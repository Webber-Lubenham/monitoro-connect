
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { testEmailDelivery } from '@/services/email/emailService';

interface TestEdgeFunctionButtonProps {
  email?: string; // Email opcional para teste
}

const TestEdgeFunctionButton: React.FC<TestEdgeFunctionButtonProps> = ({ email = 'test@example.com' }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTest = async () => {
    setIsLoading(true);
    try {
      const result = await testEmailDelivery(email);
      
      if (result.success) {
        toast({
          title: "Teste enviado com sucesso",
          description: `A função edge foi chamada com sucesso para o email ${email}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao testar função edge",
          description: result.error || "Ocorreu um erro desconhecido",
        });
      }
    } catch (error) {
      console.error("Erro ao testar função edge:", error);
      toast({
        variant: "destructive",
        title: "Erro ao testar função edge",
        description: error instanceof Error ? error.message : "Ocorreu um erro desconhecido",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleTest} 
      variant="outline" 
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Testando...
        </>
      ) : (
        'Testar Função Edge'
      )}
    </Button>
  );
};

export default TestEdgeFunctionButton;
