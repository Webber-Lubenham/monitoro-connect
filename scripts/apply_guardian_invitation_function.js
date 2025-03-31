
/**
 * This script applies the guardian invitation function migration
 * Run with: node scripts/apply_guardian_invitation_function.js
 */
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const migrationPath = path.join(__dirname, '../supabase/migrations/20250325_add_guardian_invitation_function.sql');

try {
  console.log('Applying guardian invitation function migration...');
  
  // Check if the migration file exists
  if (!fs.existsSync(migrationPath)) {
    console.error('Migration file not found:', migrationPath);
    process.exit(1);
  }

  // Run the migration using the Supabase CLI
  execSync(`supabase db push --db-url "${process.env.SUPABASE_DB_URL}"`, {
    stdio: 'inherit'
  });
  
  console.log('Migration applied successfully!');
} catch (error) {
  console.error('Error applying migration:', error.message);
  process.exit(1);
}
