package io.github.celerycore.kenjatime;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.view.WindowManager;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

@CapacitorPlugin(name = "ArenaDevice")
public class ArenaDevicePlugin extends Plugin {
    File exportSource(String value) throws IOException {
        if (value == null) throw new IOException("Missing export");
        Uri uri = Uri.parse(value);
        if (!"file".equals(uri.getScheme()) || uri.getPath() == null) throw new IOException("Invalid export");
        File source = new File(uri.getPath()).getCanonicalFile();
        String root = new File(getContext().getCacheDir(), "exports").getCanonicalPath() + File.separator;
        if (!source.getPath().startsWith(root) || !source.isFile()) throw new IOException("Invalid export");
        return source;
    }

    @PluginMethod
    public void saveArchive(PluginCall call) {
        try {
            File source = exportSource(call.getString("uri"));
            Intent intent = new Intent(Intent.ACTION_CREATE_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType("application/octet-stream");
            intent.putExtra(Intent.EXTRA_TITLE, source.getName());
            startActivityForResult(call, intent, "archiveDestination");
        } catch (Exception error) {
            call.reject("The archive save picker could not open.", error);
        }
    }

    @ActivityCallback
    protected void archiveDestination(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode() != Activity.RESULT_OK || result.getData() == null || result.getData().getData() == null) {
            call.resolve(new JSObject().put("cancelled", true));
            return;
        }
        Uri destination = result.getData().getData();
        new Thread(() -> {
            try {
                File source = exportSource(call.getString("uri"));
                try (FileInputStream input = new FileInputStream(source);
                     OutputStream output = getContext().getContentResolver().openOutputStream(destination, "w")) {
                    if (output == null) throw new IOException("Destination unavailable");
                    byte[] buffer = new byte[65536];
                    int count;
                    while ((count = input.read(buffer)) != -1) output.write(buffer, 0, count);
                }
                source.delete();
                call.resolve(new JSObject().put("saved", true));
            } catch (Exception error) {
                call.reject("The archive could not be saved. Check storage space and try again.", error);
            }
        }, "Kenjatime archive export").start();
    }

    @PluginMethod
    public void setBattleMode(PluginCall call) {
        boolean enabled = Boolean.TRUE.equals(call.getBoolean("enabled", false));
        boolean awake = enabled && Boolean.TRUE.equals(call.getBoolean("awake", false));
        getActivity().runOnUiThread(() -> {
            if (awake) getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            else getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
            call.resolve();
        });
    }
}
