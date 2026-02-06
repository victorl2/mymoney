import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_EXPENSES, GET_CATEGORIES, GET_EXPENSE_SUMMARY } from "../graphql/queries/expenses";
import { useLanguage } from "../context/LanguageContext";
import ExpenseList from "../components/expenses/ExpenseList";
import ExpenseSummaryCards from "../components/expenses/ExpenseSummaryCards";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";

export default function ExpensesPage() {
  const { t, tCategory, language } = useLanguage();
  const [filter, setFilter] = useState<{
    categoryId?: string;
    search?: string;
  }>({});
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, loading, refetch } = useQuery(GET_EXPENSES, {
    variables: {
      filter: {
        categoryId: filter.categoryId || null,
        search: filter.search || null,
      },
      limit,
      offset,
    },
  });

  const { data: summaryData, loading: summaryLoading, refetch: refetchSummary } = useQuery(GET_EXPENSE_SUMMARY);

  const { data: catData } = useQuery(GET_CATEGORIES);
  const categories = catData?.categories ?? [];

  const handleRefetch = () => {
    refetch();
    refetchSummary();
  };

  const expenses = data?.expenses?.items ?? [];
  const totalCount = data?.expenses?.totalCount ?? 0;
  const hasMore = data?.expenses?.hasMore ?? false;

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">{t("expenses.subtitle")}</p>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">{t("expenses.title")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            <span className="font-mono text-[var(--accent-primary)]">{totalCount}</span> {language === "pt-BR" ? "despesas registradas" : "total expenses tracked"}
          </p>
        </div>
        <Link to="/expenses/new">
          <Button size="lg">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("expenses.addExpense")}
            </span>
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <ExpenseSummaryCards
        totalAmount={Number(summaryData?.expenseSummary?.totalAmount ?? 0)}
        paidAmount={Number(summaryData?.expenseSummary?.paidAmount ?? 0)}
        unpaidAmount={Number(summaryData?.expenseSummary?.unpaidAmount ?? 0)}
        totalCount={summaryData?.expenseSummary?.totalCount ?? 0}
        paidCount={summaryData?.expenseSummary?.paidCount ?? 0}
        unpaidCount={summaryData?.expenseSummary?.unpaidCount ?? 0}
        loading={summaryLoading}
      />

      {/* Filters */}
      <Card className="mb-6" hover={false}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                className="
                  w-full pl-11 pr-4 py-3 rounded-xl text-sm
                  bg-[var(--bg-elevated)] text-[var(--text-primary)]
                  border border-[var(--border-subtle)]
                  placeholder:text-[var(--text-muted)]
                  transition-all duration-200
                  focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-soft)]
                  focus:outline-none hover:border-[var(--border-medium)]
                "
                placeholder={language === "pt-BR" ? "Buscar despesas..." : "Search expenses..."}
                value={filter.search ?? ""}
                onChange={(e) => {
                  setFilter((f) => ({ ...f, search: e.target.value }));
                  setOffset(0);
                }}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select
              value={filter.categoryId ?? ""}
              onChange={(e) => {
                setFilter((f) => ({ ...f, categoryId: e.target.value || undefined }));
                setOffset(0);
              }}
              options={[
                { value: "", label: language === "pt-BR" ? "Todas as Categorias" : "All Categories" },
                ...categories.map((c: { id: string; name: string }) => ({
                  value: c.id,
                  label: tCategory(c.name),
                })),
              ]}
            />
          </div>
        </div>
      </Card>

      {/* Expense List */}
      <Card hover={false}>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)]" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-[var(--bg-elevated)] rounded mb-2" />
                  <div className="h-3 w-1/4 bg-[var(--bg-elevated)] rounded" />
                </div>
                <div className="h-5 w-20 bg-[var(--bg-elevated)] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <ExpenseList expenses={expenses} onRefetch={handleRefetch} />

            {/* Pagination */}
            {totalCount > limit && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--border-subtle)]">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {language === "pt-BR" ? "Anterior" : "Previous"}
                  </span>
                </Button>

                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm text-[var(--text-secondary)]">
                    {offset + 1}
                  </span>
                  <span className="text-[var(--text-muted)]">-</span>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">
                    {Math.min(offset + limit, totalCount)}
                  </span>
                  <span className="text-[var(--text-muted)] mx-1">{language === "pt-BR" ? "de" : "of"}</span>
                  <span className="font-mono text-sm text-[var(--accent-primary)]">
                    {totalCount}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setOffset(offset + limit)}
                >
                  <span className="flex items-center gap-1">
                    {language === "pt-BR" ? "Próximo" : "Next"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
