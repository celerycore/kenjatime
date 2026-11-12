const winner=(players)=>{
  if(players[0].life<=0&&players[1].life<=0)return'draw';
  if(players[0].life<=0)return'opponent';if(players[1].life<=0)return'player';
  const difference=players[0].life*players[1].maxLife-players[1].life*players[0].maxLife;
  return difference===0?'draw':difference>0?'player':'opponent';
};

/**
 * Native MUGEN round phases:
 * 0 = character introductions; 1 = ROUND n announcement;
 * 2 = FIGHT; 3 = KO/time-over; 4 = authored victory/defeat states.
 *
 * All durations are simulation ticks (60 Hz). Character scripts, not the HUD,
 * decide when their intros and victory animations are finished. Bounded
 * failsafes prevent a broken character from trapping the entire match.
 */
export class RoundFlow{
  constructor({roundsToWin=2,roundTime=99,preIntro=30,introHold=30,overTime=60,resultTime=90,
    maxIntroTime=900,maxOutroTime=300,autoAdvance=true,endless=false,maxNoKOTime=180}={}){
    for(const [key,value] of Object.entries({roundsToWin,roundTime,preIntro,introHold,overTime,resultTime,maxIntroTime,maxOutroTime,maxNoKOTime}))
      if(!Number.isFinite(value)||value<0)throw Error(`Invalid match rule ${key}.`);
    if(roundsToWin<1||roundsToWin>99||roundTime>3600||maxIntroTime>36000||maxOutroTime>36000||maxNoKOTime<1||maxNoKOTime>36000)
      throw Error('Match rule exceeds supported bounds.');
    this.rules={roundsToWin:Math.trunc(roundsToWin),roundTime,
      preIntro:Math.trunc(preIntro),introHold:Math.trunc(introHold),
      overTime:Math.trunc(overTime),resultTime:Math.trunc(resultTime),
      maxIntroTime:Math.trunc(maxIntroTime),maxOutroTime:Math.trunc(maxOutroTime),maxNoKOTime:Math.trunc(maxNoKOTime),autoAdvance,
      endless:endless===true};
    this.roundNo=1;this.roundsExisted=0;this.wins={player:0,opponent:0};
    this.matchOver=false;this.roundWinner=null;this.reason=null;this.startRound();
  }
  startRound(){
    this.roundState=0;this.phaseTime=0;
    // Endless keeps real KO/outro/round resets, but has no round time limit.
    this.timeLeft=this.rules.endless?-1:this.rules.roundTime?Math.round(this.rules.roundTime*60):-1;
    this.roundWinner=null;this.reason=null;this._awarded=false;
    this.zeroLifeNoKOTicks=[0,0];
  }
  step({players,paused=false,intro=false,introPending=false,victoryPending=false,
    roundNotOver=false,timerFreeze=false,noKO=[false,false]}={}){
    const events=[];if(paused)return events;
    if(this.roundState===0){
      this.phaseTime++;
      if(this.phaseTime<this.rules.preIntro || (introPending&&this.phaseTime<this.rules.maxIntroTime))return events;
      this.roundState=1;this.phaseTime=0;
      events.push({type:'round',roundNo:this.roundNo});
      return events;
    }
    if(this.roundState===1){
      this.phaseTime++;
      if(this.phaseTime>=this.rules.introHold&&(!intro||this.phaseTime>=this.rules.maxIntroTime)){
        this.roundState=2;this.phaseTime=0;
        events.push({type:'fight',roundNo:this.roundNo});
      }
      return events;
    }
    if(this.roundState===2){
      this.phaseTime++;
      // NoKO can temporarily protect a cinematic defeat, but an endlessly
      // asserted NoKO must not trap a fighter at zero life forever.
      const knockout=players.some((p,i)=>{
        if(p.life>0){this.zeroLifeNoKOTicks[i]=0;return false;}
        if(!noKO[i]){this.zeroLifeNoKOTicks[i]=0;return true;}
        this.zeroLifeNoKOTicks[i]++;
        return this.zeroLifeNoKOTicks[i]>=this.rules.maxNoKOTime;
      });
      if(!timerFreeze&&this.timeLeft>0)this.timeLeft--;
      if(knockout||this.timeLeft===0){
        this.roundWinner=winner(players);
        this.reason=knockout?(players.every(p=>p.life<=0)?'double-ko':'ko'):'time';
        this.roundState=3;this.phaseTime=0;
        events.push({type:'round-over',winner:this.roundWinner,reason:this.reason});
      }
      return events;
    }
    if(this.roundState===3){
      this.phaseTime++;
      if(roundNotOver&&this.phaseTime<this.rules.maxOutroTime)return events;
      if(this.phaseTime>=this.rules.overTime){
        if(!this._awarded&&this.roundWinner!=='draw'){this.wins[this.roundWinner]++;this._awarded=true;}
        // In benchmark endless mode the round results are kept, but no win count can terminate the match.
        this.matchOver=!this.rules.endless&&Object.values(this.wins).some(w=>w>=this.rules.roundsToWin);
        this.roundState=4;this.phaseTime=0;
        events.push({type:'result',winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver});
      }
      return events;
    }
    if(this.roundState===4&&!this.matchOver&&this.rules.autoAdvance){
      this.phaseTime++;
      const complete=this.phaseTime>=this.rules.resultTime;
      const outroDone=(!victoryPending&&!roundNotOver)||this.phaseTime>=this.rules.maxOutroTime;
      if(complete&&outroDone){
        this.roundNo++;this.roundsExisted++;this.startRound();
        events.push({type:'next-round',roundNo:this.roundNo});
      }
    }
    return events;
  }
}
