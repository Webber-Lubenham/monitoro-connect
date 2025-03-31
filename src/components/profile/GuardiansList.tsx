
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Guardian } from '@/types/database.types';
import { Button } from '@/components/ui/button';
import { Check, Crown, Loader2, Mail, Trash2, UserCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface GuardiansListProps {
  guardians: Guardian[];
  isLoading: boolean;
  onRemove: (id: string) => Promise<void>;
  onSetPrimary: (id: string) => Promise<void>;
  onSendInvitation?: (id: string) => Promise<void>;
}

export const GuardiansList = ({ 
  guardians, 
  isLoading, 
  onRemove, 
  onSetPrimary,
  onSendInvitation 
}: GuardiansListProps) => {
  const { toast } = useToast();
  const [openDeleteDialog, setOpenDeleteDialog] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingPrimaryId, setSettingPrimaryId] = useState<string | null>(null);
  const [sendingInvitationId, setSendingInvitationId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onRemove(id);
      toast({
        title: "Responsável removido",
        description: "O responsável foi removido com sucesso."
      });
      setOpenDeleteDialog(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao remover",
        description: "Não foi possível remover o responsável. Tente novamente."
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSetPrimary = async (id: string) => {
    setSettingPrimaryId(id);
    try {
      await onSetPrimary(id);
      toast({
        title: "Responsável definido como principal",
        description: "O responsável foi definido como principal com sucesso."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao definir como principal",
        description: "Não foi possível definir o responsável como principal. Tente novamente."
      });
    } finally {
      setSettingPrimaryId(null);
    }
  };

  const handleSendInvitation = async (id: string) => {
    if (!onSendInvitation) return;
    
    setSendingInvitationId(id);
    try {
      await onSendInvitation(id);
      toast({
        title: "Convite enviado",
        description: "O convite foi enviado com sucesso para o responsável."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao enviar convite",
        description: "Não foi possível enviar o convite. Tente novamente."
      });
    } finally {
      setSendingInvitationId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responsáveis Cadastrados</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (guardians.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Responsáveis Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            Nenhum responsável cadastrado
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Responsáveis Cadastrados</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {guardians.map((guardian) => (
          <div 
            key={guardian.id} 
            className="border rounded-lg p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCircle className="h-5 w-5 text-primary" />
                <span className="font-medium">{guardian.nome}</span>
                {guardian.is_primary && (
                  <span className="inline-flex items-center gap-1 text-amber-600 text-xs">
                    <Crown className="h-3 w-3" />
                    Principal
                  </span>
                )}
              </div>
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>{guardian.telefone}</p>
              <p>{guardian.email}</p>
              {guardian.cpf && <p>CPF: {guardian.cpf}</p>}
            </div>

            <div className="pt-2 flex flex-wrap gap-2">
              {!guardian.is_primary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSetPrimary(guardian.id)}
                  disabled={settingPrimaryId === guardian.id}
                >
                  {settingPrimaryId === guardian.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Crown className="h-3 w-3 mr-1" />
                  )}
                  Definir como principal
                </Button>
              )}

              {onSendInvitation && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleSendInvitation(guardian.id)}
                  disabled={sendingInvitationId === guardian.id}
                  className={cn(
                    "border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                  )}
                >
                  {sendingInvitationId === guardian.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Mail className="h-3 w-3 mr-1" />
                  )}
                  Enviar convite
                </Button>
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenDeleteDialog(guardian.id)}
                className={cn(
                  "border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700"
                )}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Remover
              </Button>
            </div>

            <AlertDialog 
              open={openDeleteDialog === guardian.id} 
              onOpenChange={(open) => !open && setOpenDeleteDialog(null)}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover responsável</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja remover {guardian.nome} como responsável?
                    Esta ação não pode ser desfeita.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => handleDelete(guardian.id)}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={deletingId === guardian.id}
                  >
                    {deletingId === guardian.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Removendo...
                      </>
                    ) : (
                      'Remover'
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
