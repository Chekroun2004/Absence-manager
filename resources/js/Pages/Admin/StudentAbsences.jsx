import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function StudentAbsences({ student, absences, absenceCount, totalSessions }) {
  return (
    <AuthenticatedLayout>
      <Head title={`Absences - ${student.name}`} />

      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">{student.name}</h1>
          <p className="text-blue-100 mt-2">Détails des absences</p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* INFO ÉTUDIANT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Nom</p>
              <p className="text-2xl font-bold text-gray-900">{student.name}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Email</p>
              <p className="text-lg text-gray-900 break-all">{student.email}</p>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Mention Académique</p>
              <p className="text-lg font-semibold text-blue-700">{student.academic_mention}</p>
            </div>
          </div>

          {/* STATISTIQUES ABSENCES */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 shadow-md rounded-lg p-6 border-l-4 border-blue-600">
              <p className="text-sm text-gray-600 mb-1">Total Absences</p>
              <p className="text-4xl font-bold text-blue-700">{absenceCount}</p>
            </div>
            <div className="bg-blue-50 shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Total Séances</p>
              <p className="text-4xl font-bold text-blue-700">{totalSessions}</p>
            </div>
            <div className="bg-blue-50 shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-600 mb-1">Taux d'Absence</p>
              <p className="text-4xl font-bold text-blue-700">
                {totalSessions > 0 ? Math.round((absenceCount / totalSessions) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* ALERTE SI +3 ABSENCES */}
          {absenceCount >= 3 && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚨</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-red-800 mb-2">Alerte: Seuil d'absences dépassé</h2>
                  <p className="text-red-700">
                    Cet étudiant a dépassé le seuil critique de 3 absences avec un total de <span className="font-bold">{absenceCount} absences</span>. 
                    Une action administrative peut être nécessaire.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TABLEAU DES ABSENCES */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden border-l-4 border-blue-500">
            <div className="px-6 py-4 bg-blue-50 border-b-2 border-blue-500">
              <h3 className="text-lg font-bold text-blue-800">Historique des Absences ({absenceCount})</h3>
            </div>
            
            {absences.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-lg">Aucune absence enregistrée</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-blue-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase">Module</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase">Professeur</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase">Statut</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-blue-900 uppercase">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {absences.map((absence) => (
                      <tr key={absence.id} className="hover:bg-blue-50 transition">
                        <td className="px-6 py-4 font-semibold text-gray-900">{absence.module_name}</td>
                        <td className="px-6 py-4 text-gray-700">{absence.professor_name}</td>
                        <td className="px-6 py-4 text-gray-700">{absence.date || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            absence.status === 'absent' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {absence.status === 'absent' ? 'Absent' : 'En attente de justification'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{absence.notes || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* BOUTON RETOUR */}
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition"
            >
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

