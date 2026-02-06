import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface RecentExpense {
  id: string;
  amount: number | string;
  description: string;
  date: string;
  category: { name: string; color: string };
}

interface RecentTransactionsProps {
  expenses: RecentExpense[];
}

export default function RecentTransactions({ expenses }: RecentTransactionsProps) {
  const { currencySymbol } = useCurrency();
  const { t, tCategory, language } = useLanguage();
  const dateLocale = language === "pt-BR" ? ptBR : enUS;

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(56, 189, 248, 0.15)" }}>
            <svg className="w-4 h-4" style={{ color: "#38bdf8" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            {t("dashboard.recentTransactions")}
          </p>
        </div>
        <Link
          to="/expenses"
          className="text-xs font-medium text-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1"
        >
          {language === "pt-BR" ? "Ver tudo" : "View all"}
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-[var(--text-muted)]">{t("dashboard.noTransactions")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense, index) => (
            <div
              key={expense.id}
              className="group flex items-center justify-between p-3 -mx-3 rounded-xl transition-colors hover:bg-[var(--bg-elevated)]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Category indicator */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{ background: `${expense.category.color}20` }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: expense.category.color }}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                    {expense.description}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[var(--text-muted)]">
                      {tCategory(expense.category.name)}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[var(--border-medium)]" />
                    <span className="text-xs text-[var(--text-muted)]">
                      {format(new Date(expense.date), language === "pt-BR" ? "dd/MM" : "MMM d", { locale: dateLocale })}
                    </span>
                  </div>
                </div>
              </div>

              <span className="font-mono text-sm font-semibold text-[var(--text-primary)] shrink-0 ml-4">
                -{currencySymbol}{Number(expense.amount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
