import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Card from "../ui/Card";

interface AllocationSlice {
  assetType: string;
  totalValue: number;
  percentage: number;
}

interface PortfolioAllocationChartProps {
  data: AllocationSlice[];
}

const COLORS = ["#6366f1", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6", "#ec4899"];

const typeLabels: Record<string, string> = {
  STOCK: "Stocks",
  CRYPTO: "Crypto",
  FUND: "Funds",
  ETF: "ETFs",
  BOND: "Bonds",
  OTHER: "Other",
};

export default function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  const chartData = data.map((d) => ({
    name: typeLabels[d.assetType] ?? d.assetType,
    value: d.totalValue,
    percentage: d.percentage,
  }));

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Portfolio Allocation</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No investments yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="value"
              nameKey="name"
              paddingAngle={2}
            >
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `$${value.toFixed(2)}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
