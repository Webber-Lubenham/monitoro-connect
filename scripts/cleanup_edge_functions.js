/**
 * This script helps delete redundant edge functions to stay within the Supabase plan limits.
 * 
 * Usage:
 * 1. Make sure SUPABASE_ACCESS_TOKEN is set in your environment
 * 2. Run: node scripts/cleanup_edge_functions.js
 */

import { execSync } from 'node:child_process';

// Project reference ID
const PROJECT_REF = "usnrnaxpoqmojxsfcoox";

// List of functions that can be safely deleted as they've been consolidated
const FUNCTIONS_TO_DELETE = [
  "debug-email",
  "diagnose-email",
  "echo-payload",
  "send-guardian-email",
  "notify-email",
  "test-email",
  "test-location-email",
  "send-location-email",
  "verify-resend-config",
  "test-resend-connection"
];

async function main() {
  console.log("\n🧹 Edge Functions Cleanup Tool 🧹\n");
  
  for (const func of FUNCTIONS_TO_DELETE) {
    try {
      console.log(`Deleting ${func}...`);
      const command = `supabase functions delete ${func} --project-ref ${PROJECT_REF}`;
      execSync(command, { stdio: 'inherit' });
      console.log(`✅ Successfully deleted ${func}\n`);
    } catch (error) {
      console.error(`❌ Failed to delete ${func}: ${error.message}\n`);
    }
  }
}

main().catch(error => {
  console.error("Script failed:", error);
  process.exit(1);
});
