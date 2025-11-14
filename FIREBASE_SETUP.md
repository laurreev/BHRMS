# Firebase Setup for BHRMS

## Installation

1. Install dependencies:
```bash
npm install
```

## Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or select an existing one
3. Click on "Add app" and select Web (</>) 
4. Register your app with a nickname (e.g., "BHRMS")
5. Copy the Firebase configuration object
6. Update `src/firebase/config.js` with your configuration

## Enable Firebase Services

In the Firebase Console, enable the following services:

### 1. Authentication
- Go to Authentication > Get Started
- Enable Sign-in methods:
  - Email/Password (for staff login)
  - Or Custom Authentication (for credential-based login)

### 2. Firestore Database
- Go to Firestore Database > Create Database
- Start in production mode (or test mode for development)
- Choose a location closest to your users

### 3. Storage
- Go to Storage > Get Started
- Set up security rules for file uploads

## Running the Application

Development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Firestore Collections Structure

```
users/
  - {userId}
    - credentialNumber: string
    - name: string
    - role: string (staff, admin)
    - facility: string

facilities/
  - {facilityId}
    - name: string
    - type: string (BHS, Hospital)
    - location: GeoPoint
    - services: array
    - capacity: number

referrals/
  - {referralId}
    - patientName: string
    - fromFacility: reference
    - toFacility: reference
    - status: string (pending, accepted, completed)
    - createdBy: reference
    - createdAt: timestamp
    - updatedAt: timestamp
```

## Security Rules Example

Update your Firestore security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can read/write
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables (Optional)

Create a `.env` file for sensitive configuration:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then update `src/firebase/config.js` to use environment variables.
