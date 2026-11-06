package io.github.celerycore.kenjatime.nativeprototype;

import java.io.Closeable;
import java.io.IOException;
import org.libsdl.app.SDLActivity;

/** SDL and the unmodified ARM64 IKEMEN GO library run in a separate native process. */
public final class GameActivity extends SDLActivity {
    private Closeable libraryLock;
    @Override protected void onCreate(android.os.Bundle saved) {
        super.onCreate(saved);
        if(android.os.Build.VERSION.SDK_INT>=33&&!SDLActivity.mBrokenLibraries) {
            getOnBackInvokedDispatcher().registerOnBackInvokedCallback(android.window.OnBackInvokedDispatcher.PRIORITY_DEFAULT,()->{
                if(!SDLActivity.nativeGetHintBoolean("SDL_ANDROID_TRAP_BACK_BUTTON",false))finish();
            });
        }
    }
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
