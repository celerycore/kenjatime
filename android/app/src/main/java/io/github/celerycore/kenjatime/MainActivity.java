package io.github.celerycore.kenjatime;

import android.os.Bundle;
import android.os.SystemClock;
import android.util.Log;
import android.view.WindowManager;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private long createdAt;
    private long bridgeReadyMs;
    private boolean restoredActivity;
    private ArchiveWebChromeClient archivePicker;
    long nativeElapsedMs() { return SystemClock.elapsedRealtime() - createdAt; }
    long nativeBridgeReadyMs() { return bridgeReadyMs; }
    boolean wasActivityRestored() { return restoredActivity; }
    @Override
    public void onCreate(Bundle savedInstanceState) {
        createdAt = SystemClock.elapsedRealtime();
        restoredActivity = savedInstanceState != null;
        Log.i("KenjatimeStartup", "activity-created");
        registerPlugin(ArenaDevicePlugin.class);
        super.onCreate(savedInstanceState);
        archivePicker = new ArchiveWebChromeClient(getBridge());
        getBridge().getWebView().setWebChromeClient(archivePicker);
        bridgeReadyMs = nativeElapsedMs();
        Log.i("KenjatimeStartup", "bridge-ready in " + bridgeReadyMs + " ms");
    }

    @Override
    public void onPause() {
        getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        super.onPause();
    }

    @Override
    public void onDestroy() {
        if (archivePicker != null) archivePicker.cancel();
        super.onDestroy();
    }
}
