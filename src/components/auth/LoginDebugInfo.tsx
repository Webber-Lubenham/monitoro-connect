
interface LoginDebugInfoProps {
  debugMode: boolean;
  debugInfo: any;
}

export const LoginDebugInfo = ({ debugMode, debugInfo }: LoginDebugInfoProps) => {
  if (!debugMode || !debugInfo) {
    return null;
  }

  return (
    <div className="mt-4 p-3 border border-gray-200 rounded bg-gray-50 text-xs overflow-auto max-h-40">
      <h3 className="font-bold mb-1">Informações de depuração:</h3>
      <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
    </div>
  );
};
