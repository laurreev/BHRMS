# Quick Setup: Adding Initial Users

## 🚀 Easy Method (Recommended)

### Step 1: Enable Email/Password Authentication
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: `web-apps-5ec4c`
3. Click **Authentication** → **Sign-in method**
4. Enable **Email/Password**
5. Click **Save**

### Step 2: Run the Setup Page
1. Make sure your dev server is running (`npm run dev`)
2. Open your browser and go to: **http://localhost:3000/setup**
3. Click the **"Create Users"** button
4. Wait for the success message

### Step 3: Login
The following users will be created:

**Staff Account:**
- Email: `staff@bhrms.com`
- Password: `staff123`
- Name: Staff Dummy
- Credential: staff123
- Role: staff

**Admin Account:**
- Email: `admin@bhrms.com`
- Password: `admin123`
- Name: Admin Dummy  
- Credential: admin123
- Role: admin

Go to http://localhost:3000/login and use these credentials!

---

## 📝 Manual Method (Alternative)

If you prefer to use the Firebase Console:

### For Each User:

1. **Create Authentication Account:**
   - Go to Firebase Console → Authentication → Users
   - Click "Add User"
   - Enter email and password
   - Note the UID

2. **Create Firestore Document:**
   - Go to Firestore Database
   - Create collection: `users`
   - Add document with UID as document ID
   - Add fields:
     - `email` (string): user email
     - `firstName` (string): first name
     - `lastName` (string): last name
     - `credential` (string): credential number
     - `role` (string): staff or admin
     - `createdAt` (string): current timestamp
     - `updatedAt` (string): current timestamp

---

## ✅ Verification

After setup, verify the users were created:

1. **Check Firebase Auth:**
   - Firebase Console → Authentication → Users
   - Should see 2 users listed

2. **Check Firestore:**
   - Firebase Console → Firestore Database
   - Collection: `users`
   - Should see 2 documents

3. **Test Login:**
   - Go to http://localhost:3000/login
   - Try logging in with both accounts
   - Both should work!

---

## 🔒 Security Note

**Important:** After using the setup page, consider:
- Removing the `/setup` route from `middleware.ts` public routes
- Or deleting the `app/setup/page.tsx` file entirely
- This prevents unauthorized users from creating accounts

---

## 🎯 Next Steps

Once users are created:
1. Delete or disable the setup page
2. Use the Admin account to add more users via `/admin/add-user`
3. Start using the application!

**Enjoy your BHRMS! 🎉**
