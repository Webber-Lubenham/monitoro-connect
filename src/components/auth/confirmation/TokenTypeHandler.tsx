
import { GuardianSignupForm } from '@/components/auth/GuardianSignupForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ConfirmationInvalid } from './ConfirmationInvalid';
import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface TokenTypeHandlerProps {
  tokenType: string | null;
  token: string | null;
  email: string | null;
  onSuccess: () => void;
}

export const TokenTypeHandler = ({ tokenType, token, email, onSuccess }: TokenTypeHandlerProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (tokenType === 'signup') {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Confirmar Email</h2>
        
        <div className="flex flex-col gap-4">
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
            <CheckCircle2 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-center text-blue-700">
              Sua conta foi ativada com sucesso.
            </p>
          </div>
          
          <Button className="w-full" onClick={() => navigate('/dashboard')}>
            Ir para o dashboard
          </Button>
          
          <Button variant="outline" className="w-full" onClick={() => navigate('/')}>
            Voltar para login
          </Button>
        </div>
      </Card>
    );
  }
  
  if (tokenType === 'reset' && token && email) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">Redefinir Senha</h2>
        
        <div className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Digite sua nova senha"
            className="p-2 border border-gray-300 rounded-md"
          />
          <input
            type="password"
            placeholder="Confirme sua nova senha"
            className="p-2 border border-gray-300 rounded-md"
          />
          <Button 
            className="w-full"
            onClick={() => {
              toast({
                title: "Funcionalidade em desenvolvimento",
                description: "A redefinição de senha será implementada em breve."
              });
              navigate('/', { replace: true });
            }}
          >
            Redefinir senha
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => navigate('/', { replace: true })}
          >
            Cancelar
          </Button>
        </div>
      </Card>
    );
  }
  
  if (tokenType === 'guardian' && token && email) {
    return (
      <GuardianSignupForm 
        token={token}
        email={email}
        onSuccess={onSuccess}
      />
    );
  }
  
  if (tokenType === 'error' || !tokenType) {
    return <ConfirmationInvalid />;
  }
  
  return <ConfirmationInvalid />;
};
