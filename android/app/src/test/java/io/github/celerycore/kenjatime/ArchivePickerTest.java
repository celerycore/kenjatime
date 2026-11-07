package io.github.celerycore.kenjatime;

import static org.junit.Assert.*;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import java.util.ArrayList;
import java.util.List;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.Robolectric;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.Shadows;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.annotation.Config;
import org.robolectric.shadows.ShadowWebView;

@RunWith(RobolectricTestRunner.class)
@Config(sdk = 35, shadows = StartupTest.WorkerControllerShadow.class)
public class ArchivePickerTest {
    @Before
    public void provider() {
        PackageInfo provider = new PackageInfo();
        provider.packageName = "com.google.android.webview";
        provider.versionName = "140.0.0.0";
        ShadowWebView.setCurrentWebViewPackage(provider);
    }

    private WebChromeClient.FileChooserParams params(int mode) {
        return new WebChromeClient.FileChooserParams() {
            public int getMode() { return mode; }
            public String[] getAcceptTypes() { return new String[] { "*/*" }; }
            public boolean isCaptureEnabled() { return false; }
            public CharSequence getTitle() { return "Archive"; }
            public String getFilenameHint() { return null; }
            // Reproduce a WebView/provider choosing a media-only intent.
            public Intent createIntent() { return new Intent(Intent.ACTION_GET_CONTENT).setType("image/*"); }
        };
    }

    private Intent choose(MainActivity activity, List<Uri[]> replies, int mode) {
        WebView web = activity.getBridge().getWebView();
        WebChromeClient client = Shadows.shadowOf(web).getWebChromeClient();
        assertTrue("The running app must use the document picker", client instanceof ArchiveWebChromeClient);
        assertTrue(client.onShowFileChooser(web, replies::add, params(mode)));
        return Shadows.shadowOf(activity).getNextStartedActivityForResult().intent;
    }

    @Test
    public void opensDocumentsInDownloadsWithoutMediaOrMimeFilters() {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            List<Uri[]> replies = new ArrayList<>();
            Intent intent = choose(controller.get(), replies, WebChromeClient.FileChooserParams.MODE_OPEN);
            assertEquals(Intent.ACTION_OPEN_DOCUMENT, intent.getAction());
            assertEquals("*/*", intent.getType());
            assertTrue(intent.hasCategory(Intent.CATEGORY_OPENABLE));
            assertEquals(Intent.FLAG_GRANT_READ_URI_PERMISSION, intent.getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION);
            assertNull(intent.getStringArrayExtra(Intent.EXTRA_MIME_TYPES));
            assertFalse(intent.getBooleanExtra(Intent.EXTRA_ALLOW_MULTIPLE, false));
            assertEquals(DocumentsContract.buildRootUri("com.android.providers.downloads.documents", "downloads"),
                intent.getParcelableExtra(DocumentsContract.EXTRA_INITIAL_URI));
            assertTrue(replies.isEmpty());
        }
    }

    @Test
    public void returnsArchiveAndExtensionlessContentUrisWithoutDependingOnMimeMetadata() {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            for (String name : new String[] { "fighter.zip", "fighter.rar", "fighter.7z", "download-without-extension" }) {
                List<Uri[]> replies = new ArrayList<>();
                Intent intent = choose(activity, replies, WebChromeClient.FileChooserParams.MODE_OPEN);
                Uri uri = Uri.parse("content://com.android.providers.downloads.documents/document/" + name);
                assertNull(activity.getContentResolver().getType(uri));
                Shadows.shadowOf(activity).receiveResult(intent, Activity.RESULT_OK,
                    new Intent().setData(uri).addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION));
                assertEquals(1, replies.size());
                assertArrayEquals(new Uri[] { uri }, replies.get(0));
            }
        }
    }

    @Test
    public void cancelledAndEmptyResultsReleaseTheCallbackAndAllowAnotherImport() {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            for (int code : new int[] { Activity.RESULT_CANCELED, Activity.RESULT_OK }) {
                List<Uri[]> replies = new ArrayList<>();
                Intent intent = choose(activity, replies, WebChromeClient.FileChooserParams.MODE_OPEN);
                Shadows.shadowOf(activity).receiveResult(intent, code, null);
                assertEquals(1, replies.size());
                assertNull(replies.get(0));
            }
            List<Uri[]> replies = new ArrayList<>();
            Intent intent = choose(activity, replies, WebChromeClient.FileChooserParams.MODE_OPEN);
            Uri uri = Uri.parse("content://files/retry.7z");
            Shadows.shadowOf(activity).receiveResult(intent, Activity.RESULT_OK, new Intent().setData(uri));
            assertArrayEquals(new Uri[] { uri }, replies.get(0));
        }
    }

    @Test
    public void multipleDocumentResultsReachWebViewTogether() {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            List<Uri[]> replies = new ArrayList<>();
            Intent intent = choose(activity, replies, WebChromeClient.FileChooserParams.MODE_OPEN_MULTIPLE);
            assertTrue(intent.getBooleanExtra(Intent.EXTRA_ALLOW_MULTIPLE, false));
            Uri first = Uri.parse("content://files/fighter.zip"), second = Uri.parse("content://files/stage.rar");
            ClipData clips = ClipData.newRawUri("Archives", first);
            clips.addItem(new ClipData.Item(second));
            Intent data = new Intent();
            data.setClipData(clips);
            Shadows.shadowOf(activity).receiveResult(intent, Activity.RESULT_OK, data);
            assertEquals(1, replies.size());
            assertArrayEquals(new Uri[] { first, second }, replies.get(0));
        }
    }

    @Test
    public void competingPickerCannotStealAnExistingSelection() {
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            MainActivity activity = controller.get();
            List<Uri[]> original = new ArrayList<>(), competing = new ArrayList<>();
            Intent intent = choose(activity, original, WebChromeClient.FileChooserParams.MODE_OPEN);
            WebView web = activity.getBridge().getWebView();
            Shadows.shadowOf(web).getWebChromeClient().onShowFileChooser(web, competing::add, params(WebChromeClient.FileChooserParams.MODE_OPEN));
            assertEquals(1, competing.size());
            assertNull(competing.get(0));
            assertNull(Shadows.shadowOf(activity).getNextStartedActivityForResult());
            Uri uri = Uri.parse("content://files/original.rar");
            Shadows.shadowOf(activity).receiveResult(intent, Activity.RESULT_OK, new Intent().setData(uri));
            assertArrayEquals(new Uri[] { uri }, original.get(0));
        }
    }

    @Test
    public void destroyingTheActivityReleasesPendingWebViewSelection() {
        List<Uri[]> replies = new ArrayList<>();
        try (ActivityController<MainActivity> controller = Robolectric.buildActivity(MainActivity.class).setup()) {
            choose(controller.get(), replies, WebChromeClient.FileChooserParams.MODE_OPEN);
        }
        assertEquals(1, replies.size());
        assertNull(replies.get(0));
    }
}
