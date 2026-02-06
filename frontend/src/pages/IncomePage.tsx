import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_INCOMES } from "../graphql/queries/income";
import { GET_SETTINGS, GET_EXCHANGE_RATES, GET_SUPPORTED_CURRENCIES } from "../graphql/queries/settings";
import { useLanguage } from "../context/LanguageContext";
import IncomeList from "../components/income/IncomeList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

interface Income {
  isActive: boolean;
  netAmount: string;
  currency: string;
}

interface ExchangeRate {
  currency: string;
  rate: string;
}

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

export default function IncomePage() {
  const { t, language } = useLanguage();
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data: settingsData } = useQuery(GET_SETTINGS);
  const { data: currenciesData } = useQuery(GET_SUPPORTED_CURRENCIES);
  const mainCurrency = settingsData?.settings?.mainCurrency ?? "USD";

  const { data: ratesData } = useQuery(GET_EXCHANGE_RATES, {
    variables: { base: mainCurrency },
    skip: !mainCurrency,
  });

  const { data, loading, refetch } = useQuery(GET_INCOMES, {
    variables: {
      isActive: filterActive,
      limit,
      offset,
    },
  });

  const incomes = data?.incomes?.items ?? [];
  const totalCount = data?.incomes?.totalCount ?? 0;
  const hasMore = data?.incomes?.hasMore ?? false;

  // Build exchange rates map
  const exchangeRates: Record<string, number> = {};
  if (ratesData?.exchangeRates?.rates) {
    ratesData.exchangeRates.rates.forEach((rate: ExchangeRate) => {
      exchangeRates[rate.currency] = Number(rate.rate);
    });
  }

  // Get currency symbol for main currency
  const currencies: Currency[] = currenciesData?.supportedCurrencies ?? [];
  const mainCurrencyInfo = currencies.find((c) => c.code === mainCurrency);
  const currencySymbol = mainCurrencyInfo?.symbol ?? "$";

  // Calculate total monthly income converted to main currency
  const totalMonthlyIncome = incomes
    .filter((i: Income) => i.isActive)
    .reduce((sum: number, i: Income) => {
      const netAmount = Number(i.netAmount);
      const incomeCurrency = i.currency || mainCurrency;

      // Convert to main currency if different
      if (incomeCurrency !== mainCurrency && exchangeRates[incomeCurrency]) {
        // exchangeRates are relative to mainCurrency (how many units of X per 1 unit of main)
        // So to convert FROM income currency TO main: amount / rate
        return sum + netAmount / exchangeRates[incomeCurrency];
      }

      return sum + netAmount;
    }, 0);

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">{t("income.subtitle")}</p>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">{t("income.title")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            <span className="font-mono text-[var(--chart-2)]">{totalCount}</span> {t("income.streams")}
          </p>
        </div>
        <Link to="/income/new">
          <Button size="lg">
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              {t("income.addIncome")}
            </span>
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card className="mb-6" hover={false}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider">
              {t("income.totalMonthly")}
              <span className="ml-2 text-xs opacity-75">({mainCurrency})</span>
            </p>
            <p className="font-mono text-3xl font-bold text-[var(--chart-2)] mt-1">
              +{currencySymbol}{totalMonthlyIncome.toLocaleString(language === "pt-BR" ? "pt-BR" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFilterActive(null);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === null
                  ? "bg-[var(--accent-primary-soft)] text-[var(--accent-primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {language === "pt-BR" ? "Todos" : "All"}
            </button>
            <button
              onClick={() => {
                setFilterActive(true);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === true
                  ? "bg-[var(--chart-2)]/20 text-[var(--chart-2)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {language === "pt-BR" ? "Ativos" : "Active"}
            </button>
            <button
              onClick={() => {
                setFilterActive(false);
                setOffset(0);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                filterActive === false
                  ? "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {t("income.inactive")}
            </button>
          </div>
        </div>
      </Card>

      {/* Income List */}
      <Card hover={false}>
        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-elevated)]" />
                <div className="flex-1">
                  <div className="h-4 w-1/3 bg-[var(--bg-elevated)] rounded mb-2" />
                  <div className="h-3 w-1/4 bg-[var(--bg-elevated)] rounded" />
                </div>
                <div className="h-5 w-20 bg-[var(--bg-elevated)] rounded" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <IncomeList incomes={incomes} onRefetch={() => refetch()} />

            {/* Pagination */}
            {totalCount > limit && (
              <div className="flex items-center justify-between pt-6 mt-6 border-t border-[var(--border-subtle)]">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    {language === "pt-BR" ? "Anterior" : "Previous"}
                  </span>
                </Button>

                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm text-[var(--text-secondary)]">
                    {offset + 1}
                  </span>
                  <span className="text-[var(--text-muted)]">-</span>
                  <span className="font-mono text-sm text-[var(--text-secondary)]">
                    {Math.min(offset + limit, totalCount)}
                  </span>
                  <span className="text-[var(--text-muted)] mx-1">{language === "pt-BR" ? "de" : "of"}</span>
                  <span className="font-mono text-sm text-[var(--chart-2)]">
                    {totalCount}
                  </span>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setOffset(offset + limit)}
                >
                  <span className="flex items-center gap-1">
                    {language === "pt-BR" ? "Próximo" : "Next"}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
