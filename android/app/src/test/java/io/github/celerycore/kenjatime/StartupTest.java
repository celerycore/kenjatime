package io.github.celerycore.kenjatime;

import static org.junit.Assert.*;

import android.net.Uri;
import android.content.pm.PackageInfo;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.ServiceWorkerWebSettings;
import com.getcapacitor.Bridge;
import com.getcapacitor.JSObject;
import com.getcapacitor.PluginCall;
import android.os.Looper;
import android.view.WindowManager;
import org.robolectric.Shadows;
import androidx.activity.result.ActivityResult;
import android.app.Activity;
import android.content.Intent;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.nio.file.Files;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Map;
import org.junit.Test;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.annotation.Config;
import org.robolectric.annotation.Implementation;
import org.robolectric.annotation.Implements;
import org.robolectric.shadows.ShadowWebView;

/** Exercises Capacitor's actual URL construction and asset interception, without a phone. */
@RunWith(RobolectricTestRunner.class)
@Config(sdk = 35, shadows = StartupTest.WorkerControllerShadow.class)
public class StartupTest {
    @Before
    public void installWebViewProvider() {
        PackageInfo provider = new PackageInfo();
        provider.packageName = "com.google.android.webview";
        provider.versionName = "140.0.0.0";
        ShadowWebView.setCurrentWebViewPackage(provider);
    }
    // Robolectric shadows WebView but does not provide its service-worker provider.
    @Implements(ServiceWorkerController.class)
    public static class WorkerControllerShadow {
        @Implementation
        protected static ServiceWorkerController getInstance() {
            return new ServiceWorkerController() {
                public ServiceWorkerWebSettings getServiceWorkerWebSettings() { return null; }
                public void setServiceWorkerClient(ServiceWorkerClient client) {}
            };
        }
    }
    private WebResourceRequest request(String url) {
        return new WebResourceRequest() {
            public Uri getUrl() { return Uri.parse(url); }
            public boolean isForMainFrame() { return true; }
            public boolean isRedirect() { return false; }
            public boolean hasGesture() { return false; }
            public String getMethod() { return "GET"; }
            public Map<String, String> getRequestHeaders() { return Collections.emptyMap(); }
        };
    }

    @Test
    public void exposesNativeStartupAndWebViewDetailsWithoutOpeningTheLibrary() throws Exception {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            ArenaDevicePlugin plugin = (ArenaDevicePlugin) activity.getBridge().getPlugin("ArenaDevice").getInstance();
            final JSObject[] report = new JSObject[1];
            plugin.getStartupInfo(new PluginCall(null, "ArenaDevice", "test", "getStartupInfo", new JSObject()) {
                @Override public void resolve(JSObject data) { report[0] = data; }
            });
            assertNotNull(report[0]);
            assertEquals("android", report[0].getString("platform"));
            assertEquals(35, report[0].getInt("androidApi"));
            assertEquals("140.0.0.0", report[0].getString("webViewVersion"));
            assertTrue(report[0].getLong("nativeElapsedMs") >= report[0].getLong("nativeCreateToBridgeMs"));
            assertFalse(report[0].getBoolean("restoredActivity"));
            assertTrue(report[0].has("availableDiskBytes"));
        }
    }

    @Test
    public void archiveSaveCopiesOriginalBytesToTheChosenDocument() throws Exception {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            ArenaDevicePlugin plugin = (ArenaDevicePlugin) activity.getBridge().getPlugin("ArenaDevice").getInstance();
            File folder = new File(activity.getCacheDir(), "exports");
            folder.mkdirs();
            File source = new File(folder, "fighter.7z");
            byte[] original = new byte[300123];
            for (int i = 0; i < original.length; i++) original[i] = (byte)(i * 37);
            Files.write(source.toPath(), original);
            Uri destination = Uri.parse("content://documents/Downloads/fighter.7z");
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            Shadows.shadowOf(activity.getContentResolver()).registerOutputStream(destination, output);
            CountDownLatch completed = new CountDownLatch(1);
            AtomicBoolean saved = new AtomicBoolean(false);
            PluginCall call = new PluginCall(null, "ArenaDevice", "test", "saveArchive",
                new JSObject().put("uri", Uri.fromFile(source).toString())) {
                @Override public void resolve(JSObject result) { saved.set(result.optBoolean("saved")); completed.countDown(); }
                @Override public void reject(String message, Exception error) { completed.countDown(); }
            };
            plugin.archiveDestination(call, new ActivityResult(Activity.RESULT_OK, new Intent().setData(destination)));
            assertTrue("Native save must finish", completed.await(5, TimeUnit.SECONDS));
            assertTrue(saved.get());
            assertArrayEquals(original, output.toByteArray());
            assertFalse("Completed export should remove its temporary cache file", source.exists());
            File outside = new File(activity.getCacheDir(), "unrelated.txt");
            Files.write(outside.toPath(), new byte[] {1});
            assertThrows(java.io.IOException.class, () -> plugin.exportSource(Uri.fromFile(outside).toString()));
        }
    }

    @Test
    public void fightsKeepTheScreenAwakeWithoutChangingTheCurrentViewOrOrientation() throws Exception {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            Bridge bridge = activity.getBridge();
            ArenaDevicePlugin plugin = (ArenaDevicePlugin) bridge.getPlugin("ArenaDevice").getInstance();
            int orientation = activity.getRequestedOrientation();
            String url = bridge.getWebView().getUrl();
            plugin.setBattleMode(new PluginCall(null, "ArenaDevice", "test", "setBattleMode",
                new JSObject().put("enabled", true).put("awake", true)) {
                @Override public void resolve() {}
            });
            Shadows.shadowOf(Looper.getMainLooper()).idle();
            assertTrue((activity.getWindow().getAttributes().flags & WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON) != 0);
            assertEquals(orientation, activity.getRequestedOrientation());
            assertEquals(url, bridge.getWebView().getUrl());
            controller.pause();
            assertEquals(0, activity.getWindow().getAttributes().flags & WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        }
    }

    @Test
    public void startsAtBundledMobilePageOnLocalhost() throws Exception {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            Bridge bridge = controller.get().getBridge();
            assertNotNull(bridge);
            assertEquals("https://localhost/mobile/index.html", bridge.getAppUrl());
            assertEquals(bridge.getAppUrl(), bridge.getWebView().getUrl());
            assertEquals("localhost", Uri.parse(bridge.getAppUrl()).getHost());

            WebResourceResponse response = bridge.getLocalServer().shouldInterceptRequest(request(bridge.getAppUrl()));
            assertNotNull("Startup must be served by Capacitor, without DNS", response);
            assertEquals(200, response.getStatusCode());
            String html = new String(response.getData().readAllBytes(), StandardCharsets.UTF_8);
            assertTrue("Load mobile arena, not root lab fallback", html.contains("data-mobile-app=\"true\""));
            assertTrue(html.contains("capacitor"));

            Uri sample = Uri.parse(bridge.getAppUrl()).buildUpon().path("/kfm.zip").build();
            WebResourceResponse archive = bridge.getLocalServer().shouldInterceptRequest(request(sample.toString()));
            assertNotNull(archive);
            assertEquals(200, archive.getStatusCode());
            assertEquals('P', archive.getData().read());
            assertEquals('K', archive.getData().read());
        }
    }
}
