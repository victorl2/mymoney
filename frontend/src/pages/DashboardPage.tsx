import { useQuery } from "@apollo/client/react";
import { GET_DASHBOARD } from "../graphql/queries/dashboard";
import NetWorthCard from "../components/dashboard/NetWorthCard";
import ExpenseSummaryCard from "../components/dashboard/ExpenseSummaryCard";
import ExpenseTrendChart from "../components/dashboard/ExpenseTrendChart";
import PortfolioAllocationChart from "../components/dashboard/PortfolioAllocationChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import TopCategoriesCard from "../components/dashboard/TopCategoriesCard";

function LoadingSkeleton() {
  return (
    <div className="animate-fade-up">
      <div className="flex items-end justify-between mb-10">
        <div>
          <div className="h-5 w-32 bg-[var(--bg-elevated)] rounded-lg shimmer mb-3" />
          <div className="h-10 w-48 bg-[var(--bg-elevated)] rounded-lg shimmer" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-[var(--bg-elevated)] rounded-2xl shimmer"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data, loading } = useQuery(GET_DASHBOARD);
  const dashboard = data?.dashboard;

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!dashboard) {
    return (
      <div className="animate-fade-up">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">Overview</p>
            <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          </div>
        </div>
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center">
              <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-[var(--text-secondary)]">Unable to load dashboard data</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">Overview</p>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">Dashboard</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Last Updated</p>
          <p className="text-sm text-[var(--text-secondary)] font-mono">
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 stagger-children">
        <NetWorthCard
          netWorth={dashboard.netWorth}
          totalPortfolioValue={dashboard.totalPortfolioValue}
          totalPortfolioCost={dashboard.totalPortfolioCost}
        />
        <ExpenseSummaryCard
          totalThisMonth={dashboard.totalExpensesThisMonth}
          totalLastMonth={dashboard.totalExpensesLastMonth}
          changePercent={dashboard.expenseChangePercent}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 stagger-children">
        <ExpenseTrendChart data={dashboard.monthlyExpenseTrend} />
        <PortfolioAllocationChart data={dashboard.portfolioAllocation} />
      </div>

      {/* Bottom Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 stagger-children">
        <TopCategoriesCard categories={dashboard.topCategories} />
        <RecentTransactions expenses={dashboard.recentExpenses} />
      </div>
    </div>
  );
}
