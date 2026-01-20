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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* STATS GLOBALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Total des Séances</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalSessions}</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Taux de Présence Moyen</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.averageAttendance}%</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">Étudiants Suivis</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalStudentsTracked}</p>
            </div>
          </div>

          {/* FILTRES ET TITRE */}
          <div className="bg-white shadow-sm sm:rounded-lg mb-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">📋 Historique des Séances</h1>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 rounded font-medium transition ${
                      sortBy === 'recent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    📅 Récent
                  </button>
                  <button
                    onClick={() => setSortBy('attendance')}
                    className={`px-4 py-2 rounded font-medium transition ${
                      sortBy === 'attendance'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    👥 Présence
                  </button>
                </div>
              </div>

              {sortedSessions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucune séance terminée pour le moment.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Module
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Date de Fin
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Durée
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Présences
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Taux
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {sortedSessions.map((session) => (
                        <tr key={session.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">{session.module_name}</p>
                            <p className="text-xs text-gray-500">Code: {session.code}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {session.ended_at}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {session.duration_minutes} min
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                  ✅ {session.present_count}
                                </span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                                  ❌ {session.absent_count}
                                </span>
                              </div>
                              <span className="text-xs text-gray-500">
                                /{session.total_students}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: `${session.attendance_rate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {session.attendance_rate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(session.id)}
                              className="inline-flex items-center px-3 py-1 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
                            >
                              👁️ Voir Détails
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
