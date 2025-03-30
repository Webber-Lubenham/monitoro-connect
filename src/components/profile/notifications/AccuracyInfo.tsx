
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { getAccuracyDescription, formatAccuracy, isLowAccuracy } from "./accuracyUtils";

export interface AccuracyInfoProps {
  accuracy: number | null;
  showWarning: boolean;
}

export const AccuracyInfo = ({ accuracy, showWarning }: AccuracyInfoProps) => {
  if (!accuracy) return null;
  
  if (showWarning && isLowAccuracy(accuracy)) {
    return (
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Precisão reduzida</AlertTitle>
        <AlertDescription>
          Sua localização atual tem precisão de aproximadamente {formatAccuracy(accuracy)} ({getAccuracyDescription(accuracy)}). 
          Para melhorar a precisão, certifique-se de que o GPS está ativado e você está em uma área aberta.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="text-sm text-muted-foreground">
      Precisão atual: {formatAccuracy(accuracy)} ({getAccuracyDescription(accuracy)})
    </div>
  );
};
