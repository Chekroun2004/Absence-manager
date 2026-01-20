import { router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProfessorDashboard({ stats, modules, activeSessions, recentSessions }) {
  const [closingSessionId, setClosingSessionId] = useState(null);

  const handleCloseSession = (sessionId) => {
    if (confirm('Confirmez la fermeture de cette séance ?')) {
      setClosingSessionId(sessionId);
      router.post(route('professor.sessions.close', sessionId), {}, {
        onSuccess: () => {
          setClosingSessionId(null);
          window.location.reload();
        },
        onError: (error) => {
          setClosingSessionId(null);
          alert('Erreur lors de la fermeture de la séance');
        },
      });
    }
  };

  const handleResumeSession = (sessionId) => {
    router.post(route('professor.sessions.resume', sessionId), {}, {
      onSuccess: () => {
        // Redirection automatique
      },
      onError: () => {
        alert('Erreur lors de la réactivation du code');
      },
    });
  };

  const handleGoToSession = (sessionId) => {
    router.visit(route('professor.sessions.active', sessionId));
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* HEADER GRADIENT */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Tableau de bord</h1>
          <p className="text-blue-100 mt-2">Bienvenue dans votre espace professeur</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
        {/* CARTES STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Modules" 
            value={stats.total_modules} 
            icon="📚"
            bgColor="bg-blue-50"
            borderColor="border-blue-200"
            textColor="text-blue-900"
            accentColor="bg-blue-100"
          />
          <StatCard 
            title="Étudiants" 
            value={stats.total_students} 
            icon="👥"
            bgColor="bg-emerald-50"
            borderColor="border-emerald-200"
            textColor="text-emerald-900"
            accentColor="bg-emerald-100"
          />
          <StatCard 
            title="Séances" 
            value={stats.total_sessions} 
            icon="📊"
            bgColor="bg-cyan-50"
            borderColor="border-cyan-200"
            textColor="text-cyan-900"
            accentColor="bg-cyan-100"
          />
          <StatCard 
            title="En attente" 
            value={stats.pending_justifications} 
            icon="⏳"
            bgColor="bg-amber-50"
            borderColor="border-amber-200"
            textColor="text-amber-900"
            accentColor="bg-amber-100"
          />
        </div>

        {/* SESSIONS ACTIVES - ALERTE */}
        {activeSessions && activeSessions.length > 0 && (
          <div className="mb-12">
            <div className="bg-white rounded-lg shadow-md border border-red-200 overflow-hidden">
              {/* Header de l'alerte */}
              <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4">
                <h2 className="text-xl font-semibold text-white">Sessions actives</h2>
                <p className="text-red-100 text-sm mt-1">{activeSessions.length} séance(s) en cours</p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div
                      key={session.id}
                      className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-lg p-5 hover:shadow-md transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{session.module_name}</h3>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              Code PIN: <span className="font-mono font-bold text-red-700 text-base">{session.code}</span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Démarrée: {session.started_at}
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700">
                          Actif
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 pt-4 border-t border-red-100">
                        <button
                          onClick={() => handleGoToSession(session.id)}
                          style={{ backgroundColor: '#1e40af' }}
                          className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
                        >
                          Consulter
                        </button>
                        <button
                          onClick={() => handleResumeSession(session.id)}
                          style={{ backgroundColor: '#059669' }}
                          className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90 transition"
                        >
                          Nouveau code
                        </button>
                        <button
                          onClick={() => handleCloseSession(session.id)}
                          disabled={closingSessionId === session.id}
                          style={{ backgroundColor: '#dc2626' }}
                          className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {closingSessionId === session.id ? 'Fermeture...' : 'Fermer'}
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
        <div className="bg-white rounded-lg shadow-md border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Séances récentes</h2>
          </div>

          {/* Contenu */}
          <div className="p-6">
            {recentSessions && recentSessions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Module</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date & Heure</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Statut</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentSessions.map((session) => (
                      <tr key={session.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-900">{session.module_name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-600">{session.started_at}</p>
                        </td>
                        <td className="py-4 px-4">
                          {session.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              En cours
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Terminée
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {session.status === 'closed' && (
                            <button
                              onClick={() => router.visit(route('professor.sessions.details', session.id))}
                              className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                            >
                              Détails
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Aucune séance récente</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bgColor, borderColor, textColor, accentColor }) {
  return (
    <div className={`${bgColor} border ${borderColor} rounded-lg overflow-hidden shadow-md hover:shadow-lg transition`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-medium ${textColor.replace('900', '700')}`}>{title}</p>
            <p className={`text-3xl font-bold mt-2 ${textColor}`}>{value}</p>
          </div>
          <div className={`${accentColor} w-14 h-14 rounded-lg flex items-center justify-center text-2xl`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
}