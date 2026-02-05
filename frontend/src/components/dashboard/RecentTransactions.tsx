import { format } from "date-fns";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import CategoryBadge from "../expenses/CategoryBadge";

interface RecentExpense {
  id: string;
  amount: number;
  description: string;
  date: string;
  category: { name: string; color: string };
}

interface RecentTransactionsProps {
  expenses: RecentExpense[];
}

export default function RecentTransactions({ expenses }: RecentTransactionsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">Recent Expenses</h3>
        <Link to="/expenses" className="text-sm text-indigo-600 hover:text-indigo-700">
          View all
        </Link>
      </div>
      {expenses.length === 0 ? (
        <p className="text-gray-400 text-center py-4">No expenses yet</p>
      ) : (
        <div className="space-y-3">
          {expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{expense.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <CategoryBadge name={expense.category.name} color={expense.category.color} />
                  <span className="text-xs text-gray-500">
                    {format(new Date(expense.date), "MMM d")}
                  </span>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 shrink-0 ml-4">
                ${expense.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
