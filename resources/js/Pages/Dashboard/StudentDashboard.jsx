import { useState } from 'react';
import JustifyAbsenceModal from '@/Pages/Student/JustifyAbsenceModal';

export default function StudentDashboard({ stats, sessions }) {
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showJustifyModal, setShowJustifyModal] = useState(false);

  const filteredSessions = sessions.filter((session) => {
    if (filter === 'all') return true;
    if (filter === 'present')
      return session.attendance && session.attendance.status === 'present';
    if (filter === 'absent')
      return !session.attendance || session.attendance?.status === 'absent';
    if (filter === 'justified')
      return session.justification && session.justification.status === 'approved';
    return true;
  });

  const handleJustifyClick = (session) => {
    setSelectedSession(session);
    setShowJustifyModal(true);
  };

  const getStatusBadge = (session) => {
    // Présent
    if (session.attendance && session.attendance.status === 'present') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          ✅ Présent
        </span>
      );
    }

    // Absence justifiée approuvée
    if (
      session.justification &&
      session.justification.status === 'approved'
    ) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          ✓ Absence Justifiée
        </span>
      );
    }

    // Absence justifiée en attente
    if (
      session.justification &&
      session.justification.status === 'pending'
    ) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          ⏳ En attente
        </span>
      );
    }

    // Absence justifiée rejetée
    if (
      session.justification &&
      session.justification.status === 'rejected'
    ) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
          ⚠️ Justification Rejetée
        </span>
      );
    }

    // Absence non justifiée
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        ❌ Absent
      </span>
    );
  };

  return (
    <>
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Mon Historique de Présence</h1>
          <p className="text-green-100 mt-2">Consultez vos présences, absences et justifications</p>
        </div>
      </div>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* ALERTE ABSENCES ÉLEVÉES */}
          {stats.has_high_absence && (
            <div className="mb-8 bg-red-50 border-l-4 border-red-600 p-6 rounded-lg shadow-md">
              <div className="flex items-start gap-4">
                <div className="text-4xl">🚨</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-red-800 mb-2">Alerte: Vous avez dépassé 3 absences</h2>
                  <p className="text-red-700">
                    Vous avez actuellement <span className="font-bold">{stats.total_absences} absences</span>. 
                    Veuillez justifier vos absences au plus tôt pour éviter des mesures disciplinaires.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STATISTICHE */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Séances"
              value={stats.total_sessions}
              color="green"
            />
            <StatCard
              title="Présences"
              value={stats.present_count}
              color="emerald"
            />
            <StatCard
              title="Justifiées"
              value={stats.justified_count}
              color="lime"
            />
            <StatCard
              title="Absences"
              value={stats.absent_count}
              color="red"
            />
            <StatCard
              title="Taux Présence"
              value={`${stats.attendance_rate}%`}
              color="teal"
            />
          </div>

          {/* FILTRES */}
          <div className="bg-white overflow-hidden shadow-md sm:rounded-lg p-6 mb-6 border-l-4 border-green-500">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'Tous', icon: '📋' },
                { value: 'present', label: 'Présences', icon: '✓' },
                { value: 'justified', label: 'Justifiées', icon: '✓' },
                { value: 'absent', label: 'Absences', icon: 'X' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    filter === btn.value
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 border border-gray-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU SÉANCES */}
          <div className="bg-white overflow-hidden shadow-md sm:rounded-lg border-l-4 border-green-500">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-green-50 border-b-2 border-green-500">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">
                      Professeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-green-900 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="hover:bg-green-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          {session.module_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {session.professor_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {session.started_at}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(session)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            {/* JUSTIFIER (si absent et pas de justification) */}
                            {(!session.attendance ||
                              session.attendance.status !== 'present') &&
                              !session.justification && (
                                <button
                                  onClick={() => handleJustifyClick(session)}
                                  className="text-green-600 hover:text-green-900 font-medium transition hover:underline"
                                >
                                  Justifier
                                </button>
                              )}

                            {/* VOIR JUSTIFICATION */}
                            {session.justification && (
                              <button
                                onClick={() => setSelectedSession(session)}
                                className="text-green-600 hover:text-green-900 font-medium transition hover:underline"
                              >
                                Détails
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500 font-medium"
                      >
                        Aucune séance trouvée
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* MODAL JUSTIFICATION */}
      <JustifyAbsenceModal
        isOpen={showJustifyModal}
        session={selectedSession}
        onClose={() => setShowJustifyModal(false)}
      />
      </div>
    </>
  );
}

function StatCard({ title, value, color, span = 'col-span-1' }) {
  const colors = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-500',
      text: 'text-green-700',
      hover: 'hover:shadow-lg hover:bg-green-100'
    },
    emerald: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-500',
      text: 'text-emerald-700',
      hover: 'hover:shadow-lg hover:bg-emerald-100'
    },
    lime: {
      bg: 'bg-lime-50',
      border: 'border-lime-500',
      text: 'text-lime-700',
      hover: 'hover:shadow-lg hover:bg-lime-100'
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-500',
      text: 'text-red-700',
      hover: 'hover:shadow-lg hover:bg-red-100'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-500',
      text: 'text-teal-700',
      hover: 'hover:shadow-lg hover:bg-teal-100'
    },
  };

  const colorClass = colors[color];

  return (
    <div className={`${colorClass.bg} ${colorClass.hover} overflow-hidden shadow-md sm:rounded-lg p-6 border-l-4 ${colorClass.border} transition transform hover:scale-105 ${span}`}>
      <div className={`text-sm font-semibold ${colorClass.text}`}>{title}</div>
      <div className={`text-4xl font-bold mt-3 ${colorClass.text}`}>{value}</div>
    </div>
  );
}

function JustificationDetailsModal({ session, onClose }) {
  const justification = session.justification;

  const getStatusInfo = () => {
    if (justification.status === 'approved') {
      return {
        headerClass: 'bg-gradient-to-r from-green-600 to-green-700',
        badgeClass: 'bg-green-50 border-green-200',
        textClass: 'text-green-900',
        icon: '✓',
        label: 'Approuvée',
      };
    }
    if (justification.status === 'rejected') {
      return {
        headerClass: 'bg-gradient-to-r from-red-600 to-red-700',
        badgeClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-900',
        icon: 'X',
        label: 'Rejetée',
      };
    }
    return {
      headerClass: 'bg-gradient-to-r from-amber-600 to-amber-700',
      badgeClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-900',
      icon: '⏳',
      label: 'En attente',
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* HEADER */}
        <div className={`${statusInfo.headerClass} px-6 py-4 sticky top-0`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Détails de la Justification
              </h2>
              <p className="text-white text-opacity-90 text-sm mt-1">
                {session.module_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-100 text-2xl transition font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="p-6 space-y-6">
          {/* STATUT */}
          <div className={`${statusInfo.badgeClass} p-4 rounded-lg border`}>
            <p className={`${statusInfo.textClass} font-semibold`}>
              Statut: {statusInfo.label}
            </p>
          </div>

          {/* MODULE & DATE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                Module
              </h3>
              <p className="text-gray-900 font-medium">{session.module_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                Date Séance
              </h3>
              <p className="text-gray-900 font-medium">{session.started_at}</p>
            </div>
          </div>

          {/* RAISON */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
              Raison de l'absence
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">
                {justification.reason}
              </p>
            </div>
          </div>

          {/* MOTIF REJET */}
          {justification.status === 'rejected' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase mb-2">
                Motif du Rejet
              </h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-red-900 whitespace-pre-wrap">
                  {justification.rejection_reason}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 px-6 py-4 border-t text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium transition shadow-md"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}