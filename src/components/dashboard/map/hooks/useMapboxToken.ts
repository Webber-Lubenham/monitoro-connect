
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/ui/use-toast";
import { 
  MAPBOX_TOKEN, 
  isValidMapboxToken,
  getMapboxTokenFromEdgeFunction
} from "../utils/mapboxConfig";

export const useMapboxToken = () => {
  const [mapboxToken, setMapboxToken] = useState<string>(MAPBOX_TOKEN);
  const [hasTokenError, setHasTokenError] = useState<boolean>(false);
  const tokenFetchAttemptedRef = useRef<boolean>(false);
  const { toast } = useToast();
  
  // Fetch Mapbox token from edge function if the env token is invalid
  useEffect(() => {
    const fetchMapboxToken = async () => {
      if (tokenFetchAttemptedRef.current) return;
      tokenFetchAttemptedRef.current = true;
      
      console.log('Verificando token Mapbox:', mapboxToken ? `${mapboxToken.substring(0, 8)}...` : 'Token não disponível');
      
      if (isValidMapboxToken(mapboxToken)) {
        console.log('Token Mapbox da env é válido, usando-o');
        setMapboxToken(mapboxToken);
        return;
      }
      
      try {
        console.log('Tentando obter token Mapbox válido da edge function...');
        const token = await getMapboxTokenFromEdgeFunction();
        
        if (isValidMapboxToken(token)) {
          console.log('Token Mapbox obtido com sucesso da edge function');
          setMapboxToken(token);
        } else {
          console.error('Token Mapbox obtido da edge function é inválido');
          setHasTokenError(true);
          toast({
            title: "Erro de Configuração",
            description: "Não foi possível obter um token Mapbox válido. Por favor configure o token no painel do administrador.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error('Erro ao obter token Mapbox:', error);
        setHasTokenError(true);
        toast({
          title: "Erro de Configuração",
          description: "Não foi possível obter o token Mapbox. Verifique a conexão ou contate o administrador.",
          variant: "destructive",
        });
      }
    };
    
    fetchMapboxToken();
  }, [toast, mapboxToken]);

  return { mapboxToken, hasTokenError };
};
