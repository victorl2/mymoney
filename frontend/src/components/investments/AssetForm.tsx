import { useState } from "react";
import { useMutation } from "@apollo/client";
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

  return (
    <Card className="max-w-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">Add Asset</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Symbol"
            placeholder="AAPL"
            value={form.symbol}
            onChange={(e) => update("symbol", e.target.value)}
            required
          />
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
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Add Asset"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => navigate("/investments")}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}
