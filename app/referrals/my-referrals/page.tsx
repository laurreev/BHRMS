'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Referral {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  chiefComplaint: string;
  fromFacility: string;
  toFacility: string;
  priority: 'routine' | 'urgent' | 'emergency';
  status: 'pending' | 'accepted' | 'completed';
  createdBy: string;
  createdByName: string;
  createdAt: any;
  notes?: string;
}

export default function MyReferralsPage() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed'>('all');

  useEffect(() => {
    if (user) {
      fetchMyReferrals();
    }
  }, [user]);

  const fetchMyReferrals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const referralsRef = collection(db, 'referralsBHRMS');
      const q = query(
        referralsRef,
        where('createdBy', '==', user.credential),
        orderBy('createdAt', 'desc')
      );
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

  const filteredReferrals = referrals.filter(r => 
    filterStatus === 'all' || r.status === filterStatus
  );

  const stats = {
    total: referrals.length,
    pending: referrals.filter(r => r.status === 'pending').length,
    accepted: referrals.filter(r => r.status === 'accepted').length,
    completed: referrals.filter(r => r.status === 'completed').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'emergency': return 'bg-red-100 text-red-700 border-red-300';
      case 'urgent': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'routine': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Referrals</h1>
                <p className="text-gray-600 mt-1">Track your patient referral history</p>
              </div>
              <Link href="/referrals/create">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
                >
                  ➕ Create New Referral
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Total</div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Accepted</div>
              <div className="text-2xl font-bold text-blue-600">{stats.accepted}</div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 shadow-sm"
            >
              <div className="text-sm text-gray-600 mb-1">Completed</div>
              <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            </motion.div>
          </div>

          {/* Filter Tabs */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-2 flex gap-2">
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'pending', label: 'Pending', count: stats.pending },
              { id: 'accepted', label: 'Accepted', count: stats.accepted },
              { id: 'completed', label: 'Completed', count: stats.completed },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterStatus(filter.id as any)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  filterStatus === filter.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>

          {/* Referrals List */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {filterStatus === 'all' ? 'All Referrals' : `${filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)} Referrals`}
            </h3>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-pulse text-gray-500">Loading referrals...</div>
              </div>
            ) : filteredReferrals.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">📋</span>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Referrals Found</h3>
                <p className="text-gray-600 mb-4">
                  {filterStatus === 'all' 
                    ? "You haven't created any referrals yet."
                    : `No ${filterStatus} referrals found.`}
                </p>
                <Link href="/referrals/create">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Create Your First Referral
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredReferrals.map((referral, index) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg text-gray-900">{referral.patientName}</h4>
                        <div className="text-sm text-gray-600">
                          {referral.patientAge} years old • {referral.patientGender}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(referral.priority)}`}>
                          {referral.priority.toUpperCase()}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(referral.status)}`}>
                          {referral.status.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[140px]">Chief Complaint:</span>
                        <span>{referral.chiefComplaint}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[140px]">From:</span>
                        <span>{referral.fromFacility}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-700">
                        <span className="font-medium min-w-[140px]">To:</span>
                        <span>{referral.toFacility}</span>
                      </div>
                      {referral.notes && (
                        <div className="flex items-start text-sm text-gray-700">
                          <span className="font-medium min-w-[140px]">Notes:</span>
                          <span className="text-gray-600">{referral.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <div className="text-xs text-gray-500">
                        Created: {referral.createdAt?.toDate().toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                      <div className="flex gap-2">
                        {referral.status === 'pending' && (
                          <span className="text-xs text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            ⏳ Waiting for admin approval
                          </span>
                        )}
                        {referral.status === 'accepted' && (
                          <span className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            ✓ Accepted - In progress
                          </span>
                        )}
                        {referral.status === 'completed' && (
                          <span className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-blue-800">
                <strong>Referral Status:</strong> Pending (waiting for admin) → Accepted (admin approved) → Completed (patient received care)
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
