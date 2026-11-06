package io.github.celerycore.kenjatime.nativeprototype;

import java.io.*;
import java.nio.charset.*;
import java.util.*;
import org.json.*;

/** The UI selects catalog IDs; it cannot supply arbitrary engine paths or arguments. */
final class GameCatalog {
    private final File root;
    GameCatalog(File root){this.root=root;}
    JSONObject read() throws IOException,JSONException {
        JSONArray characters=new JSONArray(),stages=new JSONArray(),packages=new JSONArray();
        add(new File(root,"chars/kfm_zss/kfm_zss.def"),null,"Included sample",characters,stages);
        add(new File(root,"stages/kenjatime-grid.def"),null,"Training grid",characters,stages);
        File[] dirs=new File(root,"imports").listFiles();if(dirs!=null){Arrays.sort(dirs,Comparator.comparing(File::getName));for(File dir:dirs){
            if(!dir.isDirectory()||!dir.getName().matches("[0-9a-f-]{36}"))continue;
            String name=dir.getName();File info=new File(dir,".kenjatime-package.json");if(info.isFile())try{name=new JSONObject(text(info)).optString("name",name);}catch(JSONException ignored){}
            packages.put(new JSONObject().put("id",dir.getName()).put("name",name));scan(dir,dir.getName(),name,characters,stages);
        }}
        return new JSONObject().put("characters",characters).put("stages",stages).put("packages",packages);
    }
    private void scan(File dir,String packageId,String packageName,JSONArray chars,JSONArray stages) throws IOException,JSONException {
        File[] files=dir.listFiles();if(files==null)return;Arrays.sort(files,Comparator.comparing(File::getName));
        for(File file:files)if(file.isDirectory())scan(file,packageId,packageName,chars,stages);else if(file.getName().toLowerCase(Locale.ROOT).endsWith(".def")&&!file.getName().endsWith(".kenjatime-stage.def"))add(file,packageId,packageName,chars,stages);
    }
    private void add(File file,String pkg,String pkgName,JSONArray chars,JSONArray stages) throws IOException,JSONException {
        if(!file.isFile())return;Map<String,Map<String,String>> ini=ini(text(file));Map<String,String> info=ini.get("info"),files=ini.get("files");boolean stage=ini.containsKey("bgdef");if(!stage&&(info==null||files==null||!files.containsKey("sprite")))return;
        String id=relative(file);JSONObject entry=new JSONObject().put("id",id).put("name",info==null?file.getName():info.getOrDefault("displayname",info.getOrDefault("name",file.getName()))).put("author",info==null?"":info.getOrDefault("author","")).put("fileName",file.getName()).put("packageName",pkgName);
        if(pkg!=null)entry.put("packageId",pkg);
        if(!stage){for(String key:new String[]{"sprite","anim"}){File resource=resolve(file,files.get(key));if(resource!=null){entry.put(key,relative(resource));if(key.equals("sprite"))entry.put("spriteBytes",resource.length());}}}
        (stage?stages:chars).put(entry);
    }
    String[] matchArguments(JSONObject request) throws IOException,JSONException {
        JSONObject catalog=read();String p1=find(catalog.getJSONArray("characters"),request.getString("character")),p2=find(catalog.getJSONArray("characters"),request.optString("opponent",p1)),stage=find(catalog.getJSONArray("stages"),request.getString("stage"));
        String mode=request.optString("mode","solo");if(!Arrays.asList("solo","versus","cpu","training").contains(mode))throw new IOException("Unknown play mode.");
        int level=Math.max(1,Math.min(8,request.optInt("level",4))),palette=Math.max(1,Math.min(12,request.optInt("palette",1))),p2palette=Math.max(1,Math.min(12,request.optInt("opponentPalette",1)));
        return new String[]{"-config","data/kenjatime/config.ini","-p1",p1,"-p2",p2,"-s",stage,"-p1.ai",mode.equals("cpu")?""+level:"0","-p2.ai",mode.equals("cpu")||mode.equals("solo")?""+level:"0","-p1.color",""+palette,"-p2.color",""+p2palette,"-rounds",mode.equals("training")?"9999":"2","-time",mode.equals("training")?"-1":"99","-kenjatime-mode",mode};
    }
    private String find(JSONArray list,String id) throws IOException,JSONException {for(int i=0;i<list.length();i++)if(list.getJSONObject(i).getString("id").equals(id))return id;throw new IOException("Select an installed fighter and stage before starting.");}
    File resource(String path) throws IOException {File file=new File(root,path);if(!file.getCanonicalPath().startsWith(root.getCanonicalPath()+File.separator)||!file.isFile())throw new IOException("Unknown game resource.");return file;}
    private String relative(File file) throws IOException {String base=root.getCanonicalPath()+File.separator,full=file.getCanonicalPath();if(!full.startsWith(base))throw new IOException("Resource leaves the game library.");return full.substring(base.length()).replace(File.separatorChar,'/');}
    private File resolve(File def,String name) throws IOException {
        if(name==null||name.isEmpty())return null;name=name.replace('\\','/');
        for(File candidate:new File[]{new File(def.getParentFile(),name),new File(root,name),new File(def.getParentFile(),new File(name).getName())}){
            if(candidate.getCanonicalPath().startsWith(root.getCanonicalPath()+File.separator)){
                if(candidate.isFile())return candidate;File current=root;String relative=candidate.getCanonicalPath().substring(root.getCanonicalPath().length()+1);for(String part:relative.split(java.util.regex.Pattern.quote(File.separator))){File[] children=current.listFiles();File found=null;if(children!=null)for(File child:children)if(child.getName().equalsIgnoreCase(part)){found=child;break;}if(found==null){current=null;break;}current=found;}if(current!=null&&current.isFile()&&current.getCanonicalPath().startsWith(root.getCanonicalPath()+File.separator))return current;
            }
        }return null;
    }
    static String text(File file) throws IOException {
        byte[] bytes;try(InputStream in=new FileInputStream(file)){bytes=GameLibrary.read(in,2*1024*1024);}
        if(bytes.length>1&&bytes[0]==(byte)0xff&&bytes[1]==(byte)0xfe)return new String(bytes,StandardCharsets.UTF_16LE);
        if(bytes.length>1&&bytes[0]==(byte)0xfe&&bytes[1]==(byte)0xff)return new String(bytes,StandardCharsets.UTF_16BE);
        try{return StandardCharsets.UTF_8.newDecoder().decode(java.nio.ByteBuffer.wrap(bytes)).toString();}catch(CharacterCodingException e){return new String(bytes,Charset.forName("windows-1252"));}
    }
    static Map<String,Map<String,String>> ini(String text){
        Map<String,Map<String,String>> result=new LinkedHashMap<>();Map<String,String> section=null;
        for(String raw:text.replace("\ufeff","").split("\\r?\\n")){
            String line=GameLibrary.stripComment(raw).trim();if(line.startsWith("[")&&line.endsWith("]")){String name=line.substring(1,line.length()-1).trim().toLowerCase(Locale.ROOT);section=result.computeIfAbsent(name,key->new LinkedHashMap<>());}
            else if(section!=null&&line.indexOf('=')>0){int eq=line.indexOf('=');String value=line.substring(eq+1).trim();if(value.length()>1&&value.startsWith("\"")&&value.endsWith("\""))value=value.substring(1,value.length()-1);section.put(line.substring(0,eq).trim().toLowerCase(Locale.ROOT),value);}
        }return result;
    }
}
