import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

export default function InstitutionSignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institutionName, setInstitutionName] = useState("");
  const [document, setDocument] = useState("");
  const [emailDomain, setEmailDomain] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const { signUpInstitution } = useAuth();
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
      await signUpInstitution(
        email,
        password,
        institutionName,
        document,
        emailDomain,
        phone,
        address,
      );
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
        Cadastro de Instituição
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="institutionName"
            className="text-sm font-medium text-gray-700"
          >
            Nome da Instituição
          </Label>
          <Input
            id="institutionName"
            placeholder="Nome da Instituição"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email Institucional
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="contato@instituicao.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="emailDomain"
            className="text-sm font-medium text-gray-700"
          >
            Domínio de Email
          </Label>
          <Input
            id="emailDomain"
            placeholder="instituicao.com"
            value={emailDomain}
            onChange={(e) => setEmailDomain(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            Domínio usado para emails institucionais
          </p>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="document"
            className="text-sm font-medium text-gray-700"
          >
            CNPJ
          </Label>
          <Input
            id="document"
            placeholder="00.000.000/0000-00"
            value={document}
            onChange={(e) => setDocument(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Telefone
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(00) 0000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="address"
            className="text-sm font-medium text-gray-700"
          >
            Endereço
          </Label>
          <Textarea
            id="address"
            placeholder="Endereço completo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
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
