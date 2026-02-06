import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface NetWorthCardProps {
  netWorth: number | string;
  totalPortfolioValue: number | string;
  totalPortfolioCost: number | string;
  totalMonthlyIncome?: number | string;
  incomeStreamsCount?: number;
}

export default function NetWorthCard({
  netWorth,
  totalPortfolioValue,
  totalPortfolioCost,
  totalMonthlyIncome = 0,
  incomeStreamsCount = 0,
}: NetWorthCardProps) {
  const { currencySymbol } = useCurrency();
  const { t, language } = useLanguage();
  const netWorthNum = Number(netWorth);
  const portfolioValueNum = Number(totalPortfolioValue);
  const portfolioCostNum = Number(totalPortfolioCost);
  const monthlyIncomeNum = Number(totalMonthlyIncome);
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
            {t("dashboard.netWorth")}
          </p>
        </div>

        <p className="font-display text-4xl font-bold text-[var(--text-primary)] mb-6 number-reveal">
          {currencySymbol}{netWorthNum.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>

        <div className="flex items-start justify-between gap-6 pt-4 border-t border-[var(--border-subtle)]">
          <div className="min-w-0">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">{t("dashboard.portfolio")}</p>
            <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">
              {currencySymbol}{portfolioValueNum.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1 whitespace-nowrap">{t("dashboard.income")}</p>
            <div className="flex items-center gap-1.5">
              <p className="font-mono text-lg font-semibold text-[var(--chart-2)]">
                +{currencySymbol}{monthlyIncomeNum.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
              {incomeStreamsCount > 0 && (
                <span className="px-1.5 py-0.5 rounded text-xs font-medium bg-[var(--chart-2)]/20 text-[var(--chart-2)]">
                  {incomeStreamsCount}
                </span>
              )}
            </div>
          </div>
          <div className="min-w-0 text-right">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">{t("dashboard.pnl")}</p>
            <p
              className="font-mono text-lg font-semibold"
              style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
            >
              {isPositive ? "+" : ""}{gainLossPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
