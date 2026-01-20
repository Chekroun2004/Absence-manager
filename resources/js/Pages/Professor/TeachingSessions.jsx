import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';

export default function TeachingSessions({ modules }) {
  const page = usePage();
  const flash = page.props.flash || {};
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSessions, setActiveSessions] = useState({});
  const [timers, setTimers] = useState({});

  // Gestion du timer pour chaque séance
  useEffect(() => {
    const intervals = {};

    Object.entries(activeSessions).forEach(([sessionId, session]) => {
      intervals[sessionId] = setInterval(() => {
        const now = new Date();
        const expiresAt = new Date(session.expires_at);
        const remainingSeconds = Math.max(
          0,
          Math.floor((expiresAt - now) / 1000)
        );

        setTimers((prev) => ({
          ...prev,
          [sessionId]: remainingSeconds,
        }));

        if (remainingSeconds === 0) {
          setActiveSessions((prev) => {
            const newState = { ...prev };
            delete newState[sessionId];
            return newState;
          });
        }
      }, 1000);
    });

    return () => {
      Object.values(intervals).forEach(clearInterval);
    };
  }, [activeSessions]);

  const handleStartSession = (moduleId) => {
    router.post(
      route('professor.sessions.start', moduleId),
      {},
      {
        onSuccess: () => {
          // La séance est créée
        },
      }
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Mes Séances d'Enseignement" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* MESSAGE DE SUCCÈS */}
          {flash.success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p className="font-bold">✅ {flash.success.message}</p>
              <p className="text-lg font-mono mt-2">
                Code PIN : <span className="text-2xl font-bold text-red-600">
                  {flash.success.code}
                </span>
              </p>
              <p className="text-sm mt-2">
                ⏱️ Valide pendant 20 secondes
              </p>
            </div>
          )}

          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">📚 Mes Modules</h1>
                <button
                  onClick={() => router.visit(route('professor.sessions.history'))}
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition text-sm"
                >
                  📋 Voir Historique
                </button>
              </div>

              {modules.length === 0 ? (
                <p className="text-gray-500">
                  Vous n'avez pas de modules assignés.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {modules.map((module) => (
                    <div
                      key={module.id}
                      className="border rounded-lg p-4 hover:shadow-lg transition"
                    >
                      <h2 className="text-lg font-semibold mb-2">
                        {module.name}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        📋 Classe : {module.class}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        👥 Étudiants : {module.student_count}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedModule(module)}
                          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm"
                        >
                          👥 Voir Étudiants
                        </button>
                        <button
                          onClick={() => handleStartSession(module.id)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm"
                        >
                          🚀 Lancer Séance
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ÉTUDIANTS */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Étudiants de {selectedModule.name}
              </h2>
              <button
                onClick={() => setSelectedModule(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {selectedModule.students &&
              selectedModule.students.length > 0 ? (
                <ul className="space-y-2">
                  {selectedModule.students.map((student) => (
                    <li
                      key={student.id}
                      className="p-2 bg-gray-100 rounded flex items-center"
                    >
                      <span className="text-lg mr-2">👨🎓</span>
                      <div>
                        <p className="font-semibold text-sm">
                          {student.user.name}
                        </p>
                        <p className="text-xs text-gray-600">
                          {student.user.email}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  Aucun étudiant assigné à ce module.
                </p>
              )}
            </div>

            <button
              onClick={() => setSelectedModule(null)}
              className="w-full mt-4 bg-gray-600 text-white py-2 rounded hover:bg-gray-700"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}