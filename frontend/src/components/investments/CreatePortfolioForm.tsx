import { useState } from "react";
import { useMutation } from "@apollo/client";
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
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
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
      <Button type="submit" disabled={loading} size="md">
        Create
      </Button>
      <Button type="button" variant="secondary" size="md" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
}
