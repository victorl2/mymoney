import { Routes, Route, Navigate } from "react-router-dom";
import { CurrencyProvider } from "./context/CurrencyContext";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import EditExpensePage from "./pages/EditExpensePage";
import IncomePage from "./pages/IncomePage";
import AddIncomePage from "./pages/AddIncomePage";
import EditIncomePage from "./pages/EditIncomePage";
import InvestmentsPage from "./pages/InvestmentsPage";
import AddInvestmentPage from "./pages/AddInvestmentPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <CurrencyProvider>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/new" element={<AddExpensePage />} />
        <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
        <Route path="/income" element={<IncomePage />} />
        <Route path="/income/new" element={<AddIncomePage />} />
        <Route path="/income/:id/edit" element={<EditIncomePage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/investments/new" element={<AddInvestmentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
    </CurrencyProvider>
  );
}

export default App;
