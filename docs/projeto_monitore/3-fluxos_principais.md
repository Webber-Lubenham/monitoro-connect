
# Sistema Monitore - Fluxos Principais

## 🔄 Fluxos de Usuário

### Fluxo de Compartilhamento de Localização

1. Usuário faz login na aplicação
2. Sistema verifica permissões de localização
3. Usuário ativa compartilhamento de localização
4. Sistema começa a rastrear e enviar atualizações
5. Responsáveis recebem notificações conforme configurações
6. Usuário pode desativar compartilhamento a qualquer momento

### Fluxo de Cadastro de Responsável

1. Usuário acessa página de perfil
2. Seleciona opção para adicionar responsável
3. Preenche dados do responsável (nome, email, telefone)
4. Sistema valida informações e envia convite por email
5. Responsável confirma convite e cria conta (se necessário)
6. Vínculo é estabelecido entre estudante e responsável

### Fluxo de Emergência

1. Usuário pressiona botão de emergência
2. Sistema captura localização atual com máxima precisão
3. Notificação prioritária é enviada para todos os responsáveis
4. Status de emergência é registrado no sistema
5. Responsáveis podem visualizar localização exata e detalhes
6. Histórico da situação é mantido para referência futura

## 🔐 Sistema de Autenticação

### Login e Cadastro

O sistema oferece várias opções de autenticação:

- Login com email/senha
- Login com Google (integração OAuth)
- Cadastro de novos usuários com validação de email
- Confirmação por email para novos cadastros

### Recuperação de Senha

O sistema inclui um fluxo completo de recuperação de senha:

- Solicitação de redefinição via email
- Tokens seguros e temporários
- Interface dedicada para criação de nova senha
- Validação de critérios de segurança para senhas

## 📩 Sistema de Notificações

O sistema notifica os responsáveis em diversos cenários:

- Compartilhamento de localização em tempo real
- Situações de emergência
- Entrada/saída de zonas seguras (geofences)
- Alterações no status do estudante

### Canais de Notificação

- Email (via Resend)
- Push notifications (web)
- Notificações em aplicativo
