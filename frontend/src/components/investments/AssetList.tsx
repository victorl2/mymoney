import { useMutation } from "@apollo/client/react";
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

const assetTypeColors: Record<string, string> = {
  STOCK: "#a78bfa",
  CRYPTO: "#facc15",
  FUND: "#38bdf8",
  ETF: "#00ff88",
  BOND: "#f472b6",
  OTHER: "#fb923c",
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
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-14 h-14 mb-4 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center">
          <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-sm text-[var(--text-muted)]">No assets in this portfolio yet</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="pb-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Asset</th>
            <th className="pb-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Type</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Qty</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Avg Cost</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Current</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Value</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">Gain/Loss</th>
            <th className="pb-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            const gl = asset.gainLoss;
            const isPositive = gl !== null && gl >= 0;
            const color = assetTypeColors[asset.assetType] || assetTypeColors.OTHER;

            return (
              <tr
                key={asset.id}
                className="group border-b border-[var(--border-subtle)] last:border-0 hover:bg-[var(--bg-elevated)] transition-colors"
                style={{ animationDelay: `${index * 0.03}s` }}
              >
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xs font-bold"
                      style={{ background: `${color}20`, color }}
                    >
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                        {asset.symbol}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate max-w-[150px]">{asset.name}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">
                  <span
                    className="px-2 py-1 rounded-md text-xs font-medium"
                    style={{ background: `${color}20`, color }}
                  >
                    {assetTypeLabels[asset.assetType] ?? asset.assetType}
                  </span>
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-secondary)]">
                  {asset.quantity.toLocaleString()}
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-secondary)]">
                  ${asset.purchasePrice.toFixed(2)}
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-primary)]">
                  {asset.currentPrice !== null ? `$${asset.currentPrice.toFixed(2)}` : "—"}
                </td>
                <td className="py-4 text-right font-mono font-semibold text-[var(--text-primary)]">
                  {asset.currentValue !== null
                    ? `$${asset.currentValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className="py-4 text-right">
                  {gl !== null ? (
                    <div className="flex flex-col items-end">
                      <span
                        className="font-mono font-semibold"
                        style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
                      >
                        {isPositive ? "+" : ""}${gl.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {asset.gainLossPercent !== null && (
                        <span
                          className="text-xs"
                          style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
                        >
                          {isPositive ? "+" : ""}{asset.gainLossPercent.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[var(--text-muted)]">—</span>
                  )}
                </td>
                <td className="py-4">
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(asset.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
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
