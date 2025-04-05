# Guia de Migração do Banco de Dados

## Problema Identificado
- Erro: `column parent_notification_preferences.user_id does not exist`
- Causa: O novo banco Supabase não tem a tabela/coluna esperada pelo código

## Solução Passo-a-Passo

1. Verificar estrutura atual:
```sql
SELECT * FROM information_schema.columns 
WHERE table_name = 'parent_notification_preferences';
```

2. Criar migration se necessário (arquivo .sql em supabase/migrations):
```sql
-- Exemplo: supabase/migrations/20240610_add_user_id_column.sql
ALTER TABLE parent_notification_preferences
ADD COLUMN user_id UUID REFERENCES auth.users(id);
```

3. Aplicar a migration:
```bash
supabase db push
```

4. Atualizar o código para usar o novo schema:
- Verificar se o client Supabase está usando a URL e chave corretas
- Atualizar queries para refletir a estrutura atual

## Verificação Final
1. Confirmar estrutura da tabela:
```sql
\d+ parent_notification_preferences
```

2. Testar consultas básicas:
```sql
SELECT * FROM parent_notification_preferences LIMIT 1;
```

## Dicas Importantes
- Faça backup do banco antes de alterações
- Teste em ambiente de desenvolvimento primeiro
- Documente todas as alterações de schema
