export default function AdminDashboard({ stats }) {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🎛️ Dashboard Admin
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Utilisateurs" value={stats.total_users} color="blue" />
          <StatCard title="Étudiants" value={stats.total_students} color="green" />
          <StatCard title="Professeurs" value={stats.total_professors} color="purple" />
          <StatCard title="Modules" value={stats.total_modules} color="orange" />
          <StatCard
            title="En attente"
            value={stats.pending_approvals}
            color="red"
          />
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
    red: 'bg-red-50 border-red-500 text-red-600',
  };

  return (
    <div className={`${colors[color]} overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4`}>
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
    </div>
  );
}