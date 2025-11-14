'use client';

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { motion } from 'framer-motion';

export default function SetupPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  const addMessage = (message: string) => {
    setStatus(prev => [...prev, message]);
  };

  const createUser = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    credential: string;
    role: string;
  }) => {
    try {
      addMessage(`Creating account for ${userData.firstName} ${userData.lastName}...`);
      
      // Create authentication user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      
      const userId = userCredential.user.uid;
      addMessage(`✅ Auth account created: ${userData.email}`);
      
      // Store additional data in Firestore
      await setDoc(doc(db, 'usersBHRMS', userId), {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        credential: userData.credential,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      addMessage(`✅ Firestore document created for ${userData.firstName} ${userData.lastName}`);
      addMessage(`   Credential: ${userData.credential}`);
      addMessage('');
      
      return true;
    } catch (error: any) {
      addMessage(`❌ Error: ${error.message}`);
      addMessage('');
      return false;
    }
  };

  const setupUsers = async () => {
    setIsLoading(true);
    setStatus([]);
    
    addMessage('🚀 Starting user setup...');
    addMessage('');

    // Create Staff User
    await createUser({
      email: 'staff@bhrms.com',
      password: 'staff123',
      firstName: 'Staff',
      lastName: 'Dummy',
      credential: 'staff123',
      role: 'staff'
    });

    // Create Admin User
    await createUser({
      email: 'admin@bhrms.com',
      password: 'admin123',
      firstName: 'Admin',
      lastName: 'Dummy',
      credential: 'admin123',
      role: 'admin'
    });

    addMessage('✅ Setup complete!');
    addMessage('');
    addMessage('You can now login with:');
    addMessage('Staff: staff@bhrms.com / staff123');
    addMessage('Admin: admin@bhrms.com / admin123');
    
    setIsLoading(false);
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">BHRMS Initial Setup</h1>
        <p className="text-gray-600 mb-8">Create initial staff and admin accounts</p>

        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Users to be created:</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>
                <strong>Staff Account:</strong>
                <br />
                Name: Staff Dummy
                <br />
                Email: staff@bhrms.com
                <br />
                Password: staff123
                <br />
                Credential: staff123
              </li>
              <li className="mt-2">
                <strong>Admin Account:</strong>
                <br />
                Name: Admin Dummy
                <br />
                Email: admin@bhrms.com
                <br />
                Password: admin123
                <br />
                Credential: admin123
              </li>
            </ul>
          </div>
        </div>

        {!completed && (
          <motion.button
            onClick={setupUsers}
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gray-900 text-white py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? 'Creating Users...' : 'Create Users'}
          </motion.button>
        )}

        {status.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-96 overflow-y-auto">
            <h3 className="font-semibold text-gray-900 mb-3">Status:</h3>
            <div className="font-mono text-sm space-y-1">
              {status.map((msg, index) => (
                <div
                  key={index}
                  className={
                    msg.startsWith('✅')
                      ? 'text-green-700'
                      : msg.startsWith('❌')
                      ? 'text-red-700'
                      : msg.startsWith('🚀')
                      ? 'text-blue-700 font-semibold'
                      : 'text-gray-700'
                  }
                >
                  {msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">✅ Setup Complete!</h3>
              <p className="text-sm text-green-800">
                You can now close this page and login with the credentials above.
              </p>
            </div>
            
            <a
              href="/login"
              className="block w-full bg-gray-900 text-white text-center py-4 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Go to Login →
            </a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
