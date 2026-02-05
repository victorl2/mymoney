import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { CREATE_INCOME } from "../../graphql/mutations/income";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";

const INCOME_TYPES = [
  { value: "SALARY", label: "Salary" },
  { value: "FREELANCE", label: "Freelance" },
  { value: "INVESTMENTS", label: "Investments" },
  { value: "RENTAL", label: "Rental" },
  { value: "BUSINESS", label: "Business" },
  { value: "OTHER", label: "Other" },
];

export default function IncomeForm() {
  const navigate = useNavigate();
  const [createIncome, { loading }] = useMutation(CREATE_INCOME);

  const [form, setForm] = useState({
    name: "",
    amount: "",
    incomeType: "",
    isActive: true,
    startDate: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.incomeType) return;

    await createIncome({
      variables: {
        input: {
          name: form.name,
          amount: parseFloat(form.amount),
          incomeType: form.incomeType,
          isActive: form.isActive,
          startDate: form.startDate || null,
          notes: form.notes || null,
        },
      },
    });
    navigate("/income");
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="animate-fade-up max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/income")}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Income
        </button>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">New Income Stream</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Add a recurring income source</p>
      </div>

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount - prominent */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Monthly Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--chart-2)]">
                $
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
                  bg-[var(--bg-elevated)] text-[var(--chart-2)]
                  border border-[var(--border-subtle)]
                  placeholder:text-[var(--text-muted)]
                  transition-all duration-200
                  focus:border-[var(--chart-2)] focus:ring-2 focus:ring-[var(--chart-2)]/20
                  focus:outline-none hover:border-[var(--border-medium)]
                "
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)]">
                /month
              </span>
            </div>
          </div>

          <Input
            label="Name"
            placeholder="e.g., Main Job, Rental Property A"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Income Type"
              value={form.incomeType}
              onChange={(e) => update("incomeType", e.target.value)}
              options={[
                { value: "", label: "Select type" },
                ...INCOME_TYPES,
              ]}
              required
            />
            <Input
              label="Start Date (optional)"
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>

          <Input
            label="Notes (optional)"
            placeholder="Additional notes..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />

          {/* Active toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-colors hover:border-[var(--border-medium)]"
            onClick={() => update("isActive", !form.isActive)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  form.isActive ? "bg-[var(--chart-2)]/20" : "bg-[var(--bg-card)]"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${form.isActive ? "text-[var(--chart-2)]" : "text-[var(--text-muted)]"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Active Income</p>
                <p className="text-xs text-[var(--text-muted)]">Currently receiving this income</p>
              </div>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                form.isActive ? "bg-[var(--chart-2)]" : "bg-[var(--bg-card)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.isActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border-subtle)]">
            <Button type="submit" size="lg" disabled={loading} className="flex-1">
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Add Income"
              )}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/income")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
