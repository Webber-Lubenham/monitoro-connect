
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { isValidMapboxToken } from "../utils/mapboxConfig";

interface MapTokenInputProps {
  onTokenSubmit: (token: string) => void;
}

const MapTokenInput = ({ onTokenSubmit }: MapTokenInputProps) => {
  const [token, setToken] = useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidMapboxToken(token)) {
      toast({
        title: "Token Inválido",
        description: "Por favor, insira um token Mapbox válido. Ele deve começar com 'pk.'",
        variant: "destructive",
      });
      return;
    }
    
    onTokenSubmit(token);
    toast({
      title: "Token Aplicado",
      description: "O mapa será recarregado com o novo token.",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white p-4 rounded-lg border shadow-sm">
      <div className="text-sm font-medium mb-2">
        Insira seu token público do Mapbox:
      </div>
      <Input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="pk.eyJ1..."
        className="text-xs"
      />
      <div className="text-xs text-gray-500 mt-1">
        Encontre seu token no <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">painel do Mapbox</a>
      </div>
      <Button type="submit" size="sm" className="w-full mt-2">
        Aplicar Token
      </Button>
    </form>
  );
};

export default MapTokenInput;
