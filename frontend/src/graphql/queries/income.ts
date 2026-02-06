import { gql } from "@apollo/client";

export const GET_INCOMES = gql`
  query GetIncomes($isActive: Boolean, $limit: Int = 50, $offset: Int = 0) {
    incomes(isActive: $isActive, limit: $limit, offset: $offset) {
      items {
        id
        name
        amount
        incomeType
        isActive
        startDate
        notes
        currency
        isGross
        taxRate
        otherFees
        netAmount
        createdAt
        updatedAt
      }
      totalCount
      hasMore
    }
  }
`;

export const GET_INCOME = gql`
  query GetIncome($id: ID!) {
    income(id: $id) {
      id
      name
      amount
      incomeType
      isActive
      startDate
      notes
      currency
      isGross
      taxRate
      otherFees
      netAmount
      createdAt
      updatedAt
    }
  }
`;
