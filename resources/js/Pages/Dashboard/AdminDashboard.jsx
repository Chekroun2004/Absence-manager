import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats, studentsWithHighAbsence }) {
  return (
    <>
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Dashboard Admin</h1>
          <p className="text-blue-100 mt-2">Aperçu global du système de gestion</p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* ALERTE ABSENCES */}
          {studentsWithHighAbsence && studentsWithHighAbsence.length > 0 && (
            <div className="mb-8 bg-amber-50 border-l-4 border-amber-500 p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-amber-800 mb-3">Étudiants avec +3 absences</h2>
                  <div className="space-y-2">
                    {studentsWithHighAbsence.map((student) => (
                      <Link
                        key={student.id}
                        href={`/admin/students/${student.id}/absences`}
                        className="block bg-white p-4 rounded-lg border-l-4 border-amber-400 hover:bg-amber-50 hover:shadow-md transition transform hover:scale-105"
                      >
                        <div className="font-semibold text-amber-700">{student.name}</div>
                        <div className="text-sm text-gray-600">{student.email}</div>
                        <div className="text-sm font-bold text-amber-700 mt-1">{student.absence_count} absences</div>
                      </Link>
                    ))}
                  </div>
                  <p className="text-sm text-amber-700 mt-4">Les étudiants listés ont dépassé le seuil de 3 absences. Veuillez prendre les mesures appropriées.</p>
                </div>
              </div>
            </div>
          )}

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard title="Utilisateurs" value={stats.total_users} color="blue" />
            <StatCard title="Étudiants" value={stats.total_students} color="sky" />
            <StatCard title="Professeurs" value={stats.total_professors} color="cyan" />
            <StatCard title="Modules" value={stats.total_modules} color="indigo" />
            <StatCard
              title="En attente"
              value={stats.pending_approvals}
              color="amber"
            />
          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      hover: 'hover:shadow-lg hover:bg-blue-100'
    },
    sky: {
      bg: 'bg-sky-50',
      border: 'border-sky-500',
      text: 'text-sky-700',
      hover: 'hover:shadow-lg hover:bg-sky-100'
    },
    cyan: {
      bg: 'bg-cyan-50',
      border: 'border-cyan-500',
      text: 'text-cyan-700',
      hover: 'hover:shadow-lg hover:bg-cyan-100'
    },
    indigo: {
      bg: 'bg-blue-50',
      border: 'border-blue-500',
      text: 'text-blue-700',
      hover: 'hover:shadow-lg hover:bg-blue-100'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-500',
      text: 'text-amber-700',
      hover: 'hover:shadow-lg hover:bg-amber-100'
    },
  };

  const colorClass = colors[color];

  return (
    <div className={`${colorClass.bg} ${colorClass.hover} overflow-hidden shadow-md sm:rounded-lg p-6 border-l-4 ${colorClass.border} transition transform hover:scale-105`}>
      <div className={`text-sm font-semibold ${colorClass.text}`}>{title}</div>
      <div className={`text-4xl font-bold mt-3 ${colorClass.text}`}>{value}</div>
    </div>
  );
}