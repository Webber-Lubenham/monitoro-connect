import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { NotificationPreference } from "@/types/database.types";

interface SupabaseNotificationPreference {
  id: string;
  notification_type: 'whatsapp' | 'email' | 'both' | null;
  whatsapp_number: string | null;
  email: string;
  student_id: string;
  parent_id: string;
  created_at: string | null;
  updated_at: string | null;
}

const NotificationPreferences = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }

      console.log("Loading preferences for parent ID:", user.id);

      const { data: prefsData, error } = await supabase
        .from('parent_notification_preferences')
        .select('*')
        .eq('parent_id', user.id);

      if (error) {
        console.error("Error fetching preferences:", error);
        throw error;
      }
      
      console.log("Preferences data received:", prefsData);
      
      const processedPrefs: NotificationPreference[] = (prefsData || []).map((pref: SupabaseNotificationPreference) => ({
        id: pref.id,
        notification_type: pref.notification_type || 'email', // Default to 'email' if null
        whatsapp_number: pref.whatsapp_number || '',
        email: pref.email,
        student_id: pref.student_id,
        created_at: pref.created_at || '',
        updated_at: pref.updated_at || ''
      }));
      
      setPreferences(processedPrefs);
    } catch (error) {
      console.error('Erro ao carregar preferências:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível carregar suas preferências de notificação",
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (studentId: string, data: Partial<Omit<NotificationPreference, 'id' | 'student_id'>>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const currentPref = preferences.find(p => p.student_id === studentId);
      
      const updateData = {
        student_id: studentId,
        parent_id: user.id,
        email: data.email || currentPref?.email || user.email || '',
        notification_type: data.notification_type || currentPref?.notification_type || 'email',
        ...(data.whatsapp_number !== undefined && { whatsapp_number: data.whatsapp_number || null }),
      };

      const { error } = await supabase
        .from('parent_notification_preferences')
        .upsert(updateData);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Preferências de notificação atualizadas",
      });

      loadPreferences();
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar suas preferências",
      });
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <p>Carregando...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF] p-4 md:p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Preferências de Notificação</h1>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Voltar
          </Button>
        </div>

        {preferences.map((pref) => (
          <Card key={pref.id} className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Bell className="h-5 w-5 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-4">Como você quer receber as notificações?</h3>
                  <RadioGroup
                    value={pref.notification_type}
                    onValueChange={(value: 'whatsapp' | 'email' | 'both') => 
                      updatePreference(pref.student_id, { notification_type: value })
                    }
                    className="space-y-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id={`email-${pref.id}`} />
                      <Label htmlFor={`email-${pref.id}`}>Apenas Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="whatsapp" id={`whatsapp-${pref.id}`} />
                      <Label htmlFor={`whatsapp-${pref.id}`}>Apenas WhatsApp</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="both" id={`both-${pref.id}`} />
                      <Label htmlFor={`both-${pref.id}`}>Email e WhatsApp</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  <Label htmlFor={`email-input-${pref.id}`}>Email para notificações</Label>
                </div>
                <Input
                  id={`email-input-${pref.id}`}
                  type="email"
                  value={pref.email}
                  onChange={(e) => updatePreference(pref.student_id, { email: e.target.value })}
                  placeholder="seu@email.com"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  <Label htmlFor={`whatsapp-input-${pref.id}`}>Número do WhatsApp</Label>
                </div>
                <Input
                  id={`whatsapp-input-${pref.id}`}
                  type="tel"
                  value={pref.whatsapp_number || ''}
                  onChange={(e) => updatePreference(pref.student_id, { whatsapp_number: e.target.value })}
                  placeholder="(11) 98765-4321"
                />
              </div>
            </div>
          </Card>
        ))}

        {preferences.length === 0 && (
          <Card className="p-6 text-center">
            <p className="text-gray-600">
              Nenhuma preferência de notificação configurada ainda.
              Entre em contato com a escola para vincular seus filhos à sua conta.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NotificationPreferences;
