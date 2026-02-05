import Card from "../ui/Card";

interface PortfolioSummaryProps {
  name: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  assetCount: number;
}

export default function PortfolioSummary({
  name,
  totalValue,
  totalCost,
  totalGainLoss,
  totalGainLossPercent,
  assetCount,
}: PortfolioSummaryProps) {
  const isPositive = totalGainLoss >= 0;

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
        <span className="text-sm text-gray-500">{assetCount} assets</span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-xl font-bold text-gray-900">${totalValue.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Cost</p>
          <p className="text-xl font-bold text-gray-900">${totalCost.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Gain/Loss</p>
          <p className={`text-xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}${totalGainLoss.toFixed(2)}
            <span className="text-sm font-medium ml-1">
              ({isPositive ? "+" : ""}{totalGainLossPercent.toFixed(1)}%)
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
