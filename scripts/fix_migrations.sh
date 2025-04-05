#!/bin/bash

# Carrega variáveis do .env
set -a
source ../.env
set +a

echo "🔍 Verificando migrações aplicadas..."

# 1. Listar migrações já aplicadas no banco
applied_migrations=$(psql "$DATABASE_URL" -c "SELECT version FROM supabase_migrations.schema_migrations;" -t | tr -d ' ' | grep -v '^$')

echo "✅ Migrações aplicadas:"
echo "$applied_migrations"

# 2. Listar migrações locais
local_migrations=$(ls ../supabase/migrations/*.sql | xargs -n1 basename | cut -d'_' -f1)

echo "📁 Migrações locais:" 
echo "$local_migrations"

# 3. Filtrar migrações pendentes
pending_migrations=()
for migration in $local_migrations; do
  if ! echo "$applied_migrations" | grep -q "$migration"; then
    pending_migrations+=("$migration")
  fi
done

if [ ${#pending_migrations[@]} -eq 0 ]; then
  echo "🎉 Todas migrações já foram aplicadas!"
  exit 0
fi

echo "⏳ Migrações pendentes:"
printf '%s\n' "${pending_migrations[@]}"

# 4. Executar apenas migrações pendentes
echo "🚀 Executando supabase db push..."
supabase db push

echo "✔️ Migrações aplicadas com sucesso!"
