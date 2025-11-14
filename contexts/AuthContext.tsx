'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: UserData | null;
  loading: boolean;
  login: (credential: string, confirmedName: string) => Promise<void>;
  logout: () => Promise<void>;
  addUser: (userData: UserData) => Promise<void>;
}

interface UserData {
  credential: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('bhrms_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credential: string, confirmedName: string) => {
    try {
      // Fetch user from Firestore using credential
      const userDoc = await getDoc(doc(db, 'usersBHRMS', credential));
      
      if (!userDoc.exists()) {
        toast.error('Invalid credential number');
        throw new Error('User not found');
      }

      const userData = userDoc.data() as UserData;
      const fullName = `${userData.firstName} ${userData.lastName}`;

      // Verify the name matches
      if (fullName.toLowerCase() !== confirmedName.toLowerCase()) {
        toast.error('Name does not match our records');
        throw new Error('Name verification failed');
      }

      // Login successful
      setUser(userData);
      localStorage.setItem('bhrms_user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.firstName}!`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      if (!error.message.includes('not found') && !error.message.includes('verification')) {
        toast.error('Failed to login');
      }
      throw error;
    }
  };

  const addUser = async (userData: UserData) => {
    try {
      const { setDoc } = await import('firebase/firestore');
      
      await setDoc(doc(db, 'usersBHRMS', userData.credential), {
        credential: userData.credential,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      toast.success('User account created successfully!');
    } catch (error: any) {
      console.error('Add user error:', error);
      toast.error(error.message || 'Failed to create account');
      throw error;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('bhrms_user');
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, addUser }}>
      {children}
    </AuthContext.Provider>
  );
};
