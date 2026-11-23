#include <android/log.h>
#include <jni.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

#include <chrono>
#include <cerrno>
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
static std::unordered_set<int> g_acc_allow_uids;
static bool g_hide_accessibility = false;
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

static void parse_csv_uids(const std::string &csv, std::unordered_set<int> &out) {
    out.clear();
    std::istringstream iss(csv);
    std::string tok;
    while (std::getline(iss, tok, ',')) {
        if (tok.empty()) continue;
        char *end = nullptr;
        long val = std::strtol(tok.c_str(), &end, 10);
        if (end != tok.c_str() && val >= 10000) {
            out.insert(static_cast<int>(val % 100000));
        }
    }
}

static bool load_state_from_file(const char *path) {
    std::ifstream f(path);
    if (!f.is_open()) return false;

    bool hide_acc = false;
    std::unordered_set<int> usb_uids;
    std::unordered_set<int> acc_uids;
    std::string line;
    while (std::getline(f, line)) {
        if (!line.empty() && line.back() == '\r') line.pop_back();
        if (line.rfind("hide_accessibility=", 0) == 0) {
            hide_acc = (line.substr(19) == "1");
        } else if (line.rfind("usb_uids=", 0) == 0) {
            parse_csv_uids(line.substr(9), usb_uids);
        } else if (line.rfind("acc_uids=", 0) == 0) {
            parse_csv_uids(line.substr(9), acc_uids);
        }
    }

    g_hide_accessibility = hide_acc;
    g_allow_uids = std::move(usb_uids);
    g_acc_allow_uids = std::move(acc_uids);
    g_last_refresh_ms = now_ms();
    return true;
}

static void refresh_allowlist_locked() {
    if (load_state_from_file("/data/system/brene_zygisk_state")) return;
    if (!g_api) return;
    int fd = g_api->connectCompanion();
    if (fd < 0) return;

    uint8_t flags = 0;
    uint32_t usb_count = 0;
    uint32_t acc_count = 0;
    if (read_full(fd, &flags, sizeof(flags)) &&
        read_full(fd, &usb_count, sizeof(usb_count)) && usb_count <= 1024) {
        std::vector<uint32_t> usb_uids(usb_count);
        if ((usb_count == 0 || read_full(fd, usb_uids.data(), usb_count * sizeof(uint32_t))) &&
            read_full(fd, &acc_count, sizeof(acc_count)) && acc_count <= 1024) {
            std::vector<uint32_t> acc_uids(acc_count);
            if (acc_count == 0 || read_full(fd, acc_uids.data(), acc_count * sizeof(uint32_t))) {
                g_hide_accessibility = (flags & 1) != 0;
                g_allow_uids.clear();
                for (uint32_t u : usb_uids) g_allow_uids.insert(static_cast<int>(u));
                g_acc_allow_uids.clear();
                for (uint32_t u : acc_uids) g_acc_allow_uids.insert(static_cast<int>(u));
                g_last_refresh_ms = now_ms();
            }
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

static jboolean JNICALL native_is_acc_uid_allowed(JNIEnv *, jclass, jint uid) {
    int app_id = uid % 100000;
    if (app_id < 10000) return JNI_TRUE;

    std::lock_guard<std::mutex> lock(g_cache_mu);
    int64_t cur = now_ms();
    if (g_last_refresh_ms == 0 || (cur - g_last_refresh_ms) >= 3000) {
        refresh_allowlist_locked();
    }
    return g_acc_allow_uids.count(app_id) ? JNI_TRUE : JNI_FALSE;
}

static jboolean JNICALL native_is_hide_accessibility(JNIEnv *, jclass) {
    std::lock_guard<std::mutex> lock(g_cache_mu);
    int64_t cur = now_ms();
    if (g_last_refresh_ms == 0 || (cur - g_last_refresh_ms) >= 3000) {
        refresh_allowlist_locked();
    }
    return g_hide_accessibility ? JNI_TRUE : JNI_FALSE;
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
        {"nativeIsAccUidAllowed", "(I)Z", reinterpret_cast<void *>(native_is_acc_uid_allowed)},
        {"nativeIsHideAccessibility", "()Z", reinterpret_cast<void *>(native_is_hide_accessibility)},
    };
    if (env->RegisterNatives(proxy_cls, natives, 3) != JNI_OK) {
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

static void load_pkg_file(const char *path, std::unordered_set<std::string> &out) {
    std::ifstream f(path);
    std::string line;
    while (std::getline(f, line)) {
        std::string t = trim(line);
        if (!t.empty() && t[0] != '#') out.insert(t);
    }
}

static void brene_companion(int sock) {
    uint8_t flags = 0;
    {
        std::ifstream cf("/data/adb/brene/config.sh");
        std::string line;
        while (std::getline(cf, line)) {
            std::string t = trim(line);
            if (t == "config_hide_accessibility=1") {
                flags |= 1;
                break;
            }
        }
    }

    std::unordered_set<std::string> usb_pkgs;
    std::unordered_set<std::string> acc_pkgs;
    load_pkg_file("/data/adb/brene/usb_debug_allow_apps.txt", usb_pkgs);
    load_pkg_file("/data/adb/brene/accessibility_allow_apps.txt", acc_pkgs);

    std::unordered_set<uint32_t> usb_uid_set;
    std::unordered_set<uint32_t> acc_uid_set;
    if (!usb_pkgs.empty() || !acc_pkgs.empty()) {
        std::ifstream pf("/data/system/packages.list");
        std::string line;
        while (std::getline(pf, line)) {
            std::istringstream iss(line);
            std::string pkg;
            uint32_t uid = 0;
            if (iss >> pkg >> uid) {
                uint32_t app_id = uid % 100000;
                if (app_id >= 10000) {
                    if (usb_pkgs.count(pkg)) usb_uid_set.insert(app_id);
                    if (acc_pkgs.count(pkg)) acc_uid_set.insert(app_id);
                }
            }
        }
    }

    std::vector<uint32_t> usb_out(usb_uid_set.begin(), usb_uid_set.end());
    std::vector<uint32_t> acc_out(acc_uid_set.begin(), acc_uid_set.end());
    uint32_t usb_count = static_cast<uint32_t>(usb_out.size());
    uint32_t acc_count = static_cast<uint32_t>(acc_out.size());
    if (write_full(sock, &flags, sizeof(flags)) &&
        write_full(sock, &usb_count, sizeof(usb_count)) &&
        (usb_count == 0 || write_full(sock, usb_out.data(), usb_count * sizeof(uint32_t))) &&
        write_full(sock, &acc_count, sizeof(acc_count)) &&
        acc_count > 0) {
        write_full(sock, acc_out.data(), acc_count * sizeof(uint32_t));
    }
}

REGISTER_ZYGISK_MODULE(BreneModule)
REGISTER_ZYGISK_COMPANION(brene_companion)
