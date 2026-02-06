import { gql } from "@apollo/client";

export const CREATE_EXPENSE = gql`
  mutation CreateExpense($input: CreateExpenseInput!) {
    createExpense(input: $input) {
      id
      amount
      description
      notes
      date
      category {
        id
        name
        color
      }
      isRecurring
      recurrenceRule
    }
  }
`;

export const UPDATE_EXPENSE = gql`
  mutation UpdateExpense($id: ID!, $input: UpdateExpenseInput!) {
    updateExpense(id: $id, input: $input) {
      id
      amount
      description
      notes
      date
      category {
        id
        name
        color
      }
      isRecurring
      recurrenceRule
    }
  }
`;

export const DELETE_EXPENSE = gql`
  mutation DeleteExpense($id: ID!) {
    deleteExpense(id: $id)
  }
`;

export const MARK_EXPENSE_PAID = gql`
  mutation MarkExpensePaid($id: ID!, $paid: Boolean!) {
    markExpensePaid(id: $id, paid: $paid) {
      id
      isPaid
      paidAt
    }
  }
`;
