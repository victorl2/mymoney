import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { GET_CATEGORIES } from "../../graphql/queries/expenses";
import { CREATE_EXPENSE } from "../../graphql/mutations/expenses";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";

export default function ExpenseForm() {
  const navigate = useNavigate();
  const { data: catData } = useQuery(GET_CATEGORIES);
  const [createExpense, { loading }] = useMutation(CREATE_EXPENSE);

  const [form, setForm] = useState({
    amount: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    isRecurring: false,
    recurrenceRule: "",
  });

  const categories = catData?.categories ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.categoryId) return;

    await createExpense({
      variables: {
        input: {
          amount: parseFloat(form.amount),
          description: form.description,
          notes: form.notes || null,
          date: form.date,
          categoryId: form.categoryId,
          isRecurring: form.isRecurring,
          recurrenceRule: form.isRecurring && form.recurrenceRule ? form.recurrenceRule : null,
        },
      },
    });
    navigate("/expenses");
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <Card className="max-w-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Amount"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => update("amount", e.target.value)}
          required
        />
        <Input
          label="Description"
          placeholder="What was this expense for?"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
        />
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => update("date", e.target.value)}
          required
        />
        <Select
          label="Category"
          value={form.categoryId}
          onChange={(e) => update("categoryId", e.target.value)}
          options={[
            { value: "", label: "Select a category" },
            ...categories.map((c: { id: string; name: string }) => ({
              value: c.id,
              label: c.name,
            })),
          ]}
          required
        />
        <Input
          label="Notes (optional)"
          placeholder="Additional notes..."
          value={form.notes}
          onChange={(e) => update("notes", e.target.value)}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRecurring"
            checked={form.isRecurring}
            onChange={(e) => update("isRecurring", e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="isRecurring" className="text-sm text-gray-700">
            Recurring expense
          </label>
        </div>
        {form.isRecurring && (
          <Select
            label="Recurrence"
            value={form.recurrenceRule}
            onChange={(e) => update("recurrenceRule", e.target.value)}
            options={[
              { value: "", label: "Select frequency" },
              { value: "DAILY", label: "Daily" },
              { value: "WEEKLY", label: "Weekly" },
              { value: "BIWEEKLY", label: "Biweekly" },
              { value: "MONTHLY", label: "Monthly" },
              { value: "QUARTERLY", label: "Quarterly" },
              { value: "YEARLY", label: "Yearly" },
            ]}
          />
        )}
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Expense"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/expenses")}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
