
# Sistema Monitore - Tipos de Usuários e Permissões

## 👤 Tipos de Usuários

### 1. Estudantes
- **Papel no sistema:** `student`
- **Dashboard principal:** `/dashboard`
- **Funcionalidades exclusivas:**
  - Compartilhamento de localização em tempo real
  - Configurações de privacidade pessoal
  - Acionamento de alertas de emergência

### 2. Responsáveis (Guardiões)
- **Papel no sistema:** `guardian` ou `parent`
- **Dashboard principal:** `/parent-dashboard`
- **Funcionalidades exclusivas:**
  - Visualização de localização dos estudantes vinculados
  - Configuração de preferências de notificação
  - Gerenciamento de zonas seguras (geofences)

## 🔗 Relacionamentos entre Usuários

### Vínculo Estudante-Responsável

O sistema permite estabelecer vínculos entre estudantes e responsáveis:

1. **Criação do vínculo:**
   - Um responsável pode adicionar estudantes sob sua supervisão
   - Um estudante pode adicionar responsáveis para monitoramento

2. **Armazenamento do relacionamento:**
   - Tabela `guardians` armazena os vínculos
   - Campos principais: `guardian_id`, `student_id`, `is_primary`

3. **Hierarquia de responsáveis:**
   - Um estudante pode ter múltiplos responsáveis
   - Designação de responsável primário para decisões principais
   - Todos os responsáveis recebem notificações de localização e emergência

## 🛡️ Permissões de Usuários

### Permissões de Estudantes
- Gerenciar seu próprio perfil
- Ativar/desativar compartilhamento de localização
- Visualizar seu histórico de localizações
- Configurar privacidade e notificações
- Adicionar ou remover responsáveis

### Permissões de Responsáveis
- Visualizar perfis dos estudantes vinculados
- Acessar localização em tempo real dos estudantes
- Receber notificações configuradas
- Definir zonas seguras para os estudantes
- Gerenciar preferências de notificação
