import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_SETTINGS, GET_SUPPORTED_CURRENCIES, GET_SUPPORTED_LANGUAGES } from "../graphql/queries/settings";
import { UPDATE_SETTINGS } from "../graphql/mutations/settings";
import { useLanguage } from "../context/LanguageContext";
import Card from "../components/ui/Card";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export default function SettingsPage() {
  const { t, setLanguage: setContextLanguage } = useLanguage();
  const { data: settingsData, loading: settingsLoading } = useQuery(GET_SETTINGS);
  const { data: currenciesData } = useQuery(GET_SUPPORTED_CURRENCIES);
  const { data: languagesData } = useQuery(GET_SUPPORTED_LANGUAGES);
  const [updateSettings, { loading: updating }] = useMutation(UPDATE_SETTINGS);

  const [mainCurrency, setMainCurrency] = useState("");
  const [language, setLanguage] = useState("");
  const [saved, setSaved] = useState(false);

  const currencies: Currency[] = currenciesData?.supportedCurrencies ?? [];
  const languages: Language[] = languagesData?.supportedLanguages ?? [];

  useEffect(() => {
    if (settingsData?.settings?.mainCurrency) {
      setMainCurrency(settingsData.settings.mainCurrency);
    }
    if (settingsData?.settings?.language) {
      setLanguage(settingsData.settings.language);
    }
  }, [settingsData]);

  const handleSave = async () => {
    await updateSettings({
      variables: {
        input: { mainCurrency, language },
      },
      refetchQueries: [{ query: GET_SETTINGS }],
    });
    setContextLanguage(language as "en" | "pt-BR");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const selectedCurrency = currencies.find((c) => c.code === mainCurrency);
  const hasChanges =
    mainCurrency !== settingsData?.settings?.mainCurrency ||
    language !== settingsData?.settings?.language;

  return (
    <div className="animate-fade-up max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">Configure</p>
        <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">{t("settings.title")}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-2">
          {t("settings.subtitle")}
        </p>
      </div>

      {settingsLoading ? (
        <div className="space-y-6">
          <Card hover={false}>
            <div className="animate-pulse space-y-4">
              <div className="h-4 w-1/4 bg-[var(--bg-elevated)] rounded" />
              <div className="h-12 w-full bg-[var(--bg-elevated)] rounded-xl" />
            </div>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Currency Section */}
          <Card hover={false}>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent-primary-soft)] flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[var(--accent-primary)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t("settings.currency")}</h2>
                  <p className="text-sm text-[var(--text-muted)]">{t("settings.currencyDesc")}</p>
                </div>
              </div>

              {/* Currency Selection */}
              <div className="space-y-4">
                <Select
                  label={t("settings.mainCurrency")}
                  value={mainCurrency}
                  onChange={(e) => setMainCurrency(e.target.value)}
                  options={currencies.map((c) => ({
                    value: c.code,
                    label: `${c.code} - ${c.name} (${c.symbol})`,
                  }))}
                />

                {selectedCurrency && (
                  <div className="p-4 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                    <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {t("settings.preview")}
                    </p>
                    <p className="font-mono text-2xl font-bold text-[var(--text-primary)]">
                      {selectedCurrency.symbol}1,234.56
                    </p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Language Section */}
          <Card hover={false}>
            <div className="space-y-6">
              {/* Section Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-[var(--border-subtle)]">
                <div className="w-10 h-10 rounded-xl bg-[var(--chart-3)]/20 flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-[var(--chart-3)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{t("settings.language")}</h2>
                  <p className="text-sm text-[var(--text-muted)]">{t("settings.languageDesc")}</p>
                </div>
              </div>

              {/* Language Selection */}
              <div className="space-y-4">
                <Select
                  label={t("settings.language")}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={languages.map((lang) => ({
                    value: lang.code,
                    label: `${lang.nativeName} (${lang.name})`,
                  }))}
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              disabled={updating || !hasChanges}
              onClick={handleSave}
            >
              {updating ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("settings.saving")}
                </span>
              ) : (
                t("settings.saveChanges")
              )}
            </Button>

            {saved && (
              <span className="flex items-center gap-2 text-sm text-[var(--chart-2)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t("settings.saved")}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
