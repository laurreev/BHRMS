'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Navigation */}
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center"
              >
                <h1 className="text-2xl font-bold text-gray-900">BHRMS</h1>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-4"
              >
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</span>
                  <p className="text-xs text-gray-600">{user?.role}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Logout
                </motion.button>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome to Your Dashboard
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Barangay Health Referral Management System
            </p>
          </motion.div>

          {/* Dashboard Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Patients', count: '0', color: 'bg-blue-50', icon: '👥' },
              { title: 'Referrals', count: '0', color: 'bg-green-50', icon: '📋' },
              { title: 'Appointments', count: '0', color: 'bg-purple-50', icon: '📅' },
              { title: 'Health Records', count: '0', color: 'bg-yellow-50', icon: '📊' },
              { title: 'Notifications', count: '0', color: 'bg-red-50', icon: '🔔' },
              { title: 'Reports', count: '0', color: 'bg-indigo-50', icon: '📈' },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`${card.color} rounded-2xl p-6 cursor-pointer transition-shadow hover:shadow-lg`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-4xl">{card.icon}</span>
                  <span className="text-3xl font-bold text-gray-900">{card.count}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                <p className="text-sm text-gray-600 mt-1">View all {card.title.toLowerCase()}</p>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <motion.button
                onClick={() => router.push('/admin/add-user')}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-gray-900 to-gray-700 text-white rounded-xl p-4 text-left hover:shadow-lg transition-shadow"
              >
                <span className="font-medium">➕ Add New User</span>
                <p className="text-sm text-gray-300 mt-1">Admin only</p>
              </motion.button>
              {[
                'Add New Patient',
                'Create Referral',
                'Schedule Appointment',
              ].map((action, index) => (
                <motion.button
                  key={action}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white rounded-xl p-4 text-left hover:shadow-lg transition-shadow border border-gray-200"
                >
                  <span className="font-medium text-gray-900">{action}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
