import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AddExpensePage from "./pages/AddExpensePage";
import InvestmentsPage from "./pages/InvestmentsPage";
import AddInvestmentPage from "./pages/AddInvestmentPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expenses/new" element={<AddExpensePage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
        <Route path="/investments/new" element={<AddInvestmentPage />} />
      </Route>
    </Routes>
  );
}

export default App;
