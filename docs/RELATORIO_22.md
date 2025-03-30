
# RELATÓRIO 22 - Erros Persistentes na Edge Function send-email

**Data:** 17/03/2025  
**Autor:** Equipe de Desenvolvimento  
**Status:** Em análise

## Erros Registrados

### Erro Persistente de Comunicação com Edge Function `send-email`

Apesar das correções implementadas anteriormente, continuamos a registrar o seguinte erro durante o envio de notificações para os responsáveis dos alunos:

```
POST https://usnrnaxpoqmojxsfcoox.supabase.co/functions/v1/send-email 400 (Bad Request)

[EMAIL][2025-03-17T09:03:34.767Z] ERROR: Edge Function send-email error: 
{error: FunctionsHttpError: Edge Function returned a non-2xx status code}

Error notifying guardian 9087b23c-4372-4471-ae37-c5211827d0d0: FunctionsHttpError: Edge Function returned a non-2xx status code
    at cX.<anonymous> (index-BLrCHF2R.js:67:154139)
    at Generator.next (<anonymous>)
    at s (index-BLrCHF2R.js:67:153020)
```

## Análise do Problema

O sistema continua enfrentando erros 400 (Bad Request) ao tentar se comunicar com a Edge Function `send-email` do Supabase. Este é um problema crítico, pois impede o envio de notificações aos responsáveis.

### Causas Prováveis Revisadas:

1. **Incompatibilidade de formato do payload**: Mesmo após as modificações, podem existir diferenças sutis entre o formato que estamos enviando e o que a Edge Function espera.

2. **Formato de valores dentro do payload**: Algum valor específico nos campos (como o corpo HTML ou texto) pode estar causando problemas de parsing.

3. **Limitações de tamanho**: É possível que o payload esteja excedendo limites de tamanho para Edge Functions do Supabase.

4. **Headers da requisição**: Pode haver uma incompatibilidade nos headers enviados.

5. **Problemas na Edge Function**: O código da Edge Function pode conter bugs que não estão sendo capturados corretamente.

## Logs Adicionais de Diagnóstico

Adicionamos logs detalhados para melhor diagnosticar o problema:

```javascript
// No cliente
console.log('Final email payload structure:', JSON.stringify(payload, null, 2));

// Na Edge Function
console.log('Raw request body:', bodyText);
console.log('Extracted email parameters:', { to, subject, from: from || 'default', htmlLength: html?.length });
```

## Depuração e Verificações

Com base nos erros persistentes, realizamos as seguintes verificações adicionais:

1. **Verificação dos logs da Edge Function**: Analisamos os logs detalhados no painel do Supabase para entender o erro exato ocorrendo no servidor.

2. **Inspeção da requisição HTTP**: Monitoramos todo o ciclo de vida da requisição desde o frontend até a Edge Function.

3. **Teste com payload simplificado**: Tentamos enviar um payload mínimo para isolar possíveis problemas com o conteúdo.

4. **Verificação da chave da API Resend**: Confirmamos que a chave da API Resend está corretamente configurada nas variáveis de ambiente da Edge Function.

## Próximas Etapas

Para resolver este problema persistente, recomendamos:

1. **Reduzir complexidade do payload**: Simplificar o conteúdo HTML e texto para descartar problemas de formatação.

2. **Criar uma Edge Function de diagnóstico**: Implementar uma Edge Function separada para validação que apenas ecoa o payload recebido, sem tentar enviar o email.

3. **Atualizar a versão da SDK do Supabase**: Verificar se há problemas conhecidos na versão atual da SDK.

4. **Implementar mecanismo de fallback robusto**: Criar uma rota alternativa para envio de emails críticos.

5. **Monitoramento proativo**: Adicionar alertas para falhas de envio de notificações.

## Conclusão

O problema de comunicação com a Edge Function `send-email` persiste apesar das correções aplicadas anteriormente. Estamos trabalhando para diagnosticar a causa raiz e implementar uma solução definitiva.

As notificações são um componente crítico do Sistema Monitore, e continuaremos a priorizar essa correção.

---

**Próxima revisão:** 19/03/2025  
**Responsável pelo acompanhamento:** Equipe de Desenvolvimento

