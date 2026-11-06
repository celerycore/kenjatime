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
