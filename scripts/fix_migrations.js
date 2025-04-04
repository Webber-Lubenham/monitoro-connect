#!/usr/bin/env node
require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configurações do .env
const DB_URL = process.env.DATABASE_URL;
const DB_PASSWORD = process.env.POSTGRES_PASSWORD;
const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');

async function main() {
  try {
    console.log('🔍 Verificando migrações aplicadas...');
    
    // 1. Listar migrações já aplicadas no banco
    const appliedMigrations = execSync(
      `psql "${DB_URL}" -c "SELECT version FROM supabase_migrations.schema_migrations;" -t`
    ).toString()
      .split('\n')
      .filter(Boolean)
      .map(v => v.trim());

    console.log('✅ Migrações aplicadas:', appliedMigrations);

    // 2. Listar migrações locais
    const localMigrations = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .map(f => f.split('_')[0]); // Extrai timestamp (ex: 20240610000000)

    console.log('📁 Migrações locais:', localMigrations);

    // 3. Filtrar migrações pendentes
    const pendingMigrations = localMigrations.filter(
      m => !appliedMigrations.includes(m)
    );

    if (pendingMigrations.length === 0) {
      console.log('🎉 Todas migrações já foram aplicadas!');
      return;
    }

    console.log('⏳ Migrações pendentes:', pendingMigrations);

    // 4. Executar apenas migrações pendentes
    console.log('🚀 Executando supabase db push...');
    execSync('supabase db push', { stdio: 'inherit' });

    console.log('✔️ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

main();
