'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface DashboardStats {
  totalReferrals: number;
  pendingReferrals: number;
  myReferrals: number;
  totalUsers: number;
  totalFacilities: number;
  totalHotlines: number;
  recentActivity: any[];
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>({
    totalReferrals: 0,
    pendingReferrals: 0,
    myReferrals: 0,
    totalUsers: 0,
    totalFacilities: 0,
    totalHotlines: 0,
    recentActivity: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);

      // Fetch from referralsBHRMS collection
      const referralsSnapshot = await getDocs(collection(db, 'referralsBHRMS'));
      const totalReferrals = referralsSnapshot.size;
      const pendingReferrals = referralsSnapshot.docs.filter(
        doc => doc.data().status === 'pending'
      ).length;

      // Fetch staff-specific referrals
      let myReferrals = 0;
      if (user?.role === 'staff') {
        const myReferralsQuery = query(
          collection(db, 'referralsBHRMS'),
          where('createdBy', '==', user.credential)
        );
        const myReferralsSnapshot = await getDocs(myReferralsQuery);
        myReferrals = myReferralsSnapshot.size;
      }

      // Fetch from usersBHRMS collection
      const usersSnapshot = await getDocs(collection(db, 'usersBHRMS'));
      const totalUsers = usersSnapshot.size;

      // Fetch from facilitiesBHRMS collection
      const facilitiesSnapshot = await getDocs(collection(db, 'facilitiesBHRMS'));
      const totalFacilities = facilitiesSnapshot.size;

      // Fetch from hotlinesBHRMS collection
      const hotlinesSnapshot = await getDocs(collection(db, 'hotlinesBHRMS'));
      const totalHotlines = hotlinesSnapshot.size;

      // Get recent activity for staff
      const recentActivity = referralsSnapshot.docs
        .filter(doc => user?.role === 'staff' ? doc.data().createdBy === user.credential : true)
        .sort((a, b) => {
          const aDate = a.data().createdAt?.toDate() || new Date(0);
          const bDate = b.data().createdAt?.toDate() || new Date(0);
          return bDate.getTime() - aDate.getTime();
        })
        .slice(0, 5)
        .map(doc => ({ id: doc.id, ...doc.data() }));

      setStats({
        totalReferrals,
        pendingReferrals,
        myReferrals,
        totalUsers,
        totalFacilities,
        totalHotlines,
        recentActivity,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // Role-based dashboard content
  const isAdmin = user?.role === 'admin';

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Top Navigation Bar */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">🏥</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">BHRMS</h1>
                  <p className="text-xs text-gray-500">Barangay Health Referral</p>
                </div>
              </div>
              
              {/* User Menu */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h2>
            <p className="text-gray-600">
              {isAdmin 
                ? 'Municipal Health Office Administrator Dashboard'
                : 'Health Worker Portal'
              }
            </p>
          </motion.div>

          {/* Admin Dashboard */}
          {isAdmin && (
            <div className="space-y-6">
              {/* Live Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">📋</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {loading ? '...' : stats.totalReferrals}
                  </div>
                  <div className="text-xs text-gray-600">Total Referrals</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">⏳</div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {loading ? '...' : stats.pendingReferrals}
                  </div>
                  <div className="text-xs text-gray-600">Pending</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">👥</div>
                  <div className="text-2xl font-bold text-purple-600">
                    {loading ? '...' : stats.totalUsers}
                  </div>
                  <div className="text-xs text-gray-600">Personnel</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">🏥</div>
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats.totalFacilities}
                  </div>
                  <div className="text-xs text-gray-600">Facilities</div>
                </motion.div>
              </div>

              {/* Admin Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/admin/referral-dashboard">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                  >
                    <div className="text-3xl mb-3">📊</div>
                    <h3 className="text-xl font-bold mb-2">Referral Triage Dashboard</h3>
                    <p className="text-blue-100 text-sm">Live tracking of all active referrals</p>
                  </motion.div>
                </Link>

                <Link href="/admin/user-management">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                  >
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="text-xl font-bold mb-2">User Management</h3>
                    <p className="text-purple-100 text-sm">Manage BHS personnel accounts</p>
                  </motion.div>
                </Link>

                <Link href="/admin/facility-management">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                  >
                    <div className="text-3xl mb-3">🏥</div>
                    <h3 className="text-xl font-bold mb-2">Facility Management</h3>
                    <p className="text-green-100 text-sm">Update BHS & hospital details</p>
                  </motion.div>
                </Link>
              </div>

              {/* Admin Resources */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/resources/referral-map">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🗺️</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Geographic Referral Map</h4>
                          <p className="text-sm text-gray-500">View all BHS & hospitals</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/resources/health-hotlines">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📞</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Health Hotlines</h4>
                          <p className="text-sm text-gray-500">Emergency contacts</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/resources/health-protocols">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Health Protocols & Guides</h4>
                          <p className="text-sm text-gray-500">Triage flowcharts & infographics</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/admin/reports">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📈</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Reports & Analytics</h4>
                          <p className="text-sm text-gray-500">System insights</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Staff Dashboard */}
          {!isAdmin && (
            <div className="space-y-6">
              {/* Staff Statistics */}
              <div className="grid grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">📝</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {loading ? '...' : stats.myReferrals}
                  </div>
                  <div className="text-xs text-gray-600">My Referrals</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">🏥</div>
                  <div className="text-2xl font-bold text-green-600">
                    {loading ? '...' : stats.totalFacilities}
                  </div>
                  <div className="text-xs text-gray-600">Facilities</div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="text-2xl mb-1">📞</div>
                  <div className="text-2xl font-bold text-red-600">
                    {loading ? '...' : stats.totalHotlines}
                  </div>
                  <div className="text-xs text-gray-600">Hotlines</div>
                </motion.div>
              </div>

              {/* Staff Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/referrals/create">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                  >
                    <div className="text-3xl mb-3">➕</div>
                    <h3 className="text-xl font-bold mb-2">Create New Referral</h3>
                    <p className="text-blue-100 text-sm">Generate digital referral form</p>
                  </motion.div>
                </Link>

                <Link href="/referrals/my-referrals">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white shadow-lg cursor-pointer"
                  >
                    <div className="text-3xl mb-3">📝</div>
                    <h3 className="text-xl font-bold mb-2">My Referrals</h3>
                    <p className="text-purple-100 text-sm">Track your referral history</p>
                  </motion.div>
                </Link>
              </div>

              {/* Staff Resources */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Essential Resources</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/resources/referral-map">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🗺️</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Geographic Referral Map</h4>
                          <p className="text-sm text-gray-500">Find nearby BHS & hospitals</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/resources/health-hotlines">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📞</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Health Hotlines</h4>
                          <p className="text-sm text-gray-500">Ambulance & critical care contacts</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/resources/health-protocols">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📋</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Health Protocols & Guides</h4>
                          <p className="text-sm text-gray-500">Triage flowcharts & care guides</p>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/resources/patient-search">
                    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🔍</span>
                        <div>
                          <h4 className="font-medium text-gray-900">Patient History</h4>
                          <p className="text-sm text-gray-500">Search referral records</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                {loading ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="animate-pulse">Loading...</div>
                  </div>
                ) : stats.recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity: any) => (
                      <div
                        key={activity.id}
                        className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900">
                              {activity.patientName || 'Patient Referral'}
                            </div>
                            <div className="text-sm text-gray-600">
                              {activity.fromFacility} → {activity.toFacility}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {activity.createdAt?.toDate().toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              activity.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : activity.status === 'accepted'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            {activity.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">No recent referrals</p>
                    <Link href="/referrals/create">
                      <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        Create Your First Referral
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
