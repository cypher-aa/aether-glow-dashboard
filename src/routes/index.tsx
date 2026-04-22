import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IntelCard } from "@/components/IntelCard";
import { AETHER_API, fetchAI, fetchDefense, fetchMarkets, IntelFeed } from "@/lib/aether";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AETHER // Intelligence Console" },
      { name: "description", content: "Real-time intelligence dashboard for the AETHER agent — defense, AI, and market signals." },
      { property: "og:title", content: "AETHER // Intelligence Console" },
      { property: "og:description", content: "Real-time intelligence dashboard for the AETHER agent." },
    ],
  }),
  component: Dashboard,
});

type FeedState = { data: IntelFeed | null; loading: boolean; error: string | null };
const initial: FeedState = { data: null, loading: true, error: null };

function useFeed(fn: () => Promise<IntelFeed>) {
  const [state, setState] = useState<FeedState>(initial);
  useEffect(() => {
    let alive = true;
    const run = () => {
      setState((s) => ({ ...s, loading: !s.data }));
      fn()
        .then((data) => alive && setState({ data, loading: false, error: null }))
        .catch((e) => alive && setState({ data: null, loading: false, error: (e as Error).message }));
    };
    run();
    const id = setInterval(run, 15000);
    return () => { alive = false; clearInterval(id); };
  }, [fn]);
  return state;
}

function Dashboard() {
  const defense = useFeed(fetchDefense);
  const ai = useFeed(fetchAI);
  const markets = useFeed(fetchMarkets);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen px-6 py-10 md:px-12 lg:px-16">
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12 max-w-7xl mx-auto">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="relative">
              <div className="size-3 rounded-full bg-primary animate-pulse-ring" />
              <div className="absolute inset-0 size-3 rounded-full bg-primary blur-md opacity-70" />
            </div>
            <span className="font-mono text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Operator Online
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            <span className="text-foreground">AETHER</span>
            <span className="text-primary text-glow-ai">.</span>
          </h1>
          <p className="mt-2 font-mono text-xs text-muted-foreground tracking-wider">
            INTELLIGENCE CONSOLE / v1.0 / NODE {AETHER_API.replace(/^https?:\/\//, "")}
          </p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl tabular-nums text-foreground">
            {now.toISOString().slice(11, 19)}
            <span className="text-muted-foreground text-sm ml-2">UTC</span>
          </div>
          <div className="font-mono text-xs text-muted-foreground tracking-widest mt-1">
            {now.toISOString().slice(0, 10)} / SESSION ACTIVE
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        <IntelCard
          variant="defense"
          code="SECTOR // 01"
          title="Defense"
          status={defense.data?.status ?? "—"}
          metric={String(defense.data?.metric ?? "—")}
          metricLabel={defense.data?.metricLabel ?? "Threat Index"}
          loading={defense.loading}
          error={defense.error}
        >
          <FeedItems items={defense.data?.items} />
        </IntelCard>

        <IntelCard
          variant="ai"
          code="SECTOR // 02"
          title="Artificial Intelligence"
          status={ai.data?.status ?? "—"}
          metric={String(ai.data?.metric ?? "—")}
          metricLabel={ai.data?.metricLabel ?? "Model Activity"}
          loading={ai.loading}
          error={ai.error}
        >
          <FeedItems items={ai.data?.items} />
        </IntelCard>

        <IntelCard
          variant="markets"
          code="SECTOR // 03"
          title="Markets"
          status={markets.data?.status ?? "—"}
          metric={String(markets.data?.metric ?? "—")}
          metricLabel={markets.data?.metricLabel ?? "Volatility"}
          loading={markets.loading}
          error={markets.error}
        >
          <FeedItems items={markets.data?.items} />
        </IntelCard>
      </section>

      <footer className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border/40 flex items-center justify-between font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
        <span>// END OF FEED</span>
        <span>Auto-refresh · 15s</span>
      </footer>
    </main>
  );
}

function FeedItems({ items }: { items?: { title: string; detail?: string }[] }) {
  if (!items || items.length === 0) {
    return <div className="font-mono text-xs text-muted-foreground/70">// No signals in window</div>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-xs">
          <span className="font-mono text-muted-foreground/60 mt-0.5">{String(i + 1).padStart(2, "0")}</span>
          <div className="flex-1">
            <div className="text-foreground/90 leading-snug">{item.title}</div>
            {item.detail && <div className="font-mono text-[10px] text-muted-foreground mt-0.5">{item.detail}</div>}
          </div>
        </li>
      ))}
    </ul>
  );
}
