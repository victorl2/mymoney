import { useMutation } from "@apollo/client/react";
import Button from "../ui/Button";
import { DELETE_ASSET } from "../../graphql/mutations/investments";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface Asset {
  id: string;
  symbol: string;
  name: string;
  assetType: string;
  quantity: number | string;
  purchasePrice: number | string;
  purchaseDate: string;
  currentPrice: number | string | null;
  totalCost: number | string;
  currentValue: number | string | null;
  gainLoss: number | string | null;
  gainLossPercent: number | string | null;
}

interface AssetListProps {
  assets: Asset[];
  onRefetch: () => void;
}

const ASSET_TYPE_COLORS: Record<string, string> = {
  STOCK: "#a78bfa",
  CRYPTO: "#facc15",
  FUND: "#38bdf8",
  ETF: "#00ff88",
  BOND: "#f472b6",
  FII: "#14b8a6",
  OTHER: "#fb923c",
};

export default function AssetList({ assets, onRefetch }: AssetListProps) {
  const { currencySymbol } = useCurrency();
  const { t, language } = useLanguage();
  const [deleteAsset] = useMutation(DELETE_ASSET);

  const getTypeLabel = (type: string) => {
    const key = `assetType.${type.toLowerCase()}`;
    return t(key);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(language === "pt-BR" ? "Excluir este ativo?" : "Delete this asset?")) return;
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
        <p className="text-sm text-[var(--text-muted)]">{t("investments.noAssets")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-6 px-6">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)]">
            <th className="pb-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "Ativo" : "Asset"}</th>
            <th className="pb-4 text-left text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{t("investments.type")}</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "Qtd" : "Qty"}</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "Preço Médio" : "Avg Cost"}</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "Atual" : "Current"}</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{language === "pt-BR" ? "Valor" : "Value"}</th>
            <th className="pb-4 text-right text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">{t("investments.gainLoss")}</th>
            <th className="pb-4 w-10"></th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset, index) => {
            const gl = asset.gainLoss !== null ? Number(asset.gainLoss) : null;
            const isPositive = gl !== null && gl >= 0;
            const color = ASSET_TYPE_COLORS[asset.assetType] || ASSET_TYPE_COLORS.OTHER;
            const quantity = Number(asset.quantity);
            const purchasePrice = Number(asset.purchasePrice);
            const currentPrice = asset.currentPrice !== null ? Number(asset.currentPrice) : null;
            const currentValue = asset.currentValue !== null ? Number(asset.currentValue) : null;

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
                    {getTypeLabel(asset.assetType)}
                  </span>
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-secondary)]">
                  {quantity.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US")}
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-secondary)]">
                  {currencySymbol}{purchasePrice.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td className="py-4 text-right font-mono text-[var(--text-primary)]">
                  {currentPrice !== null ? `${currencySymbol}${currentPrice.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "—"}
                </td>
                <td className="py-4 text-right font-mono font-semibold text-[var(--text-primary)]">
                  {currentValue !== null
                    ? `${currencySymbol}${currentValue.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : "—"}
                </td>
                <td className="py-4 text-right">
                  {gl !== null ? (
                    <div className="flex flex-col items-end">
                      <span
                        className="font-mono font-semibold"
                        style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
                      >
                        {isPositive ? "+" : "-"}{currencySymbol}{Math.abs(gl).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {asset.gainLossPercent !== null && (
                        <span
                          className="text-xs"
                          style={{ color: isPositive ? "var(--accent-gain)" : "var(--accent-loss)" }}
                        >
                          {isPositive ? "+" : ""}{Number(asset.gainLossPercent).toFixed(1)}%
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
