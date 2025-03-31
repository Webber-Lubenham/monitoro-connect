
# Sistema Monitore - Arquitetura Técnica

## 🛠️ Visão Geral da Arquitetura

O Sistema Monitore adota uma arquitetura moderna que combina frontend React com backend Supabase, proporcionando uma experiência responsiva, segura e escalável.

### Frontend

- **Framework**: React com TypeScript
- **Estilização**: TailwindCSS com componentes shadcn/ui
- **Gerenciamento de Estado**: React Context, hooks personalizados
- **Roteamento**: React Router Dom
- **Geolocalização**: MapBox GL

### Backend (Supabase)

- **Autenticação**: Supabase Auth
- **Banco de Dados**: PostgreSQL gerenciado pelo Supabase
- **Storage**: Armazenamento para arquivos e imagens
- **Edge Functions**: Para envio de emails e processamento assíncrono
- **Realtime**: Para atualizações em tempo real

### Integrações

- **MapBox**: Visualização de mapas e geolocalização
- **Google OAuth**: Login com Google
- **Resend**: Serviço para envio de emails transacionais

## 🔒 Segurança e Privacidade

O sistema foi projetado com foco na segurança e privacidade:

- Autenticação baseada em JWT
- Row-Level Security (RLS) no banco de dados
- Criptografia de dados sensíveis
- Consentimento explícito para compartilhamento de localização
- Políticas de retenção de dados
- Controles granulares de privacidade

## 📊 Monitoramento e Logs

O sistema mantém registros detalhados para auditoria e suporte:

- Logs de autenticação e tentativas de login
- Histórico de compartilhamento de localização
- Registros de notificações enviadas
- Eventos de emergência
- Alterações em configurações de privacidade

## 🔄 Fluxo de Dados

1. O frontend React se comunica com o backend Supabase via API RESTful
2. Dados de localização são enviados para o Supabase em tempo real
3. Notificações são processadas por Edge Functions do Supabase
4. Emails são enviados usando o serviço Resend
5. Atualizações em tempo real são entregues via WebSockets
