
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { safeQuery } from "@/integrations/supabase/safeQueryBuilder";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface GuardianData {
  id: string;
  student_id: string;
  nome: string;
  telefone?: string;
  email: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
  cpf?: string;
  temp_password?: string;
  status?: string;
}

const GuardianConfirm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [guardian, setGuardian] = useState<GuardianData | null>(null);
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
        const guardianId = searchParams.get("guardian_id");
        
        if (!token || !email || !guardianId) {
          setError("Invalid confirmation link. Please request a new invitation.");
          setIsLoading(false);
          return;
        }
        
        // Fetch guardian information from database
        const { data, error: fetchError } = await safeQuery
          .from("guardians")
          .select("*")
          .eq("id", guardianId)
          .eq("email", email)
          .maybeSingle();
        
        if (fetchError || !data) {
          console.error("Error fetching guardian:", fetchError);
          setError("Could not verify your information. Please request a new invitation.");
          setIsLoading(false);
          return;
        }
        
        // Check if guardian status is pending
        if (data.status && data.status !== "pending") {
          setError("This invitation has already been used or canceled.");
          setIsLoading(false);
          return;
        }
        
        setGuardian(data as GuardianData);
        setIsLoading(false);
      } catch (error) {
        console.error("Error in guardian confirmation:", error);
        setError("An error occurred while processing your invitation. Please try again.");
        setIsLoading(false);
      }
    };
    
    fetchGuardianInfo();
  }, [location.search]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!guardian) {
      setError("Guardian information not found.");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Validate passwords
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Password too short",
          description: "Password must be at least 6 characters."
        });
        setIsSubmitting(false);
        return;
      }
      
      if (password !== confirmPassword) {
        toast({
          variant: "destructive",
          title: "Passwords don't match",
          description: "The passwords you entered don't match."
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
      const { error: updateError } = await safeQuery
        .update("guardians", { status: "active" })
        .eq("id", guardian.id || "");
      
      if (updateError) {
        throw updateError;
      }
      
      // Success
      setIsSuccess(true);
      toast({
        title: "Account activated successfully!",
        description: "You can now log in and track the student."
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
          title: "Email already registered",
          description: "This email is already in use. Please log in or use another email."
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error activating account",
          description: error.message || "An error occurred while activating your account. Please try again."
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
            <p>Verifying invitation information...</p>
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
            <h2 className="text-xl font-semibold text-center">Confirmation Error</h2>
            <p className="text-center text-gray-600">{error}</p>
            <Button onClick={() => navigate("/")} className="w-full">
              Back to Login
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
            <h2 className="text-xl font-semibold text-center">Account Activated!</h2>
            <p className="text-center text-gray-600">
              Your account has been activated successfully. You can now log in to track the student.
            </p>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Login
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
            <h1 className="text-2xl font-bold">Activate Guardian Account</h1>
            <p className="text-gray-500">
              Hello {guardian?.nome}, you have been invited to track a student on the Monitore System.
              Complete your registration to continue.
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
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
              <Input
                type="password"
                placeholder="Confirm your password"
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
                  Activating...
                </>
              ) : (
                "Activate Account"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default GuardianConfirm;
