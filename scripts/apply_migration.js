
import { createClient } from '@supabase/supabase-js'
import process from 'node:process'

// Hardcoded Supabase configuration
const supabaseUrl = 'https://sb1-yohd9adf.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'YOUR_SERVICE_ROLE_KEY_HERE' // Still using env for service role key as it's sensitive
const supabase = createClient(supabaseUrl, supabaseKey)

async function applyMigration() {
  const { data, error } = await supabase
    .from('guardians')
    .insert({
      cpf: '00000000000' // Temporary value for column creation
    })

  if (error) {
    console.error('Error applying migration:', error)
    return
  }

  console.log('Migration applied successfully:', data)
}

applyMigration()
