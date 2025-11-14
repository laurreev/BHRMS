'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Stats {
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalUsers: number;
  activeStaff: number;
  totalFacilities: number;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    completedReferrals: 0,
    totalUsers: 0,
    activeStaff: 0,
    totalFacilities: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week'); // week, month, year, all
  const [activeTab, setActiveTab] = useState('overview'); // overview, referrals, users, facilities

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch referrals
      const referralsSnapshot = await getDocs(collection(db, 'referralsBHRMS'));
      const totalReferrals = referralsSnapshot.size;
      const pendingReferrals = referralsSnapshot.docs.filter(doc => doc.data().status === 'pending').length;
      const completedReferrals = referralsSnapshot.docs.filter(doc => doc.data().status === 'completed').length;

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, 'usersBHRMS'));
      const totalUsers = usersSnapshot.size;
      const activeStaff = usersSnapshot.docs.filter(doc => doc.data().role === 'staff').length;

      // Fetch facilities
      const facilitiesSnapshot = await getDocs(collection(db, 'facilitiesBHRMS'));
      const totalFacilities = facilitiesSnapshot.size;

      setStats({
        totalReferrals,
        pendingReferrals,
        completedReferrals,
        totalUsers,
        activeStaff,
        totalFacilities,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">Only administrators can access reports.</p>
          <Link href="/dashboard">
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
                <p className="text-gray-600 mt-1">System usage and performance insights</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={fetchStats}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                  {loading ? '⏳ Loading...' : '🔄 Refresh'}
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  📥 Export PDF
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Period Selector */}
          <div className="mb-6 flex gap-2">
            {[
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'year', label: 'This Year' },
              { id: 'all', label: 'All Time' },
            ].map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* Tab Navigation */}
          <div className="mb-6 bg-white rounded-xl shadow-sm p-2 flex gap-2">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'referrals', label: 'Referrals', icon: '📋' },
              { id: 'users', label: 'Users', icon: '👥' },
              { id: 'facilities', label: 'Facilities', icon: '🏥' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="text-3xl mb-2">📋</div>
                  <div className="text-4xl font-bold mb-1">{stats.totalReferrals}</div>
                  <div className="text-blue-100">Total Referrals</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="text-3xl mb-2">⏳</div>
                  <div className="text-4xl font-bold mb-1">{stats.pendingReferrals}</div>
                  <div className="text-yellow-100">Pending</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="text-3xl mb-2">✅</div>
                  <div className="text-4xl font-bold mb-1">{stats.completedReferrals}</div>
                  <div className="text-green-100">Completed</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl p-6 shadow-lg"
                >
                  <div className="text-3xl mb-2">👥</div>
                  <div className="text-4xl font-bold mb-1">{stats.totalUsers}</div>
                  <div className="text-purple-100">Total Users</div>
                </motion.div>
              </div>

              {/* System Health */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">System Activity</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Referral Completion Rate</span>
                        <span className="font-semibold text-gray-900">
                          {stats.totalReferrals > 0
                            ? Math.round((stats.completedReferrals / stats.totalReferrals) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalReferrals > 0
                                ? (stats.completedReferrals / stats.totalReferrals) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Active Staff Members</span>
                        <span className="font-semibold text-gray-900">
                          {stats.activeStaff} / {stats.totalUsers}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{
                            width: `${
                              stats.totalUsers > 0
                                ? (stats.activeStaff / stats.totalUsers) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Registered Facilities</span>
                        <span className="font-semibold text-gray-900">{stats.totalFacilities}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(stats.totalFacilities * 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Insights</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <span className="text-2xl">✅</span>
                      <div>
                        <div className="font-semibold text-green-900 text-sm">High Completion Rate</div>
                        <div className="text-xs text-green-700">
                          {stats.totalReferrals > 0
                            ? Math.round((stats.completedReferrals / stats.totalReferrals) * 100)
                            : 0}% of referrals successfully completed
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <span className="text-2xl">👥</span>
                      <div>
                        <div className="font-semibold text-blue-900 text-sm">Active Staff</div>
                        <div className="text-xs text-blue-700">
                          {stats.activeStaff} staff members currently in system
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                      <span className="text-2xl">🏥</span>
                      <div>
                        <div className="font-semibold text-purple-900 text-sm">Facility Network</div>
                        <div className="text-xs text-purple-700">
                          {stats.totalFacilities} facilities in referral network
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Referral Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600 font-medium mb-1">Total Referrals</div>
                  <div className="text-3xl font-bold text-blue-900">{stats.totalReferrals}</div>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-600 font-medium mb-1">Pending</div>
                  <div className="text-3xl font-bold text-yellow-900">{stats.pendingReferrals}</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600 font-medium mb-1">Completed</div>
                  <div className="text-3xl font-bold text-green-900">{stats.completedReferrals}</div>
                </div>
              </div>

              {/* Placeholder for charts */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <span className="text-6xl mb-4 block">📈</span>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Referral Trends Chart</h4>
                <p className="text-sm text-gray-600">
                  Line chart showing referral trends over time will be displayed here.
                  Integration with charting library (Chart.js or Recharts) pending.
                </p>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">User Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-purple-600 font-medium mb-1">Total Users</div>
                  <div className="text-3xl font-bold text-purple-900">{stats.totalUsers}</div>
                  <div className="text-xs text-purple-600 mt-1">All system accounts</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="text-sm text-indigo-600 font-medium mb-1">Active Staff</div>
                  <div className="text-3xl font-bold text-indigo-900">{stats.activeStaff}</div>
                  <div className="text-xs text-indigo-600 mt-1">Staff role accounts</div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <span className="text-6xl mb-4 block">👥</span>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">User Activity Chart</h4>
                <p className="text-sm text-gray-600">
                  User login patterns, activity heatmap, and role distribution charts will be displayed here.
                </p>
              </div>
            </div>
          )}

          {/* Facilities Tab */}
          {activeTab === 'facilities' && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Facility Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-4 bg-teal-50 rounded-lg">
                  <div className="text-sm text-teal-600 font-medium mb-1">Total Facilities</div>
                  <div className="text-3xl font-bold text-teal-900">{stats.totalFacilities}</div>
                  <div className="text-xs text-teal-600 mt-1">In referral network</div>
                </div>
                <div className="p-4 bg-cyan-50 rounded-lg">
                  <div className="text-sm text-cyan-600 font-medium mb-1">Network Coverage</div>
                  <div className="text-3xl font-bold text-cyan-900">
                    {stats.totalFacilities > 0 ? '100%' : '0%'}
                  </div>
                  <div className="text-xs text-cyan-600 mt-1">Geographic distribution</div>
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <span className="text-6xl mb-4 block">🏥</span>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Facility Utilization Chart</h4>
                <p className="text-sm text-gray-600">
                  Charts showing facility capacity, referral volume per facility, and geographic distribution.
                </p>
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">📊</span>
              <div className="flex-1">
                <h4 className="font-semibold text-indigo-900 mb-2">Export Reports</h4>
                <p className="text-sm text-indigo-800 mb-4">
                  Generate detailed reports in various formats for record-keeping and presentation.
                </p>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    📄 Export PDF
                  </button>
                  <button className="px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                    📊 Export Excel
                  </button>
                  <button className="px-4 py-2 bg-white border border-indigo-300 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
                    📋 Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
