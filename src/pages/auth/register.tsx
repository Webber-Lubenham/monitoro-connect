
import { Link, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Toaster } from "@/components/ui/sonner"

export function RegisterPage() {
  const navigate = useNavigate()

  const handleRegisterParent = async () => {
    try {
      navigate("/register/parent")
    } catch (error) {
      console.error("Failed to proceed to parent registration", error)
    }
  }

  const handleRegisterStudent = async () => {
    try {
      navigate("/register/student")
    } catch (error) {
      console.error("Failed to proceed to student registration", error)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-bold">Criar Conta</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja se cadastrar
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleRegisterParent}
        >
          Cadastrar como Responsável
        </Button>
        <Button 
          className="w-full" 
          variant="outline"
          onClick={handleRegisterStudent}
        >
          Cadastrar como Aluno
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
