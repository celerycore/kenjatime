package io.github.celerycore.kenjatime.nativeprototype;

import android.content.res.AssetManager;
import android.util.AtomicFile;
import java.io.*;
import java.nio.channels.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Owns app-private game data. Engine execution and library mutations share an OS file lock. */
public final class GameLibrary {
    public static final long MAX_BYTES = 512L * 1024 * 1024;
    public static final int MAX_FILES = 5000, MAX_DEPTH = 24;
    private final File root;
    private final long byteLimit;
    private final int fileLimit, depthLimit;
    public GameLibrary(File filesDir) { this(filesDir,MAX_BYTES,MAX_FILES,MAX_DEPTH); }
    GameLibrary(File filesDir,long bytes,int files,int depth) { root=new File(filesDir,"game");byteLimit=bytes;fileLimit=files;depthLimit=depth; }
    public File root() { return root; }

    public interface Source {
        String name();
        boolean directory();
        List<Source> children() throws IOException;
        InputStream open() throws IOException;
    }
    public static final class Result {
        public final int characters, stages;
        Result(int characters, int stages) { this.characters=characters; this.stages=stages; }
    }

    public static Closeable lock(File filesDir) throws IOException {
        FileChannel channel = new RandomAccessFile(new File(filesDir, ".engine.lock"), "rw").getChannel();
        try {
            FileLock lock = channel.tryLock();
            if (lock == null) throw new IOException("Close the running game before changing the library.");
            return () -> { try { lock.release(); } finally { channel.close(); } };
        } catch (IOException | OverlappingFileLockException e) {
            channel.close(); throw new IOException("The game or another import is running. Close it and try again.", e);
        }
    }

    public void prepare(AssetManager assets) throws IOException {
        if (!root.isDirectory() && !root.mkdirs()) throw new IOException("Cannot create the game library.");
        File[] abandoned=new File(root,"imports").listFiles();
        if(abandoned!=null)for(File file:abandoned)if(file.getName().matches("\\.pending-[0-9a-f-]{36}"))remove(file);
        byte[] provenance;
        try (InputStream in=assets.open("native-provenance.json")) { provenance=read(in, 64*1024); }
        File marker=new File(root,".native-assets.json");
        if (marker.isFile() && Arrays.equals(readFile(marker,64*1024),provenance)) return;
        // Remove obsolete bundled screenpacks on upgrade; imported packages live in imports/.
        for(String path:new String[]{"data/system.def","data/system.sff","data/system.snd","data/fight.def","data/fight.sff","data/fight.snd","data/ikemen1","data/motif1","external/script","external/icons","upstream/main-ui-original.lua","web","font"})remove(new File(root,path));
        installAssets(assets, "");
        // Regenerate from the bundled roster plus existing imports after an engine update.
        rebuildSelect(assets);
        atomicWrite(marker,provenance);
    }

    private void installAssets(AssetManager assets, String path) throws IOException {
        if(path.equals("web"))return; // Setup assets are served from the APK, never copied into the gameplay library.
        String[] children=assets.list(path);
        if (children!=null && children.length>0) {
            for (String child:children) installAssets(assets,path.isEmpty()?child:path+"/"+child);
        } else if (!path.isEmpty()) {
            File dest=inside(root,path);mkdirParent(dest);
            AtomicFile file=new AtomicFile(dest);FileOutputStream out=file.startWrite();
            try (InputStream in=assets.open(path)) {
                byte[] buffer=new byte[65536];int n;
                while ((n=in.read(buffer))!=-1) out.write(buffer,0,n);
                file.finishWrite(out);
            } catch (IOException | RuntimeException e) { file.failWrite(out);throw e; }
        }
    }

    // Android's pinned SDL_main does not copy argv into Go's os.Args.
    // The engine reads this private JSON selection and the default config instead.
    String[] prepareMatch(org.json.JSONObject request,AssetManager assets) throws IOException,org.json.JSONException {
        String[] args=new GameCatalog(root).matchArguments(request);
        // A hidden DEF beside the source keeps all non-music stage references relative.
        for(int i=0;i<args.length;i+=2)if(args[i].equals("-s")) {
            File stage=new File(root,args[i+1]),copy=new File(stage.getParentFile(),".kenjatime-stage.def");
            String prepared=StageResources.music(root,stage);if(prepared!=null){
                atomicWrite(copy,prepared.getBytes(StandardCharsets.UTF_8));
                args[i+1]=copy.getCanonicalPath().substring(root.getCanonicalPath().length()+1).replace(File.separatorChar,'/');
            }
        }
        org.json.JSONObject flags=new org.json.JSONObject();for(int i=0;i<args.length;i+=2)flags.put(args[i],args[i+1]);
        atomicWrite(new File(root,"save/kenjatime-match.json"),flags.toString().getBytes(StandardCharsets.UTF_8));
        ensureEngineConfig(assets);return args;
    }
    void ensureEngineConfig(AssetManager assets) throws IOException {
        try(InputStream in=assets.open("data/kenjatime/config.ini")){atomicWrite(new File(root,"save/config.ini"),read(in,64*1024));}
    }
    void ensureMatch(AssetManager assets) throws IOException {
        if(!new File(root,"save/kenjatime-match.json").isFile())try{
            prepareMatch(new org.json.JSONObject().put("character","chars/kfm_zss/kfm_zss.def").put("stage","stages/kenjatime-grid.def").put("mode","training"),assets);
        }catch(org.json.JSONException e){throw new IOException(e);}
        else ensureEngineConfig(assets);
    }

    public Result importFolder(Source source,AssetManager assets) throws IOException {
        if (!source.directory()) throw new IOException("Choose an extracted character or stage folder.");
        File imports=new File(root,"imports");if (!imports.isDirectory()&&!imports.mkdirs()) throw new IOException("Cannot create imports directory.");
        String id=UUID.randomUUID().toString();File pending=new File(imports,".pending-"+id),committed=new File(imports,id);
        if (!pending.mkdir()) throw new IOException("Cannot stage this import.");
        boolean registered=false;
        try {
            long[] budget={0,0};Set<String> names=new HashSet<>();
            for (Source child:source.children()) { unique(names,child.name());copy(child,pending,0,budget); }
            List<String> characters=new ArrayList<>(),stages=new ArrayList<>();discover(pending,pending,characters,stages);
            if (characters.isEmpty()&&stages.isEmpty()) throw new IOException("No character or stage DEF found. Select the folder containing the DEF and its resources.");
            if (!pending.renameTo(committed)) throw new IOException("Cannot save the imported folder.");
            rebuildSelect(assets);registered=true;
            return new Result(characters.size(),stages.size());
        } finally { if (!registered) { remove(pending);remove(committed); } }
    }

    public Result importArchive(File file,String name,String kind,String password,AssetManager assets,ArchiveInstaller.Progress progress) throws IOException {
        if(file.length()>MAX_BYTES)throw new IOException("Archive exceeds 512 MB.");
        try(ArchiveInstaller.Reader reader=new ArchiveInstaller.NativeReader(file,password)){return installArchive(reader,name,kind,assets,progress);}
    }
    Result installArchive(ArchiveInstaller.Reader reader,String name,String kind,AssetManager assets,ArchiveInstaller.Progress progress) throws IOException {
        File imports=new File(root,"imports");if(!imports.isDirectory()&&!imports.mkdirs())throw new IOException("Cannot create imports directory.");
        String id=UUID.randomUUID().toString();File pending=new File(imports,".pending-"+id),committed=new File(imports,id);if(!pending.mkdir())throw new IOException("Cannot stage archive.");
        boolean success=false;
        try {
            ArchiveInstaller.extract(reader,pending,byteLimit,fileLimit,progress);
            List<String> characters=new ArrayList<>(),stages=new ArrayList<>();discover(pending,pending,characters,stages);
            if(characters.isEmpty()&&stages.isEmpty())throw new IOException("No MUGEN character or stage DEF found in the archive.");
            if("stage".equals(kind)&&stages.isEmpty())throw new IOException("No stage DEF found. Choose a stage archive.");
            org.json.JSONObject metadata=new org.json.JSONObject();try{metadata.put("name",name);metadata.put("installedAt",System.currentTimeMillis());}catch(org.json.JSONException e){throw new IOException(e);}
            atomicWrite(new File(pending,".kenjatime-package.json"),metadata.toString().getBytes(StandardCharsets.UTF_8));
            if(!pending.renameTo(committed))throw new IOException("Cannot finish installing the archive.");
            rebuildSelect(assets);success=true;return new Result(characters.size(),stages.size());
        }finally{if(!success){remove(pending);remove(committed);}}
    }
    public void removePackage(String id,AssetManager assets) throws IOException {
        if(id==null||!id.matches("[0-9a-f-]{36}"))throw new IOException("Unknown installed package.");
        File dir=new File(root,"imports/"+id),pending=new File(root,"imports/.removing-"+id);
        if(!dir.isDirectory()||!dir.renameTo(pending))throw new IOException("The package is not installed.");
        try{rebuildSelect(assets);}catch(IOException e){pending.renameTo(dir);throw e;}
        remove(pending);
    }

    private void copy(Source source,File parent,int depth,long[] budget) throws IOException {
        validateName(source.name());
        if (depth>depthLimit||++budget[1]>fileLimit) throw new IOException("This folder contains too many files or nested folders.");
        File dest=inside(parent,source.name());
        if (source.directory()) {
            if (!dest.mkdir()) throw new IOException("Cannot create imported folder.");
            Set<String> names=new HashSet<>();
            for (Source child:source.children()) { unique(names,child.name());copy(child,dest,depth+1,budget); }
        } else {
            try (InputStream in=source.open();OutputStream out=new FileOutputStream(dest)) {
                byte[] buffer=new byte[65536];int n;
                while ((n=in.read(buffer))!=-1) {
                    budget[0]+=n;if (budget[0]>byteLimit) throw new IOException("The extracted folder exceeds 512 MB.");
                    out.write(buffer,0,n);
                }
            }
        }
    }

    private void rebuildSelect(AssetManager assets) throws IOException {
        String stock;try (InputStream in=assets.open("data/select.def")) { stock=new String(read(in,2*1024*1024),StandardCharsets.UTF_8); }
        List<String> characters=new ArrayList<>(),stages=new ArrayList<>();File imports=new File(root,"imports");
        File[] folders=imports.listFiles();if (folders!=null) {
            Arrays.sort(folders,Comparator.comparing(File::getName));
            for (File folder:folders) if(folder.isDirectory()&&!folder.getName().startsWith(".")) discover(root,folder,characters,stages);
        }
        // IKEMEN's select parser recognizes repeated section headers in file order.
        StringBuilder select=new StringBuilder(stock).append("\n; Kenjatime native imports\n[Characters]\n");
        for(String name:characters) select.append(name).append(", stages/kenjatime-grid.def\n");
        select.append("[ExtraStages]\n");for(String name:stages) select.append(name).append('\n');
        atomicWrite(new File(root,"data/select.def"),select.toString().getBytes(StandardCharsets.UTF_8));
    }

    private static void discover(File base,File folder,List<String> characters,List<String> stages) throws IOException {
        File[] files=folder.listFiles();if(files==null)throw new IOException("Cannot read imported files.");
        Arrays.sort(files,Comparator.comparing(File::getName));
        for(File file:files) {
            if(file.isDirectory()) { discover(base,file,characters,stages);continue; }
            if(!file.getName().toLowerCase(Locale.ROOT).endsWith(".def")||file.getName().endsWith(".kenjatime-stage.def"))continue;
            String text=GameCatalog.text(file);
            String section="";boolean stage=false,info=false,sprite=false,anim=false;
            for(String line:text.replace("\ufeff","").split("\\r?\\n")) {
                line=stripComment(line).trim().toLowerCase(Locale.ROOT);
                if(line.startsWith("[")&&line.endsWith("]")) { section=line.substring(1,line.length()-1).trim();if(section.equals("bgdef"))stage=true;if(section.equals("info"))info=true; }
                else if(section.equals("files")&&line.contains("=")) {
                    String key=line.substring(0,line.indexOf('=')).trim();if(key.equals("sprite"))sprite=true;if(key.equals("anim"))anim=true;
                }
            }
            if(!stage&&!(info&&sprite))continue;
            String prefix=base.getCanonicalPath()+File.separator,full=file.getCanonicalPath();
            if(!full.startsWith(prefix))throw new IOException("The definition path leaves the library.");
            String relative=full.substring(prefix.length()).replace(File.separatorChar,'/');
            // The upstream select parser splits commas and comments without quoting.
            if(relative.matches(".*[,;\\r\\n].*"))throw new IOException("A DEF path contains a comma or semicolon. Choose its own character/stage folder instead of a parent collection.");
            (stage?stages:characters).add(relative);
        }
    }

    static String stripComment(String text) {
        boolean quoted=false;for(int i=0;i<text.length();i++){char c=text.charAt(i);if(c=='"')quoted=!quoted;else if(c==';'&&!quoted)return text.substring(0,i);}return text;
    }
    static void validateName(String name) throws IOException {
        if(name==null||name.isEmpty()||name.equals(".")||name.equals("..")||name.indexOf('/')>=0||name.indexOf('\\')>=0||name.indexOf(':')>=0||name.chars().anyMatch(c->c<32))throw new IOException("The selected provider returned an invalid filename.");
    }
    private static void unique(Set<String> names,String name) throws IOException {
        validateName(name);if(!names.add(name.toLowerCase(Locale.ROOT)))throw new IOException("Duplicate filenames differ only by case: "+name);
    }
    private static File inside(File parent,String path) throws IOException {
        File file=new File(parent,path);String prefix=parent.getCanonicalPath()+File.separator;
        if(!file.getCanonicalPath().startsWith(prefix))throw new IOException("The file path leaves the selected folder.");return file;
    }
    private static void mkdirParent(File file) throws IOException {
        File parent=file.getParentFile();if(!parent.isDirectory()&&!parent.mkdirs())throw new IOException("Cannot create game directory.");
    }
    static byte[] read(InputStream in,int maximum) throws IOException {
        ByteArrayOutputStream out=new ByteArrayOutputStream();byte[] b=new byte[8192];int n;
        while((n=in.read(b))!=-1){if(out.size()+n>maximum)throw new IOException("A definition or metadata file is too large.");out.write(b,0,n);}return out.toByteArray();
    }
    private static byte[] readFile(File file,int maximum) throws IOException { try(InputStream in=new FileInputStream(file)){return read(in,maximum);} }
    private static void atomicWrite(File path,byte[] bytes) throws IOException {
        mkdirParent(path);AtomicFile file=new AtomicFile(path);FileOutputStream out=file.startWrite();
        try {out.write(bytes);file.finishWrite(out);}catch(IOException|RuntimeException e){file.failWrite(out);throw e;}
    }
    private static void remove(File file) {
        if(file.isDirectory()&&!java.nio.file.Files.isSymbolicLink(file.toPath())){File[] files=file.listFiles();if(files!=null)for(File child:files)remove(child);}file.delete();
    }
}
