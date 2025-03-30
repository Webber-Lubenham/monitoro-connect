
# Sistema Monitore - Fluxos de Autenticação

## 🔐 Fluxos de Autenticação

### Cadastro de Usuários

O sistema permite o cadastro de dois tipos principais de usuários:

1. **Estudantes**
   - Formulário de cadastro na página inicial
   - Campos obrigatórios: Email e senha
   - Seleção de tipo de usuário: "Estudante"
   - Confirmação de email obrigatória através de link enviado
   - Após confirmação, o estudante pode fazer login

2. **Responsáveis/Guardiões**
   - Formulário de cadastro na página inicial
   - Campos obrigatórios: Email e senha
   - Seleção de tipo de usuário: "Responsável"
   - Confirmação de email obrigatória através de link enviado
   - Após confirmação, o responsável pode fazer login

**Processo técnico de cadastro:**
1. A função `handleEmailSignUp` em `useSignup.ts` processa o registro
2. Verificação de email existente na tabela `profiles`
3. Criação de usuário no Supabase Auth com metadados de função
4. Envio de email de confirmação personalizado via Resend
5. Feedback para o usuário sobre o próximo passo

### Login de Usuários

O sistema oferece um processo de login unificado:

1. Entrada na página inicial (`Index.tsx`)
2. Preenchimento de email e senha
3. Submissão do formulário de login
4. Verificação das credenciais no Supabase Auth
5. Se bem-sucedido:
   - Estudantes são redirecionados para `/dashboard`
   - Responsáveis são redirecionados para `/parent-dashboard`

**Processo técnico de login:**
1. A função `handleEmailSignIn` em `LoginForm.tsx` processa a autenticação
2. Uso de `signInWithPassword` do Supabase Auth
3. Verificação do papel do usuário em metadados
4. Redirecionamento baseado no papel (estudante ou responsável)
5. Armazenamento da sessão para uso futuro

### Recuperação de Senha

O sistema implementa um fluxo completo de recuperação de senha:

1. Clique em "Esqueceu sua senha?" na tela de login
2. Preenchimento do email associado à conta
3. Envio de email com link para redefinição de senha
4. Acesso à página de redefinição via link recebido
5. Inserção e confirmação da nova senha
6. Redirecionamento para a página de login

**Processo técnico de recuperação:**
1. A função em `PasswordResetForm.tsx` inicia o processo
2. Uso de `resetPasswordForEmail` do Supabase Auth
3. Envio de email com token e URL de redefinição
4. Página `ResetPassword.tsx` processa a atualização da senha
5. Uso de `updateUser` do Supabase Auth para definir nova senha
