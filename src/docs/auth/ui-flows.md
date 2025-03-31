
# Sistema Monitore - Fluxo de Interfaces e URLs

## 📱 Fluxo de Interfaces

1. **Página Inicial** (`Index.tsx`)
   - Acesso a login e cadastro
   - Alternância entre formulários
   - Recuperação de senha

2. **Confirmação de Email** (`Confirm.tsx`)
   - Validação de token de confirmação
   - Feedback sobre status de confirmação
   - Redirecionamento para login

3. **Recuperação de Senha** (`ResetPassword.tsx`)
   - Formulário para nova senha
   - Validação de complexidade
   - Confirmação de alteração

4. **Dashboard de Estudante** (`Dashboard.tsx`)
   - Interface principal para estudantes
   - Controles de compartilhamento de localização
   - Botão de emergência

5. **Dashboard de Responsável** (`ParentDashboard.tsx`)
   - Interface principal para responsáveis
   - Visualização de estudantes vinculados
   - Acesso a localizações e configurações

## 🌐 URLs do Sistema

O Sistema Monitore disponibiliza os seguintes endpoints para acesso:

1. **Página Inicial (Login/Cadastro)**
   - `https://sistema-monitore.com.br/` - Página principal que contém as opções de login e cadastro

2. **Dashboards**
   - `https://sistema-monitore.com.br/dashboard` - Dashboard para estudantes
   - `https://sistema-monitore.com.br/parent-dashboard` - Dashboard para responsáveis

3. **Confirmação de Cadastro**
   - `https://sistema-monitore.com.br/confirm` - Página para confirmar email após cadastro

4. **Recuperação de Senha**
   - `https://sistema-monitore.com.br/reset-password` - Página para redefinir senha

5. **Perfil de Usuário**
   - `https://sistema-monitore.com.br/profile` - Perfil do estudante, onde pode gerenciar informações pessoais e vincular responsáveis

6. **Configurações de Notificação**
   - `https://sistema-monitore.com.br/notifications` - Página para configurar preferências de notificação

7. **Página de Não Encontrado**
   - `https://sistema-monitore.com.br/*` - Página 404 para rotas não existentes

Todas as rotas são protegidas por autenticação, exceto a página inicial e as páginas relacionadas ao fluxo de autenticação (confirmação e recuperação de senha).
