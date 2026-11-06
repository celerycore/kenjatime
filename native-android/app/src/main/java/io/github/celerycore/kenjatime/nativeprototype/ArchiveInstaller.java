package io.github.celerycore.kenjatime.nativeprototype;

import java.io.*;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;
import me.zhanghai.android.libarchive.Archive;
import me.zhanghai.android.libarchive.ArchiveEntry;

/** Archive decoding is native and independent of the gameplay engine. */
final class ArchiveInstaller {
    static final class Entry {
        final String name;final long size;final int type;final boolean link;
        Entry(String name,long size,int type,boolean link){this.name=name;this.size=size;this.type=type;this.link=link;}
    }
    interface Reader extends Closeable { Entry next() throws IOException;int read(byte[] buffer) throws IOException; }
    interface Progress { void update(String message); }

    static final class NativeReader implements Reader {
        private long archive;
        NativeReader(File file,String password) throws IOException {
            archive=Archive.readNew();
            try {
                Archive.readSupportFilterAll(archive);Archive.readSupportFormatAll(archive);
                if(password!=null&&!password.isEmpty())Archive.readAddPassphrase(archive,password.getBytes(StandardCharsets.UTF_8));
                Archive.readOpenFileName(archive,file.getAbsolutePath().getBytes(StandardCharsets.UTF_8),65536);
            }catch(IOException|RuntimeException e){close();throw e;}
        }
        public Entry next() throws IOException {
            long entry=Archive.readNextHeader(archive);if(entry==0)return null;
            String name=ArchiveEntry.pathnameUtf8(entry);if(name==null)name=new String(ArchiveEntry.pathname(entry),StandardCharsets.UTF_8);
            return new Entry(name,ArchiveEntry.size(entry),ArchiveEntry.filetype(entry),ArchiveEntry.hardlinkIsSet(entry)||ArchiveEntry.symlink(entry)!=null);
        }
        public int read(byte[] bytes) throws IOException { ByteBuffer buffer=ByteBuffer.wrap(bytes);Archive.readData(archive,buffer);return buffer.position(); }
        public void close() throws IOException {if(archive!=0){long value=archive;archive=0;Archive.free(value);}}
    }

    static String path(String name) throws IOException {
        if(name==null||name.indexOf('\0')>=0)throw new IOException("The archive contains an invalid filename.");
        String value=Normalizer.normalize(name,Normalizer.Form.NFC).replace('\\','/');
        if(value.matches("^[A-Za-z]:.*"))throw new IOException("An archive path points to an external drive.");
        List<String> parts=new ArrayList<>();
        for(String part:value.split("/")) {
            if(part.isEmpty()||part.equals("."))continue;
            if(part.equals("..")){if(parts.isEmpty())throw new IOException("An archive path leaves the package.");parts.remove(parts.size()-1);continue;}
            if(part.chars().anyMatch(c->c<32))throw new IOException("The archive contains an invalid filename.");
            parts.add(part.toLowerCase(Locale.ROOT));
        }
        for(String part:parts)if(part.equals("__macosx")||part.equals(".ds_store")||part.startsWith("._"))return null;
        return parts.isEmpty()?null:String.join("/",parts);
    }

    static void extract(Reader reader,File target,long byteLimit,int fileLimit,Progress progress) throws IOException {
        long total=0;int count=0;byte[] buffer=new byte[65536];
        for(Entry entry;(entry=reader.next())!=null;) {
            if(++count>fileLimit)throw new IOException("Archive exceeds the file-count limit.");
            if(entry.link||(entry.type!=16384&&entry.type!=32768))throw new IOException("Archive links and special files are not supported.");
            String path=path(entry.name);
            if(entry.size<0||entry.size>byteLimit-total)throw new IOException("Archive exceeds 512 MB expanded.");
            if(path!=null&&path.split("/").length>GameLibrary.MAX_DEPTH)throw new IOException("Archive has too many nested folders.");
            File dest=path==null?null:new File(target,path);
            if(dest!=null&&!dest.getCanonicalPath().startsWith(target.getCanonicalPath()+File.separator))throw new IOException("An archive path leaves the package.");
            if(entry.type==16384){if(dest!=null&&!dest.isDirectory()&&!dest.mkdirs())throw new IOException("Cannot create an archive folder.");continue;}
            if(dest!=null&&!dest.getParentFile().isDirectory()&&!dest.getParentFile().mkdirs())throw new IOException("Cannot create an archive folder.");
            File candidate=dest==null?null:File.createTempFile(".entry-",".tmp",target);long actual=0;
            try(OutputStream out=candidate==null?null:new FileOutputStream(candidate)) {
                for(int n;(n=reader.read(buffer))>0;){actual+=n;total+=n;if(total>byteLimit)throw new IOException("Archive exceeds 512 MB expanded.");if(out!=null)out.write(buffer,0,n);}
            }
            if(actual!=entry.size)throw new IOException("The archive is truncated or an entry has an invalid size.");
            if(dest!=null) {
                if(dest.exists()) {if(!identical(dest,candidate))throw new IOException("Duplicate archive paths have different contents: "+path);if(!candidate.delete())throw new IOException("Cannot finish archive extraction.");}
                else if(!candidate.renameTo(dest))throw new IOException("Cannot save an archive entry.");
            }
            if(count%24==0)progress.update("Installing archive ("+count+" entries)…");
        }
    }
    private static boolean identical(File left,File right) throws IOException {
        if(left.length()!=right.length())return false;
        try(InputStream a=new BufferedInputStream(new FileInputStream(left));InputStream b=new BufferedInputStream(new FileInputStream(right))){for(int x;(x=a.read())!=-1;)if(x!=b.read())return false;return b.read()==-1;}
    }
}
