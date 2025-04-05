#!/usr/bin/env -S deno run --allow-read --allow-run --allow-env
import { parse } from "https://deno.land/std@0.224.0/flags/mod.ts";
import * as path from "node:path";
import * as fs from "node:fs";

// Carrega variáveis do .env
const env = Deno.env.toObject();
const DB_URL = env.DATABASE_URL;
const DB_PASSWORD = env.POSTGRES_PASSWORD;
const MIGRATIONS_DIR = path.join(Deno.cwd(), 'supabase/migrations');

async function runCommand(cmd: string[]): Promise<string> {
  const p = Deno.run({ cmd, stdout: "piped", stderr: "piped" });
  const [status, stdout, stderr] = await Promise.all([
    p.status(),
    p.output(),
    p.stderrOutput()
  ]);
  p.close();

  if (!status.success) {
    throw new Error(new TextDecoder().decode(stderr));
  }

  return new TextDecoder().decode(stdout);
}

async function main() {
  try {
    console.log('🔍 Verificando migrações aplicadas...');
    
    // 1. Listar migrações já aplicadas no banco
    const appliedResult = await runCommand([
      'psql', DB_URL, 
      '-c', "SELECT version FROM supabase_migrations.schema_migrations;",
      '-t'
    ]);
    const appliedMigrations = appliedResult
      .split('\n')
      .filter(Boolean)
      .map(v => v.trim());

    console.log('✅ Migrações aplicadas:', appliedMigrations);

    // 2. Listar migrações locais
    const localMigrations = fs.readdirSync(MIGRATIONS_DIR)
      .filter(f => f.endsWith('.sql'))
      .map(f => f.split('_')[0]);

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
    await runCommand(['supabase', 'db', 'push']);

    console.log('✔️ Migrações aplicadas com sucesso!');
  } catch (error) {
    console.error('❌ Erro:', error.message);
    Deno.exit(1);
  }
}

await main();
