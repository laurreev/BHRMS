'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Referral {
  id: string;
  patientName: string;
  age: number;
  gender: string;
  chiefComplaint: string;
  fromFacility: string;
  toFacility: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  priority: 'routine' | 'urgent' | 'emergency';
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export default function ReferralTriageDashboardPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | 'routine' | 'urgent' | 'emergency'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You must be an administrator to access this page.</p>
          <Link href="/dashboard">
            <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchReferrals();
    
    // Auto-refresh every 30 seconds if enabled
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchReferrals, 30000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchReferrals = async () => {
    try {
      const referralsRef = collection(db, 'referralsBHRMS');
      const q = query(referralsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const referralsList: Referral[] = [];
      snapshot.forEach((doc) => {
        referralsList.push({ id: doc.id, ...doc.data() } as Referral);
      });
      
      setReferrals(referralsList);
    } catch (error: any) {
      console.error('Error fetching referrals:', error);
      toast.error('Failed to load referrals');
    } finally {
      setLoading(false);
    }
  };

  const updateReferralStatus = async (id: string, newStatus: Referral['status']) => {
    try {
      await updateDoc(doc(db, 'referralsBHRMS', id), {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      });
      toast.success(`Referral ${newStatus}`);
      fetchReferrals();
    } catch (error: any) {
      console.error('Error updating referral:', error);
      toast.error('Failed to update referral');
    }
  };

  // Filter referrals
  const filteredReferrals = referrals.filter(r => {
    const matchesStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || r.priority === filterPriority;
    return matchesStatus && matchesPriority;
  });

  // Calculate stats
  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    completed: referrals.filter(r => r.status === 'completed').length,
    emergency: referrals.filter(r => r.priority === 'emergency' && r.status !== 'completed').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-800 border-red-300';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
                  ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  Real-Time Referral Triage Dashboard
                  {autoRefresh && (
                    <span className="text-xs font-normal text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      ● Live
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-1">Command center for all active referrals</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    autoRefresh
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {autoRefresh ? '🔄 Auto-Refresh ON' : '⏸️ Auto-Refresh OFF'}
                </button>
                <button
                  onClick={fetchReferrals}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🔄 Refresh Now
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6 shadow-sm border-2 border-yellow-200"
            >
              <div className="text-center">
                <p className="text-sm text-yellow-700 mb-1 font-medium">⏳ Pending</p>
                <p className="text-3xl font-bold text-yellow-900">{stats.pending}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm"
            >
              <div className="text-center">
                <p className="text-sm text-blue-700 mb-1">✅ Accepted</p>
                <p className="text-3xl font-bold text-blue-900">{stats.accepted}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm"
            >
              <div className="text-center">
                <p className="text-sm text-green-700 mb-1">✓ Completed</p>
                <p className="text-3xl font-bold text-green-900">{stats.completed}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6 shadow-sm border-2 border-red-200"
            >
              <div className="text-center">
                <p className="text-sm text-red-700 mb-1 font-medium">🚨 Emergency</p>
                <p className="text-3xl font-bold text-red-900">{stats.emergency}</p>
              </div>
            </motion.div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">STATUS</label>
                <div className="flex gap-2">
                  {['all', 'pending', 'accepted', 'completed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        filterStatus === status
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-2 block">PRIORITY</label>
                <div className="flex gap-2">
                  {['all', 'routine', 'urgent', 'emergency'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFilterPriority(priority as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                        filterPriority === priority
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Referrals List */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">Loading referrals...</p>
            </div>
          ) : filteredReferrals.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <span className="text-6xl mb-4 block">📋</span>
              <p className="text-gray-600 text-lg">No referrals found</p>
              <p className="text-gray-500 text-sm mt-2">All caught up! No active referrals matching your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReferrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                    referral.priority === 'emergency'
                      ? 'border-red-500'
                      : referral.priority === 'urgent'
                      ? 'border-orange-500'
                      : 'border-blue-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{referral.patientName}</h3>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getPriorityColor(referral.priority)}`}>
                          {referral.priority === 'emergency' && '🚨 '}
                          {referral.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(referral.status)}`}>
                          {referral.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-gray-500">Age/Gender</p>
                          <p className="font-medium text-gray-900">{referral.age} / {referral.gender}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Chief Complaint</p>
                          <p className="font-medium text-gray-900">{referral.chiefComplaint}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">From</p>
                          <p className="font-medium text-gray-900">{referral.fromFacility}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">To</p>
                          <p className="font-medium text-gray-900">{referral.toFacility}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created by: {referral.createdBy}</span>
                        <span>•</span>
                        <span>{new Date(referral.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {referral.status === 'pending' && (
                        <button
                          onClick={() => updateReferralStatus(referral.id, 'accepted')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                        >
                          Accept
                        </button>
                      )}
                      {referral.status === 'accepted' && (
                        <button
                          onClick={() => updateReferralStatus(referral.id, 'completed')}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-6 text-sm text-gray-600 text-center">
            Showing {filteredReferrals.length} of {referrals.length} referrals
            {autoRefresh && ' • Auto-refreshing every 30 seconds'}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
