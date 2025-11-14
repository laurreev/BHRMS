# 🏥 BHRMS - Barangay Health Referral Management System
## Complete System Overview

---

## 🎯 System Purpose

A comprehensive web application for managing patient referrals between Barangay Health Stations (BHS) and hospitals, with role-based access for administrative staff and health workers.

---

## 👥 User Roles

### 🔑 Admin (Administrator)
**Access Level**: Full system control  
**Default Test Account**: admin123 / Admin Dummy

**Capabilities**:
- Manage all user accounts
- Manage facilities (BHS and Hospitals)
- Monitor all referrals in real-time
- View comprehensive analytics
- Manage emergency hotlines
- Access all resources

### 👨‍⚕️ Staff (Health Worker)
**Access Level**: Limited to patient care functions  
**Default Test Account**: staff123 / Staff Dummy

**Capabilities**:
- Create patient referrals
- View and track own referrals
- Search patient history
- Access health resources and protocols
- View facility locations

---

## 📚 Database Structure

### Collection: `usersBHRMS`
Stores all user accounts (Admin and Staff)
```typescript
{
  credential: string,      // Unique ID (e.g., "admin123")
  firstName: string,
  lastName: string,
  role: 'admin' | 'staff',
  facility: string,
  position: string,
  email?: string,
  phone?: string,
  createdAt: string
}
```

### Collection: `facilitiesBHRMS`
Stores BHS and Hospital information
```typescript
{
  name: string,
  type: 'BHS' | 'Hospital',
  address: string,
  contact: string,
  services: string[],
  capacity?: number,
  coordinates?: { lat: number, lng: number },
  createdAt: string
}
```

### Collection: `referralsBHRMS` ⭐ (SHARED - Most Important)
Stores all patient referrals - used by both Staff and Admin
```typescript
{
  patientName: string,
  patientAge: number,
  patientGender: string,
  chiefComplaint: string,
  fromFacility: string,
  toFacility: string,
  priority: 'routine' | 'urgent' | 'emergency',
  status: 'pending' | 'accepted' | 'completed' | 'cancelled',
  createdBy: string,           // Staff credential
  createdByName: string,        // Staff full name
  createdAt: Timestamp,
  updatedAt: string,
  notes?: string
}
```

### Collection: `hotlinesBHRMS`
Stores emergency hotlines and contacts
```typescript
{
  name: string,
  category: 'ambulance' | 'hospital' | 'emergency' | 'government' | 'other',
  number: string,
  description: string,
  available24h: boolean,
  createdAt: string
}
```

---

## 🗂️ File Structure

```
BHRMS/
├── app/
│   ├── admin/                      # Admin-only pages
│   │   ├── user-management/        # CRUD users
│   │   ├── facility-management/    # CRUD facilities
│   │   ├── referral-dashboard/     # Real-time referral monitoring
│   │   ├── reports/                # Analytics & reports
│   │   └── add-user/               # User creation form
│   │
│   ├── api/
│   │   └── admin/
│   │       └── add-user/
│   │           └── route.ts        # Server-side user creation API
│   │
│   ├── referrals/                  # Staff referral pages
│   │   ├── create/                 # Create new referral
│   │   └── my-referrals/           # View own referrals
│   │
│   ├── resources/                  # Shared resources
│   │   ├── referral-map/           # Geographic facility view
│   │   ├── health-hotlines/        # Emergency contacts
│   │   ├── health-protocols/       # Medical protocols
│   │   └── patient-search/         # Search patient history
│   │
│   ├── dashboard/                  # Role-based main dashboard
│   ├── login/                      # Passwordless authentication
│   ├── setup/                      # Initial setup page
│   └── layout.tsx                  # Root layout
│
├── components/
│   ├── ProtectedRoute.tsx          # Auth guard
│   └── PageTransition.tsx          # Page animations
│
├── contexts/
│   └── AuthContext.tsx             # Authentication state
│
├── lib/
│   └── firebase.ts                 # Firebase configuration
│
├── scripts/
│   └── addUsers.js                 # Seed database script
│
├── firestore.rules                 # Database security rules
└── package.json
```

---

## 🔄 User Workflows

### Staff Workflow: Creating a Referral

```
1. Login with credential number → Staff Dashboard
   ↓
2. Click "Create Referral" or "📝 Create Referral" card
   ↓
3. Fill patient information:
   - Name, Age, Gender
   - Chief Complaint
   - Select Origin Facility (from facilitiesBHRMS)
   - Select Destination Facility (from facilitiesBHRMS)
   - Set Priority (Routine/Urgent/Emergency)
   - Add Notes
   ↓
4. Submit → Saves to referralsBHRMS
   ↓
5. Referral appears in:
   - Staff's "My Referrals" page
   - Admin's "Referral Dashboard" (real-time)
   ↓
6. Track status changes in "My Referrals"
```

### Admin Workflow: Managing Referrals

```
1. Login with admin credential → Admin Dashboard
   ↓
2. View real-time referral statistics
   ↓
3. Go to "Referral Dashboard"
   ↓
4. See all referrals from referralsBHRMS:
   - Filter by status (Pending/Accepted/Completed)
   - Filter by priority (Emergency/Urgent/Routine)
   - View patient details
   - Update status
   ↓
5. Changes reflect immediately in Staff's view
```

### Admin Workflow: Managing Facilities

```
1. Admin Dashboard → "Facility Management"
   ↓
2. View all BHS and Hospitals from facilitiesBHRMS
   ↓
3. Add New Facility:
   - Name, Type (BHS/Hospital)
   - Address, Contact
   - Services offered
   - Capacity
   ↓
4. Facilities available for staff when creating referrals
```

---

## 🔐 Authentication System

### Passwordless Login (2-Step Process)

**Step 1**: Enter credential number
```typescript
// System checks usersBHRMS collection
const user = await getUserByCredential(credentialNumber);
```

**Step 2**: Verify identity with full name
```typescript
const fullName = `${user.firstName} ${user.lastName}`;
if (enteredName === fullName) {
  // Login successful
  localStorage.setItem('bhrms_user', JSON.stringify(user));
}
```

**Persistence**: Uses localStorage with key `bhrms_user`

---

## 🛠️ Technical Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Notifications**: React Hot Toast

### Backend
- **Database**: Firebase Firestore
- **Admin SDK**: Firebase Admin (server-side operations)
- **API Routes**: Next.js API Routes

### Deployment
- **Platform**: Vercel
- **Build**: Static + Server-side Rendering
- **Environment**: Production-ready with environment variables

---

## 📊 Key Features

### Real-Time Collaboration
- ✅ Staff creates referral → Admin sees immediately
- ✅ Admin updates status → Staff sees in "My Referrals"
- ✅ Live statistics on dashboards
- ✅ Instant notifications

### Role-Based Dashboards
- 📊 **Admin Dashboard**: System-wide statistics, all referrals, user count, facility count
- 📊 **Staff Dashboard**: Personal statistics, own referrals, quick actions

### Comprehensive Search
- 🔍 **Patient Search**: Find all referrals by patient name
- 🔍 **Filter Options**: Status, priority, date range
- 🔍 **Case-insensitive**: Works with partial names

### Resource Management
- 🗺️ **Referral Map**: Geographic view of facilities
- 📞 **Health Hotlines**: Emergency contact directory
- 📋 **Health Protocols**: Medical guidelines and procedures

### Data Security
- 🔒 Firestore security rules enforce role-based access
- 🔒 Protected routes verify authentication
- 🔒 API routes use Firebase Admin SDK
- 🔒 Client-side validation

---

## 🎨 UI/UX Features

### Design System
- **Color Coding**: 
  - 🔴 Red = Emergency
  - 🟡 Yellow = Urgent/Pending
  - 🟢 Green = Routine/Completed
  - 🔵 Blue = Accepted/Admin

### Responsive Design
- ✅ Mobile-friendly
- ✅ Tablet optimized
- ✅ Desktop enhanced

### Animations
- ✅ Page transitions
- ✅ Card hover effects
- ✅ Loading states
- ✅ Smooth scrolling

### User Feedback
- ✅ Toast notifications
- ✅ Loading spinners
- ✅ Confirmation dialogs
- ✅ Error messages

---

## 📈 Analytics & Reporting

### Admin Reports Dashboard
- Total referrals by status
- Referrals by priority level
- Referrals over time (trend chart)
- Active users count
- Facility utilization
- Response time metrics

### Staff Statistics
- Personal referral count
- Pending referrals
- Completed referrals
- Recent activity

---

## 🚨 Priority System

### Emergency (🔴)
- Immediate attention required
- Life-threatening conditions
- Examples: Severe bleeding, cardiac arrest

### Urgent (🟡)
- Prompt attention needed
- Potentially serious conditions
- Examples: High fever, severe pain

### Routine (🟢)
- Standard referral
- Stable conditions
- Examples: Follow-up, consultation

---

## 📝 Status Workflow

```
Pending (🟡) → Staff creates referral
    ↓
Accepted (🔵) → Admin acknowledges and arranges transfer
    ↓
Completed (🟢) → Patient successfully referred and received
```

Alternative:
```
Pending (🟡) → Cancelled (⚫) → Admin rejects or staff cancels
```

---

## 🔧 Maintenance & Updates

### Adding New Users
**Method 1**: Admin UI
- Login as admin → User Management → Add User

**Method 2**: API Route
```typescript
POST /api/admin/add-user
Body: { credential, firstName, lastName, role, facility, position }
```

**Method 3**: Seed Script
```bash
node scripts/addUsers.js
```

### Adding New Facilities
- Login as admin → Facility Management → Add Facility
- Fills into `facilitiesBHRMS`
- Immediately available for referrals

### Managing Hotlines
- Login as admin → Health Hotlines → Add Hotline
- Staff can view, only admin can add/delete

---

## 🎓 Training Guide

### For New Staff
1. Receive credential number from admin
2. Login with credential + full name
3. Explore dashboard
4. Practice creating referral
5. Learn to track referrals in "My Referrals"
6. Familiarize with resources (Map, Hotlines, Protocols)

### For New Admins
1. Receive admin credential
2. Login and explore admin dashboard
3. Learn user management
4. Practice facility management
5. Monitor referral dashboard
6. Generate reports
7. Manage system resources

---

## ✅ Quality Assurance

### Code Quality
- ✅ TypeScript strict mode
- ✅ ESLint configured
- ✅ No build warnings
- ✅ React Hooks rules enforced

### Testing Checklist
- ✅ Login flow (both roles)
- ✅ Create referral
- ✅ Real-time updates
- ✅ Role-based access control
- ✅ Mobile responsiveness
- ✅ Error handling
- ✅ Data validation

---

## 📞 System Administrator Contact

For technical support or system issues:
- Check deployment logs in Vercel
- Review Firebase Console errors
- Monitor Firestore usage
- Verify security rules

---

## 🎉 System Status

**Version**: 1.0.0  
**Status**: ✅ Production Ready  
**Last Updated**: November 14, 2025  
**Build Status**: ✅ No Errors  
**Database**: ✅ Fully Configured  
**Security**: ✅ Rules Deployed  
**Features**: ✅ 100% Complete  

**Ready for Deployment** 🚀
