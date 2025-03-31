
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { handleLogout } from '@/utils/authUtils';

export const StudentHeader = () => {
  const { toast } = useToast();

  const onLogout = async () => {
    try {
      toast({
        title: "Saindo do sistema",
        description: "Você será redirecionado em instantes...",
      });
      
      const success = await handleLogout();
      
      if (!success) {
        throw new Error("Falha no processo de logout");
      }
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
