import Card from "../ui/Card";

interface CategorySummary {
  category: { name: string; color: string };
  totalAmount: number;
  percentage: number;
  transactionCount: number;
}

interface TopCategoriesCardProps {
  categories: CategorySummary[];
}

export default function TopCategoriesCard({ categories }: TopCategoriesCardProps) {
  return (
    <Card>
      <h3 className="text-sm font-medium text-gray-500 mb-4">Top Spending Categories</h3>
      {categories.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No data this month</p>
      ) : (
        <div className="space-y-3">
          {categories.map((item) => (
            <div key={item.category.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.category.color }}
                  />
                  <span className="text-sm font-medium text-gray-700">{item.category.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  ${item.totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: `${Math.min(item.percentage, 100)}%`,
                    backgroundColor: item.category.color,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                {item.transactionCount} transaction{item.transactionCount !== 1 ? "s" : ""} ({item.percentage.toFixed(1)}%)
              </p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
