
import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import LocationSharing from '@/components/dashboard/LocationSharing';
import EmergencyButton from '@/components/dashboard/EmergencyButton';
import NotificationCenter from '@/components/dashboard/NotificationCenter';
import GuardiansList from '@/components/guardians/GuardiansList';

const Index = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-gradient-to-br from-monitoro-50 to-white dark:from-gray-800 dark:to-gray-900 border-monitoro-100 dark:border-gray-700 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 bg-monitoro-100 dark:bg-monitoro-900/20 rounded-lg flex items-center justify-center">
                  <ShieldCheck className="h-8 w-8 text-monitoro-600 dark:text-monitoro-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-monitoro-800 dark:text-monitoro-300">
                    Bem-vindo ao Monitor Connect
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Gerencie seu compartilhamento de localização e mantenha seus responsáveis informados sobre sua segurança.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <LocationSharing />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="card-gradient p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Alerta de Emergência
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Use em situações de risco para notificar todos os seus responsáveis imediatamente.
              </p>
              <EmergencyButton />
            </Card>
            
            <div className="flex flex-col">
              <div className="bg-white dark:bg-gray-800 rounded-lg border p-4 mb-4">
                <h3 className="font-medium">Dica de Segurança</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Mantenha sempre seus dados de contato atualizados para garantir que seus responsáveis possam te encontrar quando necessário.
                </p>
              </div>
              
              <div className="flex-1 bg-gradient-to-br from-monitoro-100 to-white dark:from-monitoro-900/10 dark:to-gray-800 rounded-lg border border-monitoro-200 dark:border-monitoro-800/20 p-4">
                <h3 className="font-medium text-monitoro-800 dark:text-monitoro-300">Status do Sistema</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Compartilhamento:</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Notificações:</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Ativas</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Última sincronização:</span>
                    <span className="text-sm">há 2 minutos</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <GuardiansList />
          <NotificationCenter />
        </div>
      </div>
    </div>
  );
};

export default Index;
