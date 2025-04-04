# Script para Corrigir Migrações Duplicadas

## Pré-requisitos
- Bash (já instalado no Windows via Git Bash ou WSL)
- PostgreSQL client (psql) instalado e no PATH
- Supabase CLI instalado e configurado

## Como Executar

1. Dê permissão de execução ao script:
```bash
chmod +x fix_migrations.sh
```

2. Execute o script:
```bash
./fix_migrations.sh
```

## O que o Script Faz

1. Carrega automaticamente as variáveis do arquivo .env
2. Verifica quais migrações já foram aplicadas no banco
3. Compara com as migrações locais na pasta supabase/migrations/
4. Filtra apenas as migrações pendentes
5. Executa o comando `supabase db push` apenas para as migrações necessárias

## Solução de Problemas

- Se o psql não estiver no PATH, especifique o caminho completo no script
- Verifique se o .env contém DATABASE_URL corretamente configurada
- Para debug, execute com `bash -x fix_migrations.sh`
