-- Kenjatime owns all screens. This script only configures and runs one match.
-- No motif, title, select, options, pause-menu or storyboard code is loaded.
function loop() end
local flags = {}
local selection = io.open('save/kenjatime-match.json', 'r')
if selection then selection:close(); flags = jsonDecode('save/kenjatime-match.json') end
for key,value in pairs(getCommandLineFlags()) do flags[key] = value end
local function number(key, fallback) return tonumber(flags[key]) or fallback end
local p1 = assert(flags['-p1'], 'Select a fighter in Kenjatime.')
local p2 = flags['-p2'] or p1
local stage = flags['-s'] or 'stages/kenjatime-grid.def'
local training = flags['-kenjatime-mode'] == 'training'
modifyGameOption('Config.BootLoadingMode', 0)
setGameMode(training and 'training' or 'quickvs')
setCredits(-1)
loadFightScreen('data/kenjatime/fight.def')
setFightScreenElements({guardbar=gameOption('Options.GuardBreak'), stunbar=gameOption('Options.Dizzy'), redlifebar=gameOption('Options.RedLife')})
local frames = fightScreenVar('time.framespercount')
setTimeFramesPerCount(frames)
setRoundTime(training and -1 or math.max(-1, number('-time',99)*frames))
for side=1,2 do
  setMatchWins(side, number('-rounds',2))
  setMatchMaxDrawGames(side, 1)
end
local added = addStage(stage)
assert(added and added ~= 0, 'Cannot load stage: '..stage)
assert(addChar(p1), 'Cannot load fighter: '..p1)
local second = 0
if p2 ~= p1 then
  assert(addChar(p2), 'Cannot load fighter: '..p2)
  second = 1
end
clearSelected()
setMatchNo(1)
selectStage(1)
setTeamMode(1,0,1)
setTeamMode(2,0,1)
selectChar(1,0,number('-p1.color',1))
selectChar(2,second,number('-p2.color',2))
setCom(1,number('-p1.ai',0))
setCom(2,number('-p2.ai',4))
remapInput(1,1)
remapInput(2,2)
loadStart('pausemenu=false')
while loading() do refresh() end
game()
os.exit(0)
