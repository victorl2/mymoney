import Card from "../ui/Card";

interface NetWorthCardProps {
  netWorth: number | string;
  totalPortfolioValue: number | string;
  totalPortfolioCost: number | string;
}

export default function NetWorthCard({
  netWorth,
  totalPortfolioValue,
  totalPortfolioCost,
}: NetWorthCardProps) {
  const netWorthNum = Number(netWorth);
  const portfolioValueNum = Number(totalPortfolioValue);
  const portfolioCostNum = Number(totalPortfolioCost);
  const gainLoss = portfolioValueNum - portfolioCostNum;
  const isPositive = gainLoss >= 0;
  const gainLossPercent = portfolioCostNum > 0 ? ((gainLoss / portfolioCostNum) * 100) : 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Accent glow */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-20"
        style={{
          background: isPositive ? "var(--accent-gain)" : "var(--accent-loss)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, var(--accent-primary) 0%, #818cf8 100%)",
            }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Net Worth
          </p>
        </div>

        <p className="font-display text-4xl font-bold text-[var(--text-primary)] mb-6 number-reveal">
          ${netWorthNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Portfolio Value</p>
            <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">
              ${portfolioValueNum.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Total P&L</p>
            <div className="flex items-center gap-2">
              <p
                className="font-mono text-lg font-semibold"
                style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
              >
                {isPositive ? "+" : ""}${gainLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <span
                className="px-2 py-0.5 rounded-md text-xs font-medium"
                style={{
                  background: isPositive ? "var(--accent-gain-soft)" : "var(--accent-loss-soft)",
                  color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)",
                }}
              >
                {isPositive ? "+" : ""}{gainLossPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
