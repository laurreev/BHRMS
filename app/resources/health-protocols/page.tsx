'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function HealthProtocolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    {
      id: 'triage',
      name: 'Triage Protocols',
      icon: '🏥',
      color: 'from-red-500 to-orange-500',
      description: 'Emergency triage flowcharts and assessment guides',
    },
    {
      id: 'referral',
      name: 'Referral Guidelines',
      icon: '📋',
      color: 'from-blue-500 to-indigo-500',
      description: 'When and how to refer patients to higher-level facilities',
    },
    {
      id: 'maternal',
      name: 'Maternal Health',
      icon: '🤰',
      color: 'from-pink-500 to-rose-500',
      description: 'Prenatal care, delivery, and postpartum protocols',
    },
    {
      id: 'pediatric',
      name: 'Pediatric Care',
      icon: '👶',
      color: 'from-purple-500 to-pink-500',
      description: 'Child health assessment and immunization guidelines',
    },
    {
      id: 'infectious',
      name: 'Infectious Diseases',
      icon: '🦠',
      color: 'from-green-500 to-teal-500',
      description: 'Prevention, management, and reporting protocols',
    },
    {
      id: 'chronic',
      name: 'Chronic Diseases',
      icon: '💊',
      color: 'from-yellow-500 to-orange-500',
      description: 'Management of diabetes, hypertension, and other chronic conditions',
    },
  ];

  const protocols = {
    triage: [
      { title: 'Emergency Triage Protocol', type: 'Flowchart', updated: '2024-11' },
      { title: 'Vital Signs Assessment Guide', type: 'Infographic', updated: '2024-10' },
      { title: 'Red Flag Symptoms Checklist', type: 'Quick Reference', updated: '2024-11' },
    ],
    referral: [
      { title: 'BHS to Hospital Referral Criteria', type: 'Guide', updated: '2024-11' },
      { title: 'Referral Form Completion Guide', type: 'Tutorial', updated: '2024-10' },
      { title: 'Transportation Guidelines', type: 'Protocol', updated: '2024-09' },
    ],
    maternal: [
      { title: 'Prenatal Care Schedule', type: 'Infographic', updated: '2024-11' },
      { title: 'High-Risk Pregnancy Identification', type: 'Checklist', updated: '2024-10' },
      { title: 'Normal Delivery Protocol', type: 'Guide', updated: '2024-11' },
    ],
    pediatric: [
      { title: 'Immunization Schedule (DOH)', type: 'Chart', updated: '2024-11' },
      { title: 'Growth Monitoring Guide', type: 'Infographic', updated: '2024-10' },
      { title: 'Common Pediatric Emergencies', type: 'Quick Reference', updated: '2024-11' },
    ],
    infectious: [
      { title: 'COVID-19 Management Protocol', type: 'Guide', updated: '2024-11' },
      { title: 'Dengue Prevention & Treatment', type: 'Infographic', updated: '2024-10' },
      { title: 'Tuberculosis Screening Guide', type: 'Protocol', updated: '2024-09' },
    ],
    chronic: [
      { title: 'Hypertension Management Algorithm', type: 'Flowchart', updated: '2024-11' },
      { title: 'Diabetes Care Guide', type: 'Infographic', updated: '2024-10' },
      { title: 'Medication Compliance Strategies', type: 'Guide', updated: '2024-11' },
    ],
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Health Protocols & Guides</h1>
              <p className="text-gray-600 mt-1">Essential resources for clinical decision-making</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Categories Grid */}
          {!selectedCategory && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, index) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedCategory(category.id)}
                  className="cursor-pointer group"
                >
                  <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all p-6 h-full">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <span className="text-3xl">{category.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{category.description}</p>
                    <div className="flex items-center text-sm text-indigo-600 font-medium">
                      <span>View Protocols</span>
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Selected Category View */}
          {selectedCategory && (
            <div>
              <button
                onClick={() => setSelectedCategory(null)}
                className="mb-6 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ← Back to Categories
              </button>

              <div className="bg-white rounded-xl shadow-sm p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categories.find(c => c.id === selectedCategory)?.color} flex items-center justify-center`}>
                    <span className="text-3xl">{categories.find(c => c.id === selectedCategory)?.icon}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {categories.find(c => c.id === selectedCategory)?.name}
                    </h2>
                    <p className="text-gray-600">
                      {categories.find(c => c.id === selectedCategory)?.description}
                    </p>
                  </div>
                </div>

                {/* Protocols List */}
                <div className="space-y-4">
                  {protocols[selectedCategory as keyof typeof protocols]?.map((protocol, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:border-indigo-400 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {protocol.title}
                          </h3>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded font-medium">
                              {protocol.type}
                            </span>
                            <span className="text-xs text-gray-500">
                              Updated: {protocol.updated}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                            📄 View
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            ⬇️ Download
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Placeholder Notice */}
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">📚</span>
                    <div>
                      <h4 className="font-semibold text-yellow-900 mb-2">Protocol Documents</h4>
                      <p className="text-sm text-yellow-800">
                        Actual protocol documents, flowcharts, and infographics will be uploaded here.
                        Files will be stored in Firebase Storage and accessible for download and viewing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Reference Cards */}
          {!selectedCategory && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-2">🚨 Emergency Numbers</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Emergency:</span>
                    <span className="font-mono font-bold">911</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NDRRMC:</span>
                    <span className="font-mono font-bold">117</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Red Cross:</span>
                    <span className="font-mono font-bold">143</span>
                  </div>
                </div>
                <Link href="/resources/health-hotlines">
                  <button className="mt-4 w-full px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg transition-colors text-sm font-medium">
                    View All Hotlines →
                  </button>
                </Link>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">📊 Latest Updates</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="font-medium text-gray-900">Emergency Triage Protocol</div>
                    <div className="text-xs text-gray-500">Updated Nov 2024</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">COVID-19 Guidelines</div>
                    <div className="text-xs text-gray-500">Updated Nov 2024</div>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Immunization Schedule</div>
                    <div className="text-xs text-gray-500">Updated Nov 2024</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-2">💡 Quick Tips</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Always check vital signs first</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Document everything accurately</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>When in doubt, refer up</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Follow standard precautions</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Info Banner */}
          {!selectedCategory && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <span className="text-2xl">ℹ️</span>
                <div>
                  <h4 className="font-semibold text-blue-900 mb-2">About These Protocols</h4>
                  <p className="text-sm text-blue-800">
                    All protocols and guides are based on Department of Health (DOH) guidelines and best practices.
                    Resources are regularly updated to reflect the latest clinical standards. 
                    For questions or suggestions, contact your MHO administrator.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
