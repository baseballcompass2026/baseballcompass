import type { BaseballProvider } from "./BaseballProvider";

interface MlbGame { gameDate:string; status:{abstractGameState:string;detailedState:string}; teams:{away:{team:{name:string};score?:number};home:{team:{name:string};score?:number}}; venue?:{name:string} }
interface MlbSchedule { dates?: Array<{games:MlbGame[]}> }
interface MlbStandings { records?: Array<{division?:{name:string};teamRecords:Array<{team:{name:string};wins:number;losses:number;winningPercentage:string}>}> }
interface MlbLeader { person?:{fullName:string}; team?:{name:string}; value:string|number }
interface MlbLeaders { leagueLeaders?: Array<{leaderCategory:string;leaders:MlbLeader[]}> }

// MLB公式Stats APIからキー不要で当日情報とランキングを取得するProvider
export class MlbStatsProvider implements BaseballProvider {
  private formatDate(date:Date){return new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",month:"2-digit",day:"2-digit",year:"numeric"}).format(date);}
  private season(){return Number(new Intl.DateTimeFormat("en-US",{timeZone:"Asia/Tokyo",year:"numeric"}).format(new Date()));}
  private async officialJson<T>(url:string):Promise<T>{const response=await fetch(url,{headers:{Accept:"application/json","User-Agent":"BASEBALL-COMPASS/1.0"},cf:{cacheTtl:900,cacheEverything:true}});if(!response.ok)throw new Error(`MLB Stats API: ${response.status}`);return response.json() as Promise<T>;}
  private async games(date:Date){const url=`https://statsapi.mlb.com/api/v1/schedule?sportId=1&date=${encodeURIComponent(this.formatDate(date))}&hydrate=team,linescore`;const json=await this.officialJson<MlbSchedule>(url);return(json.dates?.flatMap(item=>item.games)||[]).map(game=>{const played=game.status.abstractGameState==="Final"||game.status.abstractGameState==="Live";return{away:game.teams.away.team.name,home:game.teams.home.team.name,time:new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",hour:"2-digit",minute:"2-digit",hour12:false}).format(new Date(game.gameDate)),venue:game.venue?.name||"会場未定",status:game.status.detailedState,score:played?`${game.teams.away.score??0} - ${game.teams.home.score??0}`:undefined};});}
  async getToday(){const games=await this.games(new Date());return{date:new Intl.DateTimeFormat("ja-JP",{timeZone:"Asia/Tokyo",dateStyle:"full"}).format(new Date()),league:"MLB",games,officialLinks:[{label:"NPB公式 試合日程・結果",url:"https://npb.jp/games/"},{label:"MLB公式 Scores",url:"https://www.mlb.com/scores"}]};}
  async getSchedule(){const now=new Date(),yesterday=new Date(now.getTime()-86400000);return{today:await this.games(now),yesterday:await this.games(yesterday),officialLinks:[{label:"NPB公式 試合日程・結果",url:"https://npb.jp/games/"},{label:"MLB公式 Scores",url:"https://www.mlb.com/scores"}]};}
  async getRanking(){
    const season=this.season();
    const standingsUrl=`https://statsapi.mlb.com/api/v1/standings?leagueId=103,104&season=${season}&standingsTypes=regularSeason&hydrate=team`;
    const hittingUrl=`https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=homeRuns,battingAverage&statGroup=hitting&statType=season&season=${season}&sportId=1&limit=10&hydrate=person,team`;
    const pitchingUrl=`https://statsapi.mlb.com/api/v1/stats/leaders?leaderCategories=earnedRunAverage&statGroup=pitching&statType=season&season=${season}&sportId=1&limit=10&hydrate=person,team`;
    const [standingsData,hittingData,pitchingData]=await Promise.all([this.officialJson<MlbStandings>(standingsUrl),this.officialJson<MlbLeaders>(hittingUrl),this.officialJson<MlbLeaders>(pitchingUrl)]);
    const standings=(standingsData.records||[]).flatMap(record=>record.teamRecords.map((team,index)=>({rank:index+1,name:`${record.division?.name||"MLB"}｜${team.team.name}`,value:`${team.wins}勝 ${team.losses}敗（${team.winningPercentage}）`})));
    const groups=[...(hittingData.leagueLeaders||[]),...(pitchingData.leagueLeaders||[])];
    const rows=(category:string,suffix:string)=>groups.find(group=>group.leaderCategory===category)?.leaders.map(leader=>({name:`${leader.person?.fullName||"-"}${leader.team?.name?`｜${leader.team.name}`:""}`,value:`${leader.value}${suffix}`}))||[];
    return{standings,homeRuns:rows("homeRuns","本"),batting:rows("battingAverage",""),era:rows("earnedRunAverage","")};
  }
  async getShop(){return{products:[{id:"bat-01",category:"バット",name:"コンパス メイプルバット",description:"振り抜きやすさを重視した硬式木製モデル。",price:14800},{id:"glove-01",category:"グローブ",name:"オールラウンドグローブ",description:"扱いやすいエントリーモデル。",price:12800},{id:"spike-01",category:"スパイク",name:"フィールドスピード",description:"軽量性とグリップを両立。",price:9800},{id:"train-01",category:"トレーニング",name:"トレーニングバンド",description:"肩まわりのウォームアップに。",price:2400},{id:"gear-01",category:"練習器具",name:"バッティングティー",description:"高さ調節ができる自主練習用。",price:6900},{id:"pick-01",category:"おすすめ",name:"ベースボールスターターセット",description:"練習を始める人におすすめ。",price:19800}]};}
}