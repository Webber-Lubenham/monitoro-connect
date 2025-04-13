# Sistema Monitore - Plataforma de Monitoramento de Estudantes

![Sistema Monitore Logo](https://sistema-monitore.com.br/logo.png)

## 🌟 Sobre o Projeto

O Sistema Monitore é uma plataforma web responsiva desenvolvida para proporcionar segurança e tranquilidade aos responsáveis de estudantes. Nossa solução permite o compartilhamento de localização em tempo real, notificações de emergência e gerenciamento eficiente da relação entre estudantes e seus responsáveis.

**URL Oficial**: [https://sistema-monitore.com.br](https://sistema-monitore.com.br)

## 🎯 Objetivos

- Facilitar a comunicação entre estudantes e responsáveis
- Proporcionar mais segurança para o deslocamento de estudantes
- Automatizar o processo de notificação em casos de emergência
- Oferecer uma plataforma intuitiva e acessível para todos os usuários
- Garantir a privacidade e segurança dos dados compartilhados

## ✨ Funcionalidades Principais

### Para Estudantes
- Cadastro completo de múltiplos responsáveis com diferentes níveis de acesso
- Compartilhamento de localização em tempo real ou agendado
- Sistema de botão de emergência para situações críticas
- Gerenciamento de configurações de privacidade
- Dashboard intuitivo com todas as informações relevantes

### Para Responsáveis
- Acompanhamento em tempo real da localização dos estudantes
- Recebimento de notificações importantes via e-mail
- Acesso a histórico de localizações
- Configuração de preferências de notificação
- Visualização centralizada de todos os estudantes vinculados

## 🚀 Arquitetura do Sistema

### Frontend
- **React**: Framework JavaScript para construção de interfaces
- **TypeScript**: Superset de JavaScript tipado
- **Tailwind CSS**: Framework de CSS utilitário
- **shadcn/ui**: Componentes de UI reutilizáveis
- **React Router**: Gerenciamento de rotas
- **MapBox GL**: Visualização de mapas e localização

### Backend
- **Supabase**: Plataforma de backend completa
  - Autenticação e gerenciamento de usuários
  - Banco de dados PostgreSQL
  - Row-Level Security (RLS)
  - Edge Functions para processamento em servidores
  - Armazenamento de arquivos

### Integrações
- **Resend**: Serviço de envio de e-mails transacionais
- **MapBox**: API de mapas e geolocalização

## 🛠️ Componentes do Sistema

### Sistema de Autenticação
- Login e registro de estudantes e responsáveis
- Confirmação de e-mail para verificação de usuários
- Recuperação de senha
- Proteção de rotas baseada em perfil de usuário

### Sistema de Localização
- Compartilhamento de localização em tempo real
- Histórico de localizações
- Controle de permissões de acesso à localização
- Visualização em mapa interativo

### Sistema de Notificações
- Notificações por e-mail
- Alertas de emergência
- Confirmações de cadastro e vinculação

### Gerenciamento de Responsáveis
- Cadastro de múltiplos responsáveis
- Definição de responsável principal
- Aprovação de vinculações
- Envio de convites por e-mail

## 🔒 Segurança e Privacidade

- **Row-Level Security (RLS)**: Controle granular de acesso a dados
- **Criptografia**: Proteção de dados sensíveis
- **Consentimento explícito**: Para compartilhamento de localização
- **Controle de sessão**: Tokens JWT para autenticação segura
- **Registro de atividades**: Para auditoria e monitoramento

## 📱 Compatibilidade

O Sistema Monitore foi projetado para funcionar perfeitamente em:

- 💻 Computadores (Windows, macOS, Linux)
- 📱 Smartphones (Android, iOS)
- 🖥️ Tablets e outros dispositivos móveis
- 🌐 Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🤝 Suporte

Para obter suporte ou tirar dúvidas:

- 📧 Email: suporte@sistema-monitore.com.br
- 💬 Chat ao vivo: Disponível no site em horário comercial

## 📚 Documentação

A documentação completa do sistema está organizada nos seguintes diretórios:

- `/docs/projeto_monitore/`: Documentação principal do projeto
- `/docs/auth/`: Documentação de autenticação e usuários
- `/docs/user-guides/`: Guias de usuário para estudantes e responsáveis
- `/src/docs/`: Documentação técnica para desenvolvedores

## 🛠️ Para Desenvolvedores

### Estrutura do Projeto

- `/src/components/`: Componentes React reutilizáveis
- `/src/pages/`: Páginas principais da aplicação
- `/src/hooks/`: Hooks personalizados para lógica de negócio
- `/src/services/`: Serviços para comunicação com APIs
- `/src/lib/`: Utilitários e configurações
- `/supabase/functions/`: Edge Functions do Supabase
- `/supabase/migrations/`: Migrações de banco de dados

### Como Executar o Projeto

1. Requisitos: Node.js & npm instalados
2. Clone o repositório: `git clone <URL_DO_GIT>`
3. Navegue até o diretório: `cd sistema-monitore`
4. Instale as dependências: `npm i`
5. Configure as variáveis de ambiente no arquivo `.env`:
   ```
   VITE_SUPABASE_URL=<sua_url_supabase>
   VITE_SUPABASE_ANON_KEY=<sua_chave_anonima>
   ```
6. Inicie o servidor de desenvolvimento: `npm run dev`

### Edge Functions

O sistema utiliza Edge Functions do Supabase para processamento no servidor:

- **email-service**: Serviço principal de e-mail
- **send-location-email**: Envio de e-mails com localização
- **send-guardian-email**: Envio de e-mails para responsáveis
- **send-confirmation-email**: Envio de e-mails de confirmação

## 🔄 Fluxos Principais

### Fluxo de Registro e Autenticação
1. Usuário se registra como estudante ou responsável
2. Confirma o e-mail através de link enviado
3. Completa o perfil com informações adicionais
4. Acessa o dashboard específico para seu perfil

### Fluxo de Compartilhamento de Localização
1. Estudante ativa o compartilhamento de localização
2. Sistema captura e armazena a posição geográfica
3. Responsáveis vinculados recebem notificações
4. Localização é exibida no mapa para os responsáveis

### Fluxo de Emergência
1. Estudante aciona o botão de emergência
2. Sistema captura a localização atual com alta prioridade
3. Notificação de emergência é enviada a todos os responsáveis
4. A localização de emergência é destacada no mapa

## 📊 Banco de Dados

O sistema utiliza um banco de dados PostgreSQL com as seguintes tabelas principais:

- **profiles**: Perfis de usuários
- **guardians**: Relações entre estudantes e responsáveis
- **location_updates**: Histórico de atualizações de localização
- **notification_logs**: Registro de notificações enviadas

## 📈 Roadmap Futuro

- Aplicativo móvel nativo para iOS e Android
- Notificações push para dispositivos móveis
- Integração com sistemas escolares
- Análise avançada de padrões de movimentação
- Definição de rotas seguras e geofencing

## 📄 Licença

© 2024 Sistema Monitore. Todos os direitos reservados.
