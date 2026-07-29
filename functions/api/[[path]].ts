import type { Env } from "../../api/types";
import { routeApi } from "../../api/router";
// Pagesと同一オリジンでAPIを公開する
export const onRequest: PagesFunction<Env> = context => routeApi(context.request, context.env);