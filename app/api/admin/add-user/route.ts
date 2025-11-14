import { NextRequest, NextResponse } from 'next/server';

// Firebase Admin SDK imports
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    // Use environment variables for production
    const serviceAccount = {
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };
    
    initializeApp({
      credential: cert(serviceAccount),
    });
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
  }
}

const adminDb = getFirestore();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { credential, firstName, lastName, role } = body;

    // Validate required fields
    if (!credential || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate role
    if (!['staff', 'admin', 'health_worker'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userRef = adminDb.collection('usersBHRMS').doc(credential);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return NextResponse.json(
        { error: 'User with this credential already exists' },
        { status: 409 }
      );
    }

    // Create new user
    await userRef.set({
      credential,
      firstName,
      lastName,
      role,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: `User ${firstName} ${lastName} created successfully`,
      user: {
        credential,
        firstName,
        lastName,
        role,
      },
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error.message },
      { status: 500 }
    );
  }
}
