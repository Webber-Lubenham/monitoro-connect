
import React from 'react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ConfirmationErrorProps {
  error: string;
}

export const ConfirmationError = ({ error }: ConfirmationErrorProps) => {
  const navigate = useNavigate();
  
  // Check if error is about an expired token
  const isExpiredToken = error.toLowerCase().includes('expirou') || error.toLowerCase().includes('expired');
  // Check if error is about an invalid token
  const isInvalidToken = error.toLowerCase().includes('inválido') || error.toLowerCase().includes('invalid');
  // Check if error is about connection issues
  const isConnectionError = error.toLowerCase().includes('conexão') || error.toLowerCase().includes('rede') || 
                            error.toLowerCase().includes('connection') || error.toLowerCase().includes('network');
  
  const handleLoginClick = () => {
    navigate('/', { replace: true });
  };
  
  const handleResendClick = () => {
    // Redirect to login page with resend parameter
    navigate('/?resend=true', { replace: true });
  };
  
  return (
    <Card className="p-8 max-w-md w-full shadow-md">
      <div className="bg-red-100 text-red-700 p-4 rounded-md mb-6">
        <AlertTriangle className="h-10 w-10 mx-auto mb-2" />
        <h2 className="text-xl font-semibold text-center mb-2">Erro na Confirmação</h2>
        <p className="text-center">{error}</p>
      </div>
      
      <div className="space-y-4">
        {isExpiredToken && (
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Dica</p>
            <p className="text-blue-600">
              Links de confirmação geralmente expiram em 24 horas. Você precisa solicitar um novo link 
              na tela de login.
            </p>
          </div>
        )}
        
        {isInvalidToken && (
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
            <p className="font-medium text-blue-700 mb-1">Dica</p>
            <p className="text-blue-600">
              O link que você utilizou parece ser inválido. Certifique-se de que está usando o 
              link mais recente enviado para seu email.
            </p>
          </div>
        )}
        
        {isConnectionError && (
          <div className="bg-yellow-50 p-4 rounded-md mb-4 text-sm">
            <p className="font-medium text-yellow-700 mb-1">Problemas de Conexão</p>
            <p className="text-yellow-600">
              Parece haver problemas com sua conexão. Verifique se você está conectado à internet
              e tente novamente.
            </p>
          </div>
        )}
        
        {isExpiredToken && (
          <Button 
            className="w-full mb-2" 
            onClick={handleResendClick}
            variant="default"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Solicitar novo link
          </Button>
        )}
        
        <Button 
          className="w-full" 
          onClick={handleLoginClick}
          variant={isExpiredToken ? "outline" : "default"}
        >
          Voltar para a página inicial
        </Button>
        
        <div className="text-center text-sm text-gray-500 mt-4">
          <p>Precisa de ajuda? Entre em contato com o suporte.</p>
        </div>
      </div>
    </Card>
  );
};
