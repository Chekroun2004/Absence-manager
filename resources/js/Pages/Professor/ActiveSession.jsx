import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function ActiveSession({ session, students }) {
  const [timeLeft, setTimeLeft] = useState(20);
  const [copied, setCopied] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const copyCode = () => {
    navigator.clipboard.writeText(session.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const presentCount = students.filter((s) => s.is_present).length;
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
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 mb-6 text-white">
                <p className="text-sm mb-2">Code PIN</p>
                <p className="text-6xl font-bold font-mono tracking-widest mb-4">
                  {session.code}
                </p>
                <button
                  onClick={copyCode}
                  className="bg-white text-blue-600 px-6 py-2 rounded font-semibold hover:bg-gray-100"
                >
                  {copied ? '✅ Copié !' : '📋 Copier'}
                </button>
              </div>

              {/* TIMER */}
              <div
                className={`text-5xl font-bold font-mono ${
                  timeLeft <= 5 ? 'text-red-600' : 'text-green-600'
                }`}
              >
                ⏱️ {timeLeft}s
              </div>
              <p className="text-gray-600 mt-2">Temps restant</p>
            </div>
          </div>

          {/* ÉTUDIANTS PRÉSENTS */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">
                👥 Étudiants ({presentCount}/{totalCount})
              </h2>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {students.length === 0 ? (
                  <p className="text-gray-500">Aucun étudiant assigné.</p>
                ) : (
                  students.map((student) => (
                    <div
                      key={student.id}
                      className={`p-4 rounded border-l-4 flex justify-between items-center ${
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
                            {new Date(
                              student.marked_at
                            ).toLocaleTimeString('fr-FR')}
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

              <button className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700 font-semibold">
                ⛔ Arrêter la séance
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}