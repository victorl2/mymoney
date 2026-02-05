import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_INCOMES } from "../graphql/queries/income";
import IncomeList from "../components/income/IncomeList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function IncomePage() {
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, loading, refetch } = useQuery(GET_INCOMES, {
    variables: {
      isActive: filterActive,
      limit,
      offset,
    },
  });

  const incomes = data?.incomes?.items ?? [];
  const totalCount = data?.incomes?.totalCount ?? 0;
  const hasMore = data?.incomes?.hasMore ?? false;

  // Calculate total monthly income
  const totalMonthlyIncome = incomes
    .filter((i: { isActive: boolean }) => i.isActive)
    .reduce((sum: number, i: { amount: number }) => sum + i.amount, 0);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">Track</p>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Income</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            <span className="font-mono text-[var(--chart-2)]">{totalCount}</span> income streams tracked
          </p>
        </div>
        <Link to="/income/new">
          <Button size="lg">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Income
            </span>
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card className="mb-6" hover={false}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider">Total Monthly Income</p>
            <p className="font-mono text-3xl font-bold text-[var(--chart-2)] mt-1">
              +${totalMonthlyIncome.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterActive(null);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === null
                  ? "bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilterActive(true);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === true
                  ? "bg-[var(--chart-2)]/20 text-[var(--chart-2)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => {
                setFilterActive(false);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === false
                  ? "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Inactive
            </button>
          </div>
        </div>
      </Card>

      {/* Income List */}
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
            <IncomeList incomes={incomes} onRefetch={() => refetch()} />

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
                    Previous
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
                  <span className="text-[var(--text-muted)] mx-1">of</span>
                  <span className="font-mono text-sm text-[var(--chart-2)]">
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
                    Next
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
