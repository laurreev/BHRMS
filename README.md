# BHRMS - Barangay Health Referral Management System

A modern, secure healthcare referral management system that digitalizes and streamlines the referral process between barangay health centers and partner healthcare facilities.

## 🚀 Features

### ✅ Authentication System
- **Admin-Only User Creation** - Only admins can add new users
- **Login** - Secure email/password authentication
- **Remember Me** - Persistent login sessions
- **Protected Routes** - Automatic redirect for unauthorized access
- **Role-Based Access** - Different permissions for Admin, Staff, Health Worker

### ✅ User Interface
- **Sleek White Theme** - Clean, professional design
- **Smooth Animations** - Page transitions with Framer Motion
- **Responsive Design** - Works on all devices
- **Toast Notifications** - Real-time feedback

### ✅ Pages
- **Home** (`/`) - Landing page with features
- **Login** (`/login`) - User authentication
- **Dashboard** (`/dashboard`) - Protected main interface
- **Add User** (`/admin/add-user`) - Admin-only user creation

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
The `.env.local` file is already configured with your Firebase credentials.

### 3. Enable Firebase Authentication
**IMPORTANT**: You must enable Email/Password authentication in Firebase Console:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `web-apps-5ec4c`
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Email/Password**
5. Enable it and click **Save**

### 4. Create First Admin User
Since only admins can create users, create the first admin manually:

1. In Firebase Console, go to **Authentication** → **Users**
2. Click **Add User**
3. Email: `admin@example.com` (or your email)
4. Password: Choose a strong password
5. Click **Add User**

### 5. Run Development Server
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### For Admins: Create User Accounts

1. Login with admin credentials
2. Click "➕ Add New User" from dashboard
3. Fill in user details (name, email, role, password)
4. Click "Create User Account"
5. User can now login with those credentials

### For All Users: Login
1. Go to `/login`
2. Enter credentials
3. Toggle "Remember me" for persistent session
4. Click "Sign In"

## 🔒 Security

- ✅ Firebase Authentication
- ✅ Protected Routes
- ✅ Environment Variables
- ✅ Form Validation
- ✅ Error Handling

**Next Steps**: See [FIREBASE_SECURITY.md](./FIREBASE_SECURITY.md) for production security setup.

## 📁 Project Structure

```
BHRMS/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Landing page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── dashboard/         # Protected dashboard
├── components/            # React components
│   ├── PageTransition.tsx
│   └── ProtectedRoute.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx    # Auth state management
├── lib/                   # Utilities
│   └── firebase.ts        # Firebase config
└── .env.local            # Environment variables (gitignored)
```

## 🚀 Deploy to Vercel

### Quick Deploy
```bash
# Push to GitHub
git add .
git commit -m "Initial commit"
git push

# Deploy on Vercel
# 1. Import repository on vercel.com
# 2. Add environment variables from .env.local
# 3. Deploy!
```

See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed instructions.

## 💻 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Auth**: Firebase Authentication
- **Database**: Firestore (ready)
- **Storage**: Firebase Storage (ready)
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No user found" | Enable Email/Password auth in Firebase Console |
| Env vars not working | Restart dev server after editing `.env.local` |
| Firebase errors | Verify config in `.env.local` |

## 📝 Next Steps

- [x] Authentication system
- [x] Login page
- [x] Admin user creation
- [x] Protected routes
- [x] Page transitions
- [ ] User management (edit/delete)
- [ ] Patient management
- [ ] Referral system
- [ ] Health records
- [ ] Analytics dashboard

## 📚 Documentation

- [User Management](./USER_MANAGEMENT.md) - How to add and manage users
- [Firebase Setup](./FIREBASE_SETUP.md) - Detailed Firebase configuration
- [Security Guide](./FIREBASE_SECURITY.md) - Production security setup
- [Vercel Deployment](./VERCEL_DEPLOYMENT.md) - Deployment instructions

---

**Built with ❤️ for Barangay Health Management**
