const LIMIT=8192;

export function decodeQuotedText(raw){
  if(!/^"[\s\S]*"$/.test(raw))throw Error('Text must be enclosed in double quotes.');
  if(raw.length>LIMIT)throw Error('Debug text exceeds 8192 characters.');
  return raw.slice(1,-1).replace(/\\([\s\S])/g,(_,c)=>{
    if(c==='n')return'\n';if(c==='t')return'    ';if(c==='\\'||c==='"')return c;
    throw Error(`Unsupported text escape \\${c}.`);
  });
}

export function clipboardFormat(raw){
  const text=decodeQuotedText(raw),parts=[];let offset=0,count=0;
  for(let i=0;i<text.length;i++)if(text[i]==='%'){
    parts.push(text.slice(offset,i));
    if(text[i+1]==='%'){parts.push('%');i++;offset=i+1;continue;}
    const match=/^%([-+ #0]*)(\d*)(?:\.(\d*))?([difFeEgG])/.exec(text.slice(i));
    if(!match)throw Error('Unsupported clipboard format specifier.');
    const width=Number(match[2]||0),precision=match[3]===undefined?undefined:Number(match[3]||0);
    if(width>512||precision>20)throw Error('Clipboard format width or precision exceeds supported bounds.');
    parts.push({flags:match[1],width,precision,spec:match[4]});count++;
    i+=match[0].length-1;offset=i+1;
  }
  parts.push(text.slice(offset));if(count>6)throw Error('Clipboard format accepts at most 6 numeric parameters.');
  return{parts,count};
}

function formatNumber({flags,width,precision,spec},{value,float}){
  if(typeof value!=='number'||!Number.isFinite(value))throw Error('Clipboard parameters must be finite numbers.');
  if(float===undefined)float=!Number.isInteger(value);
  if(/[di]/.test(spec)===!!float){spec=float?'f':'d';flags='';width=0;precision=undefined;}
  const negative=value<0||Object.is(value,-0),n=Math.abs(value);let out;
  if(/[di]/.test(spec))out=precision===0&&n===0?'':Math.trunc(n).toString().padStart(precision??0,'0');
  else if(/[fF]/.test(spec))out=n.toFixed(precision??6);
  else if(/[eE]/.test(spec))out=n.toExponential(precision??6);
  else{
    const p=Math.max(1,precision??6),rounded=Number(n.toPrecision(p)),exponent=rounded?Math.floor(Math.log10(rounded)):0;
    out=exponent< -4||exponent>=p?n.toExponential(p-1):n.toFixed(Math.max(0,p-exponent-1));
    if(!flags.includes('#'))out=out.replace(/(\.\d*?[1-9])0+(?=e|$)/,'$1').replace(/\.0*(?=e|$)/,'');
  }
  if(flags.includes('#')&&!out.includes('.'))out=out.replace(/e|$/i,'.'+(out.includes('e')?'e':''));
  out=out.replace(/e([+-])(\d+)$/i,(_,sign,digits)=>'e'+sign+digits.padStart(2,'0'));
  if(/[FEG]/.test(spec))out=out.toUpperCase();
  const sign=negative?'-':flags.includes('+')?'+':flags.includes(' ')?' ':'';
  if(flags.includes('0')&&!flags.includes('-')&&(precision===undefined||!/[di]/.test(spec)))return sign+out.padStart(Math.max(0,width-sign.length),'0');
  out=sign+out;return flags.includes('-')?out.padEnd(width):out.padStart(width);
}

export function formatClipboard(format,values){
  if(values.length!==format.count)throw Error(`Clipboard format requires ${format.count} parameters, received ${values.length}.`);
  let index=0;const text=format.parts.map(part=>typeof part==='string'?part:formatNumber(part,values[index++])).join('');
  if(text.length>LIMIT)throw Error('Formatted clipboard exceeds 8192 characters.');return text;
}
