# Vercel Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository with your code

## Deployment Steps

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit - BHRMS with Firebase"
git branch -M main
git remote add origin your-github-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
1. Install Vercel CLI globally:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts and your app will be deployed!

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
4. Click "Deploy"

### 3. Environment Variables (Optional)
If you want to use environment variables instead of hardcoded config:

1. In Vercel Dashboard, go to your project
2. Go to Settings → Environment Variables
3. Add the following variables:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

4. Update `lib/firebase.ts` to use these variables:
```typescript
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ... etc
};
```

## Post-Deployment

### Update Firebase Settings
1. Go to Firebase Console
2. Navigate to Project Settings → General
3. Under "Your apps", find your web app
4. Add your Vercel domain to "Authorized domains"

### Custom Domain (Optional)
1. In Vercel Dashboard, go to your project
2. Go to Settings → Domains
3. Add your custom domain
4. Follow DNS configuration instructions

## Automatic Deployments
Vercel automatically deploys:
- **Production:** Every push to `main` branch
- **Preview:** Every push to other branches and PRs

## Useful Commands
- `vercel` - Deploy to preview
- `vercel --prod` - Deploy to production
- `vercel dev` - Run local development server with Vercel environment

## Resources
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting Setup](https://firebase.google.com/docs/hosting)
