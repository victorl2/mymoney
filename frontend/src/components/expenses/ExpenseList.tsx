import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Button from "../ui/Button";
import { DELETE_EXPENSE, MARK_EXPENSE_PAID } from "../../graphql/mutations/expenses";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface Expense {
  id: string;
  amount: number;
  description: string;
  notes: string | null;
  date: string;
  category: { id: string; name: string; color: string };
  isRecurring: boolean;
  isPaid: boolean;
}

interface ExpenseListProps {
  expenses: Expense[];
  onRefetch: () => void;
}

export default function ExpenseList({ expenses, onRefetch }: ExpenseListProps) {
  const { currencySymbol } = useCurrency();
  const { t, tCategory, language } = useLanguage();
  const navigate = useNavigate();
  const [deleteExpense] = useMutation(DELETE_EXPENSE);
  const [markExpensePaid] = useMutation(MARK_EXPENSE_PAID);
  const dateLocale = language === "pt-BR" ? ptBR : undefined;

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense({ variables: { id } });
    onRefetch();
  };

  const handleTogglePaid = async (id: string, currentlyPaid: boolean) => {
    await markExpensePaid({ variables: { id, paid: !currentlyPaid } });
    onRefetch();
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text-primary)] mb-1">{t("expenses.noExpenses")}</p>
        <p className="text-sm text-[var(--text-muted)]">{t("expenses.addFirst")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {expenses.map((expense, index) => (
        <div
          key={expense.id}
          className={`group flex items-center justify-between p-4 -mx-2 rounded-xl transition-all duration-200 hover:bg-[var(--bg-elevated)] ${expense.isPaid ? "opacity-60" : ""}`}
          style={{ animationDelay: `${index * 0.03}s` }}
        >
          <div className="flex items-center gap-4 min-w-0">
            {/* Paid checkbox */}
            <button
              onClick={() => handleTogglePaid(expense.id, expense.isPaid)}
              className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${
                expense.isPaid
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-[var(--border-medium)] hover:border-emerald-500"
              }`}
              title={expense.isPaid ? t("expenses.markUnpaid") : t("expenses.markPaid")}
            >
              {expense.isPaid && (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>

            {/* Category indicator */}
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
              style={{ background: `${expense.category.color}15` }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: expense.category.color }}
              />
            </div>

            <div className="min-w-0">
              <p className={`text-sm font-medium truncate group-hover:text-[var(--accent-primary)] transition-colors ${expense.isPaid ? "line-through text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                {expense.description}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-2 py-0.5 rounded-md text-xs font-medium"
                  style={{
                    background: `${expense.category.color}20`,
                    color: expense.category.color,
                  }}
                >
                  {tCategory(expense.category.name)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">
                  {format(new Date(expense.date), language === "pt-BR" ? "dd/MM/yyyy" : "MMM d, yyyy", { locale: dateLocale })}
                </span>
                {expense.isRecurring && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]">
                    {t("expenses.recurring")}
                  </span>
                )}
                {expense.isPaid && (
                  <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/20 text-emerald-500">
                    {t("dashboard.paid")}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 ml-4">
            <span className={`font-mono text-lg font-semibold ${expense.isPaid ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>
              {currencySymbol}{Number(expense.amount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/expenses/${expense.id}/edit`)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(expense.id)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
