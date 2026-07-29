import type { Env } from "../api/types";
import { routeApi } from "../api/router";
import { refreshAll } from "../api/service";
import { refreshNews } from "../api/news/service";

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) { return routeApi(request, env, ctx); },
  async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    // ニュースは30分ごと、既存の試合・順位KVは従来どおりJST 6/12/18時に更新する。
    if (controller.cron === "*/30 * * * *") ctx.waitUntil(refreshNews(env));
    else ctx.waitUntil(refreshAll(env));
  }
} satisfies ExportedHandler<Env>;