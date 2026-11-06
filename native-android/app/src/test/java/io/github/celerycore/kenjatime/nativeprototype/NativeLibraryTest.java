package io.github.celerycore.kenjatime.nativeprototype;

import static org.junit.Assert.*;
import android.content.res.AssetManager;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import org.junit.*;
import org.junit.runner.RunWith;
import org.robolectric.*;
import org.robolectric.annotation.Config;

@RunWith(RobolectricTestRunner.class)
@Config(sdk=35)
public class NativeLibraryTest {
    private File dir;
    private AssetManager assets;
    private GameLibrary library;
    @Before public void setup() throws Exception {
        dir=Files.createTempDirectory("kenjatime-native-test").toFile();assets=RuntimeEnvironment.getApplication().getAssets();library=new GameLibrary(dir);library.prepare(assets);
    }
    @After public void cleanup() { remove(dir); }
    static void remove(File f){if(f.isDirectory()){File[] children=f.listFiles();if(children!=null)for(File child:children)remove(child);}f.delete();}
    static GameLibrary.Source folder(String name,GameLibrary.Source... children) { return new Node(name,null,Arrays.asList(children)); }
    static GameLibrary.Source file(String name,String text) { return new Node(name,text.getBytes(StandardCharsets.UTF_8),null); }
    static final class Node implements GameLibrary.Source {
        final String name;final byte[] bytes;final List<GameLibrary.Source> nodes;
        Node(String name,byte[] bytes,List<GameLibrary.Source> nodes){this.name=name;this.bytes=bytes;this.nodes=nodes;}
        public String name(){return name;}public boolean directory(){return nodes!=null;}public List<GameLibrary.Source> children(){return nodes;}public InputStream open(){return new ByteArrayInputStream(bytes);}
    }
    String select() throws Exception { return new String(Files.readAllBytes(new File(library.root(),"data/select.def").toPath()),StandardCharsets.UTF_8); }
    GameLibrary.Source character() { return folder("Shiki R by Hakura",file("Hero.DEF","[Info]\nname=Hero\n[Files]\nsprite=hero.sff\nanim=hero.air"),file("hero.sff","sprite"),file("hero.air","[Begin Action 0]\n0,0,0,0,1")); }
    @Test public void nativeAssetsInstallAndSubsequentLaunchPreservesChanges() throws Exception {
        assertTrue(new File(library.root(),"chars/kfm_zss/kfm_zss.def").isFile());assertTrue(new File(library.root(),"stages/kfm.sff").isFile());
        File config=new File(library.root(),"save/user-setting.txt");config.getParentFile().mkdirs();Files.write(config.toPath(),new byte[]{42});
        library.prepare(assets);assertArrayEquals(new byte[]{42},Files.readAllBytes(config.toPath()));assertTrue(new File(library.root(),".native-assets.json").isFile());
    }
    @Test public void characterAndStageFoldersRegisterAlongsideStockAssets() throws Exception {
        GameLibrary.Result c=library.importFolder(character(),assets);assertEquals(1,c.characters);assertEquals(0,c.stages);
        GameLibrary.Result s=library.importFolder(folder("Forest of King Cruel",file("forest.def","[Info]\nname=Forest\n[BGDef]\nspr=forest.sff"),file("forest.sff","stage")),assets);assertEquals(1,s.stages);
        String roster=select();assertTrue(roster.contains("kfm_zss, stages/kfm.def"));assertTrue(roster.contains("/Hero.DEF, stages/kfm.def"));assertTrue(roster.contains("/forest.def"));assertTrue(new File(library.root(),"stages/kfm.sff").isFile());
    }
    @Test public void engineAssetUpdateKeepsImportedRoster() throws Exception {
        library.importFolder(character(),assets);String before=select();assertTrue(new File(library.root(),".native-assets.json").delete());library.prepare(assets);assertEquals(before,select());
    }
    @Test public void restartingCleansInterruptedStagingAndKeepsCommittedImports() throws Exception {
        library.importFolder(character(),assets);String before=select();
        File abandoned=new File(library.root(),"imports/.pending-"+UUID.randomUUID());assertTrue(abandoned.mkdir());Files.write(new File(abandoned,"partial.sff").toPath(),new byte[]{1,2,3});
        library.prepare(assets);assertFalse(abandoned.exists());assertEquals(before,select());assertEquals(1,Objects.requireNonNull(new File(library.root(),"imports").list()).length);
    }
    @Test public void nestedDefinitionsAndQuotedCommentsAreDetected() throws Exception {
        GameLibrary.Result r=library.importFolder(folder("pack",folder("nested",file("char.def","\ufeff[Info]\nname=\"Hero; test\" ; comment\n[Files]\nsprite=x.sff\nanim=x.air"),file("intro.def","[SceneDef]\nspr=intro.sff"))),assets);assertEquals(1,r.characters);assertTrue(select().contains("/nested/char.def"));assertEquals("name=\"Hero; test\" ",GameLibrary.stripComment("name=\"Hero; test\" ; comment"));
    }
    @Test public void failedImportLeavesExistingRosterAndLibraryIntact() throws Exception {
        library.importFolder(character(),assets);String before=select();
        try { library.importFolder(folder("bad",file("notes.txt","No DEF")),assets);fail(); }catch(IOException expected){assertTrue(expected.getMessage().contains("No character or stage DEF"));}
        assertEquals(before,select());assertEquals(1,Objects.requireNonNull(new File(library.root(),"imports").list()).length);
    }
    @Test public void traversalAndCaseCollisionsCannotWriteOutsideStaging() throws Exception {
        for(String name:new String[]{"../escape","/escape","C:escape","..","a\\b","a\nb"}) {
            try {library.importFolder(folder("bad",file(name,"bad")),assets);fail(name);}catch(IOException expected){}
        }
        try {library.importFolder(folder("bad",file("Hero.def","a"),file("hero.DEF","b")),assets);fail();}catch(IOException expected){assertTrue(expected.getMessage().contains("Duplicate"));}
        assertFalse(new File(library.root(),"escape").exists());assertEquals(0,Objects.requireNonNull(new File(library.root(),"imports").list()).length);
    }
    @Test public void copyFailureRollsBackWithoutRegisteringPartialContent() throws Exception {
        GameLibrary.Source broken=new GameLibrary.Source(){public String name(){return "hero.sff";}public boolean directory(){return false;}public List<GameLibrary.Source> children(){return null;}public InputStream open()throws IOException{throw new IOException("Provider unavailable");}};
        String before=select();try{library.importFolder(folder("bad",character(),broken),assets);fail();}catch(IOException expected){assertEquals("Provider unavailable",expected.getMessage());}
        assertEquals(before,select());assertEquals(0,Objects.requireNonNull(new File(library.root(),"imports").list()).length);
    }
    @Test public void streamedByteFileAndDepthLimitsRollBackImports() throws Exception {
        GameLibrary limited=new GameLibrary(dir,16,3,1);
        for(GameLibrary.Source source:new GameLibrary.Source[]{folder("large",file("x","01234567890123456")),folder("many",file("1",""),file("2",""),file("3",""),file("4","")),folder("deep",folder("1",folder("2",file("3",""))))}){
            try{limited.importFolder(source,assets);fail();}catch(IOException expected){}
        }
        assertEquals(0,Objects.requireNonNull(new File(library.root(),"imports").list()).length);
    }
    @Test public void unsupportedSelectSyntaxRollsBackWithActionableMessage() throws Exception {
        String before=select();try{library.importFolder(folder("pack",folder("nested, collection",character())),assets);fail();}catch(IOException expected){assertTrue(expected.getMessage().contains("Choose its own"));}assertEquals(before,select());
    }
    @Test public void engineAndImporterCannotOwnLibraryAtTheSameTime() throws Exception {
        try(Closeable first=GameLibrary.lock(dir)) {
            try{GameLibrary.lock(dir);fail();}catch(IOException expected){assertTrue(expected.getMessage().contains("running"));}
        }
        try(Closeable next=GameLibrary.lock(dir)){assertNotNull(next);}
    }
}
