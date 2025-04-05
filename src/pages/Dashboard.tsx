
import React, { useEffect, useState } from "react";
import { useToast } from "../components/ui/use-toast.ts";
import { supabase } from "../lib/supabase.ts";
import { PrivacySettings } from "../components/dashboard/PrivacySettings.tsx";
import type { PrivacySettings as PrivacySettingsType } from "../lib/privacySettings.ts";
import { defaultPrivacySettings } from "../lib/privacySettings.ts";
import { Card } from "../components/ui/card.tsx";
import DashboardLayout from "../components/dashboard/DashboardLayout.tsx";
import LocationCard from "../components/dashboard/LocationCard.tsx";
import NotificationCard from "../components/dashboard/NotificationCard.tsx";
import { useAuth } from "../providers/AuthProvider.tsx";

const Dashboard = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettingsType>(defaultPrivacySettings);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        
        console.log("Dashboard initialized with user:", user?.id);
        
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
          // We're now getting user ID from the auth provider
          if (user?.id) {
            const { error } = await supabase
              .from('profiles')  // Use a table that exists in your schema
              .select('*')
              .eq('id', user.id)
              .maybeSingle();
  
            if (error) {
              console.error("Error loading user profile:", error);
            }
          }
        } catch (error) {
          console.error("Error loading profile:", error);
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

    initializeDashboard();

    return () => {
      isMounted = false;
    };
  }, [toast, user]);

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
