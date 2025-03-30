
import { GeolocationPositionError } from "../locationTypes";

export const handleLocationError = (
  error: GeolocationPositionError,
  onError: (message: string) => void,
  onStopSharing: () => void
): string => {
  console.error("Geolocation error:", error);
  let message: string;
  
  switch (error.code) {
    case error.PERMISSION_DENIED:
      message = "Permissão de localização negada. Verifique as permissões do seu navegador.";
      break;
    case error.POSITION_UNAVAILABLE:
      message = "Informação de localização indisponível. Verifique se o GPS está ativado e se você está em uma área com boa cobertura.";
      break;
    case error.TIMEOUT:
      message = "Tempo esgotado ao obter localização precisa. Usando localização aproximada baseada no IP.";
      break;
    default:
      message = `Erro desconhecido: ${error.message}`;
  }
  
  // For timeout errors, we'll try the fallback instead of stopping sharing
  if (error.code !== error.TIMEOUT) {
    onError(message);
    onStopSharing();
  } else {
    onError(message);
    // Don't stop sharing for timeout errors, let the fallback handler take over
  }
  
  return message;
};
