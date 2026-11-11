package io.github.celerycore.kenjatime;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.fail;

import android.webkit.WebView;
import android.graphics.Bitmap;
import java.io.File;
import java.io.FileOutputStream;
import androidx.test.platform.app.InstrumentationRegistry;
import androidx.test.ext.junit.runners.AndroidJUnit4;
import androidx.test.core.app.ActivityScenario;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;
import org.junit.Test;
import org.junit.runner.RunWith;

/**
 * Instrumented Core Preview smoke gate running inside the actual Android
 * WebView. The bundled KFM fight is an Android compatibility probe, not proof
 * that the three user-supplied third-party character packages run on a phone.
 */
@RunWith(AndroidJUnit4.class)
public class CoreWebViewSmokeTest {
    private static String eval(ActivityScenario<MainActivity> activity, String js) throws Exception {
        final CountDownLatch ready = new CountDownLatch(1);
        final AtomicReference<String> value = new AtomicReference<>("");
        activity.onActivity(a -> {
            WebView web = a.getBridge().getWebView();
            web.evaluateJavascript(js, result -> {
                value.set(result == null ? "" : result);
                ready.countDown();
            });
        });
        assertTrue("WebView evaluateJavascript timed out", ready.await(8, TimeUnit.SECONDS));
        return value.get();
    }

    private static void eventually(ActivityScenario<MainActivity> scenario, String script, long timeout)
            throws Exception {
        long until = System.currentTimeMillis() + timeout;
        while (System.currentTimeMillis() < until) {
            String result = eval(scenario, script);
            if ("true".equals(result)) return;
            Thread.sleep(400);
        }
        fail("Android WebView did not satisfy: " + script);
    }

    @Test public void bundledCoreLoadsAndKfmCombatAdvances() throws Exception {
        try (ActivityScenario<MainActivity> scenario = ActivityScenario.launch(MainActivity.class)) {
            eventually(scenario,
                "document.querySelector('#status')?.textContent === 'Ready when you are.'",
                45000);
            assertTrue(eval(scenario,
                "location.protocol === 'https:' && location.host === 'localhost'").equals("true"));
            assertTrue(eval(scenario,
                "document.querySelector('#name')?.textContent === 'Kung Fu Man'").equals("true"));
            String started = eval(scenario,
                "(function(){const mode=document.querySelector('#arena-mode');"
                + "const go=document.querySelector('#fight-now');"
                + "if(!mode||!go||go.disabled)return false;"
                + "mode.value='training';mode.dispatchEvent(new Event('change',{bubbles:true}));"
                + "go.click();return true;})()");
            assertTrue("Start button unavailable", "true".equals(started));
            eventually(scenario,
                "window.__kenjatimeCoreState?.ticks > 45 && "
                + "window.__kenjatimeCoreState?.players?.length === 2",
                55000);
            assertTrue(eval(scenario,
                "document.querySelector('.kenjatime-battle canvas') !== null").equals("true"));
            assertTrue(eval(scenario,
                "window.__kenjatimeCoreBattle?.gpu()?.frames > 5").equals("true"));
            // Capture the *live* match before ActivityScenario closes, not
            // the Android launcher that appears after instrumentation exits.
            Bitmap screenshot=InstrumentationRegistry.getInstrumentation()
                .getUiAutomation().takeScreenshot();
            assertNotNull("Android UI screenshot is unavailable", screenshot);
            scenario.onActivity(a -> {
                File destination=new File(a.getExternalFilesDir(null),"kenjatime-kfm-verified.png");
                try(FileOutputStream output=new FileOutputStream(destination)){
                    assertTrue(screenshot.compress(Bitmap.CompressFormat.PNG,100,output));
                }catch(Exception error){
                    throw new AssertionError("Could not persist live WebView screenshot",error);
                }
            });
            screenshot.recycle();
        }
    }
}
