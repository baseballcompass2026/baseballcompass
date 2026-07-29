import type { Env } from "../api/types";
import { routeApi } from "../api/router";
import { refreshAll } from "../api/service";
export default {
  // Workers側の /api/* エンドポイント
  fetch(request: Request, env: Env) { return routeApi(request, env); },
  // UTC 21:00/03:00/09:00 = JST 06:00/12:00/18:00
  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) { ctx.waitUntil(refreshAll(env)); }
} satisfies ExportedHandler<Env>;