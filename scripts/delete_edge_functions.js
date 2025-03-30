
#!/usr/bin/env node

/**
 * This script helps delete redundant edge functions via the Supabase CLI
 * to stay within the plan limits.
 * 
 * Usage:
 * 1. Make sure you have supabase CLI installed
 * 2. Run: node scripts/delete_edge_functions.js
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// List of functions that can be safely deleted as they've been consolidated
const FUNCTIONS_TO_DELETE = [
  "send-email",               // Consolidated into email-service
  "send-test-email",          // Consolidated into email-service/test
  "direct-email-test",        // Testing function, no longer needed
  "debug-email",              // Debugging function, no longer needed
  "diagnose-email",           // Debugging function, no longer needed
  "echo-payload",             // Debugging function, no longer needed
  "send-guardian-email",      // Consolidated into email-service
  "notify-email",             // Consolidated into email-service
  "test-email",               // Consolidated into email-service/test
  "test-location-email",      // Consolidated into email-service
  "send-location-email",      // Consolidated into email-service
  "verify-resend-config",     // Debugging function, no longer needed
  "test-resend-connection"    // Testing function, no longer needed
];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log("\n🧹 Edge Functions Cleanup Tool 🧹");
  console.log("================================\n");
  console.log("This script will help you delete redundant edge functions to stay within your Supabase plan limits.\n");
  
  console.log("The following functions will be deleted:");
  FUNCTIONS_TO_DELETE.forEach(func => console.log(`  - ${func}`));
  console.log("\nThese functions have been consolidated into the 'email-service' function.\n");
  
  const confirm = await askQuestion("Are you sure you want to proceed? (yes/no): ");
  
  if (confirm.toLowerCase() !== 'yes') {
    console.log("\nOperation cancelled. No changes were made.");
    rl.close();
    return;
  }
  
  console.log("\nDeleting edge functions... This may take a moment.\n");
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const func of FUNCTIONS_TO_DELETE) {
    try {
      console.log(`Deleting function: ${func}`);
      execSync(`supabase functions delete ${func} --project-ref usnrnaxpoqmojxsfcoox`, { 
        stdio: 'inherit' 
      });
      console.log(`✅ Function ${func} deleted successfully\n`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error deleting function ${func}: ${error.message}`);
      console.log("This might mean the function already doesn't exist.\n");
      errorCount++;
    }
  }
  
  console.log(`\n🎉 Cleanup complete! Successfully deleted ${successCount} functions, encountered errors with ${errorCount} functions.`);
  console.log("You should now be able to deploy your edge functions again.");
  console.log("\nIf you still encounter issues, try manually deleting functions from the Supabase dashboard at:");
  console.log("https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions");
  
  rl.close();
}

main().catch(error => {
  console.error(`Error: ${error.message}`);
  rl.close();
  process.exit(1);
});
