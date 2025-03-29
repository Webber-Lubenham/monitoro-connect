
import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

const EmergencyButton = () => {
  const [emergencyPressed, setEmergencyPressed] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEmergencyPress = () => {
    setConfirmDialogOpen(true);
  };

  const confirmEmergency = () => {
    setEmergencyPressed(true);
    setConfirmDialogOpen(false);
    toast({
      title: "Alerta de emergência enviado",
      description: "Todos os seus responsáveis foram notificados.",
      variant: "destructive",
    });
  };

  const cancelEmergency = () => {
    setEmergencyPressed(false);
    toast({
      title: "Alerta de emergência cancelado",
      description: "Seus responsáveis foram notificados que você está bem.",
    });
  };

  return (
    <>
      {emergencyPressed ? (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-medium">Alerta de emergência ativo</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30"
              onClick={cancelEmergency}
            >
              <X className="h-4 w-4 mr-1" />
              Cancelar
            </Button>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            Seus responsáveis foram notificados e estão visualizando sua localização em tempo real.
          </p>
        </div>
      ) : (
        <Button 
          variant="outline" 
          className="w-full h-14 text-lg bg-white border-red-300 text-red-700 hover:bg-red-50 dark:bg-gray-900 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
          onClick={handleEmergencyPress}
        >
          <AlertTriangle className="h-5 w-5 mr-2" />
          Botão de Emergência
        </Button>
      )}

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600 dark:text-red-400 flex items-center justify-center gap-2">
              <AlertTriangle />
              Confirmação de Emergência
            </DialogTitle>
            <DialogDescription className="text-center pt-2">
              Ao confirmar, um alerta será enviado para todos os seus responsáveis cadastrados junto com sua localização atual.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p className="text-center font-medium">Você está em uma situação de emergência?</p>
          </div>
          <DialogFooter className="sm:justify-center gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={confirmEmergency}
            >
              Confirmar Emergência
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmergencyButton;
