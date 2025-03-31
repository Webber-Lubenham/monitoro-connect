
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

/**
 * Removes a guardian from a student's list of guardians
 * 
 * @param guardianId The ID of the guardian to remove
 * @param studentId The ID of the student
 * @returns 
 */
export const removeGuardian = async (
  guardianId: string,
  studentId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Check if there are other guardians for the student
    const { data: guardiansData, error: guardiansError } = await supabase
      .from("guardians")
      .select("id")
      .eq("student_id", studentId || "");
    
    if (guardiansError) {
      throw new Error("Erro ao verificar responsáveis: " + guardiansError.message);
    }
    
    // Prevent removing the last guardian
    if (guardiansData.length <= 1) {
      toast({
        variant: "destructive",
        title: "Operação não permitida",
        description: "Não é possível remover o único responsável. Adicione outro responsável antes de remover este."
      });
      return { success: false, error: "Não é possível remover o único responsável" };
    }
    
    // Delete guardian record
    const { error } = await supabase
      .from("guardians")
      .delete()
      .eq("id", guardianId);
    
    if (error) {
      throw new Error("Erro ao remover responsável: " + error.message);
    }
    
    toast({
      title: "Responsável removido",
      description: "O responsável foi removido com sucesso."
    });
    
    return { success: true };
  } catch (error: any) {
    console.error("Error removing guardian:", error);
    
    toast({
      variant: "destructive",
      title: "Erro ao remover responsável",
      description: error.message || "Ocorreu um erro ao remover o responsável. Por favor, tente novamente."
    });
    
    return { success: false, error: error.message };
  }
};
