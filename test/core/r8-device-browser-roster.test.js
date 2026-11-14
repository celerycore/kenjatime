import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseBenchmarkAgent,collectBenchmarkDeviceInfo,describeBenchmarkDevice
} from '../../src/core/benchmark-device.js';
import {
  findBenchmarkFighters,BENCHMARK_MATCHUP
} from '../../src/core/benchmark-roster.js';

test('Infinix Android Chrome is identified from the user agent when Client Hints are absent',async()=>{
  const ua='Mozilla/5.0 (Linux; Android 10; Infinix X652C Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/157.0.0.0 Mobile Safari/537.36';
  const parsed=parseBenchmarkAgent(ua);
  assert.equal(parsed.deviceModel,'Infinix X652C');
  assert.equal(parsed.osName,'Android');
  assert.equal(parsed.osVersion,'10');
  assert.equal(parsed.browserName,'Google Chrome');
  assert.equal(parsed.browserVersion,'157.0.0.0');
  const info=await collectBenchmarkDeviceInfo({
    navigator:{userAgent:ua,deviceMemory:4,hardwareConcurrency:8},
    screen:{width:360,height:800},pixelRatio:2.5,
  });
  assert.equal(info.deviceModel,'Infinix X652C');
  assert.equal(info.deviceMemoryGiB,4);
  assert.equal(info.hardwareConcurrency,8);
  assert.equal(info.screenWidth,360);
  assert.equal(info.screenHeight,800);
  assert.equal(info.pixelRatio,2.5);
  assert.match(describeBenchmarkDevice(info),/Infinix X652C.*Chrome 157/);
});

test('Browser UA Client Hints model and full version override reduced Android UA',async()=>{
 const info=await collectBenchmarkDeviceInfo({
   navigator:{
     userAgent:'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/157.0.0.0 Mobile Safari/537.36',
     userAgentData:{platform:'Android',brands:[{brand:'Chromium',version:'157'}],
       async getHighEntropyValues(keys){
         assert.ok(keys.includes('model')&&keys.includes('fullVersionList'));
         return {model:'Infinix Note 30',platform:'Android',platformVersion:'14.0.0',
           fullVersionList:[{brand:'Chromium',version:'157.0.0.0'},
             {brand:'Google Chrome',version:'157.0.7612.123'}]};
       }},
   },
 });
 assert.equal(info.deviceModel,'Infinix Note 30');
 assert.equal(info.browserName,'Google Chrome');
 assert.equal(info.browserVersion,'157.0.7612.123');
 assert.equal(info.osName,'Android');
 assert.equal(info.osVersion,'14.0.0');
});

test('Restricted browser does not invent Infinix model; denied Client Hints fall back safely',async()=>{
 const info=await collectBenchmarkDeviceInfo({
   navigator:{userAgent:'Mozilla/5.0 (Linux; Android 10; K) Chrome/157.0.0.0 Mobile Safari/537.36',
     userAgentData:{getHighEntropyValues(){throw Error('blocked')}}},
 });
 assert.equal(info.deviceModel,'Unknown');
 assert.equal(info.browserName,'Google Chrome');
 assert.equal(info.deviceMemoryGiB,null);
 assert.equal(info.hardwareConcurrency,null);
});

test('Browser parsing recognizes Samsung Internet, Edge, Firefox and Safari in precedence order',()=>{
 assert.equal(parseBenchmarkAgent('Mozilla/5.0 (Linux; Android 14; SM-S926U) Chrome/122.0.0.0 Mobile Safari/537.36 SamsungBrowser/25.0').browserName,'Samsung Internet');
 assert.equal(parseBenchmarkAgent('Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit Chrome/120.0 EdgA/120.0').browserName,'Microsoft Edge');
 assert.equal(parseBenchmarkAgent('Mozilla/5.0 (Android 12; Mobile; rv:122.0) Gecko Firefox/122.0').browserName,'Firefox');
 assert.equal(parseBenchmarkAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Version/17.0 Mobile Safari/604.1').browserName,'Safari');
});

test('Nu-13 and Tomoka form a repeatable CPU-vs-CPU installed-only matchup',()=>{
 const mk=(id,name)=>({id,name,sprite:id+'.sff',anim:id+'.air'});
 const fighters=[mk('base','Kung Fu Man'),mk('t','Tomoka Minato'),mk('n','Nu-13')];
 const selected=findBenchmarkFighters(fighters);
 assert.equal(selected.ready,true);
 assert.equal(selected.tomoka.id,'t');
 assert.equal(selected.nu13.id,'n');
 assert.deepEqual(selected.missing,[]);
 assert.equal(BENCHMARK_MATCHUP.mode,'cpu');
 assert.equal(BENCHMARK_MATCHUP.spriteCacheMode,'extended');
 assert.equal(BENCHMARK_MATCHUP.gameplayFirst,true);
 assert.equal(BENCHMARK_MATCHUP.endless,true);
});

test('missing or malformed fighter archives never get marked installed or added as fake characters',()=>{
 const installed=findBenchmarkFighters([
  {id:'tomoka',name:'Tomoka Minato',sprite:'a.sff'},
  {id:'nu',name:'Nu13',sprite:'n.sff',anim:'n.air'},
 ]);
 assert.equal(installed.ready,false);
 assert.deepEqual(installed.missing,['Tomoka Minato']);
 assert.equal(installed.nu13.id,'nu');
 assert.equal(findBenchmarkFighters([]).ready,false);
 const alias=findBenchmarkFighters([
  {id:'a',name:'Tomoka',sprite:'a.sff',anim:'a.air'},
  {id:'b',name:'Nu 13',sprite:'b.sff',anim:'b.air'},
 ]);
 assert.equal(alias.ready,true);
});
