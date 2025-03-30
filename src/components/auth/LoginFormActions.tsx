
import { Button } from "@/components/ui/button";

interface LoginFormActionsProps {
  isLoading: boolean;
  onResetPassword: () => void;
  onDebugToggle: () => void;
  debugMode: boolean;
}

export const LoginFormActions = ({
  isLoading,
  onResetPassword,
  onDebugToggle,
  debugMode
}: LoginFormActionsProps) => {
  return (
    <>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Entrando..." : "Entrar"}
      </Button>
      <Button
        type="button"
        variant="link"
        className="w-full"
        onClick={onResetPassword}
      >
        Esqueceu sua senha?
      </Button>
      
      {/* Debug toggle button - hidden in normal UI but accessible */}
      <div className="text-right">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="text-xs text-gray-300 hover:text-gray-400"
          onClick={onDebugToggle}
        >
          {debugMode ? "Desativar depuração" : "•"}
        </Button>
      </div>
    </>
  );
};
