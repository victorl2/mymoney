import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Card from "../ui/Card";

interface MonthlyExpense {
  month: string;
  totalAmount: number;
}

interface ExpenseTrendChartProps {
  data: MonthlyExpense[];
}

export default function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  const chartData = data.map((d) => ({
    month: d.month.slice(5), // "01", "02", etc.
    amount: d.totalAmount,
  }));

  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Monthly Expense Trend</h3>
      {chartData.length === 0 ? (
        <p className="text-gray-400 text-center py-8">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value: number) => [`$${value.toFixed(2)}`, "Expenses"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#6366f1"
              fill="#eef2ff"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
