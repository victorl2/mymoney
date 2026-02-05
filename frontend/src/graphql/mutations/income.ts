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
      updatedAt
    }
  }
`;

export const DELETE_INCOME = gql`
  mutation DeleteIncome($id: ID!) {
    deleteIncome(id: $id)
  }
`;
