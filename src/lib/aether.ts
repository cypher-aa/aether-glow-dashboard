// AETHER backend client. Point this at your FastAPI instance.
// Override at build time with VITE_AETHER_API.
export const AETHER_API =
  (import.meta.env.VITE_AETHER_API as string | undefined) ?? "http://localhost:8000";

export interface IntelFeed {
  metric: string | number;
  metricLabel: string;
  status: string;
  items: { title: string; detail?: string }[];
}

async function tryFetch(paths: string[]): Promise<unknown> {
  let lastErr: unknown;
  for (const p of paths) {
    try {
      const res = await fetch(`${AETHER_API}${p}`, {
        headers: { Accept: "application/json" },
      });
      if (res.ok) return await res.json();
      lastErr = new Error(`${res.status} ${res.statusText}`);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Unreachable");
}

function normalize(raw: any, fallbackLabel: string): IntelFeed {
  if (!raw) return { metric: "—", metricLabel: fallbackLabel, status: "IDLE", items: [] };
  const items =
    (Array.isArray(raw.items) && raw.items) ||
    (Array.isArray(raw.signals) && raw.signals) ||
    (Array.isArray(raw.data) && raw.data) ||
    (Array.isArray(raw) && raw) ||
    [];
  return {
    metric: raw.metric ?? raw.score ?? raw.count ?? items.length ?? "—",
    metricLabel: raw.metricLabel ?? fallbackLabel,
    status: raw.status ?? "LIVE",
    items: items.slice(0, 4).map((i: any) => ({
      title: i.title ?? i.name ?? i.headline ?? String(i).slice(0, 80),
      detail: i.detail ?? i.summary ?? i.description ?? i.value,
    })),
  };
}

export async function fetchDefense(): Promise<IntelFeed> {
  const raw = await tryFetch(["/defense", "/api/defense", "/intel/defense"]);
  return normalize(raw, "Threat Index");
}
export async function fetchAI(): Promise<IntelFeed> {
  const raw = await tryFetch(["/ai", "/api/ai", "/intel/ai"]);
  return normalize(raw, "Model Activity");
}
export async function fetchMarkets(): Promise<IntelFeed> {
  const raw = await tryFetch(["/markets", "/api/markets", "/intel/markets"]);
  return normalize(raw, "Volatility");
}
