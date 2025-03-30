
# Troubleshooting Guide - Sistema Monitore

**Last Updated:** March 22, 2025

This guide provides troubleshooting steps for common issues encountered in the Sistema Monitore application.

## Edge Function Communication Issues

### Problem: "Max number of functions reached for project" Error

**Error Message:**
```
unexpected status 403: {"message":"Max number of functions reached for project"}
```

This error occurs when your Supabase project has reached the maximum number of Edge Functions allowed by your plan.

**Solution:**

1. **Automated Cleanup (Recommended):**
   Run one of the cleanup scripts to remove redundant Edge Functions:

   ```bash
   # Option 1: Using Node.js script 
   node scripts/cleanup_edge_functions.js

   # Option 2: Using Bash script
   bash scripts/cleanup_edge_functions.sh
   ```

2. **Manual Cleanup (If scripts fail):**
   
   If the scripts don't work, manually delete these functions from the Supabase dashboard:
   
   a. Go to: https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions
   
   b. Delete these redundant functions (click on each, then click "Delete Function" button):
   - `send-email` (consolidated into email-service)
   - `send-test-email` (consolidated into email-service/test)
   - `direct-email-test` (testing function, no longer needed)
   - `debug-email` (debugging function, no longer needed)
   - `diagnose-email` (debugging function, no longer needed)
   - `echo-payload` (debugging function, no longer needed)
   - `send-guardian-email` (consolidated into email-service)
   - `notify-email` (consolidated into email-service)
   - `test-email` (consolidated into email-service/test)
   - `test-location-email` (consolidated into email-service)
   - `send-location-email` (consolidated into email-service)
   - `verify-resend-config` (debugging function, no longer needed)
   - `test-resend-connection` (testing function, no longer needed)

3. **Verify Function Consolidation:**
   
   All functionality from the removed functions has been consolidated into the `email-service` function, which now handles:
   - Test emails
   - Guardian notifications 
   - Location notifications
   - Guardian invitations
   
   After cleanup, only these core functions should remain:
   - `email-service` (consolidated email function)
   - `send-confirmation-email` (user registration emails)
   - `send-guardian-invitation` (redirects to email-service)
   - `get-mapbox-token` (provides mapbox token)
   - `notify-location` (handles location notifications)
   - `test-connectivity` (diagnostic function)

4. **Redeploy After Cleanup:**
   
   After removing redundant functions, try deploying again:
   ```bash
   supabase functions deploy email-service
   ```

## CORS Errors When Accessing Edge Functions

**Symptoms:**
- Error logs showing: `Access to fetch at 'https://usnrnaxpoqmojxsfcoox.supabase.co/functions/v1/email-service' from origin 'https://student-sentinel-hub.lovable.app' has been blocked by CORS policy`
- Failed network requests
- Email notifications not being sent

**Troubleshooting Steps:**

1. **Check CORS Headers**
   Make sure your Edge Functions are properly configured with CORS headers that allow your application domain:
   ```javascript
   // Check the CORS headers in _shared/cors.ts:
   const allowedOrigins = [
     'http://localhost:8080', 
     'https://student-sentinel-hub.lovable.app',
     'https://sistema-monitore.com.br'
   ];
   ```

2. **Verify OPTIONS Request Handling**
   Ensure that your Edge Functions properly handle OPTIONS preflight requests:
   ```javascript
   if (req.method === 'OPTIONS') {
     return new Response(null, {
       status: 204,
       headers: corsHeaders
     });
   }
   ```

## Emails Not Being Delivered

If emails are failing to send or not being delivered:

### Check the From Address Domain

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

### Check Domain Verification Status

Make sure your domain is properly verified in the Resend dashboard:
1. Go to https://resend.com/domains
2. Verify that `sistema-monitore.com.br` shows as "Verified"
3. If not verified, follow the verification steps provided

### Check API Key Configuration

Ensure the `RESEND_API_KEY` is correctly configured in the Supabase Edge Functions secrets:
1. Go to the Supabase dashboard > Settings > API
2. Check that the `RESEND_API_KEY` is set and is the full, valid key

### Check Edge Function Logs

Examine the Supabase Edge Function logs for detailed error messages:
1. Go to https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions/email-service/logs
2. Look for error messages related to Resend API or email sending

If problems persist after attempting these troubleshooting steps, please contact the development team with:
- Detailed description of the issue
- Steps to reproduce
- Browser and device information
- Screenshots or screen recordings if applicable
