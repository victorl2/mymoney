import Card from "../ui/Card";

interface PortfolioSummaryProps {
  name: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  assetCount: number;
}

export default function PortfolioSummary({
  name,
  totalValue,
  totalCost,
  totalGainLoss,
  totalGainLossPercent,
  assetCount,
}: PortfolioSummaryProps) {
  const isPositive = totalGainLoss >= 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Accent glow based on performance */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{
          background: isPositive ? "var(--accent-gain)" : "var(--accent-loss)",
        }}
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--accent-primary) 0%, #818cf8 100%)",
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">{name}</h3>
              <p className="text-xs text-[var(--text-muted)]">{assetCount} {assetCount === 1 ? "asset" : "assets"}</p>
            </div>
          </div>

          {/* Performance badge */}
          <div
            className="px-3 py-1.5 rounded-lg flex items-center gap-1"
            style={{
              background: isPositive ? "var(--accent-gain-soft)" : "var(--accent-loss-soft)",
              color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)",
            }}
          >
            {isPositive ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            <span className="font-mono text-sm font-semibold">
              {isPositive ? "+" : ""}{totalGainLossPercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Value</p>
            <p className="font-mono text-2xl font-bold text-[var(--text-primary)] number-reveal">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Cost</p>
            <p className="font-mono text-xl font-semibold text-[var(--text-secondary)]">
              ${totalCost.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Gain/Loss</p>
            <p
              className="font-mono text-xl font-bold"
              style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
            >
              {isPositive ? "+" : ""}${totalGainLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
