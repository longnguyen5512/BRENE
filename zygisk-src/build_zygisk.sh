#!/usr/bin/env bash
set -euo pipefail

DIR="$(cd "$(dirname "$0")" && pwd)"
SDK="/Users/karrynguyen/Library/Android/sdk"
ANDROID_JAR="${SDK}/platforms/android-37.2/android.jar"
D8="${SDK}/build-tools/37.0.0/d8"
CXX="${SDK}/ndk/27.2.12479018/toolchains/llvm/prebuilt/darwin-x86_64/bin/aarch64-linux-android34-clang++"

rm -rf "${DIR}/build"
mkdir -p "${DIR}/build/classes" "${DIR}/build/dex"

javac --release 11 -cp "${ANDROID_JAR}" -d "${DIR}/build/classes" \
  $(find "${DIR}/stubs" "${DIR}/java" -name "*.java")

# Package ONLY com/brene classes into classes.dex (exclude compile-time framework stubs)
"${D8}" --min-api 30 --output "${DIR}/build/dex" \
  "${DIR}/build/classes/com/brene/"*.class

python3 -c '
data = open("'"${DIR}"'/build/dex/classes.dex", "rb").read()
with open("'"${DIR}"'/jni/dex_bytes.h", "w") as f:
    f.write("#pragma once\nstatic const unsigned char brene_dex[] = {\n")
    for i in range(0, len(data), 16):
        chunk = ", ".join(f"0x{b:02x}" for b in data[i:i+16])
        f.write(f"    {chunk},\n")
    f.write("};\n")
    f.write(f"static const unsigned int brene_dex_len = {len(data)};\n")
'

"${CXX}" -std=c++17 -O2 -fPIC -shared -static-libstdc++ \
  -I"${DIR}/jni" \
  "${DIR}/jni/main.cpp" \
  -llog -Wl,--gc-sections -s \
  -o "${DIR}/../module/zygisk/arm64-v8a.so"

ls -lh "${DIR}/../module/zygisk/arm64-v8a.so"
