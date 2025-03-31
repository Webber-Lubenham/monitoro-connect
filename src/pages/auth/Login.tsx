import React, { useState } from "react";

import { Link } from "react-router-dom";
import { Button } from "../components/ui/button"; 
import { Input } from "../components/ui/input"; 
import { Card, CardHeader, CardContent, CardFooter } from "../components/ui/card"; 
import { useAuth } from "../contexts/AuthContext"; 



export function LoginPage() {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

const handleSubmit = async (e: React.FormEvent) => {


    e.preventDefault();
    setLoading(true);
    await signIn(formData.email, formData.password);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Login</h2>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
          <Link to="/register/student" className="text-sm text-gray-500 hover:underline">
            Não tem uma conta? Cadastre-se
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
