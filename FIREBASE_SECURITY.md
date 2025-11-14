# Firebase Security Setup Guide

## 🔒 Essential Security Steps

### 1. Restrict API Key Usage
Go to [Google Cloud Console](https://console.cloud.google.com/):
1. Select your project: `web-apps-5ec4c`
2. Go to **APIs & Services** → **Credentials**
3. Click on your API key
4. Under **Application restrictions**, select **HTTP referrers**
5. Add your authorized domains:
   ```
   localhost:3000
   your-vercel-app.vercel.app
   yourdomain.com
   ```

### 2. Set Up Firestore Security Rules
Go to Firebase Console → Firestore Database → Rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Require authentication for all read/write operations
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Example: User-specific data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Example: Public read, authenticated write
    match /public/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Set Up Storage Security Rules
Go to Firebase Console → Storage → Rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Only authenticated users can upload
      allow write: if request.auth != null;
      // Only authenticated users can read
      allow read: if request.auth != null;
    }
    
    // User-specific folders
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Enable App Check (Advanced Protection)
1. Go to Firebase Console → App Check
2. Enable App Check for your web app
3. Use reCAPTCHA v3 for web apps
4. This prevents abuse from bots and unauthorized apps

### 5. Set Up Authentication Methods
1. Go to Firebase Console → Authentication → Sign-in method
2. Enable only the methods you need:
   - ✅ Email/Password
   - ✅ Google
   - ❌ Disable unused methods

### 6. Monitor Usage
1. Go to Firebase Console → Usage and billing
2. Set up budget alerts
3. Monitor for unusual activity

### 7. Vercel Environment Variables
When deploying to Vercel:
1. Go to your Vercel project → Settings → Environment Variables
2. Add all `NEXT_PUBLIC_FIREBASE_*` variables
3. Set them for Production, Preview, and Development environments

## ⚠️ Important Notes

- **Environment variables with `NEXT_PUBLIC_` are exposed to the browser** - this is expected for Firebase client SDK
- **True security comes from Firebase Rules**, not from hiding the API key
- **Always use the principle of least privilege** - only grant the minimum permissions needed
- **Never use Admin SDK credentials in client-side code**

## 🚨 If Your API Key is Compromised

1. **Regenerate the API key** in Google Cloud Console
2. **Update all environment variables** in your deployments
3. **Review Firebase Rules** to ensure they're restrictive
4. **Check Firebase Console logs** for suspicious activity

## Testing Security Rules

Use Firebase Rules Playground:
1. Go to Firestore/Storage Rules
2. Click "Rules Playground"
3. Test different scenarios to ensure rules work correctly

## Additional Resources
- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [App Check Documentation](https://firebase.google.com/docs/app-check)
- [Security Best Practices](https://firebase.google.com/support/guides/security-checklist)
