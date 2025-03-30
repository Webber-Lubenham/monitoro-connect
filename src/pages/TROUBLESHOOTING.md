
# Email System Troubleshooting Guide

## Common Issues and Solutions

### 1. "Max number of functions reached for project" Error

If you encounter this error when deploying Edge Functions:

```
unexpected status 403: {"message":"Max number of functions reached for project"}
```

**Solution:**
1. Run one of the cleanup scripts to remove redundant Edge Functions:

   ```bash
   # Option 1: Using Node.js script
   node scripts/cleanup_edge_functions.js

   # Option 2: Using Bash script
   bash scripts/cleanup_edge_functions.sh
   ```

2. **If scripts fail**, manually delete these functions from the Supabase dashboard:
   - `direct-email-test`
   - `notify-email`
   - `send-test-email`
   - `test-email`
   - `test-location-email`
   - `send-location-email`
   - `echo-payload`
   - `diagnose-email`
   - `verify-resend-config`
   - `debug-email`
   - `send-guardian-email`
   - `test-resend-connection`
   - `send-email`

   Go to: https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions

3. After cleanup, only these core functions should remain:
   - `email-service` (consolidated email function)
   - `send-confirmation-email` (user registration emails)
   - `send-guardian-invitation` (redirects to email-service)
   - `get-mapbox-token` (provides mapbox token)
   - `notify-location` (handles location notifications)
   - `test-connectivity` (diagnostic function)

### 2. Emails Not Being Delivered

If emails are failing to send or not being delivered:

#### Check the From Address Domain

The most common issue is using `resend.dev` in the "from" address instead of your verified domain.

**Incorrect:**
```
"from": "Sistema Monitore <noreply@resend.dev>"
```

**Correct:**
```
"from": "Sistema Monitore <notifications@sistema-monitore.com.br>"
```

All "from" addresses must use your verified domain (`sistema-monitore.com.br`).

#### Check API Key Configuration

Ensure the `RESEND_API_KEY` is correctly configured in the Supabase Edge Functions secrets.

#### Check Edge Function Logs

Examine the Supabase Edge Function logs for detailed error messages.

### 3. Testing Email Functionality

To test email functionality:

1. Go to the Email Tester page (`/email-tester`)
2. Use the "EXECUTAR TESTE DIRETO" button
3. Enter a valid test email address
4. Check the results for any error messages
