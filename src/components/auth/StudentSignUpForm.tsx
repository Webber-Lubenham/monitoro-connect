import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";

export default function StudentSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const { signUpStudent } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    if (!agreeTerms) {
      setError(
        "Você precisa concordar com os termos de uso e política de privacidade",
      );
      return;
    }

    try {
      await signUpStudent(email, password, fullName, birthDate);
      toast({
        title: "Conta criada com sucesso",
        description: "Por favor, verifique seu email para confirmar sua conta.",
        duration: 5000,
      });
      navigate("/login");
    } catch (error) {
      console.error("Error creating account:", error);
      setError("Erro ao criar conta. Verifique seus dados e tente novamente.");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">
        Cadastro de Estudante
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="fullName"
            className="text-sm font-medium text-gray-700"
          >
            Nome Completo
          </Label>
          <Input
            id="fullName"
            placeholder="Nome Completo"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="nome@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="birthDate"
            className="text-sm font-medium text-gray-700"
          >
            Data de Nascimento
          </Label>
          <Input
            id="birthDate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Crie uma senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            A senha deve ter pelo menos 8 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirmar Senha
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirme sua senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreeTerms}
            onCheckedChange={(checked) => setAgreeTerms(checked === true)}
          />
          <Label htmlFor="terms" className="text-xs text-gray-500">
            Concordo com os{" "}
            <Link to="/terms" className="text-blue-600 hover:underline">
              Termos de Uso
            </Link>{" "}
            e{" "}
            <Link to="/privacy" className="text-blue-600 hover:underline">
              Política de Privacidade
            </Link>
          </Label>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button
          type="submit"
          className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
        >
          Criar conta
        </Button>

        <div className="text-sm text-center text-gray-600 mt-6">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Entrar
          </Link>
        </div>
      </form>
    </div>
  );
}
