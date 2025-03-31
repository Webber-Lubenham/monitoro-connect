
# Email Function Consolidation Plan

## Problem
Our Supabase project has reached the maximum number of allowed Edge Functions for our plan. When trying to deploy, we're encountering the error:

```
unexpected status 403: {"message":"Max number of functions reached for project"}
```

## Solution
We have consolidated our email-related Edge Functions to reduce the total number while maintaining all required functionality.

## Consolidation Strategy

### Functions to Remove
The following functions have been or should be removed as they have been consolidated into the main email service functions:

1. `send-email` - Consolidated into `email-service`
2. `send-test-email` - Consolidated into `email-service/test`
3. `direct-email-test` - Testing function, no longer needed
4. `debug-email` - Debugging function, no longer needed
5. `diagnose-email` - Debugging function, no longer needed
6. `echo-payload` - Debugging function, no longer needed
7. `send-guardian-email` - Consolidated into `email-service`
8. `notify-email` - Consolidated into `email-service`
9. `test-email` - Consolidated into `email-service/test`
10. `test-location-email` - Consolidated into `email-service`
11. `send-location-email` - Consolidated into `email-service`
12. `verify-resend-config` - Debugging function, no longer needed
13. `test-resend-connection` - Testing function, no longer needed

### Functions to Keep
1. `email-service` - Consolidated email service for various notification types
2. `send-confirmation-email` - Primary function for user registration emails
3. `send-guardian-invitation` - Now acts as a redirect to `email-service`
4. `get-mapbox-token` - Provides mapbox token to the application
5. `notify-location` - Handles location notifications
6. `test-connectivity` - Important diagnostic function

## Implementation Steps

### Step 1: Run the Cleanup Script
Run one of the cleanup scripts to remove redundant functions:

```bash
# Option 1: Using Node.js
node scripts/cleanup_edge_functions.js

# Option 2: Using Bash
bash scripts/cleanup_edge_functions.sh
```

### Step 2: Manual Cleanup (if needed)
If the scripts fail to remove all redundant functions, manually delete them from the Supabase dashboard:

1. Go to: https://supabase.com/dashboard/project/usnrnaxpoqmojxsfcoox/functions
2. Click on each function name in the list of redundant functions
3. Click the "Delete Function" button at the bottom of the page
4. Confirm the deletion when prompted

### Step 3: Deploy the Consolidated Function
After cleanup, deploy the consolidated email service:

```bash
supabase functions deploy email-service
```

### Step 4: Verify Functionality
Test that the consolidated email service is working correctly:

1. Go to the Email Tester page (`/email-tester`)
2. Use the test buttons to verify different email functionality
3. Check the logs for any errors or issues

## Using the Consolidated Email Service

The `email-service` function now supports multiple operations:

### For Location Notifications
```javascript
await supabase.functions.invoke('email-service', {
  body: {
    type: 'location-notification',
    data: {
      studentName: "Student Name",
      guardianEmail: "guardian@example.com",
      guardianName: "Guardian Name",
      latitude: 40.7128,
      longitude: -74.0060,
      timestamp: new Date().toISOString(),
      accuracy: 10,
      isEmergency: false
    }
  }
});
```

### For Guardian Invitations
```javascript
await supabase.functions.invoke('email-service', {
  body: {
    type: 'guardian-invitation',
    data: {
      studentName: "Student Name",
      guardianEmail: "guardian@example.com",
      guardianName: "Guardian Name",
      invitationToken: "token123"
    }
  }
});
```

### For Test Emails
```javascript
await supabase.functions.invoke('email-service', {
  body: {
    type: 'test',
    data: {
      email: "test@example.com"
    }
  }
});
```

This consolidated approach allows for more efficient management of our edge functions while maintaining all the email functionality needed by the application.
