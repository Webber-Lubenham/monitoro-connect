
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

const GuardianConfirm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [guardian, setGuardian] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchGuardianInfo = async () => {
      try {
        setIsLoading(true);
        
        // Get token and email from URL search params
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get("token");
        const email = searchParams.get("email");
        
        if (!token || !email) {
          setError("Link de confirmação inválido. Por favor, solicite um novo convite.");
          setIsLoading(false);
          return;
        }
        
        // Fetch guardian information from database
        const { data, error: fetchError } = await supabase
          .from("guardians")
          .select("*")
          .eq("id", token)
          .eq("email", email)
          .maybeSingle();
        
        if (fetchError || !data) {
          console.error("Error fetching guardian:", fetchError);
          setError("Não foi possível verificar suas informações. Por favor, solicite um novo convite.");
          setIsLoading(false);
          return;
        }
        
        // Check if guardian status is pending
        if (data.status && data.status !== "pending") {
          setError("Este convite já foi utilizado ou cancelado.");
          setIsLoading(false);
          return;
        }
        
        setGuardian(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in guardian confirmation:", error);
        setError("Ocorreu um erro ao processar seu convite. Por favor, tente novamente.");
        setIsLoading(false);
      }
    };
    
    fetchGuardianInfo();
  }, [location.search]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Validate passwords
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Senha muito curta",
          description: "A senha deve ter pelo menos 6 caracteres."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Senhas não coincidem",
          description: "As senhas digitadas não são iguais."
        });
        setIsSubmitting(false);
        return;
      }
      
      // 1. Create a user account in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: guardian.email,
        password: password,
        options: {
          data: {
            role: "guardian",
            name: guardian.nome,
            guardian_id: guardian.id || "" // Ensure it's a string even if null
          }
        }
      });
      
      if (authError) {
        throw authError;
      }
      
      // 2. Update guardian status to active
      const { error: updateError } = await supabase
        .from("guardians")
        .update({ status: "active" })
        .eq("id", guardian.id || "");
      
      if (updateError) {
        throw updateError;
      }
      
      // Success
      setIsSuccess(true);
      toast({
        title: "Conta ativada com sucesso!",
        description: "Você já pode fazer login e acompanhar o estudante."
      });
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        navigate("/");
      }, 3000);
      
    } catch (error: any) {
      console.error("Error activating guardian account:", error);
      
      // Handle user already exists error
      if (error.message && error.message.includes("already exists")) {
        toast({
          variant: "destructive",
          title: "Email já cadastrado",
          description: "Este email já está em uso. Por favor, faça login ou use outro email."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao ativar conta",
          description: error.message || "Ocorreu um erro ao ativar sua conta. Por favor, tente novamente."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
        <Card className="p-8 w-full max-w-md mx-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Verificando informações do convite...</p>
          </div>
        </Card>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
        <Card className="p-8 w-full max-w-md mx-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <AlertCircle className="h-12 w-12 text-destructive" />
            <h2 className="text-xl font-semibold text-center">Erro na Confirmação</h2>
            <p className="text-center text-gray-600">{error}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Voltar para Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
        <Card className="p-8 w-full max-w-md mx-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="text-xl font-semibold text-center">Conta Ativada!</h2>
            <p className="text-center text-gray-600">
              Sua conta foi ativada com sucesso. Você já pode fazer login para acompanhar o estudante.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Ir para Login
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary">
      <Card className="p-8 w-full max-w-md mx-4">
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold">Ativar Conta de Responsável</h1>
            <p className="text-gray-500">
              Olá {guardian?.nome}, você foi convidado para acompanhar um estudante no Sistema Monitore.
              Complete seu cadastro para continuar.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                value={guardian?.nome || ""}
                disabled
                className="bg-gray-100"
              />
              <Input
                type="email"
                value={guardian?.email || ""}
                disabled
                className="bg-gray-100"
              />
              <Input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                type="password"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ativando...
                </>
              ) : (
                "Ativar Conta"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default GuardianConfirm;
