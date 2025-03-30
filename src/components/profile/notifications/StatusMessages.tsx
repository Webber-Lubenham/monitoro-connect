
import { Guardian } from "@/types/database.types";

export interface StatusMessagesProps {
  guardians: Guardian[];
  location: { latitude: number; longitude: number } | null;
  locationError: string | null;
}

export const StatusMessages = ({
  guardians,
  location,
  locationError,
}: StatusMessagesProps) => {
  if (guardians.length === 0) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        Cadastre pelo menos um responsável para poder enviar notificações.
      </p>
    );
  }

  if (!location && !locationError) {
    return (
      <p className="text-sm text-muted-foreground mt-4">
        Aguardando obtenção da localização...
      </p>
    );
  }

  return null;
};
