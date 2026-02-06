import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { GET_EXPENSE } from "../graphql/queries/expenses";
import ExpenseForm from "../components/expenses/ExpenseForm";

export default function EditExpensePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useQuery(GET_EXPENSE, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="animate-fade-up max-w-xl">
        <div className="mb-8">
          <div className="h-4 w-32 bg-[var(--bg-elevated)] rounded shimmer mb-4" />
          <div className="h-10 w-48 bg-[var(--bg-elevated)] rounded shimmer mb-2" />
          <div className="h-4 w-40 bg-[var(--bg-elevated)] rounded shimmer" />
        </div>
        <div className="h-96 bg-[var(--bg-elevated)] rounded-2xl shimmer" />
      </div>
    );
  }

  if (error || !data?.expense) {
    return (
      <div className="animate-fade-up max-w-xl">
        <div className="mb-8">
          <button
            onClick={() => navigate("/expenses")}
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Expenses
          </button>
        </div>
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-[var(--bg-elevated)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-lg font-medium text-[var(--text-primary)] mb-1">Expense not found</p>
          <p className="text-sm text-[var(--text-muted)]">The expense you're looking for doesn't exist</p>
        </div>
      </div>
    );
  }

  return <ExpenseForm expense={data.expense} />;
}
