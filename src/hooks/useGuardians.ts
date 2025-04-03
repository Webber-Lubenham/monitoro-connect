
import { useState, useEffect } from 'react';
import { getGuardians } from '@/services/guardian';
import { useToast } from '@/hooks/use-toast';
import { Guardian, GuardianForm } from '@/types/database.types';
import { createGuardian, deleteGuardian, updateGuardianInfo } from '@/services/guardianService';
import { FormErrors } from '@/hooks/guardians/types';

export const useGuardians = (studentId?: string) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const { toast } = useToast();

  // Fetch guardians initially and when studentId changes
  useEffect(() => {
    const fetchGuardians = async () => {
      if (!studentId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const guardiansList = await getGuardians(studentId);
        
        // Cast the result to Guardian[] to fix the type error
        setGuardians(guardiansList as unknown as Guardian[]);
      } catch (err: any) {
        console.error('Error fetching guardians:', err);
        setError(err);
        toast({
          variant: "destructive",
          title: "Erro ao buscar responsáveis",
          description: err.message
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchGuardians();
  }, [studentId, toast]);

  // Add a new guardian
  const addGuardian = async (newGuardian: GuardianForm): Promise<boolean> => {
    try {
      if (!studentId) {
        throw new Error("ID do aluno não encontrado");
      }

      // Validate form fields
      const errors: FormErrors = {};
      let hasErrors = false;

      if (!newGuardian.nome || newGuardian.nome.trim().length < 3) {
        errors.nome = "Nome deve ter pelo menos 3 caracteres";
        hasErrors = true;
      }

      if (!newGuardian.email || !newGuardian.email.includes('@')) {
        errors.email = "Email inválido";
        hasErrors = true;
      }

      if (!newGuardian.telefone || newGuardian.telefone.replace(/\D/g, '').length < 10) {
        errors.telefone = "Telefone inválido";
        hasErrors = true;
      }

      if (newGuardian.cpf && newGuardian.cpf.replace(/\D/g, '').length !== 11) {
        errors.cpf = "CPF inválido";
        hasErrors = true;
      }

      if (hasErrors) {
        setFormErrors(errors);
        return false;
      }

      setIsLoading(true);
      setFormErrors({});

      // Format the guardian data
      const guardianData = {
        nome: newGuardian.nome,
        email: newGuardian.email,
        telefone: newGuardian.telefone,
        is_primary: newGuardian.isPrimary,
        cpf: newGuardian.cpf
      };

      // Call the API to create guardian
      const result = await createGuardian(studentId, guardianData);

      if (!result.success) {
        throw new Error("Falha ao adicionar responsável");
      }

      // Fetch updated guardians list
      const updatedGuardians = await getGuardians(studentId);
      setGuardians(updatedGuardians as unknown as Guardian[]);

      toast({
        title: "Responsável adicionado",
        description: "O responsável foi adicionado com sucesso."
      });

      return true;
    } catch (err: any) {
      console.error('Error adding guardian:', err);
      
      // Check for specific errors
      if (err.message.includes("already exists")) {
        setFormErrors({ email: "Este email já está cadastrado como responsável" });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao adicionar responsável",
          description: err.message
        });
      }
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Remove a guardian
  const removeGuardian = async (guardianId: string): Promise<boolean> => {
    if (!studentId || !guardianId) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await deleteGuardian(guardianId, studentId);
      
      if (!result.success) {
        throw new Error(result.error || "Erro ao remover responsável");
      }
      
      // Update the UI by filtering out the removed guardian
      setGuardians(current => current.filter(g => g.id !== guardianId));
      
      return true;
    } catch (err: any) {
      console.error('Error removing guardian:', err);
      setError(err);
      // Toast message is handled in the guardian service
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Update a guardian
  const updateGuardian = async (guardianId: string, data: Partial<GuardianForm>): Promise<boolean> => {
    if (!guardianId) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Convert from form format to update format
      const updateData = {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        is_primary: data.isPrimary,
        cpf: data.cpf
      };
      
      const success = await updateGuardianInfo(guardianId, updateData);
      
      if (!success) {
        throw new Error("Falha ao atualizar responsável");
      }
      
      // Refresh the guardians list
      if (studentId) {
        const updatedGuardians = await getGuardians(studentId);
        setGuardians(updatedGuardians as unknown as Guardian[]);
      }
      
      toast({
        title: "Responsável atualizado",
        description: "As informações do responsável foram atualizadas com sucesso."
      });
      
      return true;
    } catch (err: any) {
      console.error('Error updating guardian:', err);
      setError(err);
      
      toast({
        variant: "destructive",
        title: "Erro ao atualizar responsável",
        description: err.message
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { 
    guardians, 
    isLoading, 
    error, 
    formErrors,
    setFormErrors,
    addGuardian, 
    removeGuardian,
    updateGuardian
  };
};
