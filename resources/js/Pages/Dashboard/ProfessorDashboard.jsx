import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProfessorDashboard({ stats, modules, activeSessions, recentSessions }) {
  const [closingSessionId, setClosingSessionId] = useState(null);

  const handleCloseSession = (sessionId) => {
    if (confirm('Êtes-vous sûr de vouloir fermer cette séance ?')) {
      setClosingSessionId(sessionId);
      router.post(route('professor.sessions.close', sessionId), {}, {
        onSuccess: () => {
          setClosingSessionId(null);
          window.location.reload(); // Rafraîchir pour voir la séance disparaître
        },
        onError: (error) => {
          setClosingSessionId(null);
          alert('❌ Erreur lors de la fermeture de la séance');
        },
      });
    }
  };

  const handleResumeSession = (sessionId) => {
    router.post(route('professor.sessions.resume', sessionId), {}, {
      onSuccess: () => {
        // Redirection automatique vers la séance active
      },
      onError: () => {
        alert('❌ Erreur lors de la réactivation de la séance');
      },
    });
  };

  const handleGoToSession = (sessionId) => {
    router.visit(route('professor.sessions.active', sessionId));
  };

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

        {/* ⚠️ ALERTE SÉANCES OUBLIÉES */}
        {activeSessions && activeSessions.length > 0 && (
          <div className="bg-yellow-50 overflow-hidden shadow-sm sm:rounded-lg p-6 mb-8 border-l-4 border-yellow-500">
            <div className="flex items-start gap-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-yellow-900 mb-4">
                  Séances en cours détectées!
                </h2>
                <p className="text-sm text-yellow-800 mb-4">
                  Vous avez {activeSessions.length} séance(s) encore active(s). Cliquez ci-dessous pour les terminer ou les reprendre.
                </p>
                
                <div className="space-y-3">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="p-4 bg-white border-2 border-yellow-200 rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">
                            📚 {session.module_name}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Code PIN: <span className="font-mono font-bold text-yellow-600 text-base">{session.code}</span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            🕐 Démarrée le {session.started_at}
                          </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          🔴 Actif
                        </span>
                      </div>

                      {/* ACTIONS */}
                      <div className="flex gap-2 pt-3 border-t border-yellow-100">
                        <button
                          onClick={() => handleGoToSession(session.id)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition font-medium text-sm"
                        >
                          👁️ Voir la Séance
                        </button>
                        <button
                          onClick={() => handleResumeSession(session.id)}
                          className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition font-medium text-sm"
                        >
                          🔄 Réactiver Code
                        </button>
                        <button
                          onClick={() => handleCloseSession(session.id)}
                          disabled={closingSessionId === session.id}
                          className="flex-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {closingSessionId === session.id ? '⏳ Arrêt...' : '⏹️ Terminer'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SÉANCES RÉCENTES */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            📋 Séances récentes
          </h2>
          {recentSessions && recentSessions.length > 0 ? (
            <div className="space-y-3">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex justify-between items-center p-4 border border-gray-200 rounded hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {session.module_name}
                    </p>
                    <p className="text-sm text-gray-500">{session.started_at}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      session.status === 'active'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {session.status === 'active' ? '🔴 En cours' : '✅ Terminée'}
                    </span>
                    {session.status === 'closed' && (
                      <button
                        onClick={() => router.visit(route('professor.sessions.details', session.id))}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Détails →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Aucune séance récente</p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };

  return (
    <div className={`${colorClasses[color]} border rounded-lg p-6`}>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}