
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Profile } from "@/types/database.types";

/**
 * Get details about a student by id
 */
export const getStudentProfile = async (studentId: string): Promise<{
  name: string;
  email: string;
  id: string;
} | null> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, email")
      .eq("id", studentId)
      .single();
    
    if (error) {
      console.error("Error fetching student profile:", error);
      return null;
    }
    
    // Ensure we have the correct data type
    const profileData = data as Profile;
    
    // Format the student's name
    const firstName = profileData.first_name || "";
    const lastName = profileData.last_name || "";
    const name = `${firstName} ${lastName}`.trim() || "Estudante";
    
    // Create and return the profile object
    return {
      id: studentId,
      name,
      email: profileData.email || ""
    };
  } catch (error) {
    console.error("Error in getStudentProfile:", error);
    toast({
      title: "Erro",
      description: "Não foi possível obter os dados do estudante",
      variant: "destructive"
    });
    return null;
  }
};
