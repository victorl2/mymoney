import Card from "../ui/Card";

interface NetWorthCardProps {
  netWorth: number;
  totalPortfolioValue: number;
  totalPortfolioCost: number;
}

export default function NetWorthCard({
  netWorth,
  totalPortfolioValue,
  totalPortfolioCost,
}: NetWorthCardProps) {
  const gainLoss = totalPortfolioValue - totalPortfolioCost;
  const isPositive = gainLoss >= 0;

  return (
    <Card>
      <p className="text-sm font-medium text-gray-500">Net Worth</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">${netWorth.toFixed(2)}</p>
      <div className="flex items-center gap-4 mt-3 text-sm">
        <div>
          <span className="text-gray-500">Portfolio Value: </span>
          <span className="font-medium">${totalPortfolioValue.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-500">P&L: </span>
          <span className={`font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? "+" : ""}${gainLoss.toFixed(2)}
          </span>
        </div>
      </div>
    </Card>
  );
}
