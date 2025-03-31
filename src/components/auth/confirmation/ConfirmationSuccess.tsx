
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const ConfirmationSuccess = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-8 max-w-md w-full text-center">
      <div className="bg-green-100 text-green-700 p-4 rounded-md mb-6">
        <h2 className="text-xl font-medium mb-2">Sucesso!</h2>
        <p>Sua conta foi criada com sucesso. Você será redirecionado para a página de login em instantes.</p>
      </div>
      <Button onClick={() => navigate('/')}>Ir para a página inicial</Button>
    </Card>
  );
};
