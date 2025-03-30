
# Sistema de Autenticação

## 🔐 Configuração Geral
- 🔒 **Status:** Ativo
- 🕒 **Expiração do Token:** 1 hora
- 🔑 **Secret:** `mySecretToken`

## 🔒 Segurança de Login
- 🛡️ **Máximo de Tentativas:** 5
- ⏳ **Tempo de Bloqueio:** 15 minutos
- 📝 **Registro:** Todas as tentativas são logadas
- 🔒 **Validações:**
  - Credenciais via Supabase
  - Perfil na tabela `profiles`
  - Role específica do usuário

## 📧 Email Templates
1. **Signup Confirmation**
   ```html
   <h2>Confirm your signup</h2>
   <p><a href="{{ .ConfirmationURL }}">Confirm your mail</a></p>
   ```

2. **Password Reset**
   ```html
   <h2>Reset Password</h2>
   <p><a href="{{ .ConfirmationURL }}">Reset Password</a></p>
   ```

3. **Magic Link**
   ```html
   <h2>Magic Link</h2>
   <p><a href="{{ .ConfirmationURL }}">Log In</a></p>
   ```

## Usuários de Teste
### Parent Account
- 📧 **Email:** `mauro.lima@educacao.am.gov.br`
- 🔑 **Password:** `senha123`

### Student Account
- 📧 **Email:** `sarah.lima@educacao.am.gov.br`
- 🔑 **Password:** `senha123`
