package org.libsdl.app;

import static org.junit.Assert.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.*;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk=35)
public class AudioPermissionTest {
    @Test public void captureWithoutMicrophonePermissionReturnsUnsupported() {
        SDLAudioManager.mContext=RuntimeEnvironment.getApplication();
        SDLAudioManager.initialize();
        assertEquals(android.content.pm.PackageManager.PERMISSION_DENIED,SDLAudioManager.mContext.checkSelfPermission(android.Manifest.permission.RECORD_AUDIO));
        assertNull(SDLAudioManager.captureOpen(48000,0x8010,1,1024,0));
        assertNull(SDLAudioManager.mAudioRecord);
    }
}
