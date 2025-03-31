#!/bin/bash

# Set the Supabase access token
export SUPABASE_ACCESS_TOKEN="sbp_a62a0ff07aed3f8d449dada64e2d40ca6ac1ba2c"

# Project reference ID
PROJECT_REF="usnrnaxpoqmojxsfcoox"

# List of functions to delete
FUNCTIONS=(
  "debug-email"
  "diagnose-email"
  "echo-payload"
  "send-guardian-email"
  "notify-email"
  "test-email"
  "test-location-email"
  "send-location-email"
  "verify-resend-config"
  "test-resend-connection"
)

echo "🧹 Edge Functions Cleanup Tool 🧹"
echo

# Delete each function
for func in "${FUNCTIONS[@]}"; do
  echo "Deleting $func..."
  supabase functions delete "$func" --project-ref "$PROJECT_REF" || echo "Failed to delete $func"
  echo
done

echo "Cleanup complete!"
