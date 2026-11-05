const cache=new Map();
const classes=['N','S','H'];

/** Native attribute masks keep the S/C/A and attack-class fields separate. */
export function hitAttribute(value){
  const key=String(value??'').toUpperCase().replace(/\s/g,'');if(cache.has(key))return cache.get(key);
  const [state,...items]=key.split(',');if(!/^[SCA]*$/.test(state))throw Error(`Invalid hit attribute states: ${state}`);
  const attacks=new Set();for(const item of items){
    if(!item)continue;if(!/^[NSHA][ATP]$/.test(item))throw Error(`Invalid hit attack attribute: ${item}`);
    for(const type of item[0]==='A'?classes:[item[0]])attacks.add(type+item[1]);
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
