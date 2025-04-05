#!/bin/bash

# Make sure SUPABASE_ACCESS_TOKEN is set in environment before running

# Project reference ID
PROJECT_REF="rsvjnndhbyyxktbczlnk"  # Updated project ID

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
  "direct-email-test"
  "send-test-email"
  "send-email"
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
