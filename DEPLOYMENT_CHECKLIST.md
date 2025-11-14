# 🚀 BHRMS Deployment Checklist

## ✅ Pre-Deployment Verification (COMPLETED)

### Code Quality
- [x] No ESLint errors
- [x] No TypeScript errors
- [x] No build errors
- [x] All React Hooks follow rules (no conditional hooks)
- [x] Proper error handling in all API routes

### Database Configuration
- [x] All collections use BHRMS suffix:
  - `usersBHRMS`
  - `facilitiesBHRMS`
  - `referralsBHRMS`
  - `hotlinesBHRMS`
- [x] Staff and Admin use same `referralsBHRMS` collection
- [x] Real-time tracking configured
- [x] Proper Firestore queries with indexes

### Authentication & Security
- [x] Passwordless authentication implemented
- [x] Role-based access control (Admin vs Staff)
- [x] Protected routes configured
- [x] Firestore security rules in place (`firestore.rules`)

### Features Implemented

#### Admin Features
- [x] User Management (Add, Edit, Delete users)
- [x] Facility Management (Add, Edit, Delete facilities)
- [x] Referral Dashboard (Real-time monitoring)
- [x] Reports & Analytics (Comprehensive stats)
- [x] Resource Management (Hotlines)

#### Staff Features
- [x] Create Referral (with facility selection)
- [x] My Referrals (Personal tracking)
- [x] Patient Search (History lookup)

#### Shared Resources
- [x] Referral Map (Geographic view)
- [x] Health Hotlines (Emergency contacts)
- [x] Health Protocols & Guides

---

## 🔧 Environment Variables Required

### Vercel Environment Variables
Add these in Vercel Dashboard → Settings → Environment Variables:

#### Client-side (NEXT_PUBLIC_*)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Server-side (for API routes)
```env
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project_id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----
```

**IMPORTANT**: 
- The `FIREBASE_PRIVATE_KEY` should include `\n` characters (not actual newlines)
- The API route will automatically convert `\\n` to actual newlines
- Get these values from Firebase Console → Project Settings → Service Accounts

---

## 📝 Deployment Steps

### 1. Push to GitHub
```bash
git add .
git commit -m "Production ready: All features complete, no errors"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables (see above)
4. Click "Deploy"

### 3. Configure Vercel Settings
- Framework Preset: **Next.js**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node.js Version: **18.x or higher**

---

## 🔒 Firestore Security Rules

Ensure these rules are deployed in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /usersBHRMS/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/usersBHRMS/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Facilities collection
    match /facilitiesBHRMS/{facilityId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/usersBHRMS/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Referrals collection (shared between staff and admin)
    match /referralsBHRMS/{referralId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
                            get(/databases/$(database)/documents/usersBHRMS/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Hotlines collection
    match /hotlinesBHRMS/{hotlineId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                   get(/databases/$(database)/documents/usersBHRMS/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

Deploy these rules:
```bash
firebase deploy --only firestore:rules
```

---

## 🧪 Post-Deployment Testing

### Test Admin Account
1. Login with admin credentials
2. Verify Dashboard shows all stats
3. Test User Management (Add/Edit/Delete)
4. Test Facility Management (Add/Edit/Delete)
5. Test Referral Dashboard (real-time updates)
6. Test Reports & Analytics
7. Test Health Hotlines (Add/Delete)

### Test Staff Account
1. Login with staff credentials
2. Verify Dashboard shows personal stats
3. Test Create Referral (should appear in Admin dashboard)
4. Test My Referrals (view own referrals)
5. Test Patient Search
6. Verify cannot access Admin-only pages

### Test Real-Time Features
1. Staff creates referral → Should appear in Admin dashboard immediately
2. Admin updates referral status → Should update in Staff's "My Referrals"
3. Patient Search should find newly created referrals

---

## 🔍 Health Checks

After deployment, verify:
- [ ] Homepage loads
- [ ] Login works
- [ ] Dashboard redirects based on role
- [ ] All collections accessible
- [ ] API routes work (`/api/admin/add-user`)
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Toast notifications work

---

## 📊 Monitoring

### Check Vercel Logs
- Monitor function logs for errors
- Check build logs
- Verify environment variables loaded

### Check Firebase Usage
- Monitor Firestore reads/writes
- Check authentication logs
- Verify security rules are enforced

---

## 🐛 Known Issues & Solutions

### Issue: "Missing or insufficient permissions"
**Solution**: User creation must use API route (`/api/admin/add-user`) which uses Firebase Admin SDK

### Issue: Service account key not found
**Solution**: Use environment variables instead of importing `serviceAccountKey.json`

### Issue: React Hooks errors
**Solution**: All hooks placed before conditional returns, access checks after hooks

---

## 📞 Support

If issues occur during deployment:
1. Check Vercel deployment logs
2. Verify environment variables are set
3. Check Firebase Console for errors
4. Verify Firestore security rules deployed

---

## ✅ Final Status

**Build Status**: ✅ No errors  
**Database**: ✅ All collections configured with BHRMS  
**Security**: ✅ Firestore rules in place  
**Features**: ✅ All admin and staff features complete  
**Real-time**: ✅ Live tracking configured  

**READY FOR PRODUCTION DEPLOYMENT** 🚀
