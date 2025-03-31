
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/ui/use-toast.ts";
import { supabase } from "../integrations/supabase/client.ts";
import { PrivacySettings } from "../components/dashboard/PrivacySettings.tsx";
import type { PrivacySettings as PrivacySettingsType } from "../lib/privacySettings.ts";
import { defaultPrivacySettings } from "../lib/privacySettings.ts";
import { Card } from "../components/ui/card.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import LocationCard from "../components/dashboard/LocationCard.tsx";
import NotificationCard from "../components/dashboard/NotificationCard.tsx";

// Instead of redefining geolocation interfaces, we'll use the standard DOM types

const Dashboard = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType>(defaultPrivacySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    let sessionCheckAttempts = 0;
    const MAX_ATTEMPTS = 3;

    const checkSessionAndLocation = async () => {
      try {
        setIsLoading(true);
        sessionCheckAttempts++;
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          
          if (sessionCheckAttempts >= MAX_ATTEMPTS) {
            if (isMounted) {
              setHasError(true);
              setIsLoading(false);
              toast({
                title: "Erro de conexão",
                description: "Não foi possível verificar sua sessão. Tente novamente mais tarde.",
                variant: "destructive",
              });
            }
          } else {
            // Try again in 2 seconds (with increasing delay)
            setTimeout(checkSessionAndLocation, 2000 * sessionCheckAttempts);
          }
          return;
        }
        
        if (!session) {
          if (isMounted) {
            console.log("No session found, redirecting to login");
            navigate('/');
          }
          return;
        }

        // Check if geolocation is supported
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              if (isMounted) {
                const newLocation = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  accuracy: position.coords.accuracy
                };
                setLocation(newLocation);
                setIsLoading(false);
              }
            },
            (error) => {
              console.error("Error getting location:", error);
              if (isMounted) {
                setIsLoading(false);
                toast({
                  title: "Erro de localização",
                  description: "Não foi possível obter sua localização. Verifique as permissões do navegador.",
                  variant: "destructive",
                });
              }
            },
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0
            }
          );
        } else {
          if (isMounted) {
            setIsLoading(false);
            toast({
              title: "Localização não suportada",
              description: "Seu navegador não suporta geolocalização.",
              variant: "destructive",
            });
          }
        }

        try {
          const { error } = await supabase
            .from('parent_notification_preferences')
            .select('*')
            .eq('student_id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error("Error loading preferences:", error);
            // Don't show error toast since this is optional
          }
        } catch (error) {
          console.error("Error loading preferences:", error);
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        if (isMounted) {
          setIsLoading(false);
          setHasError(true);
          toast({
            title: "Erro",
            description: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      }
    };

    checkSessionAndLocation();

    return () => {
      isMounted = false;
    };
  }, [navigate, toast]);

  const handleLocationUpdate = (newLocation: { latitude: number; longitude: number; accuracy?: number }) => {
    setLocation(newLocation);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF]">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F2FCE2] to-[#E5DEFF]">
        <div className="max-w-md p-6 bg-white rounded-lg shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">Erro de conexão</h2>
          <p className="mb-4">Não foi possível conectar ao servidor. Verifique sua conexão com a internet.</p>
          <button 
            onClick={() => globalThis.location.reload()} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <LocationCard 
        location={location}
        locationError={hasError ? "Erro ao obter localização" : null}
        onLocationUpdate={handleLocationUpdate}
      />
      
      <Card className="p-6 border-none bg-white/80 backdrop-blur-sm">
        <PrivacySettings 
          initialSettings={{
            startTime: privacySettings.sharingSchedule?.startTime || "",
            endTime: privacySettings.sharingSchedule?.endTime || "",
          }}
          onSave={(schedule: { startTime: string; endTime: string }) => {
            const newSettings: PrivacySettingsType = {
              ...privacySettings,
              sharingSchedule: schedule,
            };
            setPrivacySettings(newSettings);
          }}
        />
      </Card>
      
      <NotificationCard location={location} />
    </DashboardLayout>
  );
};

export default Dashboard;
