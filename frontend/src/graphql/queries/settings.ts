import { gql } from "@apollo/client";

export const GET_SETTINGS = gql`
  query GetSettings {
    settings {
      id
      mainCurrency
      language
      createdAt
      updatedAt
    }
  }
`;

export const GET_SUPPORTED_CURRENCIES = gql`
  query GetSupportedCurrencies {
    supportedCurrencies {
      code
      name
      symbol
    }
  }
`;

export const GET_SUPPORTED_LANGUAGES = gql`
  query GetSupportedLanguages {
    supportedLanguages {
      code
      name
      nativeName
    }
  }
`;

export const GET_EXCHANGE_RATES = gql`
  query GetExchangeRates($base: String!) {
    exchangeRates(base: $base) {
      base
      rates {
        currency
        rate
      }
    }
  }
`;
