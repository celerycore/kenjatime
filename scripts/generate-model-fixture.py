"""Authored glTF receiver/occluder/light fixture; no third-party model assets."""
from pathlib import Path
import json,struct,math
out=Path('test/fixtures/media');data=bytearray();views=[];accessors=[]
def accessor(values,kind,components,fmt='f'):
 offset=len(data);flat=[v for row in values for v in row] if isinstance(values[0],list) else values;data.extend(struct.pack('<'+fmt*len(flat),*flat));views.append({'buffer':0,'byteOffset':offset,'byteLength':len(data)-offset});a={'bufferView':len(views)-1,'componentType':5126 if fmt=='f' else 5125,'count':len(flat)//components,'type':kind}
 if kind=='VEC3':a.update(min=[min(row[i] for row in values) for i in range(3)],max=[max(row[i] for row in values) for i in range(3)])
 accessors.append(a);return len(accessors)-1
meshes=[]
for z,size,material in [(0,2,0),(1,.4,1)]:
 positions=[[-size,-size,z],[size,-size,z],[-size,size,z],[size,size,z]];pos=accessor(positions,'VEC3',3);normal=accessor([[0,0,1]]*4,'VEC3',3);uv=accessor([[0,0],[1,0],[0,1],[1,1]],'VEC2',2);indices=accessor([0,1,2,2,1,3],'SCALAR',1,'I');meshes.append({'primitives':[{'attributes':{'POSITION':pos,'NORMAL':normal,'TEXCOORD_0':uv},'indices':indices,'material':material}]})
angle=math.atan(.4)
model={'asset':{'version':'2.0','generator':'Kenjatime authored QA'},'extensionsUsed':['KHR_lights_punctual'],'extensions':{'KHR_lights_punctual':{'lights':[{'type':'directional','color':[1,1,1],'intensity':3,'extras':{'shadowMapNear':.1,'shadowMapFar':10,'shadowMapLeft':-3,'shadowMapRight':3,'shadowMapBottom':-3,'shadowMapTop':3,'shadowMapBias':.00005}}]}},'buffers':[{'uri':'shadow.bin','byteLength':len(data)}],'bufferViews':views,'accessors':accessors,'materials':[{'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[.7,.7,.7,1],'metallicFactor':0,'roughnessFactor':1}},{'doubleSided':True,'pbrMetallicRoughness':{'baseColorFactor':[.1,.2,.8,1],'metallicFactor':0,'roughnessFactor':1}}],'meshes':meshes,'nodes':[{'mesh':0},{'mesh':1},{'translation':[1,0,5],'rotation':[0,math.sin(angle/2),0,math.cos(angle/2)],'extensions':{'KHR_lights_punctual':{'light':0}}}],'scenes':[{'nodes':[0,1,2]}],'scene':0}
for node in model['nodes']:
 node.setdefault('scale',[1,1,1]);node.setdefault('rotation',[0,0,0,1]);node.setdefault('translation',[0,0,0])
(out/'shadow.gltf').write_text(json.dumps(model,separators=(',',':'))+'\n');(out/'shadow.bin').write_bytes(data)

from PIL import Image
image=Image.new('RGBA',(2,2));image.putdata([(26,51,204,255),(26,51,204,0)]*2);image.save(out/'mask.png')
