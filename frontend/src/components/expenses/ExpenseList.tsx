import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import CategoryBadge from "./CategoryBadge";
import Button from "../ui/Button";
import { DELETE_EXPENSE } from "../../graphql/mutations/expenses";

interface Expense {
  id: string;
  amount: number;
  description: string;
  notes: string | null;
  date: string;
  category: { id: string; name: string; color: string };
  isRecurring: boolean;
}

interface ExpenseListProps {
  expenses: Expense[];
  onRefetch: () => void;
}

export default function ExpenseList({ expenses, onRefetch }: ExpenseListProps) {
  const [deleteExpense] = useMutation(DELETE_EXPENSE);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense({ variables: { id } });
    onRefetch();
  };

  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No expenses found</p>
        <p className="text-sm mt-1">Add your first expense to get started</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="min-w-0">
              <p className="font-medium text-gray-900 truncate">{expense.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <CategoryBadge name={expense.category.name} color={expense.category.color} />
                <span className="text-xs text-gray-500">
                  {format(new Date(expense.date), "MMM d, yyyy")}
                </span>
                {expense.isRecurring && (
                  <span className="text-xs text-indigo-600 font-medium">Recurring</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-lg font-semibold text-gray-900">
              ${expense.amount.toFixed(2)}
            </span>
            <Button variant="danger" size="sm" onClick={() => handleDelete(expense.id)}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
