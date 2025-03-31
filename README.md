# Monitoro Connect

Sistema de monitoramento e comunicação entre instituições de ensino, alunos e responsáveis.

## Tecnologias

- React + TypeScript + Vite
- Supabase
- Mapbox
- Shadcn/ui
- TailwindCSS

## Configuração do Ambiente

1. Clone o repositório
```bash
git clone https://github.com/Webber-Lubenham/monitoro-connect.git
cd monitoro-connect
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações

4. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/       # Contextos React
  ├── hooks/         # Hooks personalizados
  ├── lib/           # Utilitários e configurações
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e integrações
  └── types/         # Definições de tipos
```

## Funcionalidades

- Autenticação e autorização
- Gerenciamento de usuários
- Sistema de notificações
- Monitoramento em tempo real
- Integração com mapas
- Comunicação entre usuários

## Desenvolvimento

### Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Executa o linter
- `npm run types:supabase` - Atualiza os tipos do Supabase

### Padrões de Código

- Utilize TypeScript para todo código novo
- Siga as convenções do ESLint
- Mantenha os componentes pequenos e focados
- Documente funções e componentes complexos

## Contribuição

1. Crie uma branch para sua feature
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commit das suas alterações
```bash
git commit -m "feat: descrição da alteração"
```

3. Envie para o repositório
```bash
git push origin feature/nome-da-feature
```

4. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
