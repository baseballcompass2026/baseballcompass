// Cloudflare Bindingsを一箇所で管理する
export interface Env { BASEBALL_DATA: KVNamespace; DB: D1Database; ALLOWED_ORIGIN?: string; APP_TIMEZONE?: string; NEWS_PROVIDER?: string; NEWS_QUERY?: string; NEWS_FETCH_LIMIT?: string }
export type Endpoint = "today" | "schedule" | "ranking" | "shop";
export interface ApiEnvelope<T> { data: T; updatedAt: string; source: "kv" | "provider" }