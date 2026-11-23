#include <android/log.h>
#include <jni.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

#include <chrono>
#include <cstdint>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <fstream>
#include <mutex>
#include <sstream>
#include <string>
#include <thread>
#include <unordered_set>
#include <vector>

#include "dex_bytes.h"
#include "zygisk.hpp"

#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, "BRENE-Zygisk", __VA_ARGS__)
#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, "BRENE-Zygisk", __VA_ARGS__)

static zygisk::Api *g_api = nullptr;
static JavaVM *g_jvm = nullptr;

static std::mutex g_cache_mu;
static std::unordered_set<int> g_allow_uids;
static int64_t g_last_refresh_ms = 0;

static int64_t now_ms() {
    struct timespec ts {};
    clock_gettime(CLOCK_MONOTONIC, &ts);
    return static_cast<int64_t>(ts.tv_sec) * 1000 + ts.tv_nsec / 1000000;
}

static bool write_full(int fd, const void *buf, size_t len) {
    const auto *p = static_cast<const uint8_t *>(buf);
    while (len > 0) {
        ssize_t n = write(fd, p, len);
        if (n <= 0) return false;
        p += n;
        len -= static_cast<size_t>(n);
    }
    return true;
}

static bool read_full(int fd, void *buf, size_t len) {
    auto *p = static_cast<uint8_t *>(buf);
    while (len > 0) {
        ssize_t n = read(fd, p, len);
        if (n <= 0) return false;
        p += n;
        len -= static_cast<size_t>(n);
    }
    return true;
}

static void refresh_allowlist_locked() {
    if (!g_api) return;
    int fd = g_api->connectCompanion();
    if (fd < 0) return;

    uint32_t count = 0;
    if (read_full(fd, &count, sizeof(count)) && count <= 1024) {
        std::vector<uint32_t> uids(count);
        if (count == 0 || read_full(fd, uids.data(), count * sizeof(uint32_t))) {
            g_allow_uids.clear();
            for (uint32_t u : uids) g_allow_uids.insert(static_cast<int>(u));
            g_last_refresh_ms = now_ms();
        }
    }
    close(fd);
}

static jboolean JNICALL native_is_uid_allowed(JNIEnv *, jclass, jint uid) {
    int app_id = uid % 100000;
    if (app_id < 10000) return JNI_TRUE;

    std::lock_guard<std::mutex> lock(g_cache_mu);
    int64_t cur = now_ms();
    if (g_last_refresh_ms == 0 || (cur - g_last_refresh_ms) >= 3000) {
        refresh_allowlist_locked();
    }
    return g_allow_uids.count(app_id) ? JNI_TRUE : JNI_FALSE;
}

static void install_in_system_server() {
    if (!g_jvm) return;
    JNIEnv *env = nullptr;
    if (g_jvm->AttachCurrentThread(&env, nullptr) != JNI_OK || !env) {
        LOGE("AttachCurrentThread failed");
        return;
    }

    jclass cls_loader_cls = env->FindClass("java/lang/ClassLoader");
    jmethodID get_sys_cl = env->GetStaticMethodID(
        cls_loader_cls, "getSystemClassLoader", "()Ljava/lang/ClassLoader;");
    jobject sys_cl = env->CallStaticObjectMethod(cls_loader_cls, get_sys_cl);

    jbyteArray dex_arr = env->NewByteArray(static_cast<jsize>(brene_dex_len));
    env->SetByteArrayRegion(dex_arr, 0, static_cast<jsize>(brene_dex_len),
                            reinterpret_cast<const jbyte *>(brene_dex));

    jclass bb_cls = env->FindClass("java/nio/ByteBuffer");
    jmethodID bb_wrap = env->GetStaticMethodID(bb_cls, "wrap", "([B)Ljava/nio/ByteBuffer;");
    jobject bb = env->CallStaticObjectMethod(bb_cls, bb_wrap, dex_arr);

    jclass dex_cl_cls = env->FindClass("dalvik/system/InMemoryDexClassLoader");
    jmethodID dex_cl_init = env->GetMethodID(
        dex_cl_cls, "<init>", "(Ljava/nio/ByteBuffer;Ljava/lang/ClassLoader;)V");
    jobject dex_cl = env->NewObject(dex_cl_cls, dex_cl_init, bb, sys_cl);

    jmethodID load_class = env->GetMethodID(
        cls_loader_cls, "loadClass", "(Ljava/lang/String;)Ljava/lang/Class;");

    jstring proxy_name = env->NewStringUTF("com.brene.SettingsBinderProxy");
    jclass proxy_cls = static_cast<jclass>(env->CallObjectMethod(dex_cl, load_class, proxy_name));
    if (env->ExceptionCheck() || !proxy_cls) {
        env->ExceptionDescribe();
        env->ExceptionClear();
        g_jvm->DetachCurrentThread();
        return;
    }

    JNINativeMethod natives[] = {
        {"nativeIsUidAllowed", "(I)Z", reinterpret_cast<void *>(native_is_uid_allowed)},
    };
    if (env->RegisterNatives(proxy_cls, natives, 1) != JNI_OK) {
        LOGE("RegisterNatives failed");
        g_jvm->DetachCurrentThread();
        return;
    }

    jstring hook_name = env->NewStringUTF("com.brene.BreneSettingsHook");
    jclass hook_cls = static_cast<jclass>(env->CallObjectMethod(dex_cl, load_class, hook_name));
    jmethodID try_install = env->GetStaticMethodID(hook_cls, "tryInstall", "()Z");

    for (int i = 0; i < 120; ++i) {
        jboolean ok = env->CallStaticBooleanMethod(hook_cls, try_install);
        if (env->ExceptionCheck()) {
            env->ExceptionClear();
        }
        if (ok == JNI_TRUE) {
            LOGI("SettingsBinderProxy installed successfully on try %d", i + 1);
            break;
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }

    g_jvm->DetachCurrentThread();
}

class BreneModule : public zygisk::ModuleBase {
public:
    void onLoad(zygisk::Api *api, JNIEnv *env) override {
        this->api = api;
        this->env = env;
    }

    void preAppSpecialize(zygisk::AppSpecializeArgs *) override {
        api->setOption(zygisk::DLCLOSE_MODULE_LIBRARY);
    }

    void postAppSpecialize(const zygisk::AppSpecializeArgs *) override {
        api->setOption(zygisk::DLCLOSE_MODULE_LIBRARY);
    }

    void postServerSpecialize(const zygisk::ServerSpecializeArgs *) override {
        g_api = api;
        if (env->GetJavaVM(&g_jvm) == JNI_OK && g_jvm) {
            std::thread(install_in_system_server).detach();
        }
    }

private:
    zygisk::Api *api = nullptr;
    JNIEnv *env = nullptr;
};

static std::string trim(const std::string &s) {
    size_t b = s.find_first_not_of(" \t\r\n");
    if (b == std::string::npos) return "";
    size_t e = s.find_last_not_of(" \t\r\n");
    return s.substr(b, e - b + 1);
}

static void brene_companion(int sock) {
    std::unordered_set<std::string> pkgs;
    {
        std::ifstream f("/data/adb/brene/usb_debug_allow_apps.txt");
        std::string line;
        while (std::getline(f, line)) {
            std::string t = trim(line);
            if (!t.empty() && t[0] != '#') pkgs.insert(t);
        }
    }

    std::unordered_set<uint32_t> uid_set;
    if (!pkgs.empty()) {
        std::ifstream pf("/data/system/packages.list");
        std::string line;
        while (std::getline(pf, line)) {
            std::istringstream iss(line);
            std::string pkg;
            uint32_t uid = 0;
            if (iss >> pkg >> uid) {
                if (pkgs.count(pkg)) {
                    uint32_t app_id = uid % 100000;
                    if (app_id >= 10000) uid_set.insert(app_id);
                }
            }
        }
    }

    std::vector<uint32_t> out(uid_set.begin(), uid_set.end());
    uint32_t count = static_cast<uint32_t>(out.size());
    if (write_full(sock, &count, sizeof(count)) && count > 0) {
        write_full(sock, out.data(), count * sizeof(uint32_t));
    }
}

REGISTER_ZYGISK_MODULE(BreneModule)
REGISTER_ZYGISK_COMPANION(brene_companion)
