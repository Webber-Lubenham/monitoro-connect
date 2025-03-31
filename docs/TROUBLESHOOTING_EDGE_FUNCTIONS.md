
# Troubleshooting Edge Functions

## "Max number of functions reached for project" Error

Se você encontrar este erro ao implantar Edge Functions:

```
unexpected status 403: {"message":"Max number of functions reached for project"}
```

Isso significa que seu projeto Supabase atingiu o número máximo de Edge Functions permitidas no seu plano atual.

### Solução:

1. **Use os Scripts de Limpeza (Recomendado)**

   Execute um destes scripts para limpar automaticamente as Edge Functions desnecessárias:
   ```bash
   # Opção 1: Usando script Node.js
   node scripts/cleanup_edge_functions.js

   # Opção 2: Usando script Bash
   bash scripts/cleanup_edge_functions.sh
   ```
   
   Estes scripts irão excluir funções redundantes que foram consolidadas na função principal `email-service`.

2. **Limpeza Manual (Se os scripts falharem)**

   Se os scripts não funcionarem, exclua manualmente estas funções no dashboard do Supabase:
   
   1. Acesse: https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions
   2. Procure e exclua estas funções redundantes:
      - `send-email`
      - `send-test-email`
      - `direct-email-test`
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

3. **Funções Principais a Serem Mantidas**

   Após a limpeza, apenas estas funções essenciais devem permanecer:
   - `email-service` (serviço de email consolidado)
   - `send-confirmation-email` (registro de usuário)
   - `send-guardian-invitation` (redireciona para email-service)
   - `get-mapbox-token` (integração mapbox)
   - `notify-location` (gerencia notificações de localização)
   - `test-connectivity` (função de diagnóstico)

4. **Após a Limpeza**

   Depois de remover as funções redundantes, tente implantar novamente:
   ```bash
   supabase functions deploy email-service
   ```

## Estratégia de Consolidação de Funções

Consolidamos múltiplas funções relacionadas a email em uma única função `email-service` que gerencia diferentes tipos de notificações por email através de um parâmetro de tipo:

```javascript
// Exemplo de chamada da função email-service consolidada
const response = await supabase.functions.invoke('email-service', {
  body: {
    type: 'location-notification',  // Ou 'guardian-notification', 'test', etc.
    data: {
      // Payload específico do tipo
    }
  }
});
```

Esta abordagem reduz significativamente o número de Edge Functions necessárias enquanto mantém toda a funcionalidade.

## Problemas Comuns de Implantação

Se você ainda estiver tendo problemas após limpar as funções:

1. **Verifique a Versão da CLI do Supabase**
   Certifique-se de estar usando a versão mais recente da CLI do Supabase:
   ```bash
   supabase --version
   npm install -g supabase@latest  # Atualize se necessário
   ```

2. **Verifique a Autenticação**
   Certifique-se de que sua CLI do Supabase esteja autenticada corretamente:
   ```bash
   supabase login
   ```

3. **Verifique a Referência do Projeto**
   Verifique se você está usando o ID de referência correto do projeto:
   ```bash
   supabase projects list
   ```

4. **Verifique os Limites de Tamanho da Função**
   Edge Functions têm limites de tamanho. Se sua função for muito grande, tente:
   - Reduzir dependências
   - Dividir a funcionalidade em várias funções
   - Remover código e comentários desnecessários

5. **Problemas de Rede**
   Se você estiver experimentando timeouts ou problemas de conexão:
   ```bash
   supabase functions deploy email-service --project-ref usnrnaxpoqmojxsfcoox --debug
   ```
   Isto mostrará informações de erro mais detalhadas.
