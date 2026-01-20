import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function SessionHistory({ sessions }) {
  const [sortBy, setSortBy] = useState('recent');

  const sortedSessions = [...sessions].sort((a, b) => {
    if (sortBy === 'recent') {
      return new Date(b.ended_at) - new Date(a.ended_at);
    } else if (sortBy === 'attendance') {
      return b.attendance_rate - a.attendance_rate;
    }
    return 0;
  });

  const handleViewDetails = (sessionId) => {
    router.visit(route('professor.sessions.details', sessionId));
  };

  const stats = {
    totalSessions: sessions.length,
    averageAttendance: sessions.length > 0 
      ? (sessions.reduce((sum, s) => sum + s.attendance_rate, 0) / sessions.length).toFixed(2)
      : 0,
    totalStudentsTracked: sessions.reduce((sum, s) => sum + s.total_students, 0),
  };

  return (
    <AuthenticatedLayout>
      <Head title="Historique des Séances" />

      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Historique des Séances</h1>
            <p className="text-blue-100">Consultez l'historique complet de vos séances et leur taux de présence</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          {/* STATS GLOBALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#1e40af' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase">Total des Séances</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#1e40af' }}>{stats.totalSessions}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#059669' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase">Taux de Présence Moyen</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#059669' }}>{stats.averageAttendance}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#0891b2' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase">Étudiants Suivis</p>
              <p className="text-4xl font-bold mt-2" style={{ color: '#0891b2' }}>{stats.totalStudentsTracked}</p>
            </div>
          </div>

          {/* FILTRES ET TABLE */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white">Séances Terminées</h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    style={{
                      backgroundColor: sortBy === 'recent' ? '#1e40af' : '#e2e8f0',
                      color: sortBy === 'recent' ? 'white' : '#64748b',
                    }}
                    className="px-4 py-2 rounded font-medium transition hover:shadow-md"
                  >
                    Plus Récent
                  </button>
                  <button
                    onClick={() => setSortBy('attendance')}
                    style={{
                      backgroundColor: sortBy === 'attendance' ? '#1e40af' : '#e2e8f0',
                      color: sortBy === 'attendance' ? 'white' : '#64748b',
                    }}
                    className="px-4 py-2 rounded font-medium transition hover:shadow-md"
                  >
                    Taux Présence
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {sortedSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune séance terminée pour le moment.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Module</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Date de Fin</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Durée</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Présences</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Taux</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sortedSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{session.module_name}</p>
                            <p className="text-xs text-gray-500">Code: {session.code}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {new Date(session.ended_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {session.duration_minutes} min
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#ecfdf5', color: '#065f46' }}>
                                {session.present_count}
                              </span>
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: '#fef2f2', color: '#991b1b' }}>
                                {session.absent_count}
                              </span>
                              <span className="text-xs text-gray-500">
                                /{session.total_students}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full"
                                  style={{ width: `${session.attendance_rate}%`, backgroundColor: '#1e40af' }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                {session.attendance_rate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(session.id)}
                              style={{ backgroundColor: '#1e40af' }}
                              className="inline-flex items-center px-3 py-1 rounded text-white text-sm font-medium hover:opacity-90 transition"
                            >
                              Détails
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
