
# Edge Functions Cleanup Guide

After consolidating the email-related Edge Functions into a single `email-service` function, we need to remove the following unused functions to stay within the limits of our Supabase plan:

1. `direct-email-test` - Replaced by `email-service/test`
2. `notify-email` - Replaced by `email-service/location-notification`
3. `send-test-email` - Replaced by `email-service/test`
4. `test-email` - Replaced by `email-service/test`
5. `test-location-email` - Replaced by `email-service/location-notification`
6. `send-location-email` - Replaced by `email-service/location-notification`
7. `echo-payload` - Debugging function, no longer needed
8. `diagnose-email` - Debugging function, no longer needed
9. `verify-resend-config` - Replaced by test functionality in `email-service`
10. `debug-email` - Debugging function, no longer needed
11. `send-guardian-email` - Replaced by `email-service/guardian-notification`
12. `test-resend-connection` - Test function, no longer needed

To remove these functions from your Supabase project:

## Option 1: Use the Cleanup Scripts

Run one of the following cleanup scripts:

```bash
# Using Bash script
bash scripts/cleanup_edge_functions.sh

# OR using Node.js script
node scripts/cleanup_edge_functions.js
```

## Option 2: Manual Deletion (if scripts fail)

If the scripts fail or encounter errors, follow these steps:

1. Go to the Supabase Dashboard: https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions
2. Look for each of the above functions in the list
3. Click the "Delete Function" button for each one
4. Confirm the deletion when prompted

## Option 3: Use Supabase CLI Directly

You can also delete functions one by one using the Supabase CLI:

```bash
# Replace function-name with the name of the function to delete
supabase functions delete function-name --project-ref usnrnaxpoqmojxsfcoox
```

## After Cleanup

After removing the redundant functions, only the following functions should remain:
- `email-service` (consolidated email function)
- `send-confirmation-email` (user registration emails)
- `send-guardian-invitation` (redirects to email-service)
- `get-mapbox-token` (provides mapbox token)
- `notify-location` (handles location notifications)
- `test-connectivity` (important diagnostic function)

This will significantly reduce the count of Edge Functions and resolve the "max number of functions reached" error.

## Troubleshooting

If you encounter issues with the cleanup scripts:
- Make sure you have the Supabase CLI installed and properly configured
- Check if you have the necessary permissions to delete functions
- Try deleting functions manually through the Supabase dashboard
- Contact Supabase support if the issue persists

