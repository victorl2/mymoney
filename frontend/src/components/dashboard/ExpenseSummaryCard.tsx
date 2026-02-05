import Card from "../ui/Card";

interface ExpenseSummaryCardProps {
  totalThisMonth: number;
  totalLastMonth: number;
  changePercent: number | null;
}

export default function ExpenseSummaryCard({
  totalThisMonth,
  totalLastMonth,
  changePercent,
}: ExpenseSummaryCardProps) {
  const isIncrease = changePercent !== null && changePercent > 0;
  const isDecrease = changePercent !== null && changePercent < 0;

  return (
    <Card>
      <p className="text-sm font-medium text-gray-500">Expenses This Month</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">${totalThisMonth.toFixed(2)}</p>
      <div className="flex items-center gap-2 mt-3 text-sm">
        {changePercent !== null && (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              isIncrease
                ? "bg-red-100 text-red-700"
                : isDecrease
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700"
            }`}
          >
            {isIncrease ? "+" : ""}
            {changePercent.toFixed(1)}%
          </span>
        )}
        <span className="text-gray-500">vs last month (${totalLastMonth.toFixed(2)})</span>
      </div>
    </Card>
  );
}
