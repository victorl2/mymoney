import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";

interface ExpensePaymentCardProps {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  totalCount: number;
  paidCount: number;
  unpaidCount: number;
  loading?: boolean;
}

export default function ExpensePaymentCard({
  totalAmount,
  paidAmount,
  unpaidAmount,
  totalCount,
  paidCount,
  unpaidCount,
  loading = false,
}: ExpensePaymentCardProps) {
  const { currencySymbol } = useCurrency();

  const formatAmount = (amount: number) => {
    return `${currencySymbol}${Number(amount).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const paidPercentage = totalAmount > 0 ? (paidAmount / totalAmount) * 100 : 0;

  if (loading) {
    return (
      <Card>
        <div className="space-y-4">
          <div className="h-4 w-32 bg-[var(--bg-elevated)] rounded shimmer" />
          <div className="h-8 w-40 bg-[var(--bg-elevated)] rounded shimmer" />
          <div className="h-3 w-full bg-[var(--bg-elevated)] rounded-full shimmer" />
          <div className="h-4 w-24 bg-[var(--bg-elevated)] rounded shimmer" />
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-[var(--text-secondary)] mb-1">
            Monthly Payment Status
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <Link
          to="/expenses"
          className="text-xs text-[var(--accent-primary)] hover:underline"
        >
          View All
        </Link>
      </div>

      {/* Progress visualization */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-2xl font-bold font-mono text-emerald-500">
            {formatAmount(paidAmount)}
          </span>
          <span className="text-sm text-[var(--text-muted)]">
            of {formatAmount(totalAmount)} paid
          </span>
        </div>

        {/* Progress bar */}
        <div className="relative h-3 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${paidPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-[var(--text-muted)]">
            {paidPercentage.toFixed(0)}% complete
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            {paidCount}/{totalCount} expenses
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-xl bg-emerald-500/10">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-emerald-500">Paid</span>
          </div>
          <p className="font-mono text-lg font-bold text-emerald-500">
            {formatAmount(paidAmount)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{paidCount} expenses</p>
        </div>

        <div className="p-3 rounded-xl bg-amber-500/10">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-xs font-medium text-amber-500">Pending</span>
          </div>
          <p className={`font-mono text-lg font-bold ${unpaidAmount > 0 ? "text-amber-500" : "text-[var(--text-muted)]"}`}>
            {formatAmount(unpaidAmount)}
          </p>
          <p className="text-xs text-[var(--text-muted)]">{unpaidCount} expenses</p>
        </div>
      </div>
    </Card>
  );
}
