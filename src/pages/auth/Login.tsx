
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"

export function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <h2 className="text-2xl font-bold">Entrar</h2>
        <p className="text-sm text-muted-foreground">
          Escolha como deseja entrar no sistema
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full" variant="outline">
          Entrar como Responsável
        </Button>
        <Button className="w-full" variant="outline">
          Entrar como Aluno
        </Button>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Registre-se
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
