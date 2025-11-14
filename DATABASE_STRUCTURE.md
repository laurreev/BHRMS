# BHRMS Database Structure

## 📊 Firestore Collections

All BHRMS collections use the `BHRMS` suffix for consistency and isolation from other apps.

---

### **usersBHRMS**
**Purpose:** Store health worker accounts (Staff & Admin)

**Document ID:** Credential number (e.g., `staff123`, `admin123`)

**Fields:**
```typescript
{
  credential: string;        // Unique credential number (matches document ID)
  firstName: string;         // User's first name
  lastName: string;          // User's last name
  role: 'staff' | 'admin';  // User role
  barangay?: string;         // Assigned barangay (for staff)
  createdAt: string;         // ISO timestamp
}
```

**Access:**
- Read: Public (for passwordless login verification)
- Write: Server-side only (via Admin SDK - `scripts/addUsers.js`)

**Usage:**
- Login verification (credential + name match)
- User management dashboard
- Role-based access control

---

### **facilitiesBHRMS**
**Purpose:** Store Barangay Health Stations and Hospitals

**Document ID:** Auto-generated

**Fields:**
```typescript
{
  name: string;              // Facility name
  type: 'BHS' | 'Hospital';  // Facility type
  address: string;           // Physical address
  contact: string;           // Contact number
  services: string[];        // Array of available services
  capacity?: number;         // Bed capacity (optional)
  coordinates?: {            // GPS coordinates (optional)
    lat: number;
    lng: number;
  };
  createdAt: string;         // ISO timestamp
}
```

**Access:**
- Read: Public (all users)
- Write: Client-side (admin interface)

**Usage:**
- Facility management page
- Referral map
- Referral creation (facility selection)
- Reports & analytics

---

### **referralsBHRMS**
**Purpose:** Store patient referral records

**Document ID:** Auto-generated

**Fields:**
```typescript
{
  patientName: string;       // Patient's full name
  patientAge: number;        // Patient's age
  patientGender: string;     // Patient's gender
  chiefComplaint: string;    // Reason for referral
  fromFacility: string;      // Origin facility name
  toFacility: string;        // Destination facility name
  priority: 'routine' | 'urgent' | 'emergency'; // Priority level
  status: 'pending' | 'accepted' | 'completed'; // Referral status
  createdBy: string;         // Credential of staff who created referral
  createdAt: Timestamp;      // Firebase Timestamp
  updatedAt?: string;        // ISO timestamp of last update
  notes?: string;            // Additional notes
}
```

**Access:**
- Read: Public (all users)
- Write: Client-side (staff can create, admin can update)

**Usage:**
- Referral triage dashboard (admin)
- My referrals (staff)
- Create referral form
- Reports & analytics
- Recent activity feed

---

### **hotlinesBHRMS**
**Purpose:** Store emergency contact numbers

**Document ID:** Auto-generated

**Fields:**
```typescript
{
  name: string;              // Contact name (e.g., "Red Cross Manila")
  category: 'ambulance' | 'hospital' | 'emergency' | 'government' | 'pharmacy' | 'other';
  number: string;            // Phone number
  description: string;       // Brief description
  available24h: boolean;     // 24/7 availability flag
  createdAt: string;         // ISO timestamp
}
```

**Access:**
- Read: Public (all users)
- Write: Client-side (admin only)

**Usage:**
- Health hotlines page
- Emergency contacts reference
- Dashboard quick reference

---

## 🔒 Security Rules

All collections are configured in `firestore.rules`:

```javascript
match /usersBHRMS/{credential} {
  allow read: if true;   // Public read for login
  allow write: if false; // Server-side only
}

match /facilitiesBHRMS/{facilityId} {
  allow read: if true;   // Anyone can view
  allow write: if true;  // Client-side writes allowed
}

match /referralsBHRMS/{referralId} {
  allow read: if true;   // Anyone can read
  allow write: if true;  // Anyone can write (will add auth later)
}

match /hotlinesBHRMS/{hotlineId} {
  allow read: if true;   // Anyone can view
  allow write: if true;  // Client-side writes allowed
}
```

---

## 📝 Naming Convention

**All BHRMS collections follow the pattern:**
```
[collectionName]BHRMS
```

**Examples:**
- `usersBHRMS` (not `users`)
- `facilitiesBHRMS` (not `facilities`)
- `referralsBHRMS` (not `referrals`)
- `hotlinesBHRMS` (not `hotlines`)

**Benefits:**
- Clear separation from other apps in the same Firebase project
- Easy identification of BHRMS-specific data
- Prevents naming conflicts
- Maintains consistency across the codebase

---

## 🚀 Future Collections (Planned)

### **protocolsBHRMS**
Store health protocol documents and guides
- Triage flowcharts
- Care protocols
- Clinical guidelines

### **reportsBHRMS**
Store generated report data
- Analytics snapshots
- Exported reports
- System metrics

### **notificationsBHRMS**
Store system notifications
- Referral updates
- System alerts
- User notifications

---

## 🛠️ Migration Notes

If migrating from old collection names:
1. Data remains in old collections (`facilities`, `referrals`, `hotlines`)
2. Old collections kept for backwards compatibility
3. All new data writes to BHRMS collections
4. Run migration script to transfer data (future task)

---

## 📊 Current Data Status

**Test Data:**
- 2 users in `usersBHRMS`:
  - `staff123` (Staff Dummy)
  - `admin123` (Admin Dummy)
  
**Production Data:**
- Facilities, referrals, and hotlines added via admin interface
- All stored in `*BHRMS` collections

---

*Last Updated: November 14, 2025*
