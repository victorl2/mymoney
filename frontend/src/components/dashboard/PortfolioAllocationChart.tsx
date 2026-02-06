import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import Card from "../ui/Card";
import { useCurrency } from "../../context/CurrencyContext";
import { useLanguage } from "../../context/LanguageContext";

interface AllocationSlice {
  assetType: string;
  totalValue: number | string;
  percentage: number | string;
}

interface PortfolioAllocationChartProps {
  data: AllocationSlice[];
}

const COLORS = ["#a78bfa", "#00ff88", "#38bdf8", "#fb923c", "#f472b6", "#facc15", "#14b8a6"];

const typeLabelsEn: Record<string, string> = {
  STOCK: "Stocks",
  CRYPTO: "Crypto",
  FUND: "Funds",
  ETF: "ETFs",
  BOND: "Bonds",
  FII: "FIIs",
  OTHER: "Other",
};

const typeLabelsPt: Record<string, string> = {
  STOCK: "Ações",
  CRYPTO: "Cripto",
  FUND: "Fundos",
  ETF: "ETFs",
  BOND: "Títulos",
  FII: "FIIs",
  OTHER: "Outros",
};

const CustomTooltip = ({ active, payload, currencySymbol, language }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const locale = language === "pt-BR" ? "pt-BR" : "en-US";
    return (
      <div
        className="px-4 py-3 rounded-xl border border-[var(--border-medium)]"
        style={{
          background: "rgba(24, 24, 27, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: payload[0].payload.fill }}
          />
          <p className="text-sm font-medium text-[var(--text-primary)]">{data.name}</p>
        </div>
        <p className="font-mono text-lg font-semibold text-[var(--text-primary)]">
          {currencySymbol}{data.value.toLocaleString(locale, { minimumFractionDigits: 2 })}
        </p>
        <p className="text-xs text-[var(--text-muted)]">{data.percentage.toFixed(1)}% {language === "pt-BR" ? "do portfólio" : "of portfolio"}</p>
      </div>
    );
  }
  return null;
};

export default function PortfolioAllocationChart({ data }: PortfolioAllocationChartProps) {
  const { currencySymbol } = useCurrency();
  const { t, language } = useLanguage();
  const typeLabels = language === "pt-BR" ? typeLabelsPt : typeLabelsEn;

  const chartData = data.map((d, i) => ({
    name: typeLabels[d.assetType] ?? d.assetType,
    value: Number(d.totalValue),
    percentage: Number(d.percentage),
    fill: COLORS[i % COLORS.length],
  }));

  const totalValue = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-gain-soft)]">
            <svg className="w-4 h-4" style={{ color: "var(--accent-gain)" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-[var(--text-secondary)] uppercase tracking-wider">
            {t("dashboard.portfolioAllocation")}
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-[var(--text-muted)]">{language === "pt-BR" ? "Nenhum investimento ainda" : "No investments yet"}</p>
        </div>
      ) : (
        <div className="flex items-center gap-6">
          {/* Chart */}
          <div className="relative w-[160px] h-[160px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip currencySymbol={currencySymbol} language={language} />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <p className="text-xs text-[var(--text-muted)] uppercase">Total</p>
              <p className="font-mono text-sm font-bold text-[var(--text-primary)]">
                {currencySymbol}{totalValue >= 1000 ? `${(totalValue / 1000).toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k` : totalValue.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-2">
            {chartData.map((item, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125"
                    style={{ background: item.fill }}
                  />
                  <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
