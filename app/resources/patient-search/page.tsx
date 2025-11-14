'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

export default function PatientSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Referral[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a patient name');
      return;
    }

    setSearching(true);
    setHasSearched(true);

    try {
      const referralsRef = collection(db, 'referralsBHRMS');
      const snapshot = await getDocs(referralsRef);
      
      const results: Referral[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Case-insensitive search
        if (data.patientName.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ id: doc.id, ...data } as Referral);
        }
      });

      // Sort by date (newest first)
      results.sort((a, b) => {
        const aDate = a.createdAt?.toDate() || new Date(0);
        const bDate = b.createdAt?.toDate() || new Date(0);
        return bDate.getTime() - aDate.getTime();
      });

      setSearchResults(results);
      
      if (results.length === 0) {
        toast('No referrals found for this patient', { icon: 'ℹ️' });
      } else {
        toast.success(`Found ${results.length} referral(s)`);
      }
    } catch (error: any) {
      console.error('Error searching:', error);
      toast.error('Failed to search referrals');
    } finally {
      setSearching(false);
    }
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
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient History Search</h1>
              <p className="text-gray-600 mt-1">Search referral records by patient name</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 mb-6"
          >
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter patient name (e.g., Juan Dela Cruz)"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={searching}
                className="px-8 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {searching ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Searching...
                  </span>
                ) : (
                  '🔍 Search'
                )}
              </button>
            </form>
          </motion.div>

          {/* Results */}
          {hasSearched && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Search Results {searchResults.length > 0 && `(${searchResults.length})`}
              </h3>

              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block">🔍</span>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                  <p className="text-gray-600">
                    No referrals found for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try searching with a different name or check the spelling
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {searchResults.map((referral, index) => (
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                        <div>
                          <div className="text-xs font-semibold text-gray-500 mb-1">CHIEF COMPLAINT</div>
                          <div className="text-sm text-gray-700">{referral.chiefComplaint}</div>
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-gray-500 mb-1">REFERRAL PATH</div>
                          <div className="text-sm text-gray-700">
                            {referral.fromFacility} → {referral.toFacility}
                          </div>
                        </div>
                      </div>

                      {referral.notes && (
                        <div className="mb-3">
                          <div className="text-xs font-semibold text-gray-500 mb-1">NOTES</div>
                          <div className="text-sm text-gray-600">{referral.notes}</div>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                        <div className="text-xs text-gray-500">
                          <strong>Created by:</strong> {referral.createdByName} ({referral.createdBy})
                        </div>
                        <div className="text-xs text-gray-500">
                          {referral.createdAt?.toDate().toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Initial State */}
          {!hasSearched && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <span className="text-6xl mb-4 block">🔍</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Search Patient History</h3>
              <p className="text-gray-600 mb-4">
                Enter a patient&apos;s name above to find their referral records
              </p>
              <div className="max-w-md mx-auto text-left bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-700 mb-2">💡 Search Tips:</div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• You can search by partial names</li>
                  <li>• Search is case-insensitive</li>
                  <li>• Results show all referrals for matching patients</li>
                  <li>• Records are sorted by date (newest first)</li>
                </ul>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-6 bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-teal-800">
                <strong>Privacy Notice:</strong> Patient information is confidential. 
                Only use this search for legitimate medical purposes in accordance with health worker protocols.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
