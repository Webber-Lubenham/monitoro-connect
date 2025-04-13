
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export const StudentHeader = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const onLogout = async () => {
    try {
      toast({
        title: "Saindo do sistema",
        description: "Você será redirecionado em instantes...",
      });
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      navigate('/login');
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro ao sair",
        description: "Não foi possível sair do sistema. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-900">Sistema Monitore</h1>
      <Button
        variant="ghost"
        onClick={onLogout}
        className="text-gray-600 hover:text-red-600"
      >
        <LogOut className="w-5 h-5 mr-2" />
        Sair
      </Button>
    </div>
  );
};

export default StudentHeader;
