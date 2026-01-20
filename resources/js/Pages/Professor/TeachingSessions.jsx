import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';

export default function TeachingSessions({ modules }) {
  const page = usePage();
  const flash = page.props.flash || {};
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeSessions, setActiveSessions] = useState({});
  const [timers, setTimers] = useState({});

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
          // Séance créée
        },
      }
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Mes Séances d'Enseignement" />

      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Mes modules</h1>
            <p className="text-blue-100 mt-2">Gérez vos séances d'enseignement</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* MESSAGE DE SUCCÈS */}
          {flash.success && (
            <div className="mb-8 bg-white border-l-4 border-green-600 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <p className="font-semibold text-green-900 mb-3">Séance lancée avec succès</p>
                <div className="bg-green-50 p-4 rounded border border-green-200 mb-4">
                  <p className="text-sm text-green-700 mb-2">Code PIN</p>
                  <p className="text-4xl font-bold font-mono text-green-900">{flash.success.code}</p>
                  <p className="text-xs text-green-600 mt-2">Valide pendant 20 secondes</p>
                </div>
              </div>
            </div>
          )}

          {/* BOUTON HISTORIQUE */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => router.visit(route('professor.sessions.history'))}
              style={{ backgroundColor: '#1e40af' }}
              className="text-white px-6 py-2 rounded font-medium hover:opacity-90 transition"
            >
              Voir l'historique
            </button>
          </div>

          {/* GRILLE MODULES */}
          {modules.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <p className="text-gray-600">Aucun module assigné</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition"
                >
                  {/* Header du module */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-gray-200 px-6 py-4">
                    <h2 className="text-lg font-semibold text-gray-900">{module.name}</h2>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <span className="text-sm font-medium">Classe :</span>
                        <span className="ml-2 text-sm text-gray-600">{module.class}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="text-sm font-medium">Étudiants :</span>
                        <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {module.student_count}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedModule(module)}
                        style={{ backgroundColor: '#0369a1' }}
                        className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90 transition text-sm"
                      >
                        Voir étudiants
                      </button>
                      <button
                        onClick={() => handleStartSession(module.id)}
                        style={{ backgroundColor: '#059669' }}
                        className="flex-1 text-white px-4 py-2 rounded font-medium hover:opacity-90 transition text-sm"
                      >
                        Lancer séance
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL ÉTUDIANTS */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-4 sticky top-0">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Étudiants - {selectedModule.name}</h2>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="text-blue-100 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6">
              {selectedModule.students && selectedModule.students.length > 0 ? (
                <div className="space-y-2">
                  {selectedModule.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 transition"
                    >
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 flex-shrink-0">
                        <span className="text-blue-700 font-semibold text-sm">
                          {student.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm">{student.user.name}</p>
                        <p className="text-xs text-gray-600">{student.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">Aucun étudiant assigné</p>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <button
                onClick={() => setSelectedModule(null)}
                className="w-full bg-gray-200 text-gray-900 py-2 rounded font-medium hover:bg-gray-300 transition"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthenticatedLayout>
  );
}