
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ConfirmationInvalid = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-center mb-4">Token Inválido</h2>
      <p className="text-center mb-6 text-gray-600">
        Este token é inválido ou já expirou. Por favor, solicite um novo link.
      </p>
      <Button 
        className="w-full" 
        onClick={() => navigate('/', { replace: true })}
      >
        Voltar para o início
      </Button>
    </Card>
  );
};
