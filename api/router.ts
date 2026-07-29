import type { Endpoint, Env } from "./types";
import { readOne } from "./service";
const endpoints = new Set<Endpoint>(["today","schedule","ranking","shop"]);
export async function routeApi(request: Request, env: Env): Promise<Response> {
  const endpoint = new URL(request.url).pathname.split("/").filter(Boolean).pop() as Endpoint;
  const headers={"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=300, stale-while-revalidate=3600","access-control-allow-origin":env.ALLOWED_ORIGIN||"*"};
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(request.method!=="GET") return Response.json({error:"Method not allowed"},{status:405,headers});
  if(!endpoints.has(endpoint)) return Response.json({error:"Not found"},{status:404,headers});
  try{return new Response(JSON.stringify(await readOne(env,endpoint)),{headers});}catch(error){console.error("API error",error);return Response.json({error:"データの取得に失敗しました"},{status:500,headers});}
}