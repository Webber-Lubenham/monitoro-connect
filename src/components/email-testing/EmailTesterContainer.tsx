
import { useState } from "react";
import { EmailTestActions } from "./EmailTestActions";
import { EmailTestResults } from "./EmailTestResults";
import { EmailDiagnosticTools } from "./EmailDiagnosticTools";
import { type EmailTestResult } from "./types";
import { PayloadInspector } from "./PayloadInspector";

export const EmailTesterContainer = () => {
  const [results, setResults] = useState<EmailTestResult | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Testador de Sistema de Email</h2>
      <p className="text-muted-foreground">
        Use esta ferramenta para testar e depurar o sistema de envio de emails.
      </p>
      
      <EmailDiagnosticTools />
      
      <div className="grid gap-6">
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">Ações de Teste</h3>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              {showAdvanced ? "Ocultar opções avançadas" : "Mostrar opções avançadas"}
            </button>
          </div>
          <EmailTestActions onResultsChange={setResults} />
        </div>
        
        {showAdvanced && <PayloadInspector />}
        
        {results && (
          <div className="flex flex-col space-y-4">
            <h3 className="text-xl font-semibold">Resultados</h3>
            <EmailTestResults results={results} />
          </div>
        )}
      </div>
    </div>
  );
};
