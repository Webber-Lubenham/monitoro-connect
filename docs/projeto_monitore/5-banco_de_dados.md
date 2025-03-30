
# Sistema Monitore - Banco de Dados

## 📋 Estrutura do Banco de Dados

O Sistema Monitore utiliza o PostgreSQL gerenciado pelo Supabase como banco de dados principal. As tabelas são organizadas para armazenar diferentes tipos de dados do sistema:

### Tabelas Principais

- **profiles**: Informações dos usuários
  - id (UUID): Identificador único do usuário, referenciado de auth.users
  - email (TEXT): Email do usuário
  - role (TEXT): Função do usuário no sistema (student, guardian, admin)
  - created_at, updated_at: Carimbos de data/hora

- **guardians**: Dados dos responsáveis
  - id (UUID): Identificador único do responsável
  - student_id (UUID): Referência ao estudante vinculado
  - nome (TEXT): Nome do responsável
  - telefone (TEXT): Número de telefone para contato
  - email (TEXT): Email para contato e notificações
  - is_primary (BOOLEAN): Indicador se é o responsável principal
  - created_at, updated_at: Carimbos de data/hora

- **location_updates**: Histórico de atualizações de localização
  - id (UUID): Identificador único da atualização
  - student_id (UUID): Referência ao estudante
  - latitude, longitude (NUMERIC): Coordenadas geográficas
  - accuracy (NUMERIC): Precisão da localização em metros
  - timestamp (TIMESTAMP): Momento da captura da localização
  - battery_level (INTEGER): Nível da bateria do dispositivo
  - status (ENUM): Status do estudante (unknown, moving, stopped)

- **notification_preferences**: Preferências de notificação
  - id (UUID): Identificador único
  - parent_id (UUID): Referência ao responsável
  - student_id (UUID): Referência ao estudante
  - email (TEXT): Email para notificações
  - notification_type (ENUM): Tipo de notificação preferido

- **safe_zones**: Definição de áreas seguras (geofences)
  - id (UUID): Identificador único da zona
  - student_id (UUID): Referência ao estudante
  - latitude, longitude (NUMERIC): Centro da área
  - radius (INTEGER): Raio da área em metros
  - name (TEXT): Nome descritivo da zona
  - type (TEXT): Tipo de zona (home, school, other)

## 🔐 Row-Level Security (RLS)

O Sistema Monitore implementa políticas de Row-Level Security no PostgreSQL para garantir que os dados sejam acessados apenas por usuários autorizados:

- Cada usuário só pode ver e modificar seus próprios dados
- Responsáveis só têm acesso a informações dos estudantes vinculados
- Administradores têm acesso controlado conforme necessidade
- Políticas específicas protegem dados sensíveis, como localização

## 🔄 Migrações e Atualizações

O esquema do banco de dados é mantido e versionado através de arquivos de migração SQL. Exemplos:

- `20250314_fix_signup_errors.sql`: Corrige problemas no processo de cadastro
- `20250228_update_rls_policies.sql`: Atualiza políticas de segurança

Essas migrações garantem que a estrutura do banco de dados seja consistente entre ambientes e permitem rastrear mudanças ao longo do tempo.
