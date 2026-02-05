import { gql } from "@apollo/client";

export const GET_PORTFOLIOS = gql`
  query GetPortfolios {
    portfolios {
      id
      name
      description
      totalValue
      totalCost
      totalGainLoss
      totalGainLossPercent
      assets {
        id
        symbol
        name
        assetType
        quantity
        purchasePrice
        purchaseDate
        currentPrice
        currency
        totalCost
        currentValue
        gainLoss
        gainLossPercent
      }
    }
  }
`;

export const GET_PORTFOLIO = gql`
  query GetPortfolio($id: ID!) {
    portfolio(id: $id) {
      id
      name
      description
      totalValue
      totalCost
      totalGainLoss
      totalGainLossPercent
      assets {
        id
        symbol
        name
        assetType
        quantity
        purchasePrice
        purchaseDate
        currentPrice
        currency
        totalCost
        currentValue
        gainLoss
        gainLossPercent
        notes
      }
    }
  }
`;
