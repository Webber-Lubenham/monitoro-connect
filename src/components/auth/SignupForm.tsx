
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { useSignup, UserRole } from "@/hooks/useSignup";

interface SignupFormProps {
  onSignupSuccess: () => void;
}

export const SignupForm = ({ onSignupSuccess }: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userRole, setUserRole] = useState<UserRole>("student");
  const { handleEmailSignUp, isLoading } = useSignup();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await handleEmailSignUp(email, password, userRole);
    
    if (result.success) {
      onSignupSuccess();
      setEmail("");
      setPassword("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <Input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />
      <div className="space-y-3">
        <Label>Tipo de Usuário</Label>
        <RadioGroup
          value={userRole}
          onValueChange={(value) => setUserRole(value as UserRole)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student">Estudante</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="guardian" id="guardian" />
            <Label htmlFor="guardian">Responsável</Label>
          </div>
        </RadioGroup>
      </div>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? "Criando conta..." : "Criar conta"}
      </Button>
    </form>
  );
};
