'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Facility {
  id: string;
  name: string;
  type: 'bhs' | 'hospital';
  address: string;
  contactNumber: string;
  services: string[];
  capacity: number;
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: string;
}

export default function FacilityManagementPage() {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'bhs' | 'hospital'>('all');
  const [formData, setFormData] = useState({
    name: '',
    type: 'bhs' as 'bhs' | 'hospital',
    address: '',
    contactNumber: '',
    services: '',
    capacity: '',
  });

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
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const facilitiesRef = collection(db, 'facilitiesBHRMS');
      const snapshot = await getDocs(facilitiesRef);
      
      const facilitiesList: Facility[] = [];
      snapshot.forEach((doc) => {
        facilitiesList.push({ id: doc.id, ...doc.data() } as Facility);
      });
      
      facilitiesList.sort((a, b) => a.name.localeCompare(b.name));
      setFacilities(facilitiesList);
    } catch (error: any) {
      console.error('Error fetching facilities:', error);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFacility = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const servicesArray = formData.services.split(',').map(s => s.trim()).filter(s => s);

      await addDoc(collection(db, 'facilitiesBHRMS'), {
        name: formData.name,
        type: formData.type,
        address: formData.address,
        contactNumber: formData.contactNumber,
        services: servicesArray,
        capacity: parseInt(formData.capacity),
        createdAt: new Date().toISOString(),
      });

      toast.success('Facility added successfully!');
      setShowAddModal(false);
      setFormData({
        name: '',
        type: 'bhs',
        address: '',
        contactNumber: '',
        services: '',
        capacity: '',
      });
      fetchFacilities();
    } catch (error: any) {
      console.error('Error adding facility:', error);
      toast.error('Failed to add facility');
    }
  };

  const handleDeleteFacility = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'facilities', id));
      toast.success(`${name} deleted successfully`);
      fetchFacilities();
    } catch (error: any) {
      console.error('Error deleting facility:', error);
      toast.error('Failed to delete facility');
    }
  };

  const filteredFacilities = facilities.filter(f => 
    filterType === 'all' || f.type === filterType
  );

  const stats = {
    total: facilities.length,
    bhs: facilities.filter(f => f.type === 'bhs').length,
    hospitals: facilities.filter(f => f.type === 'hospital').length,
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
                  ← Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Facility Management</h1>
                <p className="text-gray-600 mt-1">Manage BHS and hospital information</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl"
              >
                ➕ Add Facility
              </motion.button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Facilities</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏥</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Health Stations</p>
                  <p className="text-3xl font-bold text-green-600">{stats.bhs}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏘️</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hospitals</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.hospitals}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🏨</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Filter Buttons */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Facilities
              </button>
              <button
                onClick={() => setFilterType('bhs')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'bhs'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                BHS Only
              </button>
              <button
                onClick={() => setFilterType('hospital')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'hospital'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Hospitals Only
              </button>
            </div>
          </div>

          {/* Facilities Grid */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              <p className="mt-4 text-gray-600">Loading facilities...</p>
            </div>
          ) : filteredFacilities.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-600">No facilities found</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Add Your First Facility
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFacilities.map((facility, index) => (
                <motion.div
                  key={facility.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl shadow-sm p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      facility.type === 'bhs' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      <span className="text-2xl">{facility.type === 'bhs' ? '🏘️' : '🏨'}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      facility.type === 'bhs'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {facility.type === 'bhs' ? 'BHS' : 'Hospital'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2">{facility.name}</h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start">
                      <span className="mr-2">📍</span>
                      <span>{facility.address}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">📞</span>
                      <span>{facility.contactNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-2">🛏️</span>
                      <span>Capacity: {facility.capacity}</span>
                    </div>
                  </div>

                  {facility.services && facility.services.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-700 mb-2">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {facility.services.slice(0, 3).map((service, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {service}
                          </span>
                        ))}
                        {facility.services.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{facility.services.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleDeleteFacility(facility.id, facility.name)}
                      className="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Facility Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Facility</h2>
              </div>

              <form onSubmit={handleAddFacility} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Barangay Health Station 1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'bhs' | 'hospital' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="bhs">Barangay Health Station (BHS)</option>
                    <option value="hospital">Hospital</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Complete address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 09XX-XXX-XXXX"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Capacity (number of beds) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., 10"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Services (comma-separated)
                  </label>
                  <textarea
                    value={formData.services}
                    onChange={(e) => setFormData({ ...formData, services: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="e.g., Primary Care, Emergency, Laboratory, X-Ray"
                  />
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
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium"
                  >
                    Add Facility
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
