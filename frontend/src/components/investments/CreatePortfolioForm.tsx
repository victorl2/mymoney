import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { CREATE_PORTFOLIO } from "../../graphql/mutations/investments";
import Button from "../ui/Button";
import Input from "../ui/Input";

interface CreatePortfolioFormProps {
  onCreated: () => void;
  onCancel: () => void;
}

export default function CreatePortfolioForm({ onCreated, onCancel }: CreatePortfolioFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createPortfolio, { loading }] = useMutation(CREATE_PORTFOLIO);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    await createPortfolio({
      variables: { input: { name, description: description || null } },
    });
    onCreated();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, var(--accent-gain) 0%, var(--chart-3) 100%)",
          }}
        >
          <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-display text-lg font-bold text-[var(--text-primary)]">Create Portfolio</h3>
          <p className="text-xs text-[var(--text-muted)]">Give your new portfolio a name</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Input
          label="Portfolio Name"
          placeholder="e.g., Retirement"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Description (optional)"
          placeholder="Long-term investments"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={loading || !name.trim()}>
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating...
            </span>
          ) : (
            "Create Portfolio"
          )}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
