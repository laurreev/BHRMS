'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Facility {
  id: string;
  name: string;
  type: 'BHS' | 'Hospital';
  address: string;
  contact: string;
  services: string[];
  capacity?: number;
  coordinates?: { lat: number; lng: number };
}

export default function ReferralMapPage() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Geographic Referral Map</h1>
                <p className="text-gray-600 mt-1">Locate BHS and hospitals in the network</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('map')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'map'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🗺️ Map View
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    view === 'list'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  📋 List View
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {view === 'map' ? (
            /* Map View - Placeholder */
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-br from-blue-100 to-green-100 h-[600px] flex items-center justify-center relative">
                {/* Placeholder Map */}
                <div className="text-center z-10">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Map Coming Soon</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Geographic visualization of all BHS and hospitals will be displayed here.
                    Integration with Google Maps API pending.
                  </p>
                  <div className="inline-block bg-white rounded-lg shadow-lg p-6 text-left">
                    <h4 className="font-semibold text-gray-900 mb-3">Planned Features:</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Interactive map with facility markers
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Click markers for facility details
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Distance calculations
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Directions to facilities
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Filter by facility type
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-600 mr-2">✓</span>
                        Capacity indicators
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-20 left-20 w-16 h-16 bg-blue-500 rounded-full"></div>
                  <div className="absolute top-40 right-32 w-12 h-12 bg-green-500 rounded-full"></div>
                  <div className="absolute bottom-32 left-40 w-14 h-14 bg-blue-400 rounded-full"></div>
                  <div className="absolute bottom-20 right-20 w-10 h-10 bg-green-400 rounded-full"></div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="bg-gray-50 p-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-8">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Barangay Health Station</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">Emergency Services</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* List View */
            <div className="space-y-4">
              {loading ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <div className="animate-pulse">Loading facilities...</div>
                </div>
              ) : facilities.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                  <span className="text-6xl mb-4 block">🏥</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Facilities Found</h3>
                  <p className="text-gray-600 mb-4">No facilities have been added yet.</p>
                  <Link href="/admin/facility-management">
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Add Facilities
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">All Facilities ({facilities.length})</h3>
                  <div className="space-y-4">
                    {facilities.map((facility, index) => (
                    <motion.div
                      key={facility.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              facility.type === 'BHS' ? 'bg-green-100' : 'bg-blue-100'
                            }`}>
                              <span className="text-xl">{facility.type === 'BHS' ? '🏘️' : '🏨'}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{facility.name}</h4>
                              <span className={`text-xs font-semibold ${
                                facility.type === 'BHS' ? 'text-green-600' : 'text-blue-600'
                              }`}>
                                {facility.type}
                              </span>
                            </div>
                          </div>

                          <div className="ml-13 space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📍</span>
                              <span>{facility.address}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="mr-2">📞</span>
                              <span>{facility.contact}</span>
                            </div>
                            <div className="flex items-start text-sm text-gray-600">
                              <span className="mr-2">🏥</span>
                              <div className="flex flex-wrap gap-1">
                                {facility.services.map((service, i) => (
                                  <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {service}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            View on Map
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Get Directions
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              )}

              {!loading && facilities.length > 0 && (
                <>
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Facilities</p>
                      <p className="text-2xl font-bold text-gray-900">{facilities.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏥</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Health Stations</p>
                      <p className="text-2xl font-bold text-green-600">
                        {facilities.filter(f => f.type === 'BHS').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏘️</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Hospitals</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {facilities.filter(f => f.type === 'Hospital').length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏨</span>
                    </div>
                  </div>
                </div>
              </div>
              </>
              )}
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">About This Map</h4>
                <p className="text-sm text-blue-800">
                  This geographic referral map will help health workers quickly locate the nearest BHS or hospital 
                  for patient referrals. Facilities are managed through the <Link href="/admin/facility-management" className="underline font-medium">Facility Management</Link> page.
                  Map integration with real-time data is planned for the next update.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
