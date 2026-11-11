#!/usr/bin/env bash
# Execute as a single process inside the Android emulator action.
# Save evidence even if connectedDebugAndroidTest fails.
set +e
mkdir -p work/core
(cd android && ./gradlew -PkenjatimeCorePreview=true :app:connectedDebugAndroidTest --stacktrace)
result=$?
adb shell screencap -p /sdcard/kenjatime-core-preview.png
adb pull /sdcard/kenjatime-core-preview.png work/core/android-emulator-kfm.png
adb pull '/sdcard/Android/data/io.github.celerycore.kenjatime.core.preview/files/kenjatime-kfm-verified.png' work/core/android-emulator-kfm-live.png || true
adb shell getprop ro.build.version.release > work/core/android-emulator-release.txt
adb shell getprop ro.product.model > work/core/android-emulator-model.txt
adb logcat -d -v time > work/core/android-emulator-logcat.txt
adb shell dumpsys gfxinfo io.github.celerycore.kenjatime.core.preview > work/core/android-emulator-gfxinfo.txt
echo "Android instrumentation exit status: $result"
exit "$result"
