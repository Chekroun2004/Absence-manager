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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* HEADER GRADIENT avec effet décoratif */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Historique des Séances</h1>
                <p className="text-blue-200 mt-1">Consultez l'historique complet de vos séances et leur taux de présence</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* STATS GLOBALES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-6 border border-blue-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-blue-700 text-sm font-semibold uppercase">Total des Séances</p>
                  <p className="text-4xl font-bold text-blue-900 mt-1">{stats.totalSessions}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl shadow-lg p-6 border border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-emerald-700 text-sm font-semibold uppercase">Taux de Présence Moyen</p>
                  <p className="text-4xl font-bold text-emerald-900 mt-1">{stats.averageAttendance}%</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl shadow-lg p-6 border border-cyan-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-cyan-100 rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </div>
                <div>
                  <p className="text-cyan-700 text-sm font-semibold uppercase">Étudiants Suivis</p>
                  <p className="text-4xl font-bold text-cyan-900 mt-1">{stats.totalStudentsTracked}</p>
                </div>
              </div>
            </div>
          </div>

          {/* FILTRES ET TABLE */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Séances Terminées
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSortBy('recent')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'recent' 
                        ? 'bg-white text-blue-700 shadow-md' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Plus Récent
                  </button>
                  <button
                    onClick={() => setSortBy('attendance')}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      sortBy === 'attendance' 
                        ? 'bg-white text-blue-700 shadow-md' 
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    Taux Présence
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              {sortedSessions.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-lg font-medium">Aucune séance terminée</p>
                  <p className="text-slate-400 text-sm mt-1">Les séances terminées apparaîtront ici</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Date de Fin</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Durée</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Présences</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Taux</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sortedSessions.map((session, index) => (
                        <tr key={session.id} className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-slate-900">{session.module_name}</p>
                            <p className="text-xs text-slate-500 font-mono">Code: {session.code}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">
                            {new Date(session.ended_at).toLocaleDateString('fr-FR')}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                              {session.duration_minutes} min
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                {session.present_count}
                              </span>
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                {session.absent_count}
                              </span>
                              <span className="text-xs text-slate-400">/{session.total_students}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-20 bg-slate-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-blue-500"
                                  style={{ width: `${session.attendance_rate}%` }}
                                ></div>
                              </div>
                              <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
                                {session.attendance_rate}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleViewDetails(session.id)}
                              className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
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
