
# Sistema Monitore - Fluxos Técnicos de Autenticação

## 📊 Fluxograma Técnico de Cadastro

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ SignupForm.tsx  │────▶│  useSignup.ts   │────▶│ Supabase Auth   │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Index.tsx     │◀────│   Confirm.tsx   │◀────│ resendService   │
│   (Login)       │     │ (Verificação)   │     │ (Email)         │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📊 Fluxograma Técnico de Login

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  LoginForm.tsx  │────▶│  Supabase Auth  │────▶│ Verificação Role│
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                              ┌───────────────────────────┴───────────────────────┐
                              │                                                   │
                              ▼                                                   ▼
                    ┌─────────────────┐                                 ┌─────────────────┐
                    │                 │                                 │                 │
                    │   Dashboard.tsx │                                 │ParentDashboard  │
                    │   (Estudante)   │                                 │  (Responsável)  │
                    │                 │                                 │                 │
                    └─────────────────┘                                 └─────────────────┘
```

## 📊 Fluxograma Técnico de Recuperação de Senha

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│PasswordResetForm│────▶│  Supabase Auth  │────▶│ Email de Reset  │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Index.tsx     │◀────│ ResetPassword   │◀────│  Token no URL   │
│    (Login)      │     │     .tsx        │     │                 │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📊 Estrutura de Dados de Usuários

```
┌───────────────────────────┐
│       auth.users          │
├───────────────────────────┤
│ id (PK)                   │
│ email                     │
│ encrypted_password        │
│ email_confirmed_at        │
│ raw_user_meta_data        │
│  └─ role: "student"|"guardian" │
└─────────────┬─────────────┘
              │
              │ 1:1
              ▼
┌───────────────────────────┐
│        profiles           │
├───────────────────────────┤
│ id (PK) → auth.users.id   │
│ email                     │
│ role                      │
│ created_at                │
│ updated_at                │
└───────────────────────────┘
              │
              │ 1:N
              ▼
┌───────────────────────────┐
│        guardians          │
├───────────────────────────┤
│ id (PK)                   │
│ student_id                │
│ nome                      │
│ telefone                  │
│ email                     │
│ is_primary                │
│ created_at                │
│ updated_at                │
└───────────────────────────┘
              │
              │ 1:N
              ▼
┌───────────────────────────┐
│parent_notification_preferences│
├───────────────────────────┤
│ id (PK)                   │
│ parent_id                 │
│ student_id                │
│ email                     │
│ notification_type         │
│ created_at                │
│ updated_at                │
└───────────────────────────┘
```

## 🔄 Ciclo de Vida da Autenticação

1. **Cadastro**
   ```
   Frontend → useSignup → Supabase Auth → Email de Confirmação → Confirmação → Login
   ```

2. **Login**
   ```
   LoginForm → Supabase Auth → Verificação de Role → Redirecionamento para Dashboard
   ```

3. **Recuperação de Senha**
   ```
   PasswordResetForm → Supabase Auth → Email → Link → ResetPassword → Login
   ```

4. **Sessão**
   ```
   Login → Token JWT → Verificação automática em cada página → Logout/Expiração
   ```

## 🔒 Implementação de Segurança

1. **RLS (Row Level Security)**
   ```sql
   -- Exemplo: Permissão para visualizar localizações
   CREATE POLICY "Guardians can view student locations"
   ON location_updates
   FOR SELECT
   USING (
     auth.uid() IN (
       SELECT guardian_id 
       FROM guardians 
       WHERE student_id = location_updates.student_id
     )
   );
   ```

2. **Transições de Estado de Autenticação**
   ```typescript
   supabase.auth.onAuthStateChange((event, session) => {
     if (event === 'SIGNED_IN') {
       // Ações pós-login
     } else if (event === 'SIGNED_OUT') {
       // Limpeza de dados e redirecionamento
     }
   });
   ```

Este documento será atualizado conforme novas funcionalidades forem implementadas no sistema.
