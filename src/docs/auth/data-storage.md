
# Sistema Monitore - Armazenamento de Dados de Usuários

## 📊 Armazenamento de Dados de Usuários

### Tabelas Principais

1. **profiles**
   - Armazena dados básicos de todos os usuários
   - Vinculada ao ID do usuário em `auth.users`
   - Contém papel do usuário e informações de contato

2. **guardians**
   - Armazena relacionamentos entre estudantes e responsáveis
   - Contém informações de contato dos responsáveis
   - Registra status do relacionamento (primário/secundário)

3. **parent_notification_preferences**
   - Armazena preferências de notificação dos responsáveis
   - Vinculada ao ID do responsável
   - Configura métodos preferidos de notificação (email, WhatsApp)

## 🔒 Segurança e Privacidade

### Autenticação
- Gerenciada pelo Supabase Auth
- Tokens JWT para controle de sessão
- Confirmação de email obrigatória
- Bloqueio temporário após múltiplas tentativas de login falhas

### Proteção de Dados
- Row Level Security (RLS) para controle de acesso
- Geofencing para delimitação de zonas seguras
- Criptografia para dados sensíveis
- Armazenamento seguro de tokens e senhas

### Políticas de Acesso
- Usuários só podem acessar seus próprios dados
- Responsáveis só acessam dados de estudantes vinculados
- Isolamento completo entre usuários não relacionados
- Registro de atividades para auditoria
