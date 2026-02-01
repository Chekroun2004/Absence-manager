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

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* HEADER GRADIENT avec effet décoratif */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Mes modules</h1>
                <p className="text-blue-200 mt-1">Gérez vos séances d'enseignement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* MESSAGE DE SUCCÈS */}
          {flash.success && (
            <div className="mb-8 bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-200">
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
                <p className="font-semibold text-white text-lg flex items-center gap-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Séance lancée avec succès
                </p>
              </div>
              <div className="p-6">
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 text-center">
                  <p className="text-sm text-emerald-700 mb-2 font-medium">Code PIN</p>
                  <p className="text-5xl font-bold font-mono text-emerald-900 tracking-wider">{flash.success.code}</p>
                  <p className="text-sm text-emerald-600 mt-3 flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Valide pendant 20 secondes
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* BOUTON HISTORIQUE */}
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => router.visit(route('professor.sessions.history'))}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Voir l'historique
            </button>
          </div>

          {/* GRILLE MODULES */}
          {modules.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center border border-slate-100">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-slate-600 text-lg font-medium">Aucun module assigné</p>
              <p className="text-slate-400 text-sm mt-2">Contactez l'administration pour vous assigner des modules</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Header du module */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                    <h2 className="text-lg font-bold text-white">{module.name}</h2>
                  </div>

                  {/* Contenu */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center text-slate-700">
                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Classe</p>
                          <p className="font-semibold text-slate-900">{module.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center text-slate-700">
                        <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center mr-3">
                          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase font-medium">Étudiants</p>
                          <p className="font-semibold text-slate-900">{module.student_count}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setSelectedModule(module)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Étudiants
                      </button>
                      <button
                        onClick={() => handleStartSession(module.id)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white px-4 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-sm flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Lancer
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5 sticky top-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Étudiants</h2>
                    <p className="text-blue-200 text-sm">{selectedModule.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-white transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 max-h-[50vh] overflow-y-auto">
              {selectedModule.students && selectedModule.students.length > 0 ? (
                <div className="space-y-3">
                  {selectedModule.students.map((student) => (
                    <div
                      key={student.id}
                      className="flex items-center p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border border-slate-200 hover:shadow-md transition-all duration-200"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center mr-4 shadow-md">
                        <span className="text-white font-bold text-lg">
                          {student.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-900">{student.user.name}</p>
                        <p className="text-sm text-slate-500">{student.user.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-medium">Aucun étudiant assigné</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedModule(null)}
                className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-semibold transition-all duration-200"
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