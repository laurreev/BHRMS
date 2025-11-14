// Script to add initial users to BHRMS (Passwordless System)
// Run with: node scripts/addUsers.js

const admin = require('firebase-admin');
const path = require('path');

// Load service account key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function createUser(userData) {
  try {
    console.log(`Creating user: ${userData.firstName} ${userData.lastName}...`);

    // Store user data in Firestore (passwordless system)
    await db.collection('usersBHRMS').doc(userData.credential).set({
      credential: userData.credential,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    console.log(`✅ Created user: ${userData.firstName} ${userData.lastName}`);
    console.log(`   Credential: ${userData.credential}`);
    console.log(`   Role: ${userData.role}`);
    console.log('');

  } catch (error) {
    console.error(`❌ Error creating user ${userData.credential}:`, error.message);
  }
}

async function addUsers() {
  console.log('🚀 Adding users to BHRMS (Passwordless System)...\n');

  // Staff User
  await createUser({
    credential: 'staff123',
    firstName: 'Staff',
    lastName: 'Dummy',
    role: 'staff'
  });

  // Admin User
  await createUser({
    credential: 'admin123',
    firstName: 'Admin',
    lastName: 'Dummy',
    role: 'admin'
  });

  console.log('✅ All users created successfully!');
  console.log('\nUsers can now login with their credentials:');
  console.log('Staff: Enter credential "staff123", confirm name "Staff Dummy"');
  console.log('Admin: Enter credential "admin123", confirm name "Admin Dummy"');
  
  process.exit(0);
}

// Install firebase-admin first: npm install firebase-admin
addUsers();
