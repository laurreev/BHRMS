'use client';

import { useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function TestFirebasePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');
    
    try {
      // Test 1: Check if db is initialized
      if (!db) {
        setResult('❌ Firestore not initialized. Check your .env.local file.');
        setLoading(false);
        return;
      }
      
      setResult('✅ Firestore initialized\n');
      
      // Test 2: Try to list all users in usersBHRMS collection
      const usersRef = collection(db, 'usersBHRMS');
      const snapshot = await getDocs(usersRef);
      
      if (snapshot.empty) {
        setResult(prev => prev + '⚠️ Collection "usersBHRMS" is empty. No users found.\n');
        setResult(prev => prev + '\nRun: node scripts/addUsers.js\n');
      } else {
        setResult(prev => prev + `✅ Found ${snapshot.size} user(s) in usersBHRMS:\n\n`);
        
        snapshot.forEach((doc) => {
          const data = doc.data();
          setResult(prev => prev + `📄 Document ID: ${doc.id}\n`);
          setResult(prev => prev + `   Name: ${data.firstName} ${data.lastName}\n`);
          setResult(prev => prev + `   Credential: ${data.credential}\n`);
          setResult(prev => prev + `   Role: ${data.role}\n\n`);
        });
      }
      
      // Test 3: Try to fetch specific test credentials
      setResult(prev => prev + '\n--- Testing specific credentials ---\n');
      
      const testCredentials = ['staff123', 'admin123'];
      
      for (const cred of testCredentials) {
        try {
          const userDoc = await getDoc(doc(db, 'usersBHRMS', cred));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setResult(prev => prev + `✅ ${cred}: ${data.firstName} ${data.lastName}\n`);
          } else {
            setResult(prev => prev + `❌ ${cred}: Not found\n`);
          }
        } catch (err: any) {
          setResult(prev => prev + `❌ ${cred}: Error - ${err.message}\n`);
        }
      }
      
    } catch (error: any) {
      setResult(prev => prev + `\n❌ ERROR: ${error.message}\n\n`);
      setResult(prev => prev + `Full error: ${JSON.stringify(error, null, 2)}\n`);
    } finally {
      setLoading(false);
    }
  };

  const checkEnvVars = () => {
    const envVars = {
      'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    let output = '--- Environment Variables Check ---\n\n';
    
    for (const [key, value] of Object.entries(envVars)) {
      if (value) {
        // Show first 10 chars only for security
        const preview = value.substring(0, 10) + '...';
        output += `✅ ${key}: ${preview}\n`;
      } else {
        output += `❌ ${key}: NOT SET\n`;
      }
    }
    
    output += '\n⚠️ If any are missing, check your .env.local file';
    setResult(output);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🔧 Firebase Connection Test
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="space-y-4">
            <button
              onClick={checkEnvVars}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              1️⃣ Check Environment Variables
            </button>
            
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? '⏳ Testing...' : '2️⃣ Test Firestore Connection & Users'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-900 text-green-400 rounded-lg p-6 font-mono text-sm whitespace-pre-wrap">
            {result}
          </div>
        )}

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-900 mb-2">💡 Troubleshooting Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-800">
            <li>Click &quot;Check Environment Variables&quot; - ensure all are set</li>
            <li>Click &quot;Test Firestore Connection&quot; - verify users exist</li>
            <li>If users are missing, run: <code className="bg-yellow-100 px-2 py-1 rounded">node scripts/addUsers.js</code></li>
            <li>Make sure your .env.local file exists in the root directory</li>
            <li>Restart dev server after changing .env.local</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
