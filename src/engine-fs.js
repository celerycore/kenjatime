/** In-memory Node-style filesystem for Go's js/wasm os package.
 * All character files are mounted before Go starts; gameplay never fetches files.
 */
export function createEngineFS(files={}, {onOutput=()=>{},maxBytes=512*1024*1024}={}) {
 const nodes=new Map(),handles=new Map();let next=3,total=0,cwd='/',output='';
 const error=(code,path='')=>Object.assign(Error(`${code}: ${path}`),{code});
 function path(raw){const parts=[];for(const part of String(raw).replaceAll('\\','/').normalize('NFC').split('/')){if(!part||part==='.')continue;if(part==='..'){if(!parts.length)throw error('EACCES',raw);parts.pop();}else{if(part.includes('\0'))throw error('EINVAL',raw);parts.push(part);}}return '/'+parts.join('/').toLowerCase();}
 function key(raw){return path(String(raw).startsWith('/')?raw:cwd+'/'+raw);}
 function putDir(p){if(nodes.has(p))return;if(p!=='/')putDir(p.slice(0,p.lastIndexOf('/'))||'/');nodes.set(p,{dir:true,children:new Set(),ino:nodes.size+1});if(p!=='/')nodes.get(p.slice(0,p.lastIndexOf('/'))||'/').children.add(p.slice(p.lastIndexOf('/')+1));}
 putDir('/');
 function writeFile(p,data){const old=nodes.get(p);if(old?.dir)throw error('EISDIR',p);const size=total-(old?.data.length||0)+data.length;if(size>maxBytes)throw error('ENOSPC',p);putDir(p.slice(0,p.lastIndexOf('/'))||'/');nodes.set(p,{data,dir:false,ino:old?.ino||nodes.size+1});nodes.get(p.slice(0,p.lastIndexOf('/'))||'/').children.add(p.slice(p.lastIndexOf('/')+1));total=size;}
 for(const [name,bytes]of Object.entries(files))writeFile(key(name),bytes instanceof Uint8Array?bytes:new Uint8Array(bytes));
 const node=p=>{const n=nodes.get(p);if(!n)throw error('ENOENT',p);return n;};
 const handle=fd=>{const h=handles.get(fd);if(!h)throw error('EBADF',String(fd));return h;};
 const stat=n=>({dev:1,ino:n.ino,mode:(n.dir?16384:32768)|(n.dir?493:420),nlink:1,uid:0,gid:0,rdev:0,size:n.data?.length||0,blksize:4096,blocks:Math.ceil((n.data?.length||0)/512),atimeMs:0,mtimeMs:0,ctimeMs:0,isDirectory:()=>n.dir,isFile:()=>!n.dir,isSymbolicLink:()=>false});
 const constants={O_RDONLY:0,O_WRONLY:1,O_RDWR:2,O_CREAT:64,O_EXCL:128,O_TRUNC:512,O_APPEND:1024};
 const call=fn=>(...args)=>{const cb=args.pop();let result;try{result=fn(...args);}catch(e){cb(e);return;}cb(null,result);};
 function emit(bytes){output+=new TextDecoder().decode(bytes);let end;while((end=output.indexOf('\n'))>=0){onOutput(output.slice(0,end));output=output.slice(end+1);}}
 const fs={constants,
  open:call((raw,flags)=>{const p=key(raw);let n=nodes.get(p);if((flags&64)&&n&&(flags&128))throw error('EEXIST',p);if(!n){if(!(flags&64))throw error('ENOENT',p);writeFile(p,new Uint8Array());n=node(p);}if(flags&512){writeFile(p,new Uint8Array());n=node(p);}const fd=next++;handles.set(fd,{path:p,pos:flags&1024?(n.data?.length||0):0});return fd;}),
  close:call(fd=>{handle(fd);handles.delete(fd);}),stat:call(raw=>stat(node(key(raw)))),lstat:call(raw=>stat(node(key(raw)))),fstat:call(fd=>stat(node(handle(fd).path))),
  readdir:call(raw=>{const n=node(key(raw));if(!n.dir)throw error('ENOTDIR',raw);return [...n.children].sort();}),
  read:call((fd,buffer,offset,length,position)=>{const h=handle(fd),n=node(h.path);if(n.dir)throw error('EISDIR',h.path);const start=position===null?h.pos:position,count=Math.max(0,Math.min(length,n.data.length-start));buffer.set(n.data.subarray(start,start+count),offset);if(position===null)h.pos+=count;return count;}),
  write:call((fd,buffer,offset,length,position)=>{if(fd===1||fd===2){emit(buffer.subarray(offset,offset+length));return length;}const h=handle(fd),n=node(h.path),start=position===null?h.pos:position;if(start<0||start+length>maxBytes)throw error('ENOSPC',h.path);if(start+length>n.data.length){const data=new Uint8Array(start+length);data.set(n.data);writeFile(h.path,data);}node(h.path).data.set(buffer.subarray(offset,offset+length),start);if(position===null)h.pos=start+length;return length;}),
  writeSync(fd,bytes){emit(bytes);return bytes.length;},
  mkdir:call(raw=>{const p=key(raw);if(nodes.has(p))throw error('EEXIST',p);const parent=node(p.slice(0,p.lastIndexOf('/'))||'/');if(!parent.dir)throw error('ENOTDIR',raw);putDir(p);}),
  unlink:call(raw=>{const p=key(raw),n=node(p);if(n.dir)throw error('EISDIR',p);total-=n.data.length;nodes.delete(p);nodes.get(p.slice(0,p.lastIndexOf('/'))||'/').children.delete(p.slice(p.lastIndexOf('/')+1));}),
  rmdir:call(raw=>{const p=key(raw),n=node(p);if(!n.dir)throw error('ENOTDIR',p);if(n.children.size)throw error('ENOTEMPTY',p);nodes.delete(p);nodes.get(p.slice(0,p.lastIndexOf('/'))||'/').children.delete(p.slice(p.lastIndexOf('/')+1));}),
  rename:call((from,to)=>{const a=key(from),b=key(to),n=node(a);if(n.dir)throw error('ENOSYS',a);writeFile(b,n.data);total-=n.data.length;nodes.delete(a);nodes.get(a.slice(0,a.lastIndexOf('/'))||'/').children.delete(a.slice(a.lastIndexOf('/')+1));}),
 };
 for(const name of ['chmod','fchmod','chown','fchown','lchown','utimes','fsync'])fs[name]=call(()=>{});
 fs.truncate=call((raw,length)=>{const p=key(raw),n=node(p);if(length<0||length>maxBytes)throw error('ENOSPC',p);const b=new Uint8Array(length);b.set(n.data.subarray(0,length));writeFile(p,b);});
 fs.ftruncate=(fd,length,cb)=>fs.truncate(handle(fd).path,length,cb);
 for(const name of ['readlink','link','symlink'])fs[name]=call(()=>{throw error('ENOSYS',name);});
 const process={pid:1,ppid:0,getuid:()=>0,getgid:()=>0,geteuid:()=>0,getegid:()=>0,getgroups:()=>[],umask:()=>0,cwd:()=>cwd,chdir:raw=>{const p=key(raw);if(!node(p).dir)throw error('ENOTDIR',p);cwd=p;}};
 return {fs,process,readFile:raw=>node(key(raw)).data,paths:()=>[...nodes.keys()],get bytes(){return total;}};
}
