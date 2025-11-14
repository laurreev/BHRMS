# User Management Guide

## Overview

In BHRMS, user account creation is restricted to administrators only. Regular users cannot self-register; they must be added by an admin.

## Admin: Adding New Users

### Access the Add User Page

1. **Login as Admin**
   - Navigate to http://localhost:3000/login
   - Enter admin credentials
   - You'll be redirected to the dashboard

2. **Navigate to Add User**
   - From the dashboard, click the **"➕ Add New User"** button
   - Or directly visit: http://localhost:3000/admin/add-user

### Create a New User Account

1. **Fill in User Details:**
   - **Full Name**: User's complete name
   - **Email Address**: Will be used for login
   - **User Role**: Select from:
     - `Staff` - Regular staff member
     - `Admin` - Administrator (can add users)
     - `Health Worker` - Healthcare worker
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Must match password

2. **Submit**
   - Click "Create User Account"
   - Success message will appear
   - Form will reset for adding more users

3. **Add More Users**
   - The form stays on the page after creating a user
   - Simply fill in the next user's details
   - No need to navigate back

## User Login

### For All Users (Staff, Admin, Health Workers)

1. **Visit Login Page**
   - Go to http://localhost:3000/login
   - Or click "Sign In" from the home page

2. **Enter Credentials**
   - Email: The email provided by admin
   - Password: The password set by admin

3. **Remember Me Option**
   - ✅ **Checked**: Stay logged in even after closing browser
   - ❌ **Unchecked**: Logout when browser closes

4. **Access Dashboard**
   - After successful login, redirected to dashboard
   - Access all features based on role

## User Roles & Permissions

### Admin
- ✅ Add new users
- ✅ Manage patients
- ✅ Create referrals
- ✅ View all records
- ✅ Generate reports

### Staff
- ✅ Manage patients
- ✅ Create referrals
- ✅ View records
- ❌ Cannot add users

### Health Worker
- ✅ View patient information
- ✅ Create referrals
- ✅ Update health records
- ❌ Cannot add users

## Security Features

### Protected Routes
- `/admin/add-user` - Requires authentication
- `/dashboard` - Requires authentication
- All other admin pages - Requires authentication

### Public Routes
- `/` - Home/Landing page
- `/login` - Login page

### Removed Public Access
- ❌ `/signup` - No longer available
- Users cannot self-register

## First-Time Setup

### Creating the First Admin Account

**Important**: You need to create the first admin account manually through Firebase Console:

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: `web-apps-5ec4c`

2. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Users" tab
   - Click "Add User"

3. **Create Admin User**
   - Email: admin@example.com (or your preferred email)
   - Password: Choose a strong password
   - Click "Add User"

4. **Login to BHRMS**
   - Go to http://localhost:3000/login
   - Use the credentials you just created
   - You can now add other users!

## Troubleshooting

### "Contact your administrator" Message
- This appears on the login page
- Users cannot create their own accounts
- Admin must add users through `/admin/add-user`

### Cannot Access Add User Page
- Make sure you're logged in
- The page is protected and requires authentication
- Login first, then navigate to dashboard

### User Creation Fails
- Check Firebase Console for errors
- Ensure Email/Password auth is enabled
- Verify email format is correct
- Password must be at least 6 characters

## Best Practices

### For Admins
1. **Create users before their start date**
2. **Use strong passwords** (consider password generator)
3. **Provide credentials securely** (don't email passwords)
4. **Assign correct role** based on job function
5. **Keep track of created accounts**

### For Users
1. **Change password after first login** (feature coming soon)
2. **Use "Remember Me" on trusted devices only**
3. **Logout when done** on shared computers
4. **Report login issues** to administrator immediately

## Future Enhancements

- [ ] User list/management page
- [ ] Edit user details
- [ ] Deactivate/delete users
- [ ] Password reset functionality
- [ ] Force password change on first login
- [ ] Role-based access control (RBAC)
- [ ] Activity logging

## Quick Reference

| Action | Who Can Do It | Where |
|--------|---------------|-------|
| Create Account | Admin only | `/admin/add-user` |
| Login | All users | `/login` |
| View Dashboard | All authenticated users | `/dashboard` |
| Add Patient | Staff, Admin, Health Worker | Dashboard (coming soon) |
| Create Referral | Staff, Admin, Health Worker | Dashboard (coming soon) |

---

**Need Help?** Contact your system administrator or check the Firebase Console for user management.
