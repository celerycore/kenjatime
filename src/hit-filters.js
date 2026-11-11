const cache=new Map();
const classes=['N','S','H'];

/** Native attribute masks keep the S/C/A and attack-class fields separate. */
export function hitAttribute(value){
  const key=String(value??'').toUpperCase().replace(/\s/g,'');if(cache.has(key))return cache.get(key);
  const [state,...items]=key.split(',');if(!/^[SCA]*$/.test(state))throw Error(`Invalid hit attribute states: ${state}`);
  const attacks=new Set();for(const item of items){
    if(!item)continue;
    // Legacy MUGEN 'cheap' characters sometimes concatenate multiple valid
    // attack tokens without commas, e.g. NASAHANPSPHPNTSTHT. Interpret only
    // complete 2-letter tokens; malformed or odd-length strings still fail.
    // This has the same resulting hit mask as the comma-separated spelling.
    if(item.length%2!==0)throw Error(`Invalid hit attack attribute: ${item}`);
    for(let offset=0;offset<item.length;offset+=2){
      const token=item.slice(offset,offset+2);
      if(!/^[NSHA][ATP]$/.test(token))throw Error(`Invalid hit attack attribute: ${item}`);
      for(const type of token[0]==='A'?classes:[token[0]])attacks.add(type+token[1]);
    }
  }
  const result={states:new Set(state),attacks};if(cache.size>=512)cache.delete(cache.keys().next().value);cache.set(key,result);return result;
}

export function attributeFields(filter,attribute){
  const a=typeof filter==='string'?hitAttribute(filter):filter,b=typeof attribute==='string'?hitAttribute(attribute):attribute;
  return{state:[...b.states].some(value=>a.states.has(value)),attack:[...b.attacks].some(value=>a.attacks.has(value))};
}

export function attributeMatches(filter,attribute){const match=attributeFields(filter,attribute);return match.state&&match.attack;}

export function filterAllows(filter,attribute){
  const match=attributeFields(filter.attribute,attribute);
  return filter.exclude?!match.state&&!match.attack:match.state&&match.attack;
}
