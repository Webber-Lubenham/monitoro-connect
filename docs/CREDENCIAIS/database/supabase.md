
# Configurações do Supabase

## 🔷 Projetos Supabase

### 🚀 Sistema Monitore (Principal)
- **URL:** `https://xknmrobwhtfgxhhyoknp.supabase.co`
- **Anon Key:** `def044e9846b911be33779dc84b9377ee516c96353065e818ce8d891d83c2315`
- **Service Role Key:** `2cb28e39cea181ad6433e16a0e678a484e18fe205e96cc3ea36f04ca102fbe34`
- **Database URL:** `adac018d308a803dffec9cd0618131b8f35871bd0f4175da1ce1cd1f4288de1d`

### 📱 Sistema Monitore (Secundário)
- **URL:** `https://usnrnaxpoqmojxsfcoox.supabase.co`
- **Uso:** Ambiente de desenvolvimento e testes
- **Recursos Ativos:**
  - Autenticação
  - Storage
  - Database
  - Edge Functions

### 📱 StudentRadar
- **Project Details**
  - URL: `https://hivbdytydwoyuhxqbttk.supabase.co`
  - Project Name: `radar`
  - Organization: `monitore.org`
  - Tier: Pro

## Configuração por Framework

### Framework-Specific Configurations
- **React**
  ```javascript
  REACT_APP_SUPABASE_URL=https://xknmrobwhtfgxhhyoknp.supabase.co
  REACT_APP_SUPABASE_ANON_KEY=def044e9846b911be33779dc84b9377ee516c96353065e818ce8d891d83c2315
  ```
- **Vite**
  ```javascript
  VITE_SUPABASE_URL=https://xknmrobwhtfgxhhyoknp.supabase.co
  VITE_SUPABASE_ANON_KEY=def044e9846b911be33779dc84b9377ee516c96353065e818ce8d891d83c2315
  ```
- **Expo**
  ```javascript
  EXPO_PUBLIC_SUPABASE_URL=https://xknmrobwhtfgxhhyoknp.supabase.co
  EXPO_PUBLIC_SUPABASE_ANON_KEY=def044e9846b911be33779dc84b9377ee516c96353065e818ce8d891d83c2315
  ```

### URLs de Redirecionamento Autorizados
- **Desenvolvimento**
  - `http://localhost:8080`
  - `http://localhost:8080/auth/callback`
  - `http://localhost:8080/login`
- **Produção**
  - `https://sistema-monitore.com.br`
  - `https://sistema-monitore.com.br/auth/callback`
  - `https://sistema-monitore.com.br/login`
  - `https://www.sistema-monitore.com.br`
  - `https://www.sistema-monitore.com.br/auth/callback`
  - `https://www.sistema-monitore.com.br/login`

## 🔒 Configurações de Segurança
- **RLS (Row Level Security):** Habilitado
- **Políticas de Backup:** Diário
- **Monitoramento:** Logs ativos
- **SSL/TLS:** Forçado para todas as conexões
