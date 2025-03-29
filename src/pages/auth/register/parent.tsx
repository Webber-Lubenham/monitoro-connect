import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../../lib/supabase"  // Updated import path
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/sonner"

export function ParentRegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: 'parent'
          }
        }
      })

      if (error) throw error

      toast.success("Registration successful! Please check your email.")
      navigate("/login")
    } catch (error) {
      toast.error("Error during registration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Cadastro de Responsável</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <Input
            placeholder="Nome Completo"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
          />
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <Input
            placeholder="Telefone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}