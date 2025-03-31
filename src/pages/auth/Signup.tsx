
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { Shield, User, UserPlus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const signupSchema = z.object({
  firstName: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  lastName: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['student', 'guardian']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não conferem',
  path: ['confirmPassword'],
});

type SignupFormValues = z.infer<typeof signupSchema>;

const Signup = () => {
  const auth = useAuth();
  const { signUp } = auth;
  const isLoading = auth.isLoading ?? false;
  const [step, setStep] = useState(1);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student',
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    if (step === 1) {
      setStep(2);
      return;
    }

    if (signUp) {
      await signUp(values.email, values.password, {
        first_name: values.firstName,
        last_name: values.lastName,
        role: values.role,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 flex flex-col items-center">
          <div className="h-12 w-12 bg-monitor-500 rounded-lg flex items-center justify-center mb-2">
            <UserPlus className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Cadastro</CardTitle>
          <CardDescription className="text-center">
            {step === 1 ? 'Crie sua conta no Monitor Connect' : 'Escolha o tipo de conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {step === 1 ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="João" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sobrenome</FormLabel>
                          <FormControl>
                            <Input placeholder="Silva" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="******" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              ) : (
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de conta</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-3"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="student" />
                            </FormControl>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center">
                                <Shield className="mr-2 h-5 w-5 text-monitor-500" />
                                <span className="font-medium">Estudante</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Monitore sua localização e compartilhe com responsáveis
                              </p>
                            </div>
                          </FormItem>
                          
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                              <RadioGroupItem value="guardian" />
                            </FormControl>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center">
                                <User className="mr-2 h-5 w-5 text-monitor-500" />
                                <span className="font-medium">Responsável</span>
                              </div>
                              <p className="text-sm text-gray-500">
                                Acompanhe a localização dos estudantes sob sua responsabilidade
                              </p>
                            </div>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {step === 1 ? 'Continuar' : isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </Button>
              {step === 2 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => setStep(1)}
                >
                  Voltar
                </Button>
              )}
            </form>
          </Form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Já tem uma conta?{' '}
              <Link to="/auth/login" className="text-monitor-600 hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
