
# Troubleshooting Guide - Sistema Monitore

**Last Updated:** April 3, 2025

This guide provides troubleshooting steps for common issues encountered in the Sistema Monitore application.

## Edge Function Deployment Issues

### Problem: "Max number of functions reached for project" Error

**Error Message:**
```
unexpected create function status 403: {"message":"Max number of functions reached for project"}
```

This error occurs when your Supabase project has reached the maximum number of Edge Functions allowed by your plan.

**Solution:**

1. **Automated Cleanup (Recommended):**
   Run one of the cleanup scripts to remove redundant Edge Functions:

   ```bash
   # Option 1: Using Node.js script 
   node scripts/delete_edge_functions.js

   # Option 2: Using Bash script
   bash scripts/cleanup_edge_functions.sh
   ```

   If you're using the Node.js script, it will ask for confirmation before proceeding.

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

3. **After Cleanup:**
   
   After removing redundant functions, try deploying again:
   ```bash
   # Deploy the consolidated email service function
   supabase functions deploy email-service --project-ref usnrnaxpoqmojxsfcoox
   ```

## CORS Errors When Accessing Edge Functions

**Symptoms:**
- Error logs showing: `Access to fetch at 'https://usnrnaxpoqmojxsfcoox.supabase.co/functions/v1/email-service' from origin 'https://student-sentinel-hub.lovable.app' has been blocked by CORS policy`
- Failed network requests
- Email notifications not being sent

**Solution:**

The CORS headers in the Edge Functions have been updated to properly allow requests from all needed domains. If you're still experiencing CORS issues after deploying the updated functions, check the following:

1. Verify that the origin 'https://student-sentinel-hub.lovable.app' is properly included in the allowed origins
2. Ensure the CORS preflight handler in the Edge Function is correctly implemented
3. Check that the Edge Function is returning proper CORS headers in all responses

If problems persist, see the Edge Function logs in the Supabase dashboard for more details.

## Emails Not Being Delivered

If emails are failing to send or not being delivered, please refer to the full troubleshooting guide at:
docs/TROUBLESHOOTING.md
