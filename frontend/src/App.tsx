import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">MyMoney</h1>
          <p className="text-gray-600">Expense & Investment Portfolio Tracker</p>
        </div>
      </div>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
        <Route path="/expenses" element={<div>Expenses</div>} />
        <Route path="/expenses/new" element={<div>Add Expense</div>} />
        <Route path="/investments" element={<div>Investments</div>} />
        <Route path="/investments/new" element={<div>Add Investment</div>} />
      </Routes>
    </div>
  )
}

export default App
