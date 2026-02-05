import Card from "../ui/Card";

interface CategorySummary {
  category: { name: string; color: string };
  totalAmount: number | string;
  percentage: number | string;
  transactionCount: number;
}

interface TopCategoriesCardProps {
  categories: CategorySummary[];
}

export default function TopCategoriesCard({ categories }: TopCategoriesCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(251, 146, 60, 0.15)" }}>
            <svg className="w-4 h-4" style={{ color: "#fb923c" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            Top Categories
          </p>
        </div>
        <span className="text-xs text-[var(--text-muted)]">This month</span>
      </div>

      {categories.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-[var(--text-muted)]">No data this month</p>
        </div>
      ) : (
        <div className="space-y-4">
          {categories.map((item, index) => {
            const totalAmount = Number(item.totalAmount);
            const percentage = Number(item.percentage);
            return (
              <div
                key={item.category.name}
                className="group"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: item.category.color }}
                    />
                    <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                      {item.category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                      ${totalAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: item.category.color,
                      boxShadow: `0 0 10px ${item.category.color}40`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-[var(--text-muted)]">
                    {item.transactionCount} transaction{item.transactionCount !== 1 ? "s" : ""}
                  </span>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
