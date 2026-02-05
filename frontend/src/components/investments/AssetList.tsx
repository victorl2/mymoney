import { useMutation } from "@apollo/client";
import { format } from "date-fns";
import Button from "../ui/Button";
import { DELETE_ASSET } from "../../graphql/mutations/investments";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
  currentPrice: number | null;
  totalCost: number;
  currentValue: number | null;
  gainLoss: number | null;
  gainLossPercent: number | null;
}

interface AssetListProps {
  assets: Asset[];
  onRefetch: () => void;
}

const assetTypeLabels: Record<string, string> = {
  STOCK: "Stock",
  CRYPTO: "Crypto",
  FUND: "Fund",
  ETF: "ETF",
  BOND: "Bond",
  OTHER: "Other",
};

export default function AssetList({ assets, onRefetch }: AssetListProps) {
  const [deleteAsset] = useMutation(DELETE_ASSET);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this asset?")) return;
    await deleteAsset({ variables: { id } });
    onRefetch();
  };

  if (assets.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No assets in this portfolio yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200">
            <th className="pb-3 font-medium">Asset</th>
            <th className="pb-3 font-medium">Type</th>
            <th className="pb-3 font-medium text-right">Qty</th>
            <th className="pb-3 font-medium text-right">Avg Cost</th>
            <th className="pb-3 font-medium text-right">Current</th>
            <th className="pb-3 font-medium text-right">Value</th>
            <th className="pb-3 font-medium text-right">Gain/Loss</th>
            <th className="pb-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {assets.map((asset) => {
            const gl = asset.gainLoss;
            const isPositive = gl !== null && gl >= 0;
            return (
              <tr key={asset.id}>
                <td className="py-3">
                  <p className="font-medium text-gray-900">{asset.symbol}</p>
                  <p className="text-xs text-gray-500">{asset.name}</p>
                </td>
                <td className="py-3">
                  <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium text-gray-600">
                    {assetTypeLabels[asset.assetType] ?? asset.assetType}
                  </span>
                </td>
                <td className="py-3 text-right font-mono">{asset.quantity}</td>
                <td className="py-3 text-right font-mono">${asset.purchasePrice.toFixed(2)}</td>
                <td className="py-3 text-right font-mono">
                  {asset.currentPrice !== null ? `$${asset.currentPrice.toFixed(2)}` : "—"}
                </td>
                <td className="py-3 text-right font-mono font-medium">
                  {asset.currentValue !== null ? `$${asset.currentValue.toFixed(2)}` : "—"}
                </td>
                <td className="py-3 text-right">
                  {gl !== null ? (
                    <span className={`font-mono font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}${gl.toFixed(2)}
                      {asset.gainLossPercent !== null && (
                        <span className="text-xs ml-1">
                          ({isPositive ? "+" : ""}{asset.gainLossPercent.toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  ) : "—"}
                </td>
                <td className="py-3 text-right">
                  <Button variant="danger" size="sm" onClick={() => handleDelete(asset.id)}>
                    Delete
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
