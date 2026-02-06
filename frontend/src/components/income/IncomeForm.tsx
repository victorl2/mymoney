import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { CREATE_INCOME, UPDATE_INCOME } from "../../graphql/mutations/income";
import { GET_INCOMES } from "../../graphql/queries/income";
import { GET_SETTINGS, GET_SUPPORTED_CURRENCIES } from "../../graphql/queries/settings";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";
import { useLanguage } from "../../context/LanguageContext";

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Income {
  id: string;
  name: string;
  amount: number | string;
  incomeType: string;
  isActive: boolean;
  startDate: string | null;
  notes: string | null;
  currency: string;
  isGross: boolean;
  taxRate: number | string | null;
  otherFees: number | string | null;
}

interface IncomeFormProps {
  income?: Income;
}

export default function IncomeForm({ income }: IncomeFormProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { data: settingsData } = useQuery(GET_SETTINGS);
  const { data: currenciesData } = useQuery(GET_SUPPORTED_CURRENCIES);
  const [createIncome, { loading: creating }] = useMutation(CREATE_INCOME);
  const [updateIncome, { loading: updating }] = useMutation(UPDATE_INCOME);

  const isEditMode = !!income;
  const loading = creating || updating;

  const currencies: Currency[] = currenciesData?.supportedCurrencies ?? [];

  const INCOME_TYPES = [
    { value: "SALARY", label: t("incomeType.salary") },
    { value: "FREELANCE", label: t("incomeType.freelance") },
    { value: "INVESTMENTS", label: t("incomeType.investments") },
    { value: "RENTAL", label: t("incomeType.rental") },
    { value: "BUSINESS", label: t("incomeType.business") },
    { value: "OTHER", label: t("incomeType.other") },
  ];

  const [form, setForm] = useState({
    name: "",
    amount: "",
    incomeType: "",
    isActive: true,
    startDate: "",
    notes: "",
    currency: "",
    isGross: true,
    taxRate: "",
    otherFees: "",
  });

  // Populate form when editing
  useEffect(() => {
    if (income) {
      setForm({
        name: income.name,
        amount: String(income.amount),
        incomeType: income.incomeType.toUpperCase(),
        isActive: income.isActive,
        startDate: income.startDate || "",
        notes: income.notes || "",
        currency: income.currency,
        isGross: income.isGross,
        taxRate: income.taxRate ? String(income.taxRate) : "",
        otherFees: income.otherFees ? String(income.otherFees) : "",
      });
    }
  }, [income]);

  // Set default currency from settings (only for new income)
  useEffect(() => {
    if (!isEditMode && settingsData?.settings?.mainCurrency && !form.currency) {
      setForm((prev) => ({ ...prev, currency: settingsData.settings.mainCurrency }));
    }
  }, [settingsData, form.currency, isEditMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.amount || !form.incomeType) return;

    const input = {
      name: form.name,
      amount: parseFloat(form.amount),
      incomeType: form.incomeType,
      isActive: form.isActive,
      startDate: form.startDate || null,
      notes: form.notes || null,
      currency: form.currency || null,
      isGross: form.isGross,
      taxRate: form.taxRate ? parseFloat(form.taxRate) : null,
      otherFees: form.otherFees ? parseFloat(form.otherFees) : null,
    };

    if (isEditMode) {
      await updateIncome({
        variables: { id: income.id, input },
      });
    } else {
      await createIncome({
        variables: { input },
        refetchQueries: [{ query: GET_INCOMES }],
      });
    }
    navigate("/income");
  };

  const update = (field: string, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Calculate net amount preview
  const calculateNetAmount = () => {
    const amount = parseFloat(form.amount) || 0;
    if (!form.isGross) return amount;

    let net = amount;
    if (form.taxRate) {
      net -= amount * (parseFloat(form.taxRate) / 100);
    }
    if (form.otherFees) {
      net -= parseFloat(form.otherFees);
    }
    return Math.max(net, 0);
  };

  const selectedCurrency = currencies.find((c) => c.code === form.currency);
  const currencySymbol = selectedCurrency?.symbol || "$";

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
          {t("common.back")} {t("nav.income")}
        </button>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">
          {isEditMode ? t("income.editIncome") : t("income.newIncome")}
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          {t("income.subtitle")}
        </p>
      </div>

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount and Currency row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                {t("income.monthlyAmount")}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-[var(--chart-2)]">
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
                    w-full pl-12 pr-4 py-4 rounded-xl text-2xl font-mono font-bold
                    bg-[var(--bg-elevated)] text-[var(--chart-2)]
                    border border-[var(--border-subtle)]
                    placeholder:text-[var(--text-muted)]
                    transition-all duration-200
                    focus:border-[var(--chart-2)] focus:ring-2 focus:ring-[var(--chart-2)]/20
                    focus:outline-none hover:border-[var(--border-medium)]
                  "
                />
              </div>
            </div>
            <Select
              label={t("income.currency")}
              value={form.currency}
              onChange={(e) => update("currency", e.target.value)}
              options={currencies.map((c) => ({
                value: c.code,
                label: c.code,
              }))}
            />
          </div>

          <Input
            label={t("income.name")}
            placeholder=""
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label={t("income.type")}
              value={form.incomeType}
              onChange={(e) => update("incomeType", e.target.value)}
              options={[
                { value: "", label: t("expenses.selectCategory") },
                ...INCOME_TYPES,
              ]}
              required
            />
            <Input
              label={t("income.startDate")}
              type="date"
              value={form.startDate}
              onChange={(e) => update("startDate", e.target.value)}
            />
          </div>

          {/* Gross/Net toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] cursor-pointer transition-colors hover:border-[var(--border-medium)]"
            onClick={() => update("isGross", !form.isGross)}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                  form.isGross ? "bg-[var(--accent-primary-soft)]" : "bg-[var(--bg-card)]"
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-colors ${form.isGross ? "text-[var(--accent-primary)]" : "text-[var(--text-muted)]"}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">{t("income.grossAmount")}</p>
                <p className="text-xs text-[var(--text-muted)]">
                  {form.isGross ? t("income.grossDesc") : t("income.netDesc")}
                </p>
              </div>
            </div>
            <div
              className={`w-12 h-7 rounded-full p-1 transition-colors ${
                form.isGross ? "bg-[var(--accent-primary)]" : "bg-[var(--bg-card)]"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  form.isGross ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
          </div>

          {/* Tax and fees - only show when isGross */}
          {form.isGross && (
            <div className="animate-fade-up space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label={t("income.taxRate")}
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  placeholder="22.5"
                  value={form.taxRate}
                  onChange={(e) => update("taxRate", e.target.value)}
                />
                <Input
                  label={t("income.otherFees")}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="100.00"
                  value={form.otherFees}
                  onChange={(e) => update("otherFees", e.target.value)}
                />
              </div>

              {/* Net amount preview */}
              {form.amount && (form.taxRate || form.otherFees) && (
                <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t("income.gross")}</p>
                      <p className="font-mono text-lg text-[var(--text-secondary)]">
                        {currencySymbol}{parseFloat(form.amount).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                    <div className="text-right">
                      <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider">{t("income.net")}</p>
                      <p className="font-mono text-lg font-bold text-[var(--chart-2)]">
                        {currencySymbol}{calculateNetAmount().toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <Input
            label={t("expenses.notesOptional")}
            placeholder=""
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
                <p className="text-sm font-medium text-[var(--text-primary)]">{t("income.activeIncome")}</p>
                <p className="text-xs text-[var(--text-muted)]">{t("income.activeDesc")}</p>
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
                  {t("common.loading")}
                </span>
              ) : (
                isEditMode ? t("common.save") : t("income.addIncome")
              )}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/income")}>
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
