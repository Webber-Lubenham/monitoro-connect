
# Solução para o Problema de Limite de Funções no Supabase

## Problema Identificado

O sistema Monitore encontrou o seguinte erro ao tentar implantar novas Edge Functions:

```
unexpected create function status 403: {"message":"Max number of functions reached for project"}
```

Este erro ocorre quando atingimos o limite máximo de funções permitidas no plano atual do Supabase.

## Causa do Problema

Durante o desenvolvimento, várias Edge Functions foram criadas para testes, depuração e funcionalidades específicas. Ao longo do tempo, muitas destas funções foram consolidadas no serviço `email-service`, tornando as funções individuais originais redundantes.

## Solução Implementada

### 1. Consolidação de Funções

Todas as funções relacionadas a emails foram consolidadas em um único serviço `email-service`, que agora gerencia diferentes tipos de notificações:

- Notificações de localização
- Convites para responsáveis
- Emails de teste
- Notificações para responsáveis

### 2. Procedimento de Limpeza

Para resolver o erro, implementamos um processo de limpeza que remove funções redundantes:

#### Método Automático (Recomendado)

Execute um dos scripts de limpeza fornecidos:

```bash
# Opção 1: Usando o script Node.js
node scripts/cleanup_edge_functions.js

# Opção 2: Usando o script Bash
bash scripts/cleanup_edge_functions.sh
```

Estes scripts excluirão automaticamente as seguintes funções:
- `debug-email`
- `diagnose-email`
- `echo-payload`
- `send-guardian-email`
- `notify-email`
- `test-email`
- `test-location-email`
- `send-location-email`
- `verify-resend-config`
- `test-resend-connection`
- `direct-email-test`
- `send-test-email`
- `send-email`

#### Método Manual

Se os scripts não funcionarem, você pode excluir manualmente as funções redundantes:

1. Acesse o painel do Supabase: https://supabase.com/dashboard/project/pqhxgsrbazjgzyrxhyjj/functions
2. Localize as funções listadas acima
3. Clique no botão "Delete Function" para cada uma delas
4. Confirme a exclusão quando solicitado

### 3. Lista de Funções Essenciais

Após a limpeza, apenas estas funções principais devem permanecer:

- `email-service` (função consolidada para todos os serviços de email)
- `send-confirmation-email` (emails de registro de usuário)
- `send-guardian-invitation` (redirecionamento para email-service)
- `get-mapbox-token` (fornece token do Mapbox)
- `notify-location` (gerencia notificações de localização)
- `test-connectivity` (função de diagnóstico)

## Configuração CORS Aprimorada

Além da limpeza das funções, identificamos e corrigimos problemas de CORS que estavam afetando as chamadas às Edge Functions. A configuração CORS foi atualizada para aceitar solicitações dos seguintes domínios:

```javascript
const allowedOrigins = [
  'http://localhost:8080', 
  'https://sistema-monitore.com.br', 
  'https://www.sistema-monitore.com.br',
  'https://student-sentinel-hub.lovable.app',
  'https://lovable.dev',
  'https://*.lovable.app'
];
```

## Prevenção de Problemas Futuros

Para evitar atingir novamente o limite de funções:

1. **Consolidar funcionalidades relacionadas** em uma única função usando padrões baseados em tipo
2. **Remover funções de teste** após a conclusão do desenvolvimento
3. **Manter documentação atualizada** sobre quais funções podem ser removidas com segurança
4. **Monitorar regularmente** o número de funções no projeto

## Verificação da Solução

Após aplicar a solução de limpeza, você deve ser capaz de implantar novas funções sem encontrar o erro "Max number of functions reached for project".

Para verificar se a solução foi aplicada corretamente, execute:

```bash
supabase functions list --project-ref pqhxgsrbazjgzyrxhyjj
```

Isso listará todas as funções atualmente implantadas, permitindo que você confirme que apenas as funções essenciais estão presentes.
