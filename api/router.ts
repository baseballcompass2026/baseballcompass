import type { Endpoint, Env } from "./types";
import { readOne } from "./service";
import { routeNewsApi } from "./news/router";
const endpoints = new Set<Endpoint>(["today","schedule","ranking","shop"]);

interface CacheContext { waitUntil(promise: Promise<unknown>): void }
export async function routeApi(request: Request, env: Env, ctx?: CacheContext): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const headers={"content-type":"application/json; charset=utf-8","cache-control":"public, max-age=300, s-maxage=300, stale-while-revalidate=3600","access-control-allow-origin":env.ALLOWED_ORIGIN||"*"};
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers});
  if(request.method!=="GET") return Response.json({error:"Method not allowed"},{status:405,headers});
  const cache = await caches.open("baseball-compass-api");
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    let response: Response;
    if (parts[1] === "news") response = await routeNewsApi(request, env);
    else {
      const endpoint = parts.at(-1) as Endpoint;
      if(!endpoints.has(endpoint)) return Response.json({error:"Not found"},{status:404,headers});
      response = new Response(JSON.stringify(await readOne(env,endpoint)),{headers});
    }
    const normalized = new Response(response.body,{status:response.status,statusText:response.statusText,headers:{...Object.fromEntries(response.headers),...headers}});
    if (normalized.ok && ctx) ctx.waitUntil(cache.put(request, normalized.clone()));
    return normalized;
  } catch(error) {
    console.error("API error", { path:url.pathname, error:error instanceof Error?error.message:String(error) });
    return Response.json({error:"データを取得できませんでした"},{status:500,headers});
  }
}