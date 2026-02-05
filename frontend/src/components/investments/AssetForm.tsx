import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { CREATE_ASSET } from "../../graphql/mutations/investments";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Card from "../ui/Card";

interface AssetFormProps {
  portfolioId: string;
}

const assetTypes = [
  { value: "STOCK", label: "Stock" },
  { value: "CRYPTO", label: "Crypto" },
  { value: "FUND", label: "Fund" },
  { value: "ETF", label: "ETF" },
  { value: "BOND", label: "Bond" },
  { value: "OTHER", label: "Other" },
];

const assetTypeColors: Record<string, string> = {
  STOCK: "#a78bfa",
  CRYPTO: "#facc15",
  FUND: "#38bdf8",
  ETF: "#00ff88",
  BOND: "#f472b6",
  OTHER: "#fb923c",
};

export default function AssetForm({ portfolioId }: AssetFormProps) {
  const navigate = useNavigate();
  const [createAsset, { loading }] = useMutation(CREATE_ASSET);

  const [form, setForm] = useState({
    symbol: "",
    name: "",
    assetType: "STOCK",
    quantity: "",
    purchasePrice: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    currentPrice: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.symbol || !form.name || !form.quantity || !form.purchasePrice) return;

    await createAsset({
      variables: {
        input: {
          portfolioId,
          symbol: form.symbol.toUpperCase(),
          name: form.name,
          assetType: form.assetType,
          quantity: parseFloat(form.quantity),
          purchasePrice: parseFloat(form.purchasePrice),
          purchaseDate: form.purchaseDate,
          currentPrice: form.currentPrice ? parseFloat(form.currentPrice) : null,
          notes: form.notes || null,
        },
      },
    });
    navigate("/investments");
  };

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const selectedColor = assetTypeColors[form.assetType] || assetTypeColors.OTHER;

  return (
    <div className="animate-fade-up max-w-xl">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/investments")}
          className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Investments
        </button>
        <h1 className="font-display text-3xl font-bold text-[var(--text-primary)]">Add Asset</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Add a new asset to your portfolio</p>
      </div>

      <Card hover={false}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Symbol and Type row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Symbol
              </label>
              <div className="relative">
                <div
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold"
                  style={{ background: `${selectedColor}20`, color: selectedColor }}
                >
                  {form.symbol ? form.symbol.slice(0, 2).toUpperCase() : "??"}
                </div>
                <input
                  placeholder="AAPL"
                  value={form.symbol}
                  onChange={(e) => update("symbol", e.target.value.toUpperCase())}
                  required
                  className="
                    w-full pl-14 pr-4 py-3 rounded-xl text-sm uppercase font-mono
                    bg-[var(--bg-elevated)] text-[var(--text-primary)]
                    border border-[var(--border-subtle)]
                    placeholder:text-[var(--text-muted)] placeholder:normal-case
                    transition-all duration-200
                    focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary-soft)]
                    focus:outline-none hover:border-[var(--border-medium)]
                  "
                />
              </div>
            </div>
            <Select
              label="Type"
              value={form.assetType}
              onChange={(e) => update("assetType", e.target.value)}
              options={assetTypes}
            />
          </div>

          <Input
            label="Name"
            placeholder="Apple Inc."
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Quantity"
              type="number"
              step="any"
              min="0"
              placeholder="10"
              value={form.quantity}
              onChange={(e) => update("quantity", e.target.value)}
              required
            />
            <Input
              label="Purchase Price"
              type="number"
              step="0.01"
              min="0"
              placeholder="150.00"
              value={form.purchasePrice}
              onChange={(e) => update("purchasePrice", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Purchase Date"
              type="date"
              value={form.purchaseDate}
              onChange={(e) => update("purchaseDate", e.target.value)}
              required
            />
            <Input
              label="Current Price (optional)"
              type="number"
              step="0.01"
              min="0"
              placeholder="175.00"
              value={form.currentPrice}
              onChange={(e) => update("currentPrice", e.target.value)}
            />
          </div>

          <Input
            label="Notes (optional)"
            placeholder="Additional notes..."
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
          />

          {/* Cost preview */}
          {form.quantity && form.purchasePrice && (
            <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Cost</p>
              <p className="font-mono text-xl font-bold text-[var(--text-primary)]">
                ${(parseFloat(form.quantity) * parseFloat(form.purchasePrice)).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
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
                  Saving...
                </span>
              ) : (
                "Add Asset"
              )}
            </Button>
            <Button type="button" variant="secondary" size="lg" onClick={() => navigate("/investments")}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
