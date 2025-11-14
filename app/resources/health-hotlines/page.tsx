'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

interface Hotline {
  id: string;
  name: string;
  category: 'ambulance' | 'hospital' | 'emergency' | 'government' | 'other';
  number: string;
  description: string;
  available24h: boolean;
  createdAt: string;
}

export default function HealthHotlinesPage() {
  const { user } = useAuth();
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState<'all' | Hotline['category']>('all');
  const [formData, setFormData] = useState({
    name: '',
    category: 'ambulance' as Hotline['category'],
    number: '',
    description: '',
    available24h: true,
  });

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchHotlines();
  }, []);

  const fetchHotlines = async () => {
    try {
      setLoading(true);
      const hotlinesRef = collection(db, 'hotlinesBHRMS');
      const snapshot = await getDocs(hotlinesRef);
      
      const hotlinesList: Hotline[] = [];
      snapshot.forEach((doc) => {
        hotlinesList.push({ id: doc.id, ...doc.data() } as Hotline);
      });
      
      // Sort by category then name
      hotlinesList.sort((a, b) => {
        if (a.category === b.category) {
          return a.name.localeCompare(b.name);
        }
        return a.category.localeCompare(b.category);
      });
      
      setHotlines(hotlinesList);
    } catch (error: any) {
      console.error('Error fetching hotlines:', error);
      toast.error('Failed to load hotlines');
    } finally {
      setLoading(false);
    }
  };

  const handleAddHotline = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await addDoc(collection(db, 'hotlinesBHRMS'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });

      toast.success('Hotline added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        category: 'ambulance',
        number: '',
        description: '',
        available24h: true,
      });
      fetchHotlines();
    } catch (error: any) {
      console.error('Error adding hotline:', error);
      toast.error('Failed to add hotline');
    }
  };

  const handleDeleteHotline = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'hotlinesBHRMS', id));
      toast.success('Hotline deleted successfully');
      fetchHotlines();
    } catch (error: any) {
      console.error('Error deleting hotline:', error);
      toast.error('Failed to delete hotline');
    }
  };

  const filteredHotlines = hotlines.filter(h => 
    filterCategory === 'all' || h.category === filterCategory
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ambulance': return '🚑';
      case 'hospital': return '🏥';
      case 'emergency': return '🚨';
      case 'government': return '🏛️';
      default: return '📞';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ambulance': return 'bg-red-100 text-red-800 border-red-300';
      case 'hospital': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'emergency': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'government': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const categories = [
    { value: 'all', label: 'All Services', icon: '📞' },
    { value: 'ambulance', label: 'Ambulance', icon: '🚑' },
    { value: 'hospital', label: 'Hospitals', icon: '🏥' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
    { value: 'government', label: 'Government', icon: '🏛️' },
    { value: 'other', label: 'Other', icon: '📱' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Health Hotlines</h1>
                <p className="text-gray-600 mt-1">Emergency contacts & critical care services</p>
              </div>
              {isAdmin && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
                >
                  ➕ Add Hotline
                </motion.button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Emergency Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl p-6 mb-6 shadow-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">🚨</span>
              <div>
                <h2 className="text-2xl font-bold mb-1">Emergency Services</h2>
                <p className="text-red-100">For life-threatening emergencies, call immediately</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <a href="tel:911" className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 transition-colors">
                <div className="text-white/80 text-sm mb-1">National Emergency</div>
                <div className="text-3xl font-bold">911</div>
              </a>
              <a href="tel:117" className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 transition-colors">
                <div className="text-white/80 text-sm mb-1">NDRRMC Hotline</div>
                <div className="text-3xl font-bold">117</div>
              </a>
              <a href="tel:143" className="bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg p-4 transition-colors">
                <div className="text-white/80 text-sm mb-1">Red Cross</div>
                <div className="text-3xl font-bold">143</div>
              </a>
            </div>
          </motion.div>

          {/* Category Filters */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setFilterCategory(cat.value as any)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    filterCategory === cat.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hotlines List */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <p className="mt-4 text-gray-600">Loading hotlines...</p>
            </div>
          ) : filteredHotlines.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <span className="text-6xl mb-4 block">📞</span>
              <p className="text-gray-600">No hotlines found</p>
              {isAdmin && (
                <button
                  onClick={() => setShowAddModal(true)}
                  className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Add Your First Hotline
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredHotlines.map((hotline, index) => (
                <motion.div
                  key={hotline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center border-2 ${getCategoryColor(hotline.category)}`}>
                        <span className="text-2xl">{getCategoryIcon(hotline.category)}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{hotline.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded border ${getCategoryColor(hotline.category)}`}>
                          {hotline.category}
                        </span>
                      </div>
                    </div>
                    {hotline.available24h && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                        24/7
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 mb-4">{hotline.description}</p>

                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${hotline.number}`}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-shadow text-center font-bold text-lg"
                    >
                      📞 {hotline.number}
                    </a>
                    {isAdmin && (
                      <button
                        onClick={() => handleDeleteHotline(hotline.id, hotline.name)}
                        className="px-4 py-3 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">Quick Access</h4>
                <p className="text-sm text-blue-800">
                  Save these numbers to your phone for quick access during emergencies. 
                  All hotlines are verified and updated regularly by administrators.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Hotline Modal */}
        {showAddModal && isAdmin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-md w-full"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Hotline</h2>
              </div>

              <form onSubmit={handleAddHotline} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., City Ambulance Service"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Hotline['category'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  >
                    <option value="ambulance">Ambulance</option>
                    <option value="hospital">Hospital</option>
                    <option value="emergency">Emergency Services</option>
                    <option value="government">Government Hotline</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="e.g., 0912-345-6789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    rows={3}
                    placeholder="Brief description of services provided"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="available24h"
                    checked={formData.available24h}
                    onChange={(e) => setFormData({ ...formData, available24h: e.target.checked })}
                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <label htmlFor="available24h" className="ml-2 text-sm text-gray-700">
                    Available 24/7
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                  >
                    Add Hotline
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
