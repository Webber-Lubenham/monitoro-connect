import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { supabase } from "../../../lib/supabase.ts"
import { Button } from "../../../components/ui/button.tsx"
import { Input } from "../../../components/ui/input.tsx"
import { Card, CardHeader, CardContent, CardFooter } from "../../../components/ui/card.tsx"
import { toast } from "../../../components/ui/sonner.tsx"
import { z } from 'zod'

const studentSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  fullName: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  cpf: z.string().length(11, "CPF deve ter 11 dígitos"),
  phone: z.string()
    .min(10, "Telefone deve ter no mínimo 10 dígitos")
    .max(14, "Telefone deve ter no máximo 14 dígitos")
    .refine((value) => {
      // Brazilian format: (XX)XXXXX-XXXX or XXXXXXXXXXX
      const brPattern = /^(\d{10,11})$/
      // UK format: +44XXXXXXXXXX or 44XXXXXXXXXX
      const ukPattern = /^(44\d{10})$/
      return brPattern.test(value.replace(/\D/g, '')) || ukPattern.test(value.replace(/\D/g, ''))
    }, "Formato de telefone inválido. Use formato Brasil ou Reino Unido"),
  parentName: z.string().min(3, "Nome do responsável deve ter no mínimo 3 caracteres"),
  parentEmail: z.string().email("Email do responsável inválido"),
  parentPhone: z.string().min(10, "Telefone do responsável inválido"),
  parentCpf: z.string().length(11, "CPF do responsável deve ter 11 dígitos")
})

export function StudentRegisterPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "franklima.flm@gmail.com",
    password: "Str0ngP@ssw0rd123", // Stronger default password
    fullName: "Sarah Rackel Ferreira Lima",
    cpf: "02991935278",
    phone: "447386797716",
    parentName: "Mauro Frank Lima de Lima",
    parentEmail: "frankwebber33@hotmail.com",
    parentPhone: "447386797715",
    parentCpf: "43803916215"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const validatedData = studentSchema.parse(formData)

      // Test Supabase connection
      const { data: testData, error: testError } = await supabase
        .from('profiles')
        .select('count')
        .single()

      console.log('Connection test:', {
        success: !testError,
        data: testData,
        error: testError
      })

      if (testError) {
        throw new Error('Failed to connect to Supabase')
      }

      // Try a simpler signup with just email/password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        // Log detailed error information
        console.error('Auth error details:', {
          code: signUpError.status,
          name: signUpError.name,
          message: signUpError.message,
          details: signUpError
        })
        throw signUpError
      }

      if (!signUpData.user) {
        throw new Error('Signup failed - no user returned')
      }

      toast.success("Cadastro realizado com sucesso! Por favor, verifique seu email.")
      navigate("/login")
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error(error.errors[0].message)
      } else {
        console.error('Registration error:', error)
        toast.error("Erro durante o cadastro. Por favor, tente novamente.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Cadastro de Aluno</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <h3 className="font-medium">Dados do Aluno</h3>
            <Input
              placeholder="Nome Completo"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: (e.target as HTMLInputElement).value })}
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
              placeholder="CPF"
              value={formData.cpf}
              onChange={(e) => setFormData({ ...formData, cpf: (e.target as HTMLInputElement).value })}
              required
              maxLength={11}
              pattern="\d{11}"
              title="Digite um CPF válido (apenas números)"
            />
            <Input
              placeholder="Telefone (BR ou UK)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: (e.target as HTMLInputElement).value })}
              required
              maxLength={14}
              title="Digite um telefone válido (Brasil: 10-11 dígitos ou Reino Unido: começando com 44)"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Dados do Responsável</h3>
            <Input
              placeholder="Nome do Responsável"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email do Responsável"
              value={formData.parentEmail}
              onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
              required
            />
            <Input
              placeholder="Telefone do Responsável"
              value={formData.parentPhone}
              onChange={(e) => setFormData({ ...formData, parentPhone: (e.target as HTMLInputElement).value })}
              required
              maxLength={14}
              title="Digite um telefone válido (Brasil: 10-11 dígitos ou Reino Unido: começando com 44)"
            />
            <Input
              placeholder="CPF do Responsável"
              value={formData.parentCpf}
              onChange={(e) => setFormData({ ...formData, parentCpf: (e.target as HTMLInputElement).value })}
              required
              maxLength={11}
              pattern="\d{11}"
              title="Digite um CPF válido (apenas números)"
            />
          </div>
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
