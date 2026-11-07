package io.github.celerycore.kenjatime;

import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.DocumentsContract;
import android.webkit.ValueCallback;
import android.webkit.WebView;
import android.widget.Toast;
import androidx.activity.result.ActivityResult;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import com.getcapacitor.Bridge;
import com.getcapacitor.BridgeWebChromeClient;

/** Keep archive input on the Storage Access Framework, including on OEM WebViews. */
public class ArchiveWebChromeClient extends BridgeWebChromeClient {
    private final Bridge bridge;
    private final ActivityResultLauncher<Intent> documents;
    private ValueCallback<Uri[]> pending;

    public ArchiveWebChromeClient(Bridge bridge) {
        super(bridge);
        this.bridge = bridge;
        documents = bridge.registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), this::selected);
    }

    @Override
    public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
        if (params.getMode() != FileChooserParams.MODE_OPEN && params.getMode() != FileChooserParams.MODE_OPEN_MULTIPLE) {
            return super.onShowFileChooser(view, callback, params);
        }
        if (pending != null) {
            callback.onReceiveValue(null);
            return true;
        }
        pending = callback;
        // GET_CONTENT may route to an OEM media picker. OPEN_DOCUMENT exposes
        // Downloads/storage and cloud document providers without media permissions.
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT)
            .addCategory(Intent.CATEGORY_OPENABLE)
            .setType("*/*")
            .addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        if (params.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE) intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI,
                DocumentsContract.buildRootUri("com.android.providers.downloads.documents", "downloads"));
        }
        try {
            documents.launch(intent);
        } catch (ActivityNotFoundException error) {
            cancel();
            Toast.makeText(bridge.getContext(), "Enable Android Files / Documents to import ZIP, RAR or 7z archives.", Toast.LENGTH_LONG).show();
        }
        return true;
    }

    private void selected(ActivityResult result) {
        Uri[] uris = null;
        Intent data = result.getData();
        if (result.getResultCode() == Activity.RESULT_OK && data != null) {
            ClipData clips = data.getClipData();
            if (clips != null && clips.getItemCount() > 0) {
                uris = new Uri[clips.getItemCount()];
                for (int n = 0; n < uris.length; n++) uris[n] = clips.getItemAt(n).getUri();
            } else if (data.getData() != null) {
                uris = new Uri[] { data.getData() };
            }
        }
        ValueCallback<Uri[]> callback = pending;
        pending = null;
        if (callback != null) callback.onReceiveValue(uris);
    }

    void cancel() {
        ValueCallback<Uri[]> callback = pending;
        pending = null;
        if (callback != null) callback.onReceiveValue(null);
    }
}
