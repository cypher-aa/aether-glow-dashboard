import { ReactNode } from "react";

type Variant = "defense" | "ai" | "markets";

const glowMap: Record<Variant, string> = {
  defense: "glow-defense",
  ai: "glow-ai",
  markets: "glow-markets",
};
const textGlowMap: Record<Variant, string> = {
  defense: "text-glow-defense",
  ai: "text-glow-ai",
  markets: "text-glow-markets",
};
const accentMap: Record<Variant, string> = {
  defense: "text-defense",
  ai: "text-ai",
  markets: "text-markets",
};
const dotMap: Record<Variant, string> = {
  defense: "bg-defense",
  ai: "bg-ai",
  markets: "bg-markets",
};

interface IntelCardProps {
  variant: Variant;
  code: string;
  title: string;
  status: string;
  metric: string;
  metricLabel: string;
  children?: ReactNode;
  loading?: boolean;
  error?: string | null;
}

export function IntelCard({
  variant,
  code,
  title,
  status,
  metric,
  metricLabel,
  children,
  loading,
  error,
}: IntelCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-card/80 backdrop-blur-xl p-6 scanline ${glowMap[variant]} transition-transform duration-500 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`size-1.5 rounded-full ${dotMap[variant]} animate-pulse-ring`} />
            <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
              {code}
            </span>
          </div>
          <h2 className={`text-2xl font-semibold tracking-tight ${accentMap[variant]} ${textGlowMap[variant]}`}>
            {title}
          </h2>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground border border-border/60 rounded px-2 py-1">
          {loading ? "SYNC" : error ? "ERR" : status}
        </span>
      </div>

      <div className="mb-6">
        <div className={`text-5xl font-bold font-mono tabular-nums ${accentMap[variant]}`}>
          {loading ? "—" : error ? "N/A" : metric}
        </div>
        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {metricLabel}
        </div>
      </div>

      <div className="space-y-2 text-sm text-muted-foreground min-h-[6rem]">
        {error ? (
          <div className="font-mono text-xs text-destructive/90 leading-relaxed">
            ⚠ {error}
          </div>
        ) : loading ? (
          <div className="space-y-2">
            <div className="h-2 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-2 w-1/2 rounded bg-muted animate-pulse" />
            <div className="h-2 w-2/3 rounded bg-muted animate-pulse" />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
