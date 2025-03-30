
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { MapPin, Bell, LogOut, Users, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ParentDashboard = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          window.location.href = '/';
          return;
        }
        
        // Fetch children data for this parent
        const { data, error } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', session.user.id);
          
        if (error) {
          console.error("Error fetching children:", error);
          toast({
            title: "Erro",
            description: "Não foi possível carregar os dados dos seus filhos.",
            variant: "destructive",
          });
        } else {
          setChildren(data || []);
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, [navigate, toast]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Saindo do sistema",
        description: "Você será redirecionado em instantes...",
      });
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Erro",
        description: "Não foi possível fazer logout.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel do Responsável</h1>
          <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sair
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center justify-center p-4 space-y-3">
              <Users className="h-10 w-10 text-primary" />
              <h3 className="font-medium text-lg">Estudantes</h3>
              <p className="text-3xl font-bold">{children.length}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/students')}
              >
                Gerenciar Estudantes
              </Button>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center justify-center p-4 space-y-3">
              <MapPin className="h-10 w-10 text-green-500" />
              <h3 className="font-medium text-lg">Localização</h3>
              <p className="text-sm text-center">Acompanhe a localização dos seus filhos em tempo real</p>
              <Button 
                className="w-full"
                onClick={() => navigate('/locations')}
              >
                Ver no Mapa
              </Button>
            </div>
          </Card>

          <Card className="p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col items-center justify-center p-4 space-y-3">
              <Bell className="h-10 w-10 text-amber-500" />
              <h3 className="font-medium text-lg">Notificações</h3>
              <p className="text-sm text-center">Configure como deseja receber alertas</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate('/notifications')}
              >
                Configurar Notificações
              </Button>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Estudantes Registrados</h2>
          {children.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nenhum estudante registrado ainda.</p>
              <Button className="mt-4" onClick={() => navigate('/register-student')}>
                Registrar Estudante
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <Card key={child.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{child.name}</h3>
                      <p className="text-sm text-gray-500">
                        {child.grade || "Série não informada"} • {child.school_id ? "Escola registrada" : "Escola não informada"}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate(`/student/${child.id}`)}>
                      Detalhes
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Atividade Recente</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm">Sem atividades recentes para mostrar.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ParentDashboard;
