import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface ExpenseSummaryCardProps {
  totalThisMonth: number | string;
  totalLastMonth: number | string;
  changePercent: number | string | null;
}

export default function ExpenseSummaryCard({
  totalThisMonth,
  totalLastMonth,
  changePercent,
}: ExpenseSummaryCardProps) {
  const { currencySymbol } = useCurrency();
  const { language } = useLanguage();
  const thisMonthNum = Number(totalThisMonth);
  const lastMonthNum = Number(totalLastMonth);
  const changeNum = changePercent !== null ? Number(changePercent) : null;
  const isIncrease = changeNum !== null && changeNum > 0;
  const isDecrease = changeNum !== null && changeNum < 0;

  return (
    <Card className="relative overflow-hidden">
      {/* Accent glow - red for increase (bad), green for decrease (good) */}
      <div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-15"
        style={{
          background: isIncrease ? "var(--accent-loss)" : isDecrease ? "var(--accent-gain)" : "var(--accent-primary)",
        }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-loss-soft)]">
            <svg className="w-4 h-4" style={{ color: "var(--accent-loss)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            {language === "pt-BR" ? "Despesas Mensais" : "Monthly Expenses"}
          </p>
        </div>

        <div className="flex items-end gap-3 mb-6">
          <p className="font-display text-4xl font-bold text-[var(--text-primary)] number-reveal">
            {currencySymbol}{thisMonthNum.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          {changeNum !== null && (
            <span
              className="px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 mb-1"
              style={{
                background: isIncrease ? "var(--accent-loss-soft)" : isDecrease ? "var(--accent-gain-soft)" : "var(--bg-elevated)",
                color: isIncrease ? "var(--accent-loss)" : isDecrease ? "var(--accent-gain)" : "var(--text-secondary)",
              }}
            >
              {isIncrease ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              ) : isDecrease ? (
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              ) : null}
              {isIncrease ? "+" : ""}{changeNum.toFixed(1)}%
            </span>
          )}
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "vs Mês Anterior" : "vs Last Month"}</p>
            <p className="font-mono text-sm text-[var(--text-secondary)]">
              {currencySymbol}{lastMonthNum.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          {/* Progress bar comparing months */}
          <div className="mt-3 h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${Math.min((thisMonthNum / Math.max(lastMonthNum, thisMonthNum)) * 100, 100)}%`,
                background: isIncrease ? "var(--accent-loss)" : "var(--accent-gain)",
              }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
