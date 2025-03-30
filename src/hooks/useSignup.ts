
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import resendService from "@/services/email/resendService";
import { useToast } from "@/hooks/use-toast";

export type UserRole = "student" | "guardian";

export const useSignup = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Get the application domain and protocol based on environment
  const getAppUrl = () => {
    // Use HTTP for development with correct port
    if (import.meta.env.DEV) {
      return 'http://localhost:8080';
    }
    // Use HTTPS for production with the correct domain
    return 'https://www.sistema-monitore.com.br';
  };

  const normalizeEmail = (email: string) => {
    return email.trim().toLowerCase();
  };

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      return "A senha deve ter pelo menos 6 caracteres";
    }
    return null;
  };

  // Função para enviar email de confirmação diretamente pela função edge
  const sendDirectConfirmationEmail = async (
    email: string, 
    confirmationUrl: string, 
    userRole: string
  ): Promise<boolean> => {
    try {
      console.log(`Enviando confirmação diretamente para ${email} com URL ${confirmationUrl}`);
      
      // Ensure the body is a stringified JSON object
      const payload = JSON.stringify({
        email: email,
        confirmationUrl: confirmationUrl,
        userRole: userRole
      });
      
      console.log("Payload para edge function:", payload);
      
      const { data, error } = await supabase.functions.invoke(
        'send-confirmation-email',
        { 
          body: payload,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (error) {
        console.error("Error sending confirmation email:", error);
        throw error;
      }
      
      console.log("Email de confirmação enviado com sucesso", data);
      return true;
    } catch (error) {
      console.error("Erro ao enviar email de confirmação:", error);
      return false;
    }
  };

  const handleEmailSignUp = async (email: string, password: string, userRole: UserRole) => {
    setIsLoading(true);
    console.log(`Starting registration: ${email} - Role: ${userRole}`);

    try {
      // Always normalize email to lowercase
      const normalizedEmail = normalizeEmail(email);
      
      // Validate password
      const passwordError = validatePassword(password);
      if (passwordError) {
        toast({
          variant: "destructive",
          title: "Senha inválida",
          description: passwordError,
        });
        setIsLoading(false);
        return { success: false };
      }
      
      // First, check if a user with this email exists in the profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (profileError) {
        console.error("Error checking profiles table:", profileError);
      }

      // If user exists in profiles table
      if (profileData) {
        toast({
          variant: "destructive",
          title: "Email já cadastrado",
          description: "Este email já está cadastrado. Por favor, faça login ou use outro email.",
        });
        setIsLoading(false);
        return { success: false };
      }

      console.log("About to call signUp with email:", normalizedEmail);
      
      // If not found in profiles table, proceed with sign up
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            role: userRole,
            email: normalizedEmail
          }
        }
      });

      if (error) {
        console.error("Signup error:", error);
        toast({
          variant: "destructive",
          title: "Erro no cadastro",
          description: error.message,
        });
        return { success: false };
      }

      if (data?.user) {
        console.log("User created successfully:", data.user);
        
        // Get the base URL for confirmation
        const appUrl = getAppUrl();
        const confirmationUrl = `${appUrl}/confirm?token=${data.user.id}&email=${encodeURIComponent(normalizedEmail)}`;
        
        console.log("Using confirmation URL:", confirmationUrl);
        
        // Tentar múltiplos métodos de envio de email, começando com o método direto
        let emailSent = false;
        
        try {
          // Método 1: Enviar diretamente via edge function
          emailSent = await sendDirectConfirmationEmail(normalizedEmail, confirmationUrl, userRole);
          if (emailSent) {
            console.log("Email de confirmação enviado via Edge Function");
          }
        } catch (edgeFnError) {
          console.error("Falha ao enviar email via Edge Function:", edgeFnError);
        }
        
        // Se o método direto falhar, tente o método do resendService
        if (!emailSent) {
          try {
            await resendService.sendConfirmationEmail(normalizedEmail, confirmationUrl, userRole);
            emailSent = true;
            console.log("Custom confirmation email sent successfully");
          } catch (emailError) {
            console.error("Error sending custom confirmation email:", emailError);
          }
        }

        // Show appropriate success message
        toast({
          title: "✅ Cadastro realizado com sucesso!",
          description: emailSent
            ? "Enviamos um email de confirmação. Por favor, verifique sua caixa de entrada."
            : "Sua conta foi criada. Por favor, verifique seu email para confirmar o cadastro.",
          duration: 6000,
        });

        return { success: true, user: data.user };
      }

      // If we get here without a user, something went wrong
      toast({
        variant: "destructive",
        title: "Erro no cadastro",
        description: "Não foi possível completar o cadastro. Por favor, tente novamente.",
      });
      return { success: false };

    } catch (error) {
      console.error("Unexpected error during signup:", error);
      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro durante o cadastro. Por favor, tente novamente.",
      });
      return { success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEmailSignUp,
    isLoading
  };
};
