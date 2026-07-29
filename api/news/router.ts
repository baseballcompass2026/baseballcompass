import type { Env } from "../types";
import { extractSearchPlayer } from "./classifier";
import { listNews } from "./repository";

export async function routeNewsApi(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean).slice(2);
  const first = parts[0]?.toLowerCase();
  const options: Parameters<typeof listNews>[1] = {
    limit: Number(url.searchParams.get("limit") || 20),
    query: url.searchParams.get("q")?.trim() || undefined,
    order: url.searchParams.get("section") === "featured" ? "featured" : "latest"
  };
  if (first === "mlb") options.category = "MLB";
  else if (first === "npb") options.category = "NPB";
  else if (first === "highschool") options.category = "高校野球";
  else if (first === "player") {
    const player = extractSearchPlayer(parts[1] || "");
    if (!player) return Response.json({ error:"Player not found" }, { status:404 });
    options.player = player;
  } else if (first && !["featured","latest"].includes(first)) return Response.json({ error:"Not found" }, { status:404 });
  if (first === "featured") options.order = "featured";
  const news = await listNews(env, options);
  return Response.json({ data:news, updatedAt:new Date().toISOString(), copyrightPolicy:"本文・要約・画像は保存せず、元記事へのリンクのみを提供します。" });
}