'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import toast from 'react-hot-toast';

interface Facility {
  id: string;
  name: string;
  type: 'BHS' | 'Hospital';
  address: string;
}

export default function CreateReferralPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  // Form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [fromFacility, setFromFacility] = useState('');
  const [toFacility, setToFacility] = useState('');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [notes, setNotes] = useState('');
  
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const facilitiesRef = collection(db, 'facilitiesBHRMS');
      const snapshot = await getDocs(facilitiesRef);
      
      const facilitiesList: Facility[] = [];
      snapshot.forEach((doc) => {
        facilitiesList.push({ id: doc.id, ...doc.data() } as Facility);
      });
      
      facilitiesList.sort((a, b) => a.name.localeCompare(b.name));
      setFacilities(facilitiesList);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      toast.error('Failed to load facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a referral');
      return;
    }

    if (fromFacility === toFacility) {
      toast.error('Origin and destination facilities must be different');
      return;
    }

    setSubmitting(true);

    try {
      await addDoc(collection(db, 'referralsBHRMS'), {
        patientName,
        patientAge: parseInt(patientAge),
        patientGender,
        chiefComplaint,
        fromFacility,
        toFacility,
        priority,
        notes,
        status: 'pending',
        createdBy: user.credential,
        createdByName: `${user.firstName} ${user.lastName}`,
        createdAt: Timestamp.now(),
        updatedAt: new Date().toISOString(),
      });

      toast.success('Referral created successfully!');
      
      // Clear form
      setPatientName('');
      setPatientAge('');
      setPatientGender('Male');
      setChiefComplaint('');
      setFromFacility('');
      setToFacility('');
      setPriority('routine');
      setNotes('');

      // Redirect to My Referrals after 1 second
      setTimeout(() => {
        router.push('/referrals/my-referrals');
      }, 1000);
    } catch (error: any) {
      console.error('Error creating referral:', error);
      toast.error('Failed to create referral');
    } finally {
      setSubmitting(false);
    }
  };

  const bhsFacilities = facilities.filter(f => f.type === 'BHS');
  const hospitalFacilities = facilities.filter(f => f.type === 'Hospital');

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Referral</h1>
              <p className="text-gray-600 mt-1">Generate digital patient referral form</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Information Section */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👤</span>
                  Patient Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Juan Dela Cruz"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      required
                      min="0"
                      max="150"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Chief Complaint / Reason for Referral <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      required
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Describe the patient's condition and reason for referral..."
                    />
                  </div>
                </div>
              </div>

              {/* Referral Details Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🏥</span>
                  Referral Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From (Origin Facility) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={fromFacility}
                      onChange={(e) => setFromFacility(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select origin facility</option>
                      {bhsFacilities.length > 0 && (
                        <optgroup label="Barangay Health Stations">
                          {bhsFacilities.map((facility) => (
                            <option key={facility.id} value={facility.name}>
                              {facility.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {hospitalFacilities.length > 0 && (
                        <optgroup label="Hospitals">
                          {hospitalFacilities.map((facility) => (
                            <option key={facility.id} value={facility.name}>
                              {facility.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To (Destination Facility) <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={toFacility}
                      onChange={(e) => setToFacility(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="">Select destination facility</option>
                      {bhsFacilities.length > 0 && (
                        <optgroup label="Barangay Health Stations">
                          {bhsFacilities.map((facility) => (
                            <option key={facility.id} value={facility.name}>
                              {facility.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      {hospitalFacilities.length > 0 && (
                        <optgroup label="Hospitals">
                          {hospitalFacilities.map((facility) => (
                            <option key={facility.id} value={facility.name}>
                              {facility.name}
                            </option>
                          ))}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority Level <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setPriority('routine')}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          priority === 'routine'
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-300 text-gray-700 hover:border-green-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">🟢</div>
                        Routine
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('urgent')}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          priority === 'urgent'
                            ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                            : 'border-gray-300 text-gray-700 hover:border-yellow-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">🟡</div>
                        Urgent
                      </button>
                      <button
                        type="button"
                        onClick={() => setPriority('emergency')}
                        className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                          priority === 'emergency'
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-300 text-gray-700 hover:border-red-400'
                        }`}
                      >
                        <div className="text-2xl mb-1">🔴</div>
                        Emergency
                      </button>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Any additional information that may be helpful..."
                    />
                  </div>
                </div>
              </div>

              {/* Created By Info */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="text-sm text-gray-600">
                  <strong>Created by:</strong> {user?.firstName} {user?.lastName} ({user?.credential})
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Referral...
                    </span>
                  ) : (
                    '✓ Create Referral'
                  )}
                </button>
                <Link href="/dashboard" className="flex-1">
                  <button
                    type="button"
                    className="w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </Link>
              </div>
            </form>
          </motion.div>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <span className="text-xl">ℹ️</span>
              <div className="text-sm text-blue-800">
                <strong>Note:</strong> All referrals are sent to the admin dashboard for approval and tracking. 
                You can view the status of your referrals in the <Link href="/referrals/my-referrals" className="underline font-medium">My Referrals</Link> page.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
