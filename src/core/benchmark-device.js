/** Reproducible R8 device/browser metadata for locally exported benchmark CSV.
 * No network send, no persistent device identifier and no IP/location lookup.
 * UA Client Hints may restrict the model: report Unknown rather than guess.
 */
const clean=(value,max=180)=>String(value||"").replace(/[\r\n\t]+/g," ").trim().slice(0,max);
const browserPatterns=[
  [/SamsungBrowser\/([\d.]+)/i,"Samsung Internet"],
  [/EdgA?\/([\d.]+)/i,"Microsoft Edge"],
  [/EdgiOS\/([\d.]+)/i,"Microsoft Edge"],
  [/OPR\/([\d.]+)/i,"Opera"],
  [/FxiOS\/([\d.]+)/i,"Firefox"],
  [/Firefox\/([\d.]+)/i,"Firefox"],
  [/CriOS\/([\d.]+)/i,"Google Chrome"],
  [/Chrome\/([\d.]+)/i,"Google Chrome"],
  [/Version\/([\d.]+).*Safari/i,"Safari"],
];
const androidModel=ua=>{
  const match=ua.match(/Android\s+[\d.]+;\s*([^)]+)/i);
  if(!match)return "";
  const model=clean(match[1]
    .replace(/;\s*(?:wv|U)(?=;|$)/gi,"")
    .replace(/\s*Build\/.*/i,"")
    .split(";").map(x=>x.trim()).filter(x=>x&&!/^Mobile$/i.test(x)).at(-1)||"",90);
  return /^(?:K|wv|U|Mobile|Unknown)$/i.test(model)?"":model;
};
export function parseBenchmarkAgent(userAgent=""){
  const ua=clean(userAgent,512);
  let osName="Unknown",osVersion="";
  if(/Android/i.test(ua)){
    osName="Android";
    osVersion=ua.match(/Android\s+([\d.]+)/i)?.[1]||"";
  }else if(/iPhone|iPad|iPod/i.test(ua)){
    osName="iOS/iPadOS";
    osVersion=(ua.match(/OS\s+(\d+(?:_\d+)*)/i)?.[1]||"").replaceAll("_", ".");
  }else if(/Windows NT/i.test(ua)){
    osName="Windows";
    osVersion=ua.match(/Windows NT\s+([\d.]+)/i)?.[1]||"";
  }else if(/Mac OS X/i.test(ua)){
    osName="macOS";
    osVersion=(ua.match(/Mac OS X\s+(\d+(?:_\d+)*)/i)?.[1]||"").replaceAll("_", ".");
  }else if(/Linux/i.test(ua))osName="Linux";
  const found=browserPatterns.map(([re,name])=>({match:ua.match(re),name})).find(x=>x.match);
  return {osName,osVersion,browserName:found?.name||"Unknown",
    browserVersion:found?.match?.[1]||"",
    deviceModel:osName==="Android"?androidModel(ua):
      /iPhone/i.test(ua)?"iPhone":/iPad/i.test(ua)?"iPad":"",
    userAgent:ua};
}
export async function collectBenchmarkDeviceInfo({
  navigator:nav=globalThis.navigator,screen:screenInfo=globalThis.screen,
  pixelRatio=globalThis.devicePixelRatio,
}={}){
  const parsed=parseBenchmarkAgent(nav?.userAgent||"");
  const data=nav?.userAgentData;
  let hints={};
  if(data?.getHighEntropyValues){
    try{
      hints=await data.getHighEntropyValues([
        "model","platform","platformVersion","fullVersionList"
      ])||{};
    }catch{hints={};}
  }
  const brandList=Array.isArray(hints.fullVersionList)
    ? hints.fullVersionList: Array.isArray(data?.brands)?data.brands:[];
  const browserNames={
    "Google Chrome":"Google Chrome","Microsoft Edge":"Microsoft Edge",
    "Samsung Internet":"Samsung Internet","Opera":"Opera",
    "Firefox":"Firefox","Chromium":"Chromium",
  };
  const preferred=brandList.find(b=>b?.brand===parsed.browserName)||
    brandList.find(b=>b?.brand&&b.brand!=="Chromium"&&browserNames[b.brand])||
    brandList.find(b=>b?.brand==="Chromium");
  // FullVersionList is more accurate than a reduced mobile user-agent.
  let browserName=parsed.browserName,browserVersion=parsed.browserVersion;
  if(preferred && (browserName==="Unknown"||preferred.brand===browserName)){
    browserName=browserNames[preferred.brand]||preferred.brand;
    browserVersion=clean(preferred.version,40)||browserVersion;
  }
  const osName=parsed.osName==="Unknown" ? clean(hints.platform||data?.platform,50)||"Unknown":parsed.osName;
  const deviceModel=clean(hints.model||parsed.deviceModel,90)||"Unknown";
  const memory=Number(nav?.deviceMemory);
  const cpu=Number(nav?.hardwareConcurrency);
  const width=Number(screenInfo?.width);
  const height=Number(screenInfo?.height);
  const dpr=Number(pixelRatio);
  return {
    deviceModel,osName,osVersion:parsed.osVersion,
    browserName,browserVersion,userAgent:parsed.userAgent,
    deviceMemoryGiB:Number.isFinite(memory)&&memory>0?memory:null,
    hardwareConcurrency:Number.isInteger(cpu)&&cpu>0?cpu:null,
    screenWidth:Number.isFinite(width)&&width>0?width:null,
    screenHeight:Number.isFinite(height)&&height>0?height:null,
    pixelRatio:Number.isFinite(dpr)&&dpr>0?dpr:null,
  };
}
export function describeBenchmarkDevice(info){
  if(!info)return "Detecting device / browser…";
  const model=info.deviceModel==="Unknown"?info.osName:
    info.deviceModel+" · "+info.osName;
  return model+" · "+info.browserName+
    (info.browserVersion?" "+info.browserVersion.split(".")[0]:"");
}
