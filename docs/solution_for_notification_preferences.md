
# Solução para o Problema da Coluna user_id Ausente

## O Problema

A aplicação está enfrentando um erro ao tentar acessar a coluna `user_id` na tabela `parent_notification_preferences`, o que está resultando em requisições com status 400 (Bad Request).

## Detalhes do Erro

```
GET https://usnrnaxpoqmojxsfcoox.supabase.co/rest/v1/parent_notification_preferences?select=user_id&limit=1 400 (Bad Request)
```

```
auth.ts:90 user_id column missing from notification preferences table
```

## A Solução

Para resolver este problema, é necessário aplicar a migração que já foi criada no arquivo `supabase/migrations/20240610000000_add_user_id_to_preferences.sql`. Esta migração adiciona a coluna `user_id` à tabela `parent_notification_preferences`.

### Passos para Implementar a Solução:

1. Execute o comando abaixo para aplicar a migração ao banco de dados:

```bash
supabase db push
```

2. Depois de aplicar a migração, verifique se a coluna foi adicionada corretamente:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'parent_notification_preferences';
```

3. O código já foi atualizado para utilizar a nova coluna e possui fallbacks para manter a compatibilidade com dados existentes, que usam a coluna `parent_id`.

## Impacto Após a Resolução

Com esta solução:
- As preferências de notificação serão carregadas corretamente
- As configurações personalizadas de notificação funcionarão como esperado
- Os erros 400 (Bad Request) não ocorrerão mais ao acessar esta tabela
