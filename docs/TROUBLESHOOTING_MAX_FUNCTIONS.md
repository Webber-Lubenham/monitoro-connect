# Resolvendo o Problema "Max number of functions reached"

Este guia fornece os passos necessários para resolver o erro "Max number of functions reached for project" no Supabase.

## Pré-requisitos

1. Docker Desktop instalado e rodando
2. Supabase CLI instalado
3. Token de acesso do Supabase configurado

## Passo a Passo

### 1. Preparação do Ambiente

1. Abra o Docker Desktop e aguarde ele inicializar completamente
2. Verifique se o Docker está rodando:
   ```bash
   docker ps
   ```

### 2. Configuração do Token Supabase

1. Abra o arquivo `.env` e verifique se o token está configurado:
   ```
   SUPABASE_CLI_TOKEN=sbp_a62a0ff07aed3f8d449dada64e2d40ca6ac1ba2c
   ```

### 3. Limpeza das Funções Edge

1. Execute o script de limpeza para remover funções redundantes:
   ```bash
   bash scripts/cleanup_edge_functions.sh
   ```

   Este script tentará remover as seguintes funções:
   - debug-email
   - diagnose-email
   - echo-payload
   - send-guardian-email
   - notify-email
   - test-email
   - test-location-email
   - send-location-email
   - verify-resend-config
   - test-resend-connection

### 4. Verificação da Limpeza

1. Liste as funções Edge restantes:
   ```bash
   supabase functions list --project-ref usnrnaxpoqmojxsfcoox
   ```

### 5. Implantação da Nova Função

1. Implante a função test-resend-connection:
   ```bash
   supabase functions deploy test-resend-connection --project-ref usnrnaxpoqmojxsfcoox
   ```

## Solução de Problemas

Se encontrar erros durante o processo:

### Erro de Docker
Se receber erro relacionado ao Docker:
1. Verifique se o Docker Desktop está rodando
2. Reinicie o Docker Desktop se necessário
3. Aguarde a inicialização completa

### Erro de Autenticação Supabase
Se receber erro de autenticação:
1. Verifique se o token está correto no arquivo `.env`
2. Exporte o token manualmente:
   ```bash
   $env:SUPABASE_ACCESS_TOKEN = "sbp_a62a0ff07aed3f8d449dada64e2d40ca6ac1ba2c"
   ```

### Limpeza Manual (se necessário)

Se os scripts não funcionarem, você pode remover as funções manualmente:

1. Acesse o painel do Supabase: https://supabase.com/dashboard
2. Selecione o projeto (ID: usnrnaxpoqmojxsfcoox)
3. Vá para a seção Edge Functions
4. Para cada função redundante:
   - Clique na função
   - Clique em "Delete Function"
   - Confirme a exclusão

## Verificação Final

Após completar todos os passos:

1. Verifique se a função foi implantada com sucesso
2. Teste a funcionalidade para garantir que tudo está funcionando
3. Verifique os logs no painel do Supabase para identificar possíveis erros

## Contato para Suporte

Se precisar de ajuda adicional:
1. Abra uma issue no repositório do projeto
2. Entre em contato com o suporte do Supabase
3. Consulte a documentação em: https://supabase.com/docs
