import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Button from "../ui/Button";
import { DELETE_INCOME } from "../../graphql/mutations/income";
import { useLanguage } from "../../context/LanguageContext";

interface Income {
  id: string;
  name: string;
  amount: number;
  incomeType: string;
  isActive: boolean;
  startDate: string | null;
  notes: string | null;
  currency: string;
  isGross: boolean;
  taxRate: number | null;
  otherFees: number | null;
  netAmount: number;
}

interface IncomeListProps {
  incomes: Income[];
  onRefetch: () => void;
}

const INCOME_TYPE_COLORS: Record<string, string> = {
  salary: "#22c55e",
  freelance: "#8b5cf6",
  investments: "#f59e0b",
  rental: "#06b6d4",
  business: "#ec4899",
  other: "#64748b",
};

export default function IncomeList({ incomes, onRefetch }: IncomeListProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [deleteIncome] = useMutation(DELETE_INCOME);
  const dateLocale = language === "pt-BR" ? ptBR : undefined;

  const getTypeLabel = (type: string) => {
    const key = `incomeType.${type.toLowerCase()}`;
    return t(key);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === "pt-BR" ? "Excluir esta fonte de renda?" : "Delete this income stream?")) return;
    await deleteIncome({ variables: { id } });
    onRefetch();
  };

  if (incomes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 mb-4 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-lg font-medium text-[var(--text-primary)] mb-1">{t("income.noIncome")}</p>
        <p className="text-sm text-[var(--text-muted)]">{t("income.addFirst")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {incomes.map((income, index) => {
        const typeColor = INCOME_TYPE_COLORS[income.incomeType] || INCOME_TYPE_COLORS.other;

        return (
          <div
            key={income.id}
            className="group flex items-center justify-between p-4 -mx-2 rounded-xl transition-all duration-200 hover:bg-[var(--bg-elevated)]"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            <div className="flex items-center gap-4 min-w-0">
              {/* Type indicator */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ background: `${typeColor}15` }}
              >
                <svg
                  className="w-5 h-5"
                  style={{ color: typeColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate group-hover:text-[var(--accent-primary)] transition-colors">
                  {income.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-2 py-0.5 rounded-md text-xs font-medium"
                    style={{
                      background: `${typeColor}20`,
                      color: typeColor,
                    }}
                  >
                    {getTypeLabel(income.incomeType)}
                  </span>
                  {income.startDate && (
                    <span className="text-xs text-[var(--text-muted)]">
                      {language === "pt-BR" ? "Desde" : "Since"} {format(new Date(income.startDate), language === "pt-BR" ? "MM/yyyy" : "MMM yyyy", { locale: dateLocale })}
                    </span>
                  )}
                  {!income.isActive && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-[var(--bg-card)] text-[var(--text-muted)]">
                      {t("income.inactive")}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              <div className="text-right">
                {income.isGross && Number(income.netAmount) !== Number(income.amount) ? (
                  <>
                    <span className="font-mono text-sm text-[var(--text-muted)] line-through block">
                      +{Number(income.amount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
                    </span>
                    <span className="font-mono text-lg font-semibold text-[var(--chart-2)]">
                      +{Number(income.netAmount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
                    </span>
                  </>
                ) : (
                  <span className="font-mono text-lg font-semibold text-[var(--chart-2)]">
                    +{Number(income.netAmount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
                  </span>
                )}
                <span className="text-xs text-[var(--text-muted)] block">
                  {income.currency}{t("common.perMonth")}{income.isGross && income.taxRate ? ` (${t("income.net").toLowerCase()})` : ""}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => navigate(`/income/${income.id}/edit`)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(income.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
