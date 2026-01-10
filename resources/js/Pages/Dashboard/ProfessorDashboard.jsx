export default function ProfessorDashboard({ stats, modules, recentSessions }) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          👨🏫 Dashboard Professeur
        </h1>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Modules" value={stats.total_modules} color="blue" />
          <StatCard title="Étudiants" value={stats.total_students} color="green" />
          <StatCard title="Séances" value={stats.total_sessions} color="purple" />
          <StatCard
            title="Justifications"
            value={stats.pending_justifications}
            color="orange"
          />
        </div>

        {/* SÉANCES RÉCENTES */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Séances récentes
          </h2>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded hover:bg-gray-50"
              >
                <div>
                  <p className="font-semibold text-gray-900">
                    {session.module_name}
                  </p>
                  <p className="text-sm text-gray-500">{session.started_at}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  session.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {session.status === 'active' ? '🔴 En cours' : '✅ Terminée'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-500 text-blue-600',
    green: 'bg-green-50 border-green-500 text-green-600',
    purple: 'bg-purple-50 border-purple-500 text-purple-600',
    orange: 'bg-orange-50 border-orange-500 text-orange-600',
  };

  return (
    <div className={`${colors[color]} overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}