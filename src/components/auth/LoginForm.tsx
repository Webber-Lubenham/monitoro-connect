
import { useLogin } from "@/hooks/useLogin";
import { LoginFormFields } from "./LoginFormFields";
import { LoginFormActions } from "./LoginFormActions";
import { LoginDebugInfo } from "./LoginDebugInfo";

interface LoginFormProps {
  onResetPassword: () => void;
}

export const LoginForm = ({ onResetPassword }: LoginFormProps) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    debugMode,
    debugInfo,
    handleEmailSignIn,
    toggleDebugMode
  } = useLogin();

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
