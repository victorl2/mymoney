import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface ExpenseSummaryCardsProps {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalCount: number;
  paidCount: number;
  unpaidCount: number;
  loading?: boolean;
}

export default function ExpenseSummaryCards({
  totalAmount,
  paidAmount,
  unpaidAmount,
  totalCount,
  paidCount,
  unpaidCount,
  loading = false,
}: ExpenseSummaryCardsProps) {
  const { currencySymbol } = useCurrency();
  const { language } = useLanguage();
  const locale = language === "pt-BR" ? "pt-BR" : "en-US";

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${Number(amount).toLocaleString(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-subtle)]">
            <div className="h-4 w-24 bg-[var(--bg-elevated)] rounded shimmer mb-3" />
            <div className="h-8 w-32 bg-[var(--bg-elevated)] rounded shimmer mb-2" />
            <div className="h-3 w-20 bg-[var(--bg-elevated)] rounded shimmer" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Total Expenses */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--border-medium)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {language === "pt-BR" ? "Total do Mês" : "Total This Month"}
          </span>
        </div>
        <p className="font-mono text-2xl font-bold text-[var(--text-primary)] mb-1">
          {formatAmount(totalAmount)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {totalCount} {language === "pt-BR" ? (totalCount !== 1 ? "despesas" : "despesa") : (totalCount !== 1 ? "expenses" : "expense")}
        </p>
      </div>

      {/* Paid Expenses */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--border-medium)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {language === "pt-BR" ? "Já Pago" : "Already Paid"}
          </span>
        </div>
        <p className="font-mono text-2xl font-bold text-emerald-500 mb-1">
          {formatAmount(paidAmount)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {language === "pt-BR" ? `${paidCount} de ${totalCount} pago${paidCount !== 1 ? "s" : ""}` : `${paidCount} of ${totalCount} paid`}
        </p>
      </div>

      {/* Unpaid Expenses */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-5 border border-[var(--border-subtle)] transition-all duration-200 hover:border-[var(--border-medium)]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            {language === "pt-BR" ? "A Pagar" : "Left to Pay"}
          </span>
        </div>
        <p className={`font-mono text-2xl font-bold mb-1 ${unpaidAmount > 0 ? "text-amber-500" : "text-[var(--text-muted)]"}`}>
          {formatAmount(unpaidAmount)}
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          {language === "pt-BR"
            ? `${unpaidCount} ${unpaidCount !== 1 ? "despesas restantes" : "despesa restante"}`
            : `${unpaidCount} expense${unpaidCount !== 1 ? "s" : ""} remaining`}
        </p>
      </div>
    </div>
  );
}
