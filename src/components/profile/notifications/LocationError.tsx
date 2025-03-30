
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export interface LocationErrorProps {
  error: string | null;
}

export const LocationError = ({ error }: LocationErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Erro de localização</AlertTitle>
      <AlertDescription>
        {error}
      </AlertDescription>
    </Alert>
  );
};
