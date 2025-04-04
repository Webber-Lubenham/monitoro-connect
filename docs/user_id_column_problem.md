
# Problema de Coluna `user_id` ausente em `parent_notification_preferences`

## Descrição do Problema

A aplicação está encontrando erros ao tentar acessar a coluna `user_id` na tabela `parent_notification_preferences`. As requisições de busca estão retornando status 400 (Bad Request) devido à ausência desta coluna.

## Detalhes do Erro

Mensagens de erro nos logs:
```
GET https://usnrnaxpoqmojxsfcoox.supabase.co/rest/v1/parent_notification_preferences?select=user_id&limit=1 400 (Bad Request)
```

E mensagem específica:
```
auth.ts:90 user_id column missing from notification preferences table
```

## Impacto

Este problema afeta:
- Carregamento de preferências de notificação dos usuários
- Configurações personalizadas de notificação
- Potencialmente causa falhas em notificações automáticas

## Solução

A migração para adicionar a coluna `user_id` já foi criada em `supabase/migrations/20240610000000_add_user_id_to_preferences.sql`, mas precisa ser aplicada ao banco de dados.

### Passos para Implementação

1. Verificar se a migração foi aplicada corretamente:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'parent_notification_preferences';
   ```

2. Se a coluna não existir, aplicar a migração executando:
   ```bash
   supabase db push
   ```

3. Atualizar o código da aplicação que interage com esta tabela para usar a nova coluna:
   - Em `src/config/auth.ts` (já foi atualizado para verificar a existência da coluna)
   - Em `src/integrations/auth.ts` (atualizado para usar `parent_id` como fallback)
   - Em `src/pages/NotificationPreferences.tsx` (adicionar suporte ao novo campo)

## Verificação da Solução

Após aplicar a migração e atualizar o código, verificar se:

1. A coluna `user_id` existe na tabela `parent_notification_preferences`
2. As consultas usando essa coluna funcionam corretamente
3. Os logs não mostram mais o erro de "coluna ausente"

## Notas Adicionais

- A migração atual adiciona a coluna `user_id` como uma foreign key para `auth.users(id)`
- Esta atualização faz parte de uma melhoria na estrutura de dados para tornar mais claro o relacionamento entre usuários e suas preferências de notificação
- Os dados existentes não serão afetados, pois a coluna é opcional (nullable)
