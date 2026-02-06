import { gql } from "@apollo/client";

export const GET_EXPENSES = gql`
  query GetExpenses(
    $filter: ExpenseFilter
    $sortBy: ExpenseSortField = DATE
    $sortDirection: SortDirection = DESC
    $limit: Int = 20
    $offset: Int = 0
  ) {
    expenses(
      filter: $filter
      sortBy: $sortBy
      sortDirection: $sortDirection
      limit: $limit
      offset: $offset
    ) {
      items {
        id
        amount
        description
        notes
        date
        category {
          id
          name
          color
          icon
        }
        isRecurring
        recurrenceRule
        isPaid
        paidAt
        createdAt
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_EXPENSE = gql`
  query GetExpense($id: ID!) {
    expense(id: $id) {
      id
      amount
      description
      notes
      date
      category {
        id
        name
        color
        icon
      }
      isRecurring
      recurrenceRule
      isPaid
      paidAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_EXPENSE_SUMMARY = gql`
  query GetExpenseSummary($month: Int, $year: Int) {
    expenseSummary(month: $month, year: $year) {
      totalAmount
      paidAmount
      unpaidAmount
      totalCount
      paidCount
      unpaidCount
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      color
      icon
    }
  }
`;
