
import { type BasicEmailTestResult } from "./types";

interface BasicEmailTestResultsProps {
  testResult: BasicEmailTestResult | null;
}

export const BasicEmailTestResults = ({ testResult }: BasicEmailTestResultsProps) => {
  if (!testResult) return null;

  return (
    <div className={`p-4 rounded-md mt-4 ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
      <p className="font-medium">{testResult.success ? "✅ Sucesso" : "❌ Falha"}</p>
      {testResult.message && <p className="text-sm mt-1">{testResult.message}</p>}
      {testResult.error && <p className="text-sm mt-1 font-mono bg-red-100 p-2 rounded overflow-auto">{testResult.error}</p>}
      {testResult.details && (
        <div className="mt-2">
          <p className="text-sm font-medium">Detalhes:</p>
          <pre className="text-xs mt-1 bg-gray-100 p-2 rounded overflow-auto">{JSON.stringify(testResult.details, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
