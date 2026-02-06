import { gql } from "@apollo/client";

export const CREATE_INCOME = gql`
  mutation CreateIncome($input: CreateIncomeInput!) {
    createIncome(input: $input) {
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
    }
  }
`;

export const UPDATE_INCOME = gql`
  mutation UpdateIncome($id: ID!, $input: UpdateIncomeInput!) {
    updateIncome(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id)
  }
`;
