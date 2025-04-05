
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { User, LogOut, MapPin, Bell } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Sistema Monitore</h1>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => window.location.href = '/profile'}
              className="transition-all duration-300 hover:scale-105"
              size="sm"
            >
              <User className="mr-2 h-4 w-4" />
              Meu Perfil
            </Button>
            <Button
              variant="outline"
              onClick={signOut}
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
