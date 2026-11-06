package io.github.celerycore.kenjatime.nativeprototype;
import static org.junit.Assert.*;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.os.Looper;
import android.view.*;
import android.webkit.WebView;
import org.json.JSONObject;
import org.junit.*;
import org.junit.runner.RunWith;
import org.robolectric.*;
import org.robolectric.annotation.Config;
import org.robolectric.android.controller.ActivityController;
import org.robolectric.shadows.ShadowWebView;
@RunWith(RobolectricTestRunner.class) @Config(sdk=35)
public class NativeLauncherTest {
 @Before public void provider(){PackageInfo p=new PackageInfo();p.packageName="com.google.android.webview";p.versionName="140.0.0.0";ShadowWebView.setCurrentWebViewPackage(p);}
 private WebView web(View view){if(view instanceof WebView)return (WebView)view;if(view instanceof ViewGroup){ViewGroup g=(ViewGroup)view;for(int i=0;i<g.getChildCount();i++){WebView found=web(g.getChildAt(i));if(found!=null)return found;}}return null;}
 @Test public void originalUiIsBundledAndUntrustedFileAccessIsDisabled(){try(ActivityController<LauncherActivity> c=Robolectric.buildActivity(LauncherActivity.class).setup()){WebView w=web(c.get().getWindow().getDecorView());assertEquals(LauncherActivity.UI_URL,w.getUrl());assertFalse(w.getSettings().getAllowFileAccess());assertFalse(w.getSettings().getAllowContentAccess());assertTrue(w.getSettings().getJavaScriptEnabled());}}
 @Test public void archivePickerAcceptsAndroidProvidersWithMissingMime()throws Exception{try(ActivityController<LauncherActivity> c=Robolectric.buildActivity(LauncherActivity.class).setup()){LauncherActivity a=c.get();a.chooseArchive(web(a.getWindow().getDecorView()),new JSONObject().put("id",1));Intent i=Shadows.shadowOf(a).getNextStartedActivityForResult().intent;assertEquals(Intent.ACTION_OPEN_DOCUMENT,i.getAction());assertEquals("*/*",i.getType());assertTrue(i.hasCategory(Intent.CATEGORY_OPENABLE));}}
 @Test public void launchPassesValidatedSelectionToNativeAndDestroysSetupView()throws Exception{try(ActivityController<LauncherActivity> c=Robolectric.buildActivity(LauncherActivity.class).setup()){LauncherActivity a=c.get();WebView w=web(a.getWindow().getDecorView());a.new Bridge(w).request(new JSONObject().put("id",1).put("action","launch").put("character","chars/kfm_zss/kfm_zss.def").put("opponent","chars/kfm_zss/kfm_zss.def").put("stage","stages/kenjatime-grid.def").put("mode","training").toString());Intent i=null;long end=System.currentTimeMillis()+20000;while(i==null&&System.currentTimeMillis()<end){Thread.sleep(10);Shadows.shadowOf(Looper.getMainLooper()).idle();i=Shadows.shadowOf(a).getNextStartedActivity();}assertNotNull(i);assertEquals(GameActivity.class.getName(),i.getComponent().getClassName());assertTrue(java.util.Arrays.asList(i.getStringArrayExtra("matchArgs")).contains("training"));assertFalse(java.util.Arrays.asList(i.getStringArrayExtra("matchArgs")).contains("-loadmotif"));c.pause().stop();assertNull(web(a.getWindow().getDecorView()));c.start().resume();assertNotNull(web(a.getWindow().getDecorView()));}}
}
