
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { type BasicEmailTestResult } from './types';

interface BasicEmailTestFormProps {
  email: string;
  setEmail: (email: string) => void;
  onResultsChange: (results: BasicEmailTestResult | null) => void;
}

export const BasicEmailTestForm = ({ email, setEmail, onResultsChange }: BasicEmailTestFormProps) => {
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    if (!email || !email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, insira um endereço de email válido.",
        variant: "destructive"
      });
      
      onResultsChange({
        success: false,
        error: "Endereço de email inválido"
      });
      
      return;
    }

    setIsSending(true);
    onResultsChange(null);
    
    try {
      const response = await supabase.functions.invoke('test-email', {
        body: { email }
      });
      
      console.log('Test email response:', response);
      
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao enviar email de teste');
      }
      
      // Store detailed results for troubleshooting
      onResultsChange({
        success: response.data?.success || false,
        message: response.data?.message,
        error: response.data?.error,
        details: response.data
      });
      
      if (response.data?.success) {
        toast({
          title: "Email enviado com sucesso",
          description: `Um email de teste foi enviado para ${email}. Verifique sua caixa de entrada.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Falha ao enviar email",
          description: response.data?.error || 'Erro desconhecido ao enviar email',
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error testing email:', error);
      
      onResultsChange({
        success: false,
        error: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
        details: error
      });
      
      toast({
        title: "Erro ao enviar email de teste",
        description: error instanceof Error ? error.message : 'Ocorreu um erro inesperado',
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="test-email" className="text-sm font-medium">
          Email para teste
        </label>
        <input
          id="test-email"
          type="email"
          className="w-full p-2 border rounded-md"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      <Button 
        onClick={handleTestEmail} 
        disabled={isSending}
        className="w-full"
      >
        {isSending ? 'Enviando...' : 'Enviar Email de Teste'}
      </Button>
    </div>
  );
};
