/** Benchmark roster profiles are *match templates*, not game assets.
 * Kenjatime must never pretend a fighter is playable unless the actual
 * archive was imported on the current device (or legally hosted later).
 */
const normalize=name=>String(name||"").normalize("NFKC").toLowerCase()
  .replace(/[ν]/g,"nu").replace(/[^a-z0-9]+/g,"");
export const BENCHMARK_MATCHUP=Object.freeze({
  id:"nu13-tomoka-r8",
  title:"Tomoka Minato vs Nu-13",
  p1:"Tomoka Minato",
  p2:"Nu-13",
  mode:"cpu",spriteCacheMode:"extended",gameplayFirst:true,endless:true,
});
export function findBenchmarkFighters(characters=[]){
  const available=(Array.isArray(characters)?characters:[]).filter(c=>c&&
    typeof c.id==="string"&&c.sprite&&c.anim);
  const names=c=>[c.name,c.characterName,c.definitionName].map(normalize);
  const find=(patterns,preferred,excludedId)=>{
    const candidates=available.filter(character=>character.id!==excludedId);
    return candidates.find(c=>normalize(c.name)===preferred)||
      candidates.find(c=>names(c).includes(preferred))||
      candidates.find(c=>names(c).some(name=>patterns.some(pattern=>pattern.test(name))));
  };
  const tomoka=find([/^tomokaminato$/, /^tomoka$/],"tomokaminato")||null;
  const nu13=find([/^nu13$/, /^nu013$/, /^nyu13$/],"nu13",tomoka?.id)||null;
  return {tomoka,nu13,ready:!!(tomoka&&nu13),
    missing:[!tomoka?"Tomoka Minato":null,!nu13?"Nu-13":null].filter(Boolean)};
}
