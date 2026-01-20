import React, { useState, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function SessionDetails({ session, students: initialStudents }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredStudents = useMemo(() => {
    return initialStudents.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           student.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || student.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [searchTerm, filterStatus]);

  const presentStudents = initialStudents.filter(s => s.status === 'present');
  const absentStudents = initialStudents.filter(s => s.status === 'absent');

  return (
    <AuthenticatedLayout>
      <Head title={`Détails - ${session.module_name}`} />

      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => router.visit(route('professor.sessions.history'))}
              className="text-blue-100 hover:text-white transition mb-4 text-sm font-medium"
            >
              ← Retour à l'historique
            </button>
            <h1 className="text-4xl font-bold text-white mb-2">{session.module_name}</h1>
            <p className="text-blue-100">Code: <span className="font-mono font-bold text-lg text-white">{session.code}</span></p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-8">
          {/* INFO SÉANCE */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: '#1e40af' }}>
              <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Début</p>
              <p className="font-semibold text-gray-900">{new Date(session.started_at).toLocaleDateString('fr-FR')} {new Date(session.started_at).toLocaleTimeString('fr-FR')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: '#059669' }}>
              <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Fin</p>
              <p className="font-semibold text-gray-900">{new Date(session.ended_at).toLocaleDateString('fr-FR')} {new Date(session.ended_at).toLocaleTimeString('fr-FR')}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: '#d97706' }}>
              <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Durée</p>
              <p className="font-semibold text-gray-900">{session.duration_minutes} min</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 border-l-4" style={{ borderColor: '#0891b2' }}>
              <p className="text-gray-600 text-xs font-semibold uppercase mb-2">Total Étudiants</p>
              <p className="font-semibold text-gray-900">{session.total_students}</p>
            </div>
          </div>

          {/* STATISTIQUES RÉSUMÉES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#059669' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Présents</p>
              <p className="text-3xl font-bold" style={{ color: '#059669' }}>{session.present_count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {session.total_students > 0 ? ((session.present_count / session.total_students * 100).toFixed(1)) : 0}% du total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#dc2626' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Absents</p>
              <p className="text-3xl font-bold" style={{ color: '#dc2626' }}>{session.absent_count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {session.total_students > 0 ? ((session.absent_count / session.total_students * 100).toFixed(1)) : 0}% du total
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: '#1e40af' }}>
              <p className="text-gray-600 text-sm font-semibold uppercase mb-2">Taux de Présence</p>
              <p className="text-3xl font-bold" style={{ color: '#1e40af' }}>
                {session.total_students > 0 ? ((session.present_count / session.total_students * 100).toFixed(1)) : 0}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${session.total_students > 0 ? (session.present_count / session.total_students * 100) : 0}%`,
                    backgroundColor: '#1e40af'
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* LISTE DES ÉTUDIANTS */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Liste des Étudiants</h2>
            </div>

            <div className="p-6">
              {/* FILTRES ET RECHERCHE */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">Tous</option>
                  <option value="present">Présents</option>
                  <option value="absent">Absents</option>
                </select>
              </div>

              {/* TABLEAU */}
              {filteredStudents.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Aucun étudiant ne correspond à votre recherche.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gradient-to-r from-gray-800 to-gray-700">
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Nom</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Email</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Statut</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Heure du Marquage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {student.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              student.status === 'present'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {student.status === 'present' ? 'Présent' : 'Absent'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {student.marked_at ? new Date(student.marked_at).toLocaleTimeString('fr-FR') : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* RÉSUMÉ FINAL */}
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600">
                  Affichage: <span className="font-semibold">{filteredStudents.length}</span> sur <span className="font-semibold">{initialStudents.length}</span> étudiants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
