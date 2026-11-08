-- QA only. The production bootstrap/core never loads this file.
local cfg=jsonDecode('qa/plan.json')
local result={cases={}}
local current=0
local active=nil
local lastFrame=-1
local finished=false
local visualWaiting=false
local calls=0
local function fighter()
 local v={state=stateNo(),time=time(),stateOwner=getStateOwnerPlayerNo(),animationOwner=animPlayerNo(),anim=anim(),element=animElemNo(0),elementTime=animElemTime(animElemNo(0)),
  life=life(),power=power(),x=posX(),y=posY(),vx=velX(),vy=velY(),facing=facing(),ctrl=ctrl(),stateType=stateType(),moveType=moveType(),physics=physics(),
  hitCount=hitCount(),moveHit=moveHit(),moveContact=moveContact(),moveGuarded=moveGuarded(),hitPause=hitPauseTime(),guardDistance=inGuardDist(),
  hitTime=getHitVar('hittime'),hitShake=getHitVar('hitshaketime'),fall=getHitVar('fall'),recover=getHitVar('fall.recover'),fallTime=getHitVar('fall.time'),
  palette=palNo(),drawPalette={drawPal('group'),drawPal('index')},tint={palFxVar('time'),palFxVar('add.r'),palFxVar('add.g'),palFxVar('add.b'),palFxVar('mul.r'),palFxVar('mul.g'),palFxVar('mul.b')},
  projectileHit=projHitTime(-1),projectileGuarded=projGuardedTime(-1),projectileCancelled=projCancelTime(-1),
  variables={var(0),var(1),var(2),var(3),var(4),var(5)},helperCount=numHelper(),projectileCount=numProj(),targets=numTarget(),
  screenX=screenPosX(),screenY=screenPosY()}
 v.sprite={spriteVar('width'),spriteVar('height'),spriteVar('xoffset'),spriteVar('yoffset')}
 return v
end
local function snapshot(side)
 player(side)
 local v=fighter()
 v.helpers={}
 for h=1,math.min(32,v.helperCount) do
  player(side)
  assert(helperIndex(h),'Missing helper during capture')
  local helper=fighter();helper.helperId=helperVar('id');helper.ownPalette=helperVar('ownpal');helper.id=id()
  v.helpers[#v.helpers+1]=helper
 end
 player(side)
 v.projectiles={}
 for p=0,math.min(32,v.projectileCount)-1 do
  v.projectiles[#v.projectiles+1]={id=projVar(-1,p,'projid'),anim=projVar(-1,p,'anim'),time=projVar(-1,p,'time'),hits=projVar(-1,p,'projhits'),
   x=projVar(-1,p,'pos x'),y=projVar(-1,p,'pos y'),vx=projVar(-1,p,'vel x'),vy=projVar(-1,p,'vel y'),pause=projVar(-1,p,'pausemovetime'),
   palette={projVar(-1,p,'drawpal group'),projVar(-1,p,'drawpal index')}}
 end
 return v
end
local function save()
 jsonEncode(result,'save/verification.json')
 print('KJ_VERIFY_DONE')
 finished=true
 if getRuntimeOS()=='js' then togglePause() else os.exit(0) end
end
local function finish()
 if cfg.capture then
  jsonEncode(result,'save/verification.json')
  local f=assert(io.open('qa/capture.request','w'));f:write('capture');f:close()
  if getRuntimeOS()=='js' then print('KJ_VERIFY_DONE');finished=true;togglePause()
  else visualWaiting=true;togglePause() end
 else save() end
end
local function startNext()
 current=current+1
 if current>#cfg.cases then finish();return end
 local c=cfg.cases[current]
 active={id=c.id,samples={}}
 result.cases[#result.cases+1]=active
 lastFrame=-1
 print('KJ_CASE '..c.id)
 for side=1,2 do player(side);playerBufReset(side);setLife(1000);setPower(c.power or 1500);assert(changeState(c.setupState),'Missing QA setup state') end
end
function loop()
 calls=calls+1
 if calls%120==0 and active then player(1);print('KJ_PROGRESS',current,gameTime(),stateNo(),time(),var(cfg.caseVar),var(cfg.originVar),paused(),roundState()) end
 if finished then return end
 if visualWaiting then if not fileExists('qa/capture.request') then save() end;return end
 if not active then
  if roundState()==2 and player(1) and stateNo()==0 and player(2) and stateNo()==0 then startNext() end
  return
 end
 player(1)
 if var(cfg.caseVar)~=current then
  if calls%10==0 then
   active.setupRetries=(active.setupRetries or 0)+1
   assert(active.setupRetries<=5,'Could not enter neutral setup: '..active.id)
   local c=cfg.cases[current]
   for side=1,2 do player(side);playerBufReset(side);assert(changeState(c.setupState),'Missing QA setup state') end
  end
  return
 end
 local frame=gameTime()-var(cfg.originVar)
 if frame<=0 then return end
 if frame==lastFrame then return end
 assert(frame==lastFrame+1 or lastFrame==-1 and frame==1,'Missing QA simulation frame: '..frame..' after '..lastFrame)
 lastFrame=frame
 local row={tick=frame,player=snapshot(1),opponent=snapshot(2),camera={cameraPosX(),cameraPosY()},pause=pauseTime()}
 active.samples[#active.samples+1]=row
 local c=cfg.cases[current]
 local complete=(c.captureAt and frame>=c.captureAt) or (frame>=(c.minFrames or 40) and row.player.ctrl and row.opponent.ctrl and row.player.helperCount==0 and row.player.projectileCount==0 and row.opponent.helperCount==0 and row.opponent.projectileCount==0)
 if complete or frame>=(c.maxFrames or 480) then
  active.timedOut=not complete
  startNext()
 end
end
