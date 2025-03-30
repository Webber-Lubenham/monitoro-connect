
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GuardianSignupFormProps {
  token: string;
  email: string;
  onSuccess: () => void;
}

export const GuardianSignupForm = ({ token, email, onSuccess }: GuardianSignupFormProps) => {
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [invitationDetails, setInvitationDetails] = useState<any>(null);
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(true);

  // Buscar detalhes do convite ao montar
  useEffect(() => {
    const fetchInvitationDetails = async () => {
      try {
        setIsLoadingInvitation(true);
        console.log(`Buscando detalhes do convite para: ${email}, token: ${token}`);
        
        // Obter detalhes do convite pelo token
        const { data, error } = await supabase
          .from('student_invitations')
          .select('student_id, parent_id, email, used, token, created_at')
          .eq('token', token)
          .eq('email', email.toLowerCase().trim())
          .single();
        
        if (error) {
          console.error('Erro ao buscar convite:', error);
          throw error;
        }
        
        console.log('Dados do convite:', data);
        
        if (data?.used) {
          setError('Este convite já foi utilizado. Por favor, faça login normalmente.');
          setInvitationDetails(null);
        } else if (data) {
          // Buscar detalhes do aluno
          const { data: studentData } = await supabase
            .from('profiles')
            .select('name, email')
            .eq('id', data.student_id)
            .single();
          
          console.log('Dados do aluno:', studentData);
          
          setInvitationDetails({
            ...data,
            studentName: studentData?.name || 'estudante',
            studentEmail: studentData?.email
          });
        } else {
          setError('Convite não encontrado ou expirado.');
          setInvitationDetails(null);
        }
      } catch (error: any) {
        console.error('Erro ao verificar convite:', error);
        setError('Erro ao verificar convite: ' + error.message);
        setInvitationDetails(null);
      } finally {
        setIsLoadingInvitation(false);
      }
    };
    
    fetchInvitationDetails();
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validar senha
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Iniciando cadastro de responsável');
      let userId;
      
      // Verificar se parent_id existe no convite
      if (invitationDetails.parent_id) {
        console.log('Usuário já existe, atualizando senha');
        // Usuário já existe, vamos atualizar a senha e o papel
        const { error: updateError } = await supabase.auth.admin.updateUserById(
          invitationDetails.parent_id,
          { password, user_metadata: { role: 'guardian' } }
        );
        
        if (updateError) {
          console.error('Erro ao atualizar usuário:', updateError);
          throw updateError;
        }
        
        userId = invitationDetails.parent_id;
      } else {
        console.log('Criando novo usuário');
        // Novo usuário, criar conta
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'guardian'
            }
          }
        });
        
        if (signUpError) {
          console.error('Erro no cadastro:', signUpError);
          throw signUpError;
        }
        
        if (!signUpData.user) {
          throw new Error('Falha ao criar conta');
        }
        
        console.log('Conta criada:', signUpData.user);
        userId = signUpData.user.id;
      }
      
      // Marcar o convite como usado e atualizar parent_id
      console.log('Atualizando convite como usado');
      const { error: inviteError } = await supabase
        .from('student_invitations')
        .update({
          used: true,
          parent_id: userId
        })
        .eq('token', token)
        .eq('email', email.toLowerCase().trim());
      
      if (inviteError) {
        console.error('Erro ao atualizar convite:', inviteError);
        // Continuar mesmo assim
      }
      
      // Adicionar entrada na tabela profiles se não existir
      console.log('Criando/atualizando perfil');
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: email.toLowerCase().trim(),
          name: invitationDetails?.nome || email.split('@')[0],
          role: 'guardian'
        });
      
      if (profileError) {
        console.error('Erro ao criar perfil:', profileError);
        // Continuar mesmo assim
      }
      
      // Mostrar sucesso e redirecionar
      toast({
        title: "Conta criada com sucesso!",
        description: "Sua conta de responsável foi criada. Faça login para acessar o sistema.",
      });
      
      console.log('Processo de cadastro concluído com sucesso');
      onSuccess();
    } catch (error: any) {
      console.error('Erro no cadastro de responsável:', error);
      
      if (error.message?.includes('User already registered')) {
        setError('Este email já está registrado. Por favor, faça login.');
      } else {
        setError(error.message || 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingInvitation) {
    return (
      <Card className="p-6 shadow-lg max-w-md w-full mx-auto text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Verificando convite...</p>
      </Card>
    );
  }

  if (!invitationDetails) {
    return (
      <Card className="p-6 shadow-lg max-w-md w-full mx-auto">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Convite Inválido</AlertTitle>
          <AlertDescription>
            {error || 'Este convite não é válido ou já foi utilizado. Por favor, peça ao aluno para enviar um novo convite.'}
          </AlertDescription>
        </Alert>
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={() => window.location.href = '/'}
        >
          Voltar para página inicial
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Criar Conta de Responsável</h2>
      
      <Alert className="mb-6">
        <AlertTitle>Convite de {invitationDetails.studentName}</AlertTitle>
        <AlertDescription>
          Você foi convidado para ser responsável de {invitationDetails.studentName}.
          {invitationDetails.studentEmail && (
            <span> Email do aluno: {invitationDetails.studentEmail}</span>
          )}
        </AlertDescription>
      </Alert>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email:</label>
          <Input
            type="email"
            value={email}
            disabled
            className="bg-gray-50"
          />
          <p className="text-xs text-gray-500">Este é o email que recebeu o convite.</p>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Senha:</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Crie uma senha segura"
            required
            min={6}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Confirme a senha:</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Digite a senha novamente"
            required
          />
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
            {error}
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando conta...
            </>
          ) : (
            'Criar Conta'
          )}
        </Button>
      </form>
    </Card>
  );
};
