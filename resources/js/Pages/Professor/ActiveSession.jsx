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

  // ✅ CALCUL DU TEMPS DEPUIS expires_at
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

  // ✅ POLLING : Rafraîchir les présences toutes les 2 secondes
  useEffect(() => {
    if (sessionExpired) {
      console.log('⏸️ POLLING ARRÊTÉ - Temps écoulé');
      return;
    }

    const interval = setInterval(async () => {
      try {
        console.log(`🔄 [${new Date().toLocaleTimeString()}] Polling...`);
        
        const response = await fetch(
          `/professor/sessions/${session.id}/attendances`
        );
        
        if (!response.ok) {
          console.error(`❌ ERREUR HTTP ${response.status}`);
          return;
        }
        
        const data = await response.json();
        
        setStudents((prevStudents) => {
          const updated = prevStudents.map((student) => {
            const attendance = data.attendances.find(
              (a) => a.student_id === student.id
            );
            
            if (attendance && attendance.status === 'present' && !student.is_present) {
              console.log(`✅ ${student.name} est maintenant PRÉSENT`);
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
        console.error('❌ ERREUR FETCH:', error);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [session.id, sessionExpired]);

  const copyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ FONCTION POUR ARRÊTER LA SÉANCE
  const handleCloseSession = () => {
    if (confirm('Êtes-vous sûr de vouloir arrêter la séance ?')) {
      setIsClosing(true);
      router.post(route('professor.sessions.close', session.id), {}, {
        onSuccess: () => {
          router.visit(route('professor.sessions.stats', session.id));
        },
        onError: (error) => {
          console.error('❌ Erreur:', error);
          setIsClosing(false);
        }
      });
    }
  };

  // ✅ FONCTION POUR RÉACTIVER LE CODE
  const handleResumeSession = () => {
    if (confirm('Êtes-vous sûr de vouloir générer un nouveau code PIN ?')) {
      setIsResuming(true);
      router.post(route('professor.sessions.resume', session.id), {}, {
        onSuccess: () => {
          setIsResuming(false);
          window.location.reload(); // Rafraîchir pour voir le nouveau code
        },
        onError: (error) => {
          console.error('❌ Erreur:', error);
          setIsResuming(false);
          alert('❌ Erreur lors de la réactivation du code');
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

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* CODE PIN AFFICHAGE */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg mb-6">
            <div className="p-8 text-center">
              <h1 className="text-3xl font-bold mb-2">🚀 Séance Lancée !</h1>
              <p className="text-gray-600 mb-6">{session.module_name}</p>

              {/* CODE PIN EN GROS */}
              <div className={`rounded-lg p-8 mb-6 text-white ${
                timeLeft <= 0
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600'
              }`}>
                <p className="text-sm mb-2">Code PIN</p>
                <p className="text-6xl font-bold font-mono tracking-widest mb-4">
                  {timeLeft <= 0 ? '⏹️ EXPIRÉ' : session.code}
                </p>
                <button
                  onClick={copyCode}
                  disabled={timeLeft <= 0}
                  className={`${
                    timeLeft <= 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-white hover:bg-gray-100'
                  } text-blue-600 px-6 py-2 rounded font-semibold`}
                >
                  {copied ? '✅ Copié !' : '📋 Copier'}
                </button>
              </div>

              {/* ⚠️ ALERTE SI SÉANCE OUBLIÉE */}
              {session.is_forgotten && (
                <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                  <p className="text-sm text-yellow-800 font-semibold">
                    ⚠️ Cette séance a été lancée il y a longtemps. N'oublie pas de la terminer!
                  </p>
                </div>
              )}

              {/* TIMER */}
              <div
                className={`text-5xl font-bold font-mono ${
                  timeLeft <= 0
                    ? 'text-gray-600'
                    : timeLeft <= 5
                      ? 'text-red-600'
                      : 'text-green-600'
                }`}
              >
                ⏱️ {timeLeft}s
              </div>
              <p className="text-gray-600 mt-2">
                {timeLeft <= 0 ? '❌ Séance terminée' : 'Temps restant'}
              </p>
            </div>
          </div>

          {/* ÉTUDIANTS PRÉSENTS */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                👥 Étudiants ({presentCount}/{totalCount})
              </h2>

              {/* 🔄 Indicateur de synchronisation */}
              {timeLeft > 0 ? (
                <div className="mb-4 p-3 bg-blue-50 rounded text-sm text-blue-700">
                  🔄 Mise à jour automatique en cours... (toutes les 2s)
                </div>
              ) : (
                <div className="mb-4 p-3 bg-red-50 rounded text-sm text-red-700">
                  ⏹️ Séance terminée - Polling arrêté
                </div>
              )}

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-gray-500">Aucun étudiant assigné.</p>
                ) : (
                  students.map((student) => (
                    <div
                      key={`student-${student.id}`}
                      className={`p-4 rounded border-l-4 flex justify-between items-center transition ${
                        student.is_present
                          ? 'bg-green-50 border-green-500'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-gray-600">
                          {student.email}
                        </p>
                      </div>

                      {student.is_present ? (
                        <div className="text-right">
                          <p className="text-green-600 font-semibold">
                            ✅ Présent
                          </p>
                          <p className="text-xs text-gray-600">
                            {student.marked_at
                              ? new Date(
                                  student.marked_at
                                ).toLocaleTimeString('fr-FR')
                              : ''}
                          </p>
                        </div>
                      ) : (
                        <div className="text-right">
                          <p className="text-gray-500">⏳ En attente</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* ✅ BOUTONS D'ACTIONS */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleResumeSession}
                  disabled={isResuming}
                  className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResuming ? '⏳ Réactivation...' : '🔄 Réactiver le code'}
                </button>

                <button
                  onClick={handleCloseSession}
                  disabled={isClosing}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isClosing ? '⏳ Arrêt en cours...' : '⛔ Arrêter la séance'}
                </button>
                
                <button
                  onClick={() => router.visit(route('professor.sessions'))}
                  className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 font-semibold"
                >
                  ← Retour aux séances
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}