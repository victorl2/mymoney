import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import Card from "../ui/Card";

interface MonthlyExpense {
  month: string;
  totalAmount: number | string;
}

interface ExpenseTrendChartProps {
  data: MonthlyExpense[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="px-4 py-3 rounded-xl border border-[var(--border-medium)]"
        style={{
          background: "rgba(24, 24, 27, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
          Month {label}
        </p>
        <p className="font-mono text-lg font-semibold" style={{ color: "var(--accent-primary)" }}>
          ${payload[0].value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
        </p>
      </div>
    );
  }
  return null;
};

export default function ExpenseTrendChart({ data }: ExpenseTrendChartProps) {
  const chartData = data.map((d) => ({
    month: d.month.slice(5),
    amount: Number(d.totalAmount),
  }));

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-primary-soft)]">
            <svg className="w-4 h-4" style={{ color: "var(--accent-primary)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Expense Trend
          </p>
        </div>
        <span className="text-xs text-[var(--text-muted)]">Last 12 months</span>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[var(--text-muted)]">No data yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border-subtle)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "JetBrains Mono" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "JetBrains Mono" }}
              tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} cursor={false} />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="var(--accent-primary)"
              strokeWidth={2}
              fill="url(#expenseGradient)"
              dot={false}
              activeDot={{
                r: 6,
                fill: "var(--accent-primary)",
                stroke: "var(--bg-primary)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
