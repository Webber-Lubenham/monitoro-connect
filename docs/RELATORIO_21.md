
# RELATÓRIO 21 - Erros de Comunicação com Edge Functions

**Data:** 17/03/2025  
**Autor:** Equipe de Desenvolvimento  
**Status:** Em análise

## Erros Registrados

### Erro de Comunicação com Edge Function `send-email`

Durante o processo de notificação para os responsáveis dos alunos, foram registrados os seguintes erros:

```
POST https://usnrnaxpoqmojxsfcoox.supabase.co/functions/v1/send-email 400 (Bad Request)

[EMAIL][2025-03-16T22:08:32.965Z] ERROR: Edge Function send-email error: FunctionsHttpError: Edge Function returned a non-2xx status code
    at cX.<anonymous> (index-D9MxYjnk.js:67:154139)
    at Generator.next (<anonymous>)
    at s (index-D9MxYjnk.js:67:153020)

Error notifying guardian 9087b23c-4372-4471-ae37-c5211827d0d0: FunctionsHttpError: Edge Function returned a non-2xx status code
    at cX.<anonymous> (index-D9MxYjnk.js:67:154139)
    at Generator.next (<anonymous>)
    at s (index-D9MxYjnk.js:67:153020)
```

## Análise do Problema

O sistema está enfrentando problemas de comunicação com a Edge Function `send-email`, que está retornando um código de status HTTP 400 (Bad Request).

### Causas Prováveis:

1. **Formato incorreto do payload**: A Edge Function espera receber os parâmetros de email diretamente no nível superior do objeto JSON, mas o cliente pode estar aninhando esses parâmetros dentro de uma propriedade "payload".

2. **Validação de parâmetros**: Algum parâmetro obrigatório pode estar faltando ou em formato incorreto.

3. **Problemas de autenticação**: Possível falha na autenticação com o serviço Supabase ou com o provedor de email Resend.

4. **Configuração de ambiente**: Chave de API do Resend pode não estar configurada corretamente.

## Correções Implementadas

1. Corrigido o formato do payload no arquivo `edgeFunctionClient.ts`:
```javascript
// CRITICALLY IMPORTANT: Send email parameters directly at the top level
// This format must match exactly what the Edge Function expects
const payload = {
  from,
  to,
  subject,
  html,
  text
};
```

2. Melhorado o sistema de logging para facilitar diagnóstico:
```javascript
// Debug log to verify the payload structure
console.log(`Enviando para ${functionName} com corpo:`, JSON.stringify(payload));
```

3. Adicionado tratamento de erros mais detalhado na função `sendViaEdgeFunction`.

## Status da Resolução

Estamos monitorando os logs para verificar se as correções implementadas resolveram o problema. Caso os erros persistam, as seguintes ações serão consideradas:

1. Implementar uma versão simplificada da Edge Function para diagnóstico
2. Verificar os logs completos no painel de controle do Supabase
3. Testar o envio de email diretamente através da API do Resend
4. Implementar um mecanismo alternativo para notificações críticas

## Próximos Passos

1. Monitorar os logs de erro após as correções
2. Implementar testes unitários específicos para o envio de email
3. Criar uma interface de diagnóstico para testar a conectividade com a Edge Function
4. Considerar implementação de um sistema de filas para garantir entrega de notificações

---

**Próxima revisão:** 20/03/2025  
**Responsável pelo acompanhamento:** Equipe de Desenvolvimento
