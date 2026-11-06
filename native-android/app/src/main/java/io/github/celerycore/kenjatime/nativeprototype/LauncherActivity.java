package io.github.celerycore.kenjatime.nativeprototype;

import android.annotation.SuppressLint;
import android.app.*;
import android.os.Bundle;
import android.content.*;
import android.database.Cursor;
import android.net.Uri;
import android.provider.OpenableColumns;
import android.webkit.*;
import android.widget.FrameLayout;
import androidx.webkit.WebViewAssetLoader;
import java.io.*;
import java.net.URLConnection;
import java.util.*;
import java.util.concurrent.*;
import org.json.*;

/** Kenjatime's original setup UI; gameplay runs in the separate SDL activity. */
public final class LauncherActivity extends Activity {
    static final String UI_URL="https://appassets.androidplatform.net/assets/web/native-ui/index.html";
    private static final int PICK_ARCHIVE=10;
    private final ExecutorService worker=Executors.newSingleThreadExecutor();
    private FrameLayout host;
    private WebView web;
    private boolean launchingGame,importing;
    private JSONObject picker;
    private WebView pickerView;
    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);host=new FrameLayout(this);setContentView(host);
        host.setOnApplyWindowInsetsListener((view,insets)->{view.setPadding(insets.getSystemWindowInsetLeft(),insets.getSystemWindowInsetTop(),insets.getSystemWindowInsetRight(),insets.getSystemWindowInsetBottom());return insets;});
        createUi();host.requestApplyInsets();
    }
    @SuppressLint("SetJavaScriptEnabled")
    private void createUi() {
        web=new WebView(this);WebSettings settings=web.getSettings();settings.setJavaScriptEnabled(true);settings.setDomStorageEnabled(true);settings.setAllowFileAccess(false);settings.setAllowContentAccess(false);settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).addPathHandler("/game/",path->{
            try{
                File file=new GameCatalog(new GameLibrary(getFilesDir()).root()).resource(path);
                String mime=URLConnection.guessContentTypeFromName(file.getName());if(mime==null)mime="application/octet-stream";
                WebResourceResponse response=new WebResourceResponse(mime,null,new FileInputStream(file));response.setResponseHeaders(Collections.singletonMap("Cache-Control","no-store"));return response;
            }catch(IOException e){return new WebResourceResponse("text/plain","UTF-8",404,"Not Found",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
        }).build();
        web.setWebViewClient(new WebViewClient(){
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest request){WebResourceResponse response=loader.shouldInterceptRequest(request.getUrl());return response!=null?response:new WebResourceResponse("text/plain","UTF-8",403,"Forbidden",Collections.emptyMap(),new ByteArrayInputStream(new byte[0]));}
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest request){Uri uri=request.getUrl();return !("https".equals(uri.getScheme())&&"appassets.androidplatform.net".equals(uri.getHost())&&"/assets/web/native-ui/index.html".equals(uri.getPath()));}
        });
        web.addJavascriptInterface(new Bridge(web),"KenjatimeNative");host.addView(web,new FrameLayout.LayoutParams(-1,-1));web.loadUrl(UI_URL);
    }
    final class Bridge {
        private final WebView owner;
        Bridge(WebView owner){this.owner=owner;}
        @JavascriptInterface public void request(String raw) {
            final JSONObject request;
            try{if(raw.length()>8192)throw new JSONException("Request too large");request=new JSONObject(raw);}catch(JSONException e){return;}
            String action=request.optString("action");
            if(action.equals("pickArchive")){runOnUiThread(()->chooseArchive(owner,request));return;}
            if(action.equals("credits")){runOnUiThread(()->{showCredits();reply(owner,request,new JSONObject(),null);});return;}
            worker.execute(()->{
                try(Closeable lock=GameLibrary.lock(getFilesDir())) {
                    GameLibrary library=new GameLibrary(getFilesDir());library.prepare(getAssets());GameCatalog catalog=new GameCatalog(library.root());
                    switch(action) {
                        case "catalog":reply(owner,request,catalog.read(),null);break;
                        case "remove":library.removePackage(request.getString("packageId"),getAssets());reply(owner,request,catalog.read(),null);break;
                        case "launch":
                            String[] args=catalog.matchArguments(request);reply(owner,request,new JSONObject().put("launching",true),null);
                            runOnUiThread(()->{if(owner!=web||isFinishing())return;launchingGame=true;startActivity(new Intent(LauncherActivity.this,GameActivity.class).putExtra("matchArgs",args));});break;
                        default:throw new IOException("Unknown app action.");
                    }
                }catch(Exception e){reply(owner,request,null,e.getMessage());}
            });
        }
    }
    void chooseArchive(WebView owner,JSONObject request) {
        if(owner!=web)return;if(importing||picker!=null){reply(owner,request,null,"An archive is already being imported.");return;}
        picker=request;pickerView=owner;
        Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("*/*").addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivityForResult(intent,PICK_ARCHIVE);
    }
    @Override protected void onActivityResult(int code,int result,Intent data) {
        super.onActivityResult(code,result,data);if(code!=PICK_ARCHIVE||picker==null)return;
        JSONObject request=picker;WebView owner=pickerView;picker=null;pickerView=null;
        if(result!=RESULT_OK||data==null||data.getData()==null){try{reply(owner,request,new JSONObject().put("cancelled",true),null);}catch(JSONException ignored){}return;}
        Uri uri=data.getData();importing=true;
        worker.execute(()->{
            File cached=null;
            try(Closeable lock=GameLibrary.lock(getFilesDir())) {
                GameLibrary library=new GameLibrary(getFilesDir());library.prepare(getAssets());String name=displayName(uri);cached=File.createTempFile("mugen-import-",".archive",getCacheDir());
                progress(owner,"Reading "+name+"…");
                try(InputStream in=getContentResolver().openInputStream(uri);OutputStream out=new FileOutputStream(cached)) {
                    if(in==null)throw new IOException("The archive could not be opened. Download it to your device first.");
                    byte[] buffer=new byte[65536];long total=0;for(int n;(n=in.read(buffer))!=-1;){total+=n;if(total>GameLibrary.MAX_BYTES)throw new IOException("Archive exceeds 512 MB.");out.write(buffer,0,n);}
                }
                progress(owner,"Installing character and stage files…");
                library.importArchive(cached,name,request.optString("kind","any"),request.optString("password",""),getAssets(),message->progress(owner,message));
                reply(owner,request,new GameCatalog(library.root()).read(),null);
            }catch(Exception e){reply(owner,request,null,"Import failed: "+e.getMessage());}
            finally{if(cached!=null)cached.delete();runOnUiThread(()->importing=false);}
        });
    }
    private String displayName(Uri uri) {
        try(Cursor cursor=getContentResolver().query(uri,new String[]{OpenableColumns.DISPLAY_NAME},null,null,null)){if(cursor!=null&&cursor.moveToFirst()&&cursor.getString(0)!=null)return cursor.getString(0);}catch(RuntimeException ignored){}return "MUGEN archive";
    }
    private void reply(WebView owner,JSONObject request,Object data,String error) {
        try{JSONObject result=new JSONObject().put("id",request.optInt("id"));if(error!=null)result.put("error",error);else result.put("data",data);String json=result.toString().replace("\u2028","\\u2028").replace("\u2029","\\u2029");runOnUiThread(()->{if(owner==web&&!isFinishing())owner.evaluateJavascript("window.__kenjatimeNativeResult("+json+")",null);});}catch(JSONException ignored){}
    }
    private void progress(WebView owner,String message){String text=JSONObject.quote(message);runOnUiThread(()->{if(owner==web&&!isFinishing())owner.evaluateJavascript("window.__kenjatimeNativeProgress("+text+")",null);});}
    private void showCredits() {
        new AlertDialog.Builder(this).setTitle("Kenjatime · credits and source").setNeutralButton("License notices",(dialog,which)->showNotices()).setMessage("Gameplay: IKEMEN GO v1.0.0\nhttps://github.com/ikemen-engine/Ikemen-GO\n\nArchive reader: libarchive-android 1.1.6\nhttps://github.com/zhanghai/libarchive-android\n\nAll bundled license notices and build/source details are included in the app assets and the Kenjatime source repository.").setPositiveButton("Close",null).show();
    }
    private String archiveNotices()throws IOException{try(InputStream in=getAssets().open("web/third-party-archives.txt")){return "\n\n"+new String(GameLibrary.read(in,2*1024*1024),java.nio.charset.StandardCharsets.UTF_8);}}
    private void showNotices(){try(InputStream in=getAssets().open("upstream/LICENSES.txt")){new AlertDialog.Builder(this).setTitle("Bundled license notices").setMessage(new String(GameLibrary.read(in,2*1024*1024),java.nio.charset.StandardCharsets.UTF_8)+archiveNotices()+"\n\nArchive decoder: libarchive-android 1.1.6, Apache-2.0; libarchive, BSD-2-Clause. https://github.com/zhanghai/libarchive-android").setPositiveButton("Close",null).show();}catch(IOException e){new AlertDialog.Builder(this).setMessage(e.getMessage()).setPositiveButton("Close",null).show();}}
    @Override protected void onPause(){if(web!=null){web.onPause();web.pauseTimers();}super.onPause();}
    @Override protected void onStop(){super.onStop();if(launchingGame&&web!=null){host.removeView(web);web.removeJavascriptInterface("KenjatimeNative");web.destroy();web=null;}}
    @Override protected void onResume(){super.onResume();if(web==null&&host!=null){launchingGame=false;createUi();}if(web!=null){web.onResume();web.resumeTimers();}}
    @Override protected void onDestroy(){if(web!=null){host.removeView(web);web.removeJavascriptInterface("KenjatimeNative");web.destroy();web=null;}worker.shutdown();super.onDestroy();}
}
