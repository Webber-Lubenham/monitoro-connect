
import { Button } from "@/components/ui/button";

interface LoginFormActionsProps {
  isLoading: boolean;
  onResetPassword: () => void;
  onDebugToggle: () => void;
  onTestUser?: () => void;
  debugMode: boolean;
}

export const LoginFormActions = ({
  isLoading,
  onResetPassword,
  onDebugToggle,
  onTestUser,
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
      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="link"
          onClick={onResetPassword}
          className="text-sm"
        >
          Esqueceu sua senha?
        </Button>
        
        {onTestUser && (
          <Button
            type="button"
            variant="link"
            onClick={onTestUser}
            className="text-xs text-gray-500"
          >
            Verificar conta
          </Button>
        )}
      </div>
      
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
