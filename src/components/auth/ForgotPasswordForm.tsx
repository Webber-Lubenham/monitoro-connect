import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import AuthLayout from "./AuthLayout";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const { resetPassword } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await resetPassword(email);
      setIsSubmitted(true);
      toast({
        title: "Email enviado",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error sending reset password email:", error);
      setError("Erro ao enviar email. Verifique se o endereço está correto.");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md mx-auto">
        <Link
          to="/login"
          className="flex items-center text-sm text-gray-600 mb-6 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para login
        </Link>

        {!isSubmitted ? (
          <>
            <h2 className="text-2xl font-bold text-center mb-2">
              Esqueceu sua senha?
            </h2>
            <p className="text-sm text-gray-500 text-center mb-6">
              Digite seu email e enviaremos um link para redefinir sua senha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
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

              {error && <p className="text-sm text-red-500">{error}</p>}

              <Button
                type="submit"
                className="w-full h-12 rounded-full bg-black text-white hover:bg-gray-800 text-sm font-medium"
              >
                Enviar link de redefinição
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-2">Email enviado!</h3>
              <p className="text-sm">
                Enviamos um link para {email}. Verifique sua caixa de entrada e
                siga as instruções para redefinir sua senha.
              </p>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Não recebeu o email? Verifique sua pasta de spam ou
            </p>
            <Button
              onClick={() =>
                handleSubmit({ preventDefault: () => {} } as React.FormEvent)
              }
              variant="outline"
              className="text-sm"
            >
              Enviar novamente
            </Button>
          </div>
        )}
      </div>
    </AuthLayout>
  );
}
