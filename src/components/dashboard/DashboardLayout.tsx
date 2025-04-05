
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, LogOut, MapPin, Bell } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { handleLogout } from "@/utils/authUtils";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const navigate = useNavigate();
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
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Sistema Monitore</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => navigate('/profile')}
              className="transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Button>
            <Button
              variant="outline"
              onClick={onLogout}
              className="transition-all duration-300 hover:text-red-600"
              size="sm"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
