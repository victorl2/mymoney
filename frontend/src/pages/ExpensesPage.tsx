import { useState } from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import { GET_EXPENSES, GET_CATEGORIES } from "../graphql/queries/expenses";
import ExpenseList from "../components/expenses/ExpenseList";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";

export default function ExpensesPage() {
  const [filter, setFilter] = useState<{
    categoryId?: string;
    search?: string;
  }>({});
  const [offset, setOffset] = useState(0);
  const limit = 10;

  const { data, loading, refetch } = useQuery(GET_EXPENSES, {
    variables: {
      filter: {
        categoryId: filter.categoryId || null,
        search: filter.search || null,
      },
      limit,
      offset,
    },
  });

  const { data: catData } = useQuery(GET_CATEGORIES);
  const categories = catData?.categories ?? [];

  const expenses = data?.expenses?.items ?? [];
  const totalCount = data?.expenses?.totalCount ?? 0;
  const hasMore = data?.expenses?.hasMore ?? false;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
          <p className="text-sm text-gray-500 mt-1">{totalCount} total expenses</p>
        </div>
        <Link to="/expenses/new">
          <Button>Add Expense</Button>
        </Link>
      </div>

      <Card className="mb-6">
        <div className="flex gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search expenses..."
              value={filter.search ?? ""}
              onChange={(e) => {
                setFilter((f) => ({ ...f, search: e.target.value }));
                setOffset(0);
              }}
            />
          </div>
          <Select
            value={filter.categoryId ?? ""}
            onChange={(e) => {
              setFilter((f) => ({ ...f, categoryId: e.target.value || undefined }));
              setOffset(0);
            }}
            options={[
              { value: "", label: "All Categories" },
              ...categories.map((c: { id: string; name: string }) => ({
                value: c.id,
                label: c.name,
              })),
            ]}
          />
        </div>
      </Card>

      <Card>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : (
          <>
            <ExpenseList expenses={expenses} onRefetch={() => refetch()} />
            {totalCount > limit && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-500">
                  {offset + 1}–{Math.min(offset + limit, totalCount)} of {totalCount}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!hasMore}
                  onClick={() => setOffset(offset + limit)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
