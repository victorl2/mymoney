import { createContext, useContext, type ReactNode } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_SETTINGS, GET_SUPPORTED_CURRENCIES } from "../graphql/queries/settings";

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

// Fallback symbols when currencies haven't loaded yet
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  BRL: "R$",
  JPY: "¥",
  CNY: "¥",
  CAD: "$",
  AUD: "$",
  CHF: "CHF",
  INR: "₹",
};

interface CurrencyContextType {
  mainCurrency: string;
  currencySymbol: string;
  currencies: Currency[];
  loading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType>({
  mainCurrency: "USD",
  currencySymbol: "$",
  currencies: [],
  loading: true,
});

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_SETTINGS);
  const { data: currenciesData, loading: currenciesLoading } = useQuery(GET_SUPPORTED_CURRENCIES);

  const currencies: Currency[] = currenciesData?.supportedCurrencies ?? [];
  const mainCurrency = settingsData?.settings?.mainCurrency ?? "USD";
  const currencyInfo = currencies.find((c) => c.code === mainCurrency);
  // Use fetched symbol, or fallback to static mapping, or default to $
  const currencySymbol = currencyInfo?.symbol ?? CURRENCY_SYMBOLS[mainCurrency] ?? "$";

  return (
    <CurrencyContext.Provider
      value={{
        mainCurrency,
        currencySymbol,
        currencies,
        loading: settingsLoading || currenciesLoading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}
