
# Sistema Monitore - Páginas Principais

## 📱 Páginas do Sistema

### Página Inicial (Login/Cadastro)

Arquivo: `src/pages/Index.tsx`

Funcionalidades:
- Login com email/senha
- Cadastro de novos usuários
- Login com Google
- Recuperação de senha
- Redirecionamento automático para usuários já autenticados

### Dashboard

Arquivo: `src/pages/Dashboard.tsx`

Funcionalidades:
- Visualização do mapa com localização atual
- Controles para compartilhamento de localização
- Configurações de privacidade
- Acesso rápido às funcionalidades principais

### Perfil do Estudante

Arquivo: `src/pages/StudentProfile.tsx`

Funcionalidades:
- Visualização e edição de informações pessoais
- Gerenciamento de responsáveis
- Histórico de atividades
- Opções de privacidade avançadas

### Preferências de Notificação

Arquivo: `src/pages/NotificationPreferences.tsx`

Funcionalidades:
- Configuração de canais de notificação (email, push)
- Personalização de alertas por tipo de evento
- Programação de horários para notificações

## 🧭 Navegação e Rotas

O Sistema Monitore utiliza React Router Dom para gerenciar a navegação entre páginas:

- `/`: Página inicial com opções de login e cadastro
- `/dashboard`: Dashboard principal com mapa e controles
- `/profile`: Gerenciamento do perfil do usuário
- `/notifications`: Configurações de notificações
- `/404`: Página de erro para rotas não encontradas

## 🎨 Interfaces e Componentes UI

O sistema utiliza diversos componentes de interface para criar uma experiência consistente:

- **Formulários**: Componentes para entrada de dados com validação
- **Cards**: Containers para informações e controles relacionados
- **Botões**: Elementos de ação com diferentes variantes e estados
- **Mapas**: Visualização interativa de localização
- **Listas**: Exibição de dados tabulares e coleções
- **Modais**: Janelas sobrepostas para ações específicas
- **Toasts**: Notificações temporárias para feedback do sistema
