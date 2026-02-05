import { gql } from "@apollo/client";

export const CREATE_PORTFOLIO = gql`
  mutation CreatePortfolio($input: CreatePortfolioInput!) {
    createPortfolio(input: $input) {
      id
      name
      description
    }
  }
`;

export const DELETE_PORTFOLIO = gql`
  mutation DeletePortfolio($id: ID!) {
    deletePortfolio(id: $id)
  }
`;

export const CREATE_ASSET = gql`
  mutation CreateAsset($input: CreateAssetInput!) {
    createAsset(input: $input) {
      id
      symbol
      name
      assetType
      quantity
      purchasePrice
      currentPrice
      totalCost
      currentValue
      gainLoss
      gainLossPercent
    }
  }
`;

export const UPDATE_ASSET_PRICE = gql`
  mutation UpdateAssetPrice($id: ID!, $currentPrice: Decimal!) {
    updateAssetPrice(id: $id, currentPrice: $currentPrice) {
      id
      currentPrice
      currentValue
      gainLoss
      gainLossPercent
    }
  }
`;

export const DELETE_ASSET = gql`
  mutation DeleteAsset($id: ID!) {
    deleteAsset(id: $id)
  }
`;
