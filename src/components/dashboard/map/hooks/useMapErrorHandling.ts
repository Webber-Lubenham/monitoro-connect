
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Location, isLocationUsable } from "../utils/locationUtils";

interface UseMapErrorHandlingProps {
  location: Location | null;
  operation: string;
  error?: Error | null;
}

export const useMapErrorHandling = ({
  location,
  operation,
  error
}: UseMapErrorHandlingProps) => {
  const { toast } = useToast();
  
  useEffect(() => {
    if (!error) return;
    
    console.error(`Erro ao ${operation}:`, error);
    toast({
      title: "Erro na Localização",
      description: `Não foi possível ${operation}.`,
      variant: "destructive",
    });
  }, [error, operation, toast]);
  
  useEffect(() => {
    if (!location) return;
    
    if (!isLocationUsable(location)) {
      console.warn(`Ignorando localização inválida para ${operation}:`, location);
    }
  }, [location, operation]);
};
