import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router-dom";
import { GET_PORTFOLIOS } from "../graphql/queries/investments";
import { useLanguage } from "../context/LanguageContext";
import PortfolioSummary from "../components/investments/PortfolioSummary";
import AssetList from "../components/investments/AssetList";
import CreatePortfolioForm from "../components/investments/CreatePortfolioForm";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function InvestmentsPage() {
  const { t, language } = useLanguage();
  const { data, loading, refetch } = useQuery(GET_PORTFOLIOS);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const portfolios = data?.portfolios ?? [];

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm text-[var(--text-muted)] uppercase tracking-wider mb-1">{t("investments.subtitle")}</p>
          <h1 className="font-display text-4xl font-bold text-[var(--text-primary)]">{t("investments.title")}</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-2">
            <span className="font-mono text-[var(--accent-gain)]">{portfolios.length}</span> {language === "pt-BR" ? (portfolios.length === 1 ? "portfólio ativo" : "portfólios ativos") : (portfolios.length === 1 ? "active portfolio" : "active portfolios")}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowCreateForm(true)}>
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {language === "pt-BR" ? "Novo Portfólio" : "New Portfolio"}
            </span>
          </Button>
          {portfolios.length > 0 && (
            <Link to={`/investments/new?portfolioId=${portfolios[0].id}`}>
              <Button size="md">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t("investments.addAsset")}
                </span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Create Portfolio Form */}
      {showCreateForm && (
        <Card className="mb-6 animate-fade-up" hover={false}>
          <CreatePortfolioForm
            onCreated={() => {
              setShowCreateForm(false);
              refetch();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </Card>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {[...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="h-32 bg-[var(--bg-elevated)] rounded-2xl shimmer mb-3" />
              <div className="h-48 bg-[var(--bg-elevated)] rounded-2xl shimmer" />
            </div>
          ))}
        </div>
      ) : portfolios.length === 0 ? (
        <Card hover={false}>
          <div className="flex flex-col items-center justify-center py-16">
            <div
              className="w-20 h-20 mb-6 rounded-2xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, var(--accent-gain-soft), var(--accent-primary-soft))",
              }}
            >
              <svg className="w-10 h-10 text-[var(--accent-gain)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-xl font-medium text-[var(--text-primary)] mb-2">{t("investments.noPortfolios")}</p>
            <p className="text-sm text-[var(--text-muted)] mb-6">{t("investments.createFirst")}</p>
            <Button onClick={() => setShowCreateForm(true)}>
              {language === "pt-BR" ? "Criar Seu Primeiro Portfólio" : "Create Your First Portfolio"}
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-8 stagger-children">
          {portfolios.map((portfolio: {
            id: string;
            name: string;
            totalValue: number;
            totalCost: number;
            totalGainLoss: number;
            totalGainLossPercent: number;
            assets: Array<{
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
            }>;
          }) => (
            <div key={portfolio.id}>
              <PortfolioSummary
                name={portfolio.name}
                totalValue={portfolio.totalValue}
                totalCost={portfolio.totalCost}
                totalGainLoss={portfolio.totalGainLoss}
                totalGainLossPercent={portfolio.totalGainLossPercent}
                assetCount={portfolio.assets.length}
              />
              <Card className="mt-3" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--accent-primary-soft)]">
                      <svg className="w-4 h-4 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <h3 className="font-medium text-[var(--text-primary)]">{language === "pt-BR" ? "Ativos" : "Assets"}</h3>
                  </div>
                  <Link to={`/investments/new?portfolioId=${portfolio.id}`}>
                    <Button size="sm" variant="secondary">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {language === "pt-BR" ? "Adicionar" : "Add"}
                      </span>
                    </Button>
                  </Link>
                </div>
                <AssetList assets={portfolio.assets} onRefetch={() => refetch()} />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
