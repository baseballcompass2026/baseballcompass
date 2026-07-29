import type { Endpoint, Env } from "./types";
import type { BaseballProvider } from "./providers/BaseballProvider";
import { MlbStatsProvider } from "./providers/MlbStatsProvider";
const provider: BaseballProvider = new MlbStatsProvider();
const keys:Record<Endpoint,string>={today:"today.json",schedule:"schedule.json",ranking:"ranking.json",shop:"shop.json"};
export async function refreshOne(env:Env,endpoint:Endpoint){const method=({today:"getToday",schedule:"getSchedule",ranking:"getRanking",shop:"getShop"} as const)[endpoint];const data=await provider[method]();const envelope={data,updatedAt:new Date().toISOString(),source:"provider" as const};await env.BASEBALL_DATA.put(keys[endpoint],JSON.stringify(envelope),{expirationTtl:86400});return envelope;}
export async function readOne(env:Env,endpoint:Endpoint){const cached=await env.BASEBALL_DATA.get(keys[endpoint],"json");if(cached)return {...cached as object,source:"kv"};return refreshOne(env,endpoint);}
export async function refreshAll(env:Env){await Promise.all((["today","schedule","ranking","shop"] as Endpoint[]).map(key=>refreshOne(env,key)));}