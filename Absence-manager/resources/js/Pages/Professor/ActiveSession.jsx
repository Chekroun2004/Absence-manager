import React, { useState, useEffect, useMemo } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function ActiveSession({ session, students: initialStudents }) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [copied, setCopied] = useState(false);
  const [students, setStudents] = useState(initialStudents);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isResuming, setIsResuming] = useState(false);

  // CALCUL DU TEMPS DEPUIS expires_at
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiresAt = new Date(session.expires_at).getTime();
      const remaining = Math.max(0, Math.ceil((expiresAt - now) / 1000));
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        setSessionExpired(true);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [session.expires_at]);

  // POLLING : Rafraîchir les présences toutes les 2 secondes
  useEffect(() => {
    if (sessionExpired) {
      console.log('POLLING ARRÊTÉ - Temps écoulé');
      return;
    }

    const interval = setInterval(async () => {
      try {
        console.log(`[${new Date().toLocaleTimeString()}] Polling...`);
        
        const response = await fetch(
          `/professor/sessions/${session.id}/attendances`
        );
        
        if (!response.ok) {
          console.error(`ERREUR HTTP ${response.status}`);
          return;
        }
        
        const data = await response.json();
        
        setStudents((prevStudents) => {
          const updated = prevStudents.map((student) => {
            const attendance = data.attendances.find(
              (a) => a.student_id === student.id
            );
            
            if (attendance && attendance.status === 'present' && !student.is_present) {
              console.log(`${student.name} est maintenant PRÉSENT`);
              return {
                ...student,
                is_present: true,
                marked_at: attendance.marked_at,
              };
            }
            return student;
          });
          
          return updated;
        });
        
      } catch (error) {
        console.error('ERREUR FETCH:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session.id, sessionExpired]);

  const copyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // FONCTION POUR ARRÊTER LA SÉANCE
  const handleCloseSession = () => {
    if (confirm('Êtes-vous sûr de vouloir arrêter la séance ?')) {
      setIsClosing(true);
      router.post(route('professor.sessions.close', session.id), {}, {
        onSuccess: () => {
          router.visit(route('professor.sessions.stats', session.id));
        },
        onError: (error) => {
          console.error('Erreur:', error);
          setIsClosing(false);
        }
      });
    }
  };

  // FONCTION POUR RÉACTIVER LE CODE
  const handleResumeSession = () => {
    if (confirm('Êtes-vous sûr de vouloir générer un nouveau code PIN ?')) {
      setIsResuming(true);
      router.post(route('professor.sessions.resume', session.id), {}, {
        onSuccess: () => {
          setIsResuming(false);
          window.location.reload(); // Rafraîchir pour voir le nouveau code
        },
        onError: (error) => {
          console.error('Erreur:', error);
          setIsResuming(false);
          alert('Erreur lors de la réactivation du code');
        }
      });
    }
  };

  const presentCount = useMemo(
    () => students.filter((s) => s.is_present).length,
    [students]
  );
  const totalCount = students.length;

  return (
    <AuthenticatedLayout>
      <Head title={`Séance Active - ${session.module_name}`} />

      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* HEADER avec effet décoratif */}
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
          {/* Cercles décoratifs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">{session.module_name}</h1>
                <p className="text-blue-200 mt-1">Séance en cours</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* CODE PIN - SECTION PRINCIPALE */}
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 mb-8 overflow-hidden">
            <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 p-16 text-center relative overflow-hidden">
              {/* Cercles décoratifs dans le code section */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              
              <p className="text-lg font-bold text-blue-200 uppercase mb-8 tracking-wide relative">Code PIN à communiquer</p>
              
              {/* SESSION ID */}
              <div className="mb-6 p-4 bg-blue-800/50 backdrop-blur-sm rounded-2xl inline-block relative">
                <p className="text-sm text-blue-300 font-medium">Session ID</p>
                <p className="text-3xl font-bold text-white">{session.id}</p>
              </div>
              
              {/* CODE CARD */}
              <div className="bg-white rounded-3xl p-12 mb-8 shadow-2xl border-4 border-blue-100 relative">
                <p className="text-slate-500 text-sm font-semibold mb-4 uppercase">Code PIN</p>
                <p className="text-8xl md:text-9xl font-black font-mono tracking-widest text-blue-900 leading-none">
                  {timeLeft <= 0 ? (
                    <svg className="w-24 h-24 md:w-32 md:h-32 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : session.code}
                </p>
              </div>

              {/* TIMER */}
              <div className="flex items-center justify-center gap-4 relative">
                <div className={`text-center p-6 rounded-2xl ${timeLeft <= 0 ? 'bg-red-500/20' : 'bg-emerald-500/20'} backdrop-blur-sm`}>
                  <p className={`text-7xl font-black font-mono ${timeLeft <= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {timeLeft}
                  </p>
                  <p className={`text-sm font-semibold uppercase mt-2 ${timeLeft <= 0 ? 'text-red-300' : 'text-emerald-300'}`}>
                    secondes
                  </p>
                </div>
              </div>

              {/* COPY BUTTON */}
              <button
                onClick={copyCode}
                disabled={timeLeft <= 0}
                className={`mt-8 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg relative flex items-center gap-2 mx-auto ${
                  timeLeft <= 0 
                    ? 'bg-slate-500 cursor-not-allowed text-slate-300' 
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copié au presse-papiers
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copier le code
                  </>
                )}
              </button>
            </div>

            {/* ALERTE SESSION OUBLIÉE */}
            {session.is_forgotten && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-5 flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-sm text-amber-900 font-medium">
                  Cette séance a été lancée il y a plus de 20 minutes
                </p>
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-100">Présents</p>
                  <p className="text-4xl font-bold mt-2">{presentCount}</p>
                  <p className="text-xs text-emerald-200 mt-2">sur {totalCount}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100">Taux de présence</p>
                  <p className="text-4xl font-bold mt-2">{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl shadow-xl p-6 text-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Statut Polling</p>
                  <p className="text-xl font-bold mt-2">
                    {timeLeft > 0 ? 'Actif (2s)' : 'Arrêté'}
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  {timeLeft > 0 ? (
                    <svg className="w-7 h-7 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* LISTE ÉTUDIANTS */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                Étudiants
                <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm font-medium">{presentCount}/{totalCount}</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">Aucun étudiant</p>
                  </div>
                ) : (
                  students.map((student) => (
                    <div
                      key={`student-${student.id}`}
                      className={`p-4 rounded-xl border-l-4 flex justify-between items-center transition-all duration-300 hover:shadow-md ${
                        student.is_present
                          ? 'bg-emerald-50 border-emerald-500'
                          : 'bg-slate-50 border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold ${
                          student.is_present 
                            ? 'bg-emerald-200 text-emerald-700' 
                            : 'bg-slate-200 text-slate-600'
                        }`}>
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{student.name}</p>
                          <p className="text-sm text-slate-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {student.is_present ? (
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Présent
                            </span>
                            {student.marked_at && (
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                                {new Date(student.marked_at).toLocaleTimeString('fr-FR')}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-200 text-slate-600 rounded-full text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            En attente
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={handleResumeSession}
              disabled={isResuming}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResuming ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réactivation...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Nouveau code
                </>
              )}
            </button>
            <button
              onClick={handleCloseSession}
              disabled={isClosing}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isClosing ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Fermeture...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Fermer
                </>
              )}
            </button>
            <button
              onClick={() => router.visit(route('professor.sessions'))}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}