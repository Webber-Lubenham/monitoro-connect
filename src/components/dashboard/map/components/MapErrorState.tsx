
import React, { useState } from 'react';
import { AlertTriangle, RefreshCw, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MapTokenInput from './MapTokenInput';

interface MapErrorStateProps {
  onTokenUpdate?: (token: string) => void;
}

const MapErrorState: React.FC<MapErrorStateProps> = ({ onTokenUpdate }) => {
  const [showTokenInput, setShowTokenInput] = useState(false);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleTokenSubmit = (token: string) => {
    if (onTokenUpdate) {
      onTokenUpdate(token);
    }
    // Armazenar localmente para recarregar
    localStorage.setItem('mapbox_token', token);
    // Recarregar a página para aplicar
    window.location.reload();
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-600 rounded-xl">
      <div className="text-center p-4 max-w-md">
        <AlertTriangle className="h-12 w-12 mx-auto mb-2 text-red-500" />
        <h3 className="font-semibold text-lg">Erro no carregamento do mapa</h3>
        <p className="mt-1 mx-auto">Não foi possível carregar o mapa devido a um problema de autenticação com o serviço do Mapbox.</p>
        
        <div className="mt-3 text-sm text-gray-500">
          <p>Possíveis causas:</p>
          <ul className="list-disc text-left pl-5 mt-1">
            <li>Token Mapbox inválido ou expirado</li>
            <li>Problema de conectividade com o serviço Mapbox</li>
            <li>Erro de comunicação com a função de backend</li>
          </ul>
        </div>
        
        {showTokenInput ? (
          <div className="mt-4">
            <MapTokenInput onTokenSubmit={handleTokenSubmit} />
            <button 
              onClick={() => setShowTokenInput(false)}
              className="mt-2 text-sm text-gray-500 underline"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <div className="mt-4 flex flex-col space-y-2">
            <Button 
              onClick={handleRefresh}
              className="bg-blue-500 hover:bg-blue-600 text-white flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Button>
            
            <Button 
              onClick={() => setShowTokenInput(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Key className="h-4 w-4" />
              Inserir token manualmente
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs bg-gray-200 p-3 rounded-md">
          <p>Nota para administradores: Verifique se o token Mapbox está configurado corretamente nas secrets da edge function e no arquivo .env.</p>
        </div>
      </div>
    </div>
  );
};

export default MapErrorState;
