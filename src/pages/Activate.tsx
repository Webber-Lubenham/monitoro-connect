
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Activate = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const type = searchParams.get('type');
  const email = searchParams.get('email');
  const temp = searchParams.get('temp');
  
  useEffect(() => {
    // Validate parameters
    if (!type || !email || !temp) {
      toast({
        variant: "destructive",
        title: "Link inválido",
        description: "O link de ativação está incompleto ou inválido.",
      });
      return;
    }
    
    // Redirect to the confirmation page with appropriate params
    if (type === 'guardian') {
      navigate(`/guardian-confirm?token=${temp}&email=${email}`, { replace: true });
    } else {
      navigate(`/confirm?type=${type}&token=${temp}&email=${email}`, { replace: true });
    }
  }, [type, email, temp, navigate, toast]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary p-4">
      <Card className="p-6 text-center w-full max-w-md">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Redirecionando...</h2>
        <p className="text-gray-600">Aguarde enquanto processamos sua solicitação.</p>
      </Card>
    </div>
  );
};

export default Activate;
