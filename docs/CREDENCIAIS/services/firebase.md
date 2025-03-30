
# Firebase Configuration

## Project Details
- **Project Name:** monitor
- **Project ID:** monitor-bfd79
- **Project Number:** 507562002644
- **Storage Bucket:** monitor-bfd79.firebasestorage.app
- **Messaging Sender ID:** 507562002644
- **App ID:** 1:507562002644:web:ac373113ba415306831341
- **Measurement ID:** G-XLY918SYQ5
- **Public Name:** project-507562002644

## Authentication Configuration
- **Enabled Providers:** 
  - Email/Password
  - Google Sign-in
- **Support Email:** educatechnov@gmail.com
- **Multi-factor Authentication:** Available with Identity Platform upgrade

## Deployment Information
- **Hosting URL:** monitor-bfd79.web.app
- **Default Deploy Directory:** public
- **CLI Setup:**
  ```bash
  npm install -g firebase-tools
  firebase login
  firebase init
  firebase deploy
  ```

## SDK Integration
```javascript
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDSR9TlCJCQJsFZVD8kGb4AE9nUuuQM968",
  authDomain: "monitor-bfd79.firebaseapp.com",
  projectId: "monitor-bfd79",
  storageBucket: "monitor-bfd79.appspot.com",
  messagingSenderId: "507562002644",
  appId: "1:507562002644:web:ac373113ba415306831341",
  measurementId: "G-XLY918SYQ5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
```
