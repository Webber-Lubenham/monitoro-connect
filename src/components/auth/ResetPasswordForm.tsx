import { useState, useEffect } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Extract token from URL
  useEffect(() => {
    // The token should be in the hash or query params depending on Supabase's redirect
    const hash = location.hash;
    const searchParams = new URLSearchParams(location.search);

    if (!hash && !searchParams.has("token")) {
      setError("Link de redefinição inválido ou expirado.");
    }
  }, [location]);

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

    try {
      await updatePassword(password);
      setIsSuccess(true);
      toast({
        title: "Senha atualizada",
        description: "Sua senha foi redefinida com sucesso.",
        duration: 5000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      setError("Erro ao redefinir senha. O link pode ter expirado.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        {!isSuccess ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Redefinir Senha
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Crie uma nova senha para sua conta
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Nova Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua nova senha"
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
                  placeholder="Confirme sua nova senha"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="h-12 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
              >
                Redefinir Senha
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-2">Senha atualizada!</h3>
              <p className="text-sm">
                Sua senha foi redefinida com sucesso. Você será redirecionado
                para a página de login em instantes.
              </p>
            </div>
            <Link to="/login">
              <Button className="text-sm">Ir para o login</Button>
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
