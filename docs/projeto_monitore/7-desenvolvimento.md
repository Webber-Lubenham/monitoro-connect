
# Sistema Monitore - Guia para Desenvolvedores

## 💻 Ambiente de Desenvolvimento

### Requisitos

- Node.js (v18 ou superior)
- npm/yarn/bun
- Git

### Configuração Inicial

1. Clone o repositório:
   ```bash
   git clone <URL_DO_REPOSITÓRIO>
   cd sistema-monitore
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=<URL_DO_SUPABASE>
   VITE_SUPABASE_ANON_KEY=<CHAVE_ANÔNIMA_DO_SUPABASE>
   VITE_MAPBOX_TOKEN=<TOKEN_DO_MAPBOX>
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🧩 Estrutura do Projeto

```
src/
  ├── components/        # Componentes reutilizáveis
  │   ├── ui/            # Componentes básicos de UI (shadcn/ui)
  │   ├── auth/          # Componentes de autenticação
  │   ├── dashboard/     # Componentes do dashboard
  │   ├── profile/       # Componentes de perfil
  │   └── ...
  ├── hooks/             # Hooks personalizados
  ├── pages/             # Páginas da aplicação
  ├── services/          # Serviços e APIs
  ├── types/             # Definições de tipos TypeScript
  ├── utils/             # Utilitários e helpers
  ├── integrations/      # Integrações com serviços externos
  ├── lib/               # Bibliotecas e configurações
  ├── App.tsx            # Componente principal
  └── main.tsx           # Ponto de entrada
```

## 🚀 Extensão do Projeto

### Criação de Novas Funcionalidades

1. **Planejamento**: Defina claramente o escopo da funcionalidade
2. **Componentes**: Crie componentes modulares e reutilizáveis
3. **Hooks**: Extraia lógica complexa para hooks personalizados
4. **Testes**: Implemente testes para garantir a qualidade
5. **Documentação**: Atualize a documentação para refletir as mudanças

### Boas Práticas

- Siga o padrão de nomenclatura existente
- Mantenha componentes pequenos e focados
- Use TypeScript para definir interfaces claras
- Reutilize componentes e hooks existentes
- Mantenha o estado perto de onde é usado
- Documente decisões arquiteturais importantes

## 🔄 Fluxo de Trabalho Git

1. Crie uma branch para sua feature/fix: `git checkout -b feature/nome-da-feature`
2. Faça commits pequenos e descritivos
3. Abra um Pull Request detalhando as mudanças
4. Solicite revisão de código
5. Após aprovação, faça o merge na branch principal

## 🐞 Debugging

- Use `console.log()` estrategicamente
- Utilize o React Developer Tools para inspecionar componentes
- Verifique os logs do Supabase para problemas no servidor
- Inspecione requisições de rede para identificar problemas de API
