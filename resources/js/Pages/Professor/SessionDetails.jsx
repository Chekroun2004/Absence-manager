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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* HEADER DE LA SÉANCE */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-8 text-white">
            <button
              onClick={() => router.visit(route('professor.sessions.history'))}
              className="mb-4 text-blue-100 hover:text-white transition"
            >
              ← Retour à l'historique
            </button>
            <h1 className="text-3xl font-bold mb-2">{session.module_name}</h1>
            <p className="text-blue-100 mb-4">Code: <span className="font-mono font-bold text-lg">{session.code}</span></p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-blue-500 bg-opacity-50 rounded p-4">
                <p className="text-blue-100 text-sm">Début</p>
                <p className="font-semibold">{session.started_at}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-50 rounded p-4">
                <p className="text-blue-100 text-sm">Fin</p>
                <p className="font-semibold">{session.ended_at}</p>
              </div>
              <div className="bg-blue-500 bg-opacity-50 rounded p-4">
                <p className="text-blue-100 text-sm">Durée</p>
                <p className="font-semibold">{session.duration_minutes} min</p>
              </div>
              <div className="bg-blue-500 bg-opacity-50 rounded p-4">
                <p className="text-blue-100 text-sm">Total Étudiants</p>
                <p className="font-semibold">{session.total_students}</p>
              </div>
            </div>
          </div>

          {/* STATISTIQUES RÉSUMÉES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">✅ Présents</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{session.present_count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {session.total_students > 0 ? ((session.present_count / session.total_students * 100).toFixed(1)) : 0}% du total
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">❌ Absents</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{session.absent_count}</p>
              <p className="text-xs text-gray-500 mt-1">
                {session.total_students > 0 ? ((session.absent_count / session.total_students * 100).toFixed(1)) : 0}% du total
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <p className="text-gray-600 text-sm font-medium">📊 Taux de Présence</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">
                {session.total_students > 0 ? ((session.present_count / session.total_students * 100).toFixed(1)) : 0}%
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${session.total_students > 0 ? (session.present_count / session.total_students * 100) : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* LISTE DES ÉTUDIANTS */}
          <div className="bg-white shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">👥 Liste des Étudiants</h2>

              {/* FILTRES ET RECHERCHE */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="🔍 Rechercher par nom ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">Tous</option>
                  <option value="present">✅ Présents</option>
                  <option value="absent">❌ Absents</option>
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
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Nom
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-700">
                          Heure du Marquage
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
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
                              {student.status === 'present' ? '✅ Présent' : '❌ Absent'}
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
                  📊 Affichage: <span className="font-semibold">{filteredStudents.length}</span> sur <span className="font-semibold">{initialStudents.length}</span> étudiants
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
