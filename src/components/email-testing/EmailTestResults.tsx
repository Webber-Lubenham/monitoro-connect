
import { type EmailTestResult } from "./types";

interface EmailTestResultsProps {
  results: EmailTestResult | null;  // Changed from testResult to results to match usage
}

export const EmailTestResults = ({ results }: EmailTestResultsProps) => {
  if (!results) return null;

  return (
    <div className={`p-4 rounded-md mt-4 ${results.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      <p className="font-medium">{results.success ? "✅ Sucesso" : "❌ Falha"}</p>
      {results.message && <p className="text-sm mt-1">{results.message}</p>}
      {results.error && <p className="text-sm mt-1 font-mono bg-red-100 p-2 rounded overflow-auto">{results.error}</p>}
      {results.details && (
        <div className="mt-2">
          <p className="text-sm font-medium">Detalhes:</p>
          <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(results.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
