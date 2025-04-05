
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoginFormFields } from "./LoginFormFields";
import { LoginFormActions } from "./LoginFormActions";
import { LoginDebugInfo } from "./LoginDebugInfo";
import { useAuth } from "@/providers/AuthProvider";

interface LoginFormProps {
  onResetPassword: () => void;
}

export const LoginForm = ({ onResetPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [debugMode, setDebugMode] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  
  const { signIn, isLoading } = useAuth();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Track login attempts
    setLoginAttempts(prev => prev + 1);
    
    // Clear debug info
    setDebugInfo(null);
    
    // Call the auth provider's signIn method
    await signIn(email, password);
  };

  const toggleDebugMode = () => {
    setDebugMode(!debugMode);
  };

  return (
    <form onSubmit={handleEmailSignIn} className="space-y-4">
      <LoginFormFields
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
      />
      
      <LoginFormActions
        isLoading={isLoading}
        onResetPassword={onResetPassword}
        onDebugToggle={toggleDebugMode}
        debugMode={debugMode}
      />
      
      <LoginDebugInfo 
        debugMode={debugMode} 
        debugInfo={debugInfo} 
      />
    </form>
  );
};
