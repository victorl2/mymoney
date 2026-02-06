import { gql } from "@apollo/client";

export const GET_DASHBOARD = gql`
  query GetDashboard($month: String) {
    dashboard(month: $month) {
      totalExpensesThisMonth
      totalExpensesLastMonth
      expenseChangePercent
      totalPortfolioValue
      totalPortfolioCost
      netWorth
      totalMonthlyIncome
      incomeStreamsCount
      topCategories {
        category {
          id
          name
          color
        }
        totalAmount
        percentage
        transactionCount
      }
      recentExpenses {
        id
        amount
        description
        date
        category {
          id
          name
          color
        }
      }
      portfolioAllocation {
        assetType
        totalValue
        percentage
      }
      monthlyExpenseTrend {
        month
        totalAmount
      }
    }
  }
`;
