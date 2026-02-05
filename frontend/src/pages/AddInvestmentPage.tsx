import { useSearchParams } from "react-router-dom";
import AssetForm from "../components/investments/AssetForm";

export default function AddInvestmentPage() {
  const [searchParams] = useSearchParams();
  const portfolioId = searchParams.get("portfolioId") ?? "";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Asset</h1>
      {portfolioId ? (
        <AssetForm portfolioId={portfolioId} />
      ) : (
        <p className="text-gray-500">No portfolio selected. Go back and select a portfolio first.</p>
      )}
    </div>
  );
}
