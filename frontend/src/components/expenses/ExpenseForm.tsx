import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { GET_CATEGORIES, GET_EXPENSES, GET_EXPENSE_SUMMARY } from "../../graphql/queries/expenses";
import { CREATE_EXPENSE, UPDATE_EXPENSE } from "../../graphql/mutations/expenses";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface Expense {
  id: string;
  amount: number | string;
  description: string;
  notes: string | null;
  date: string;
  category: { id: string; name: string; color: string };
  isRecurring: boolean;
  recurrenceRule: string | null;
}

interface ExpenseFormProps {
  expense?: Expense;
}

export default function ExpenseForm({ expense }: ExpenseFormProps) {
  const { currencySymbol } = useCurrency();
  const { t, tCategory } = useLanguage();
  const navigate = useNavigate();
  const { data: catData } = useQuery(GET_CATEGORIES);
  const [createExpense, { loading: creating }] = useMutation(CREATE_EXPENSE);
  const [updateExpense, { loading: updating }] = useMutation(UPDATE_EXPENSE);

  const isEditMode = !!expense;
  const loading = creating || updating;

  const [form, setForm] = useState({
    amount: "",
    description: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    categoryId: "",
    isRecurring: false,
    recurrenceRule: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (expense) {
      setForm({
        amount: String(expense.amount),
        description: expense.description,
        notes: expense.notes || "",
        date: expense.date,
        categoryId: expense.category.id,
        isRecurring: expense.isRecurring,
        recurrenceRule: expense.recurrenceRule?.toUpperCase() || "",
      });
    }
  }, [expense]);

  const categories = catData?.categories ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.description || !form.categoryId) return;

    const input = {
      amount: parseFloat(form.amount),
      description: form.description,
      notes: form.notes || null,
      date: form.date,
      categoryId: form.categoryId,
      isRecurring: form.isRecurring,
      recurrenceRule: form.isRecurring && form.recurrenceRule ? form.recurrenceRule.toUpperCase() : null,
    };

    if (isEditMode) {
      await updateExpense({
        variables: { id: expense.id, input },
        refetchQueries: ["GetExpenses", "GetExpenseSummary"],
      });
    } else {
      await createExpense({
        variables: { input },
        refetchQueries: ["GetExpenses", "GetExpenseSummary"],
      });
    }
    navigate("/expenses");
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="animate-fade-up max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/expenses")}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t("common.back")} {t("nav.expenses")}
        </button>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">
          {isEditMode ? t("expenses.editExpense") : t("expenses.newExpense")}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {t("expenses.subtitle")}
        </p>
      </div>

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount - prominent */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {t("expenses.amount")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--text-muted)]">
                {currencySymbol}
              </span>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => update("amount", e.target.value)}
                required
                className="
                  w-full pl-10 pr-4 py-4 rounded-xl text-2xl font-mono font-bold
                  bg-[var(--bg-elevated)] text-[var(--text-primary)]
                  border border-[var(--border-subtle)]
                  placeholder:text-[var(--text-muted)]
                  transition-all duration-200
                  focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-soft)]
                  focus:outline-none hover:border-[var(--border-medium)]
                "
              />
            </div>
          </div>

          <Input
            label={t("expenses.description")}
            placeholder=""
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t("expenses.date")}
              type="date"
              value={form.date}
              onChange={(e) => update("date", e.target.value)}
              required
            />
            <Select
              label={t("expenses.category")}
              value={form.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              options={[
                { value: "", label: t("expenses.selectCategory") },
                ...categories.map((c: { id: string; name: string }) => ({
                  value: c.id,
                  label: tCategory(c.name),
                })),
              ]}
              required
            />
          </div>

          <Input
            label={t("expenses.notesOptional")}
            placeholder=""
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />

          {/* Recurring toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-colors hover:border-[var(--border-medium)]"
            onClick={() => {
              const newIsRecurring = !form.isRecurring;
              setForm((prev) => ({
                ...prev,
                isRecurring: newIsRecurring,
                recurrenceRule: newIsRecurring && !prev.recurrenceRule ? "MONTHLY" : prev.recurrenceRule,
              }));
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  form.isRecurring ? "bg-[var(--accent-primary-soft)]" : "bg-[var(--bg-card)]"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${form.isRecurring ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{t("expenses.recurring")}</p>
                <p className="text-xs text-[var(--text-muted)]">{t("expenses.recurringDesc")}</p>
              </div>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                form.isRecurring ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-card)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.isRecurring ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {form.isRecurring && (
            <div className="animate-fade-up">
              <Select
                label={t("expenses.recurrence")}
                value={form.recurrenceRule}
                onChange={(e) => update("recurrenceRule", e.target.value)}
                options={[
                  { value: "", label: t("expenses.selectFrequency") },
                  { value: "DAILY", label: t("common.daily") },
                  { value: "WEEKLY", label: t("common.weekly") },
                  { value: "BIWEEKLY", label: t("common.biweekly") },
                  { value: "MONTHLY", label: t("common.monthly") },
                  { value: "QUARTERLY", label: t("common.quarterly") },
                  { value: "YEARLY", label: t("common.yearly") },
                ]}
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <Button type="submit" size="lg" disabled={loading} className="flex-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  {t("common.loading")}
                </span>
              ) : (
                isEditMode ? t("common.save") : t("expenses.addExpense")
              )}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/expenses")}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
