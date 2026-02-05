import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_PORTFOLIOS } from "../graphql/queries/investments";
import PortfolioSummary from "../components/investments/PortfolioSummary";
import AssetList from "../components/investments/AssetList";
import CreatePortfolioForm from "../components/investments/CreatePortfolioForm";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function InvestmentsPage() {
  const { data, loading, refetch } = useQuery(GET_PORTFOLIOS);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const portfolios = data?.portfolios ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Investments</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowCreateForm(true)}>
            New Portfolio
          </Button>
          {portfolios.length > 0 && (
            <Link to={`/investments/new?portfolioId=${portfolios[0].id}`}>
              <Button>Add Asset</Button>
            </Link>
          )}
        </div>
      </div>

      {showCreateForm && (
        <Card className="mb-6">
          <CreatePortfolioForm
            onCreated={() => {
              setShowCreateForm(false);
              refetch();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      {loading ? (
        <Card>
          <div className="text-center py-8 text-gray-500">Loading...</div>
        </Card>
      ) : portfolios.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">No portfolios yet</p>
            <p className="text-sm mt-1">Create a portfolio to start tracking your investments</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          {portfolios.map((portfolio: {
            id: string;
            name: string;
            totalValue: number;
            totalCost: number;
            totalGainLoss: number;
            totalGainLossPercent: number;
            assets: Array<{
              id: string;
              symbol: string;
              name: string;
              assetType: string;
              quantity: number;
              purchasePrice: number;
              purchaseDate: string;
              currentPrice: number | null;
              totalCost: number;
              currentValue: number | null;
              gainLoss: number | null;
              gainLossPercent: number | null;
            }>;
          }) => (
            <div key={portfolio.id}>
              <PortfolioSummary
                name={portfolio.name}
                totalValue={portfolio.totalValue}
                totalCost={portfolio.totalCost}
                totalGainLoss={portfolio.totalGainLoss}
                totalGainLossPercent={portfolio.totalGainLossPercent}
                assetCount={portfolio.assets.length}
              />
              <Card className="mt-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-gray-700">Assets</h3>
                  <Link to={`/investments/new?portfolioId=${portfolio.id}`}>
                    <Button size="sm" variant="secondary">Add Asset</Button>
                  </Link>
                </div>
                <AssetList assets={portfolio.assets} onRefetch={() => refetch()} />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
