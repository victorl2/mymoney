import { gql } from "@apollo/client";

export const UPDATE_SETTINGS = gql`
  mutation UpdateSettings($input: UpdateSettingsInput!) {
    updateSettings(input: $input) {
      id
      mainCurrency
      language
      updatedAt
    }
  }
`;
