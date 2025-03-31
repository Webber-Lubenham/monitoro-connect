
import { Button } from "@/components/ui/button";
import { Loader2, Mail, RefreshCw } from "lucide-react";

export interface NotificationActionsProps {
  onNotify: () => Promise<void>;
  onUpdateLocation: () => void;
  loading: boolean;
  locationAvailable: boolean;
  guardiansAvailable: boolean;
}

export const NotificationActions = ({
  onNotify,
  onUpdateLocation,
  loading,
  locationAvailable,
  guardiansAvailable,
}: NotificationActionsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        onClick={onNotify}
        disabled={loading || !guardiansAvailable || !locationAvailable}
        variant="default"
        className="flex-1"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Enviando notificações...</span>
          </>
        ) : (
          <>
            <Mail className="mr-2 h-4 w-4" />
            <span>Notificar por E-mail</span>
          </>
        )}
      </Button>

      <Button
        onClick={onUpdateLocation}
        disabled={loading}
        variant="outline"
        title="Atualizar localização atual"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
