package io.github.celerycore.kenjatime.nativeprototype;

import java.io.Closeable;
import java.io.IOException;
import org.libsdl.app.SDLActivity;

/** SDL and the unmodified ARM64 IKEMEN GO library run in a separate native process. */
public final class GameActivity extends SDLActivity {
    private Closeable libraryLock;
    private boolean userPaused;
    private android.widget.Button pause;
    @Override protected String[] getArguments() {
        String[] args=getIntent().getStringArrayExtra("matchArgs");
        return args!=null?args:new String[]{"-p1","chars/kfm_zss/kfm_zss.def","-p2","chars/kfm_zss/kfm_zss.def","-s","stages/kenjatime-grid.def","-kenjatime-mode","training","-time","-1"};
    }
    @Override protected void onCreate(android.os.Bundle saved) {
        super.onCreate(saved);
        if(android.os.Build.VERSION.SDK_INT>=33&&!SDLActivity.mBrokenLibraries) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,()->{
                if(!SDLActivity.nativeGetHintBoolean("SDL_ANDROID_TRAP_BACK_BUTTON",false))finish();
            });
        }
        if(!SDLActivity.mBrokenLibraries){
            android.widget.LinearLayout bar=new android.widget.LinearLayout(this);bar.setOrientation(android.widget.LinearLayout.HORIZONTAL);
            android.widget.Button menu=control("Menu");pause=control("Pause");bar.addView(menu);bar.addView(pause);menu.setOnClickListener(view->finish());pause.setOnClickListener(view->setUserPaused(!userPaused));
            android.widget.RelativeLayout.LayoutParams params=new android.widget.RelativeLayout.LayoutParams(-2,dp(44));params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_RIGHT);params.addRule(android.widget.RelativeLayout.ALIGN_PARENT_TOP);params.setMargins(dp(8),dp(8),dp(12),0);mLayout.addView(bar,params);bar.setZ(200f);
            mLayout.setOnApplyWindowInsetsListener((view,insets)->{view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});mLayout.requestApplyInsets();
        }
    }
    private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    private android.widget.Button control(String label){android.widget.Button button=new android.widget.Button(this);button.setText(label);button.setAllCaps(false);button.setTextColor(getColorStateList(R.color.kenjatime_control_text));button.setBackgroundResource(R.drawable.kenjatime_control);android.widget.LinearLayout.LayoutParams params=new android.widget.LinearLayout.LayoutParams(dp(84),dp(40));params.setMargins(dp(4),0,dp(4),0);button.setLayoutParams(params);return button;}
    private void setUserPaused(boolean value){userPaused=value;if(mControllerOverlay!=null)mControllerOverlay.releaseAllControls();pause.setText(value?"Resume":"Pause");if(value)pauseNativeThread();else resumeNativeThread();}
    @Override protected void onPause(){if(mControllerOverlay!=null)mControllerOverlay.releaseAllControls();super.onPause();}
    @Override protected void onResume(){super.onResume();if(userPaused&&!SDLActivity.mBrokenLibraries)pauseNativeThread();}
    @Override public void loadLibraries() {
        try { libraryLock=GameLibrary.lock(getFilesDir()); }
        catch(IOException e) { throw new IllegalStateException(e.getMessage(),e); }
        super.loadLibraries();
    }
    @Override protected void onDestroy() {
        try { super.onDestroy(); }
        finally { if(libraryLock!=null)try { libraryLock.close(); }catch(IOException ignored){} }
    }
}
