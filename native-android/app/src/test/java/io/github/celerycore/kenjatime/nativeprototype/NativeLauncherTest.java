package io.github.celerycore.kenjatime.nativeprototype;

import static org.junit.Assert.*;
import android.content.Intent;
import android.os.Looper;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.*;
import org.robolectric.annotation.Config;
import org.robolectric.android.controller.ActivityController;

@RunWith(RobolectricTestRunner.class)
@Config(sdk=35)
public class NativeLauncherTest {
    private Button button(View view,String text) {
        if(view instanceof Button&&((Button)view).getText().toString().equals(text))return (Button)view;
        if(view instanceof ViewGroup){ViewGroup group=(ViewGroup)view;for(int i=0;i<group.getChildCount();i++){Button found=button(group.getChildAt(i),text);if(found!=null)return found;}}
        return null;
    }
    @Test public void launcherChoosesFoldersThroughAndroidDocumentsPicker() {
        try(ActivityController<LauncherActivity> controller=Robolectric.buildActivity(LauncherActivity.class).setup()){
            LauncherActivity activity=controller.get();button(activity.getWindow().getDecorView(),"Import extracted character / stage folder").performClick();
            Intent intent=Shadows.shadowOf(activity).getNextStartedActivityForResult().intent;
            assertEquals(Intent.ACTION_OPEN_DOCUMENT_TREE,intent.getAction());assertEquals(Intent.FLAG_GRANT_READ_URI_PERMISSION,intent.getFlags()&Intent.FLAG_GRANT_READ_URI_PERMISSION);
        }
    }
    @Test public void launcherPreparesActualAssetsAndStartsNativeActivityWithoutWebView() throws Exception {
        try(ActivityController<LauncherActivity> controller=Robolectric.buildActivity(LauncherActivity.class).setup()){
            LauncherActivity activity=controller.get();Button play=button(activity.getWindow().getDecorView(),"Start native game");play.performClick();assertFalse(play.isEnabled());
            long end=System.currentTimeMillis()+15000;while(!play.isEnabled()&&System.currentTimeMillis()<end){Thread.sleep(10);Shadows.shadowOf(Looper.getMainLooper()).idle();}
            assertTrue(play.isEnabled());Intent intent=Shadows.shadowOf(activity).getNextStartedActivity();assertNotNull(intent);assertEquals(GameActivity.class.getName(),intent.getComponent().getClassName());
            assertTrue(new java.io.File(activity.getFilesDir(),"game/chars/kfm_zss/kfm_zss.def").isFile());
        }
    }
}
