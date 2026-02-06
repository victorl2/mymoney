import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_SETTINGS } from "../graphql/queries/settings";

const translations = {
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.expenses": "Expenses",
    "nav.income": "Income",
    "nav.investments": "Investments",
    "nav.settings": "Settings",

    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Your financial overview",
    "dashboard.netWorth": "Net Worth",
    "dashboard.portfolio": "Portfolio",
    "dashboard.income": "Income",
    "dashboard.pnl": "P&L",
    "dashboard.expenseSummary": "Expense Summary",
    "dashboard.totalExpenses": "Total Expenses",
    "dashboard.paid": "Paid",
    "dashboard.unpaid": "Unpaid",
    "dashboard.expenseTrend": "Expense Trend",
    "dashboard.last6Months": "Last 6 months",
    "dashboard.portfolioAllocation": "Portfolio Allocation",
    "dashboard.topCategories": "Top Categories",
    "dashboard.thisMonth": "This Month",
    "dashboard.recentTransactions": "Recent Transactions",
    "dashboard.noTransactions": "No recent transactions",

    // Expenses
    "expenses.title": "Expenses",
    "expenses.subtitle": "Track your spending",
    "expenses.addExpense": "Add Expense",
    "expenses.newExpense": "New Expense",
    "expenses.editExpense": "Edit Expense",
    "expenses.noExpenses": "No expenses found",
    "expenses.addFirst": "Add your first expense to get started",
    "expenses.amount": "Amount",
    "expenses.description": "Description",
    "expenses.date": "Date",
    "expenses.category": "Category",
    "expenses.notes": "Notes",
    "expenses.notesOptional": "Notes (optional)",
    "expenses.recurring": "Recurring Expense",
    "expenses.recurringDesc": "This expense repeats on a schedule",
    "expenses.recurrence": "Recurrence",
    "expenses.selectCategory": "Select a category",
    "expenses.selectFrequency": "Select frequency",
    "expenses.markPaid": "Mark as paid",
    "expenses.markUnpaid": "Mark as unpaid",

    // Income
    "income.title": "Income",
    "income.subtitle": "Manage your income streams",
    "income.addIncome": "Add Income",
    "income.newIncome": "New Income Stream",
    "income.editIncome": "Edit Income Stream",
    "income.noIncome": "No income streams found",
    "income.addFirst": "Add your first income stream to get started",
    "income.monthlyAmount": "Monthly Amount",
    "income.name": "Name",
    "income.type": "Income Type",
    "income.startDate": "Start Date (optional)",
    "income.currency": "Currency",
    "income.grossAmount": "Gross Amount",
    "income.grossDesc": "Amount before taxes and deductions",
    "income.netDesc": "Amount is already net/liquid",
    "income.taxRate": "Tax Rate % (optional)",
    "income.otherFees": "Other Fees (optional)",
    "income.gross": "Gross",
    "income.net": "Net",
    "income.activeIncome": "Active Income",
    "income.activeDesc": "Currently receiving this income",
    "income.inactive": "Inactive",
    "income.totalMonthly": "Total Monthly Income",
    "income.streams": "streams",

    // Investments
    "investments.title": "Investments",
    "investments.subtitle": "Manage your portfolio",
    "investments.addAsset": "Add Asset",
    "investments.createPortfolio": "Create Portfolio",
    "investments.noPortfolios": "No portfolios yet",
    "investments.createFirst": "Create your first portfolio to start tracking investments",
    "investments.noAssets": "No assets in this portfolio yet",
    "investments.symbol": "Symbol",
    "investments.type": "Type",
    "investments.quantity": "Quantity",
    "investments.purchasePrice": "Purchase Price",
    "investments.purchaseDate": "Purchase Date",
    "investments.currentPrice": "Current Price (optional)",
    "investments.totalCost": "Total Cost",
    "investments.gainLoss": "Gain/Loss",
    "investments.portfolioName": "Portfolio Name",
    "investments.description": "Description (optional)",

    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your application preferences",
    "settings.currency": "Currency",
    "settings.currencyDesc": "Set your default currency for new entries",
    "settings.mainCurrency": "Main Currency",
    "settings.preview": "Preview",
    "settings.language": "Language",
    "settings.languageDesc": "Choose your preferred language",
    "settings.saveChanges": "Save Changes",
    "settings.saving": "Saving...",
    "settings.saved": "Saved!",

    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.back": "Back",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.notFound": "Not found",
    "common.daily": "Daily",
    "common.weekly": "Weekly",
    "common.biweekly": "Biweekly",
    "common.monthly": "Monthly",
    "common.quarterly": "Quarterly",
    "common.yearly": "Yearly",
    "common.perMonth": "/month",

    // Asset Types
    "assetType.stock": "Stock",
    "assetType.crypto": "Crypto",
    "assetType.fund": "Fund",
    "assetType.etf": "ETF",
    "assetType.bond": "Bond",
    "assetType.fii": "FII",
    "assetType.other": "Other",

    // Income Types
    "incomeType.salary": "Salary",
    "incomeType.freelance": "Freelance",
    "incomeType.investments": "Investments",
    "incomeType.rental": "Rental",
    "incomeType.business": "Business",
    "incomeType.other": "Other",

    // Categories
    "category.food": "Food",
    "category.transport": "Transport",
    "category.transportation": "Transportation",
    "category.housing": "Housing",
    "category.utilities": "Utilities",
    "category.bills": "Bills",
    "category.entertainment": "Entertainment",
    "category.shopping": "Shopping",
    "category.health": "Health",
    "category.education": "Education",
    "category.travel": "Travel",
    "category.groceries": "Groceries",
    "category.restaurants": "Restaurants",
    "category.subscriptions": "Subscriptions",
    "category.insurance": "Insurance",
    "category.personal": "Personal",
    "category.gifts": "Gifts",
    "category.pets": "Pets",
    "category.other": "Other",
  },
  "pt-BR": {
    // Navigation
    "nav.dashboard": "Painel",
    "nav.expenses": "Despesas",
    "nav.income": "Receitas",
    "nav.investments": "Investimentos",
    "nav.settings": "Configurações",

    // Dashboard
    "dashboard.title": "Painel",
    "dashboard.subtitle": "Sua visão financeira",
    "dashboard.netWorth": "Patrimônio Líquido",
    "dashboard.portfolio": "Portfólio",
    "dashboard.income": "Receita",
    "dashboard.pnl": "L&P",
    "dashboard.expenseSummary": "Resumo de Despesas",
    "dashboard.totalExpenses": "Total de Despesas",
    "dashboard.paid": "Pago",
    "dashboard.unpaid": "A Pagar",
    "dashboard.expenseTrend": "Tendência de Despesas",
    "dashboard.last6Months": "Últimos 6 meses",
    "dashboard.portfolioAllocation": "Alocação do Portfólio",
    "dashboard.topCategories": "Principais Categorias",
    "dashboard.thisMonth": "Este Mês",
    "dashboard.recentTransactions": "Transações Recentes",
    "dashboard.noTransactions": "Nenhuma transação recente",

    // Expenses
    "expenses.title": "Despesas",
    "expenses.subtitle": "Acompanhe seus gastos",
    "expenses.addExpense": "Nova Despesa",
    "expenses.newExpense": "Nova Despesa",
    "expenses.editExpense": "Editar Despesa",
    "expenses.noExpenses": "Nenhuma despesa encontrada",
    "expenses.addFirst": "Adicione sua primeira despesa para começar",
    "expenses.amount": "Valor",
    "expenses.description": "Descrição",
    "expenses.date": "Data",
    "expenses.category": "Categoria",
    "expenses.notes": "Notas",
    "expenses.notesOptional": "Notas (opcional)",
    "expenses.recurring": "Despesa Recorrente",
    "expenses.recurringDesc": "Esta despesa se repete em uma frequência",
    "expenses.recurrence": "Recorrência",
    "expenses.selectCategory": "Selecione uma categoria",
    "expenses.selectFrequency": "Selecione a frequência",
    "expenses.markPaid": "Marcar como pago",
    "expenses.markUnpaid": "Marcar como não pago",

    // Income
    "income.title": "Receitas",
    "income.subtitle": "Gerencie suas fontes de renda",
    "income.addIncome": "Nova Receita",
    "income.newIncome": "Nova Fonte de Renda",
    "income.editIncome": "Editar Fonte de Renda",
    "income.noIncome": "Nenhuma fonte de renda encontrada",
    "income.addFirst": "Adicione sua primeira fonte de renda para começar",
    "income.monthlyAmount": "Valor Mensal",
    "income.name": "Nome",
    "income.type": "Tipo de Receita",
    "income.startDate": "Data de Início (opcional)",
    "income.currency": "Moeda",
    "income.grossAmount": "Valor Bruto",
    "income.grossDesc": "Valor antes de impostos e deduções",
    "income.netDesc": "Valor já é líquido",
    "income.taxRate": "Alíquota % (opcional)",
    "income.otherFees": "Outras Taxas (opcional)",
    "income.gross": "Bruto",
    "income.net": "Líquido",
    "income.activeIncome": "Receita Ativa",
    "income.activeDesc": "Recebendo atualmente esta renda",
    "income.inactive": "Inativo",
    "income.totalMonthly": "Receita Mensal Total",
    "income.streams": "fontes",

    // Investments
    "investments.title": "Investimentos",
    "investments.subtitle": "Gerencie seu portfólio",
    "investments.addAsset": "Adicionar Ativo",
    "investments.createPortfolio": "Criar Portfólio",
    "investments.noPortfolios": "Nenhum portfólio ainda",
    "investments.createFirst": "Crie seu primeiro portfólio para começar a acompanhar investimentos",
    "investments.noAssets": "Nenhum ativo neste portfólio ainda",
    "investments.symbol": "Símbolo",
    "investments.type": "Tipo",
    "investments.quantity": "Quantidade",
    "investments.purchasePrice": "Preço de Compra",
    "investments.purchaseDate": "Data de Compra",
    "investments.currentPrice": "Preço Atual (opcional)",
    "investments.totalCost": "Custo Total",
    "investments.gainLoss": "Ganho/Perda",
    "investments.portfolioName": "Nome do Portfólio",
    "investments.description": "Descrição (opcional)",

    // Settings
    "settings.title": "Configurações",
    "settings.subtitle": "Gerencie suas preferências do aplicativo",
    "settings.currency": "Moeda",
    "settings.currencyDesc": "Defina sua moeda padrão para novas entradas",
    "settings.mainCurrency": "Moeda Principal",
    "settings.preview": "Visualização",
    "settings.language": "Idioma",
    "settings.languageDesc": "Escolha seu idioma preferido",
    "settings.saveChanges": "Salvar Alterações",
    "settings.saving": "Salvando...",
    "settings.saved": "Salvo!",

    // Common
    "common.save": "Salvar",
    "common.cancel": "Cancelar",
    "common.delete": "Excluir",
    "common.edit": "Editar",
    "common.add": "Adicionar",
    "common.back": "Voltar",
    "common.loading": "Carregando...",
    "common.error": "Erro",
    "common.notFound": "Não encontrado",
    "common.daily": "Diário",
    "common.weekly": "Semanal",
    "common.biweekly": "Quinzenal",
    "common.monthly": "Mensal",
    "common.quarterly": "Trimestral",
    "common.yearly": "Anual",
    "common.perMonth": "/mês",

    // Asset Types
    "assetType.stock": "Ação",
    "assetType.crypto": "Cripto",
    "assetType.fund": "Fundo",
    "assetType.etf": "ETF",
    "assetType.bond": "Título",
    "assetType.fii": "FII",
    "assetType.other": "Outro",

    // Income Types
    "incomeType.salary": "Salário",
    "incomeType.freelance": "Freelance",
    "incomeType.investments": "Investimentos",
    "incomeType.rental": "Aluguel",
    "incomeType.business": "Negócio",
    "incomeType.other": "Outro",

    // Categories
    "category.food": "Alimentação",
    "category.transport": "Transporte",
    "category.transportation": "Transporte",
    "category.housing": "Moradia",
    "category.utilities": "Contas",
    "category.bills": "Contas",
    "category.entertainment": "Entretenimento",
    "category.shopping": "Compras",
    "category.health": "Saúde",
    "category.education": "Educação",
    "category.travel": "Viagem",
    "category.groceries": "Supermercado",
    "category.restaurants": "Restaurantes",
    "category.subscriptions": "Assinaturas",
    "category.insurance": "Seguros",
    "category.personal": "Pessoal",
    "category.gifts": "Presentes",
    "category.pets": "Pets",
    "category.other": "Outros",
  },
};

type Language = keyof typeof translations;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tCategory: (name: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { data: settingsData } = useQuery(GET_SETTINGS);
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    if (settingsData?.settings?.language) {
      const lang = settingsData.settings.language as Language;
      if (lang in translations) {
        setLanguageState(lang);
      }
    }
  }, [settingsData]);

  const setLanguage = (lang: Language) => {
    if (lang in translations) {
      setLanguageState(lang);
    }
  };

  const t = (key: string): string => {
    const langTranslations = translations[language] as Record<string, string>;
    const enTranslations = translations.en as Record<string, string>;
    return langTranslations[key] || enTranslations[key] || key;
  };

  const tCategory = (name: string): string => {
    // Try to find a translation for the category name
    const key = `category.${name.toLowerCase().replace(/\s+/g, "")}`;
    const langTranslations = translations[language] as Record<string, string>;
    const enTranslations = translations.en as Record<string, string>;
    return langTranslations[key] || enTranslations[key] || name;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tCategory }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

export { translations };
export type { Language };
