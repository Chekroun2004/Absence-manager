import { Link } from '@inertiajs/react';

export default function AdminDashboard({ stats, studentsWithHighAbsence }) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* HEADER GRADIENT */}
        <div className="mb-8 rounded-lg bg-gradient-to-r from-red-900 to-red-700 shadow-lg px-6 py-8">
          <h1 className="text-4xl font-bold text-white">Dashboard Admin</h1>
          <p className="text-red-100 mt-2">Aperçu global du système de gestion</p>
        </div>

        {/* ALERTE ABSENCES */}
        {studentsWithHighAbsence && studentsWithHighAbsence.length > 0 && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-lg shadow-md">
            <div className="flex items-start gap-4">
              <div className="text-4xl">⚠️</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-800 mb-3">Étudiants avec +3 absences</h2>
                <div className="space-y-2">
                  {studentsWithHighAbsence.map((student) => (
                    <Link
                      key={student.id}
                      href={`/admin/students/${student.id}/absences`}
                      className="block bg-white p-4 rounded-lg border-l-4 border-red-400 hover:bg-red-50 hover:shadow-md transition transform hover:scale-105"
                    >
                      <div className="font-semibold text-red-600">{student.name}</div>
                      <div className="text-sm text-gray-600">{student.email}</div>
                      <div className="text-sm font-bold text-red-700 mt-1">{student.absence_count} absences</div>
                    </Link>
                  ))}
                </div>
                <p className="text-sm text-red-700 mt-4">Les étudiants listés ont dépassé le seuil de 3 absences. Veuillez prendre les mesures appropriées.</p>
              </div>
            </div>
          </div>
        )}

        {/* STAT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <StatCard title="Utilisateurs" value={stats.total_users} color="red" />
          <StatCard title="Étudiants" value={stats.total_students} color="orange" />
          <StatCard title="Professeurs" value={stats.total_professors} color="rose" />
          <StatCard title="Modules" value={stats.total_modules} color="crimson" />
          <StatCard
            title="En attente"
            value={stats.pending_approvals}
            color="scarlet"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      hover: 'hover:shadow-lg hover:bg-red-100'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-500',
      text: 'text-orange-700',
      hover: 'hover:shadow-lg hover:bg-orange-100'
    },
    rose: {
      bg: 'bg-rose-50',
      border: 'border-rose-500',
      text: 'text-rose-700',
      hover: 'hover:shadow-lg hover:bg-rose-100'
    },
    crimson: {
      bg: 'bg-red-50',
      border: 'border-red-600',
      text: 'text-red-800',
      hover: 'hover:shadow-lg hover:bg-red-100'
    },
    scarlet: {
      bg: 'bg-red-100',
      border: 'border-red-600',
      text: 'text-red-800',
      hover: 'hover:shadow-lg hover:bg-red-200'
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