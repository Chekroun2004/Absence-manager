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

      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">{session.module_name}</h1>
            <p className="text-blue-100 mt-2">Séance en cours</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* CODE PIN - SECTION PRINCIPALE */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-8 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-12 text-center border-b border-gray-200">
              <p className="text-sm font-semibold text-gray-600 uppercase mb-4">Code PIN à communiquer</p>
              <div style={{ backgroundColor: '#1e40af' }} className="w-48 mx-auto rounded-lg p-8 text-white">
                <p className="text-6xl font-bold font-mono tracking-widest">
                  {timeLeft <= 0 ? 'EXPIRÉ' : session.code}
                </p>
              </div>
              <p style={{ color: timeLeft <= 0 ? '#dc2626' : '#059669' }} className="text-5xl font-bold font-mono mt-6">
                {timeLeft}s
              </p>
              <p className="text-gray-600 text-sm mt-2">Temps restant</p>

              <button
                onClick={copyCode}
                disabled={timeLeft <= 0}
                style={{ backgroundColor: timeLeft <= 0 ? '#9ca3af' : '#1e40af' }}
                className="mt-6 text-white px-6 py-2 rounded font-medium hover:opacity-90 transition disabled:cursor-not-allowed"
              >
                {copied ? 'Copié' : 'Copier le code'}
              </button>
            </div>

            {/* ALERTE SESSION OUBLIÉE */}
            {session.is_forgotten && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-0">
                <p className="text-sm text-amber-900 font-medium">
                  Cette séance a été lancée il y a plus de 20 minutes
                </p>
              </div>
            )}
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Présents</p>
              <p className="text-4xl font-bold text-green-600 mt-2">{presentCount}</p>
              <p className="text-xs text-gray-500 mt-2">sur {totalCount}</p>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Taux</p>
              <p className="text-4xl font-bold text-blue-900 mt-2">{totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0}%</p>
            </div>
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <p className="text-sm font-medium text-gray-600">Polling</p>
              <p className="text-sm text-gray-600 mt-2">
                {timeLeft > 0 ? 'Actif (2s)' : 'Arrêté'}
              </p>
            </div>
          </div>

          {/* LISTE ÉTUDIANTS */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
              <h2 className="text-xl font-semibold text-white">Étudiants ({presentCount}/{totalCount})</h2>
            </div>
            <div className="p-6">
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Aucun étudiant</p>
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
                      <div>
                        <p className="font-medium text-gray-900">{student.name}</p>
                        <p className="text-sm text-gray-600">{student.email}</p>
                      </div>
                      <div className="text-right">
                        {student.is_present ? (
                          <div>
                            <p className="text-green-600 font-semibold text-sm">Présent</p>
                            <p className="text-xs text-gray-500">
                              {student.marked_at ? new Date(student.marked_at).toLocaleTimeString('fr-FR') : ''}
                            </p>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">En attente</p>
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
              style={{ backgroundColor: '#059669' }}
              className="flex-1 text-white px-6 py-3 rounded font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResuming ? 'Réactivation...' : 'Nouveau code'}
            </button>
            <button
              onClick={handleCloseSession}
              disabled={isClosing}
              style={{ backgroundColor: '#dc2626' }}
              className="flex-1 text-white px-6 py-3 rounded font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClosing ? 'Fermeture...' : 'Fermer'}
            </button>
            <button
              onClick={() => router.visit(route('professor.sessions'))}
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded font-medium hover:bg-gray-700 transition"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}