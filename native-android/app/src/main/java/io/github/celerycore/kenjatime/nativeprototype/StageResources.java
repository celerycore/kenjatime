package io.github.celerycore.kenjatime.nativeprototype;

import java.io.*;
import java.util.*;
import java.util.regex.*;

/** Engine-ready stage copy; original installed files and catalog IDs stay intact. */
final class StageResources {
    static String music(File root,File def) throws IOException {
        String source=GameCatalog.text(def);StringBuilder out=new StringBuilder();boolean music=false,changed=false;
        Pattern field=Pattern.compile("^(\\s*(?:[\\w.-]+\\.)?(?:bgmusic|bgm)\\s*=\\s*)(.*)$",Pattern.CASE_INSENSITIVE);
        for(String line:source.split("\\r?\\n",-1)) {
            String clean=GameLibrary.stripComment(line).trim();
            if(clean.startsWith("[")&&clean.endsWith("]"))music=clean.equalsIgnoreCase("[Music]");
            Matcher m=field.matcher(line);
            if(music&&m.matches()) {
                String original=line;boolean resolved=false;
                String value=GameLibrary.stripComment(m.group(2)).trim();File direct=resolve(root,def,value);
                if(direct!=null){line=m.group(1)+quote(relative(root,direct));resolved=true;}
                else {
                    List<String> tracks=new ArrayList<>();int start=0;boolean quoted=false;
                    for(int i=0;i<=value.length();i++) {if(i<value.length()&&value.charAt(i)=='"')quoted=!quoted;if(i==value.length()||(value.charAt(i)==','&&!quoted)) {String track=value.substring(start,i).trim();File file=resolve(root,def,track);if(file!=null)resolved=true;tracks.add(file==null?track:quote(relative(root,file)));start=i+1;}}
                    line=m.group(1)+String.join(", ",tracks);
                }
                if(resolved&&!line.equals(original))changed=true;
            }
            out.append(line).append('\n');
        }
        return changed?out.toString():null;
    }
    private static String quote(String name){return (name.contains(",")||name.contains(";"))?'"'+name+'"':name;}
    private static String relative(File root,File file) throws IOException {return file.getCanonicalPath().substring(root.getCanonicalPath().length()+1).replace(File.separatorChar,'/');}
    private static File resolve(File root,File def,String name) throws IOException {
        name=name.trim();if(name.startsWith("\"")&&name.endsWith("\"")&&name.length()>1)name=name.substring(1,name.length()-1);name=name.replace('\\','/');
        if(name.isEmpty()||name.startsWith("/")||name.matches("^[A-Za-z]:.*")||name.indexOf(0)>=0)return null;
        String defPath=relative(root,def);File pkg=root;
        if(defPath.startsWith("imports/")){String[] parts=defPath.split("/",3);if(parts.length<3)return null;pkg=new File(root,"imports/"+parts[1]);}
        String boundary=pkg.getCanonicalPath()+File.separator;
        for(File candidate:new File[]{new File(def.getParentFile(),name),new File(pkg,name),new File(root,name),new File(def.getParentFile(),new File(name).getName())}) {
            String path=candidate.getCanonicalPath();if(!path.startsWith(boundary))continue;
            File current=pkg;for(String part:path.substring(boundary.length()).split(Pattern.quote(File.separator))) {File found=null;File[] children=current.listFiles();if(children!=null)for(File child:children)if(child.getName().equalsIgnoreCase(part)){found=child;break;}if(found==null){current=null;break;}current=found;}
            if(current!=null&&current.isFile()&&current.getCanonicalPath().startsWith(boundary))return current;
        }
        return null;
    }
}
