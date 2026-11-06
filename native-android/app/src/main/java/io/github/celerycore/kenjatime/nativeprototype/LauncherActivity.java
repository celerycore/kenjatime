package io.github.celerycore.kenjatime.nativeprototype;

import android.app.*;
import android.os.Bundle;
import android.content.*;
import android.database.Cursor;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.view.View;
import android.widget.*;
import java.io.*;
import java.util.*;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

public final class LauncherActivity extends Activity {
    private static final int PICK_FOLDER=10;
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private TextView status;
    private Button play,importFolder;
    private boolean busy;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        LinearLayout body=new LinearLayout(this);body.setOrientation(LinearLayout.VERTICAL);body.setPadding(dp(20),dp(24),dp(20),dp(20));
        TextView title=new TextView(this);title.setText("Kenjatime Native");title.setTextSize(28);body.addView(title);
        TextView description=new TextView(this);description.setText("Native IKEMEN GO engine · ARM64 prototype\n\nPlay training or matches from the engine menu. The included fighters and touch controls run without a browser.");description.setPadding(0,20,0,24);body.addView(description);
        play=button(body,"Start native game",v->startGame());
        importFolder=button(body,"Import extracted character / stage folder",v->{
            Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);startActivityForResult(intent,PICK_FOLDER);
        });
        TextView help=new TextView(this);help.setText("For this prototype, extract ZIP/RAR files in your Files app first, then choose the folder containing the DEF and its resources. Imported fighters and stages appear in the native selection screens.\n\nThis separate app keeps its own library. Your Kenjatime web library and existing IKEMEN GO installation stay separate.");help.setPadding(0,20,0,20);body.addView(help);
        button(body,"Engine credits and source",v->showCredits());
        status=new TextView(this);status.setPadding(0,20,0,0);status.setText("Ready. The first start prepares the included game files.");body.addView(status);
        ScrollView scroll=new ScrollView(this);scroll.addView(body);
        scroll.setOnApplyWindowInsetsListener((view,insets)->{view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
        setContentView(scroll);scroll.requestApplyInsets();
    }
    private int dp(int value){return Math.round(value*getResources().getDisplayMetrics().density);}
    private Button button(LinearLayout body,String label,View.OnClickListener listener) { Button b=new Button(this);b.setText(label);b.setOnClickListener(listener);body.addView(b);return b; }
    private void setBusy(boolean value,String message) { busy=value;play.setEnabled(!value);importFolder.setEnabled(!value);status.setText(message); }
    private void startGame() {
        if(busy)return;setBusy(true,"Preparing native game…");
        worker.execute(()->{
            try(Closeable lock=GameLibrary.lock(getFilesDir())) { new GameLibrary(getFilesDir()).prepare(getAssets()); }
            catch(Exception e) { complete("Could not start: "+e.getMessage(),false);return; }
            complete("Native game ready.",true);
        });
    }
    private void complete(String message,boolean launch) {
        runOnUiThread(()->{if(isFinishing()||isDestroyed())return;setBusy(false,message);if(launch)startActivity(new Intent(this,GameActivity.class));});
    }
    @Override protected void onActivityResult(int request,int result,Intent data) {
        super.onActivityResult(request,result,data);if(request!=PICK_FOLDER||result!=RESULT_OK||data==null||data.getData()==null||busy)return;
        Uri uri=data.getData();setBusy(true,"Importing folder…");
        worker.execute(()->{
            try(Closeable lock=GameLibrary.lock(getFilesDir())) {
                GameLibrary library=new GameLibrary(getFilesDir());library.prepare(getAssets());
                GameLibrary.Result imported=library.importFolder(new DocumentSource(uri,DocumentsContract.getTreeDocumentId(uri),"Selected folder",true),getAssets());
                complete("Imported "+imported.characters+" character(s) and "+imported.stages+" stage(s). Start the native game to select them.",false);
            }catch(Exception e){complete("Import failed: "+e.getMessage(),false);}
        });
    }
    private void showCredits() {
        try(InputStream in=getAssets().open("upstream/LICENSES.txt")) {
            String licenses=new String(GameLibrary.read(in,128*1024),java.nio.charset.StandardCharsets.UTF_8);
            TextView text=new TextView(this);text.setPadding(24,16,24,16);text.setText("IKEMEN GO v1.0.0\nhttps://github.com/ikemen-engine/Ikemen-GO/tree/81c6da71d689625e20db79586815b695da00dd6d\n\nAndroid wrapper and SDL sources:\nhttps://github.com/Jesuszilla/ikemen-droid/tree/dbc5cfb49b1fed1d4a732ff48b439dd684d54145\n\nFFmpeg corresponding source:\nhttps://github.com/ikemen-engine/Ikemen-GO/releases/download/v1.0.0/src_ffmpeg.tar.gz\n\n"+licenses);
            ScrollView scroll=new ScrollView(this);scroll.addView(text);new AlertDialog.Builder(this).setTitle("Credits and source").setView(scroll).setPositiveButton("Close",null).show();
        }catch(IOException e){status.setText("Credits could not open: "+e.getMessage());}
    }
    @Override protected void onDestroy() { worker.shutdown();super.onDestroy(); }

    private final class DocumentSource implements GameLibrary.Source {
        private final Uri tree;private final String id,name;private final boolean directory;
        DocumentSource(Uri tree,String id,String name,boolean directory){this.tree=tree;this.id=id;this.name=name;this.directory=directory;}
        public String name(){return name;}public boolean directory(){return directory;}
        public InputStream open() throws IOException {
            InputStream stream=getContentResolver().openInputStream(DocumentsContract.buildDocumentUriUsingTree(tree,id));if(stream==null)throw new IOException("The selected file could not be opened.");return stream;
        }
        public List<GameLibrary.Source> children() throws IOException {
            List<GameLibrary.Source> result=new ArrayList<>();String[] columns={DocumentsContract.Document.COLUMN_DOCUMENT_ID,DocumentsContract.Document.COLUMN_DISPLAY_NAME,DocumentsContract.Document.COLUMN_MIME_TYPE};
            try(Cursor cursor=getContentResolver().query(DocumentsContract.buildChildDocumentsUriUsingTree(tree,id),columns,null,null,null)) {
                if(cursor==null)throw new IOException("The selected folder could not be read.");
                while(cursor.moveToNext()) {
                    if(result.size()>=GameLibrary.MAX_FILES)throw new IOException("The selected folder contains too many files.");
                    result.add(new DocumentSource(tree,cursor.getString(0),cursor.getString(1),DocumentsContract.Document.MIME_TYPE_DIR.equals(cursor.getString(2))));
                }
            }return result;
        }
    }
}
