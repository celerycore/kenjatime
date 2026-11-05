const winner=(players)=>{
  if(players[0].life<=0&&players[1].life<=0)return'draw';
  if(players[0].life<=0)return'opponent';if(players[1].life<=0)return'player';
  const difference=players[0].life*players[1].maxLife-players[1].life*players[0].maxLife;
  return difference===0?'draw':difference>0?'player':'opponent';
};

/** Round phases and scoring are independent of character state/animation clocks. */
export class RoundFlow{
  constructor({roundsToWin=2,roundTime=99,preIntro=30,introHold=30,overTime=60,resultTime=90,autoAdvance=true}={}){
    for(const [key,value]of Object.entries({roundsToWin,roundTime,preIntro,introHold,overTime,resultTime}))if(!Number.isFinite(value)||value<0)throw Error(`Invalid match rule ${key}.`);
    if(roundsToWin<1||roundsToWin>99||roundTime>3600)throw Error('Match rule exceeds supported bounds.');
    this.rules={roundsToWin:Math.trunc(roundsToWin),roundTime,preIntro:Math.trunc(preIntro),introHold:Math.trunc(introHold),overTime:Math.trunc(overTime),resultTime:Math.trunc(resultTime),autoAdvance};
    this.roundNo=1;this.roundsExisted=0;this.wins={player:0,opponent:0};this.matchOver=false;this.roundWinner=null;this.reason=null;this.startRound();
  }
  startRound(){this.roundState=0;this.phaseTime=0;this.timeLeft=this.rules.roundTime?Math.round(this.rules.roundTime*60):-1;this.roundWinner=null;this.reason=null;this._awarded=false;}
  step({players,paused=false,intro=false,roundNotOver=false,timerFreeze=false,noKO=[false,false]}={}){
    const events=[];if(paused)return events;
    if(this.roundState===0){if(++this.phaseTime>=this.rules.preIntro){this.roundState=1;this.phaseTime=0;}return events;}
    if(this.roundState===1){
      this.phaseTime++;if(!intro&&this.phaseTime>=this.rules.introHold){this.roundState=2;this.phaseTime=0;events.push({type:'fight'});}return events;
    }
    if(this.roundState===2){
      this.phaseTime++;
      const knockout=players.some((p,i)=>p.life<=0&&!noKO[i]);
      if(!timerFreeze&&this.timeLeft>0)this.timeLeft--;
      if(knockout||this.timeLeft===0){
        this.roundWinner=winner(players);this.reason=knockout?(players.every(p=>p.life<=0)?'double-ko':'ko'):'time';
        this.roundState=3;this.phaseTime=0;events.push({type:'round-over',winner:this.roundWinner,reason:this.reason});
      }return events;
    }
    if(this.roundState===3){
      if(roundNotOver)return events;
      if(++this.phaseTime>=this.rules.overTime){
        if(!this._awarded&&this.roundWinner!=='draw'){this.wins[this.roundWinner]++;this._awarded=true;}
        this.matchOver=Object.values(this.wins).some(w=>w>=this.rules.roundsToWin);
        this.roundState=4;this.phaseTime=0;events.push({type:'result',winner:this.roundWinner,reason:this.reason,matchOver:this.matchOver});
      }return events;
    }
    if(this.roundState===4&&!roundNotOver&&!this.matchOver&&this.rules.autoAdvance&&++this.phaseTime>=this.rules.resultTime){
      this.roundNo++;this.roundsExisted++;this.startRound();events.push({type:'next-round',roundNo:this.roundNo});
    }
    return events;
  }
}
