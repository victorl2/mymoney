import { useQuery } from "@apollo/client";
import { GET_DASHBOARD } from "../graphql/queries/dashboard";
import NetWorthCard from "../components/dashboard/NetWorthCard";
import ExpenseSummaryCard from "../components/dashboard/ExpenseSummaryCard";
import ExpenseTrendChart from "../components/dashboard/ExpenseTrendChart";
import PortfolioAllocationChart from "../components/dashboard/PortfolioAllocationChart";
import RecentTransactions from "../components/dashboard/RecentTransactions";
import TopCategoriesCard from "../components/dashboard/TopCategoriesCard";

export default function DashboardPage() {
  const { data, loading } = useQuery(GET_DASHBOARD);
  const dashboard = data?.dashboard;

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="text-center py-12 text-gray-500">Unable to load dashboard data</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <ExpenseTrendChart data={dashboard.monthlyExpenseTrend} />
        <PortfolioAllocationChart data={dashboard.portfolioAllocation} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TopCategoriesCard categories={dashboard.topCategories} />
        <RecentTransactions expenses={dashboard.recentExpenses} />
      </div>
    </div>
  );
}
