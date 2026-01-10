import { useState } from 'react';
import { Link } from '@inertiajs/react';
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
    <div className="py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            👨🎓 Mon Historique de Présence
          </h1>
          <p className="text-gray-600 mt-2">
            Consultez vos présences, absences et justifications
          </p>
        </div>

        {/* STATISTIQUES */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Total Séances"
            value={stats.total_sessions}
            color="blue"
          />
          <StatCard
            title="Présences"
            value={stats.present_count}
            color="green"
          />
          <StatCard
            title="Justifiées"
            value={stats.justified_count}
            color="cyan"
          />
          <StatCard
            title="Absences"
            value={stats.absent_count}
            color="red"
          />
          <StatCard
            title="Taux Présence"
            value={`${stats.attendance_rate}%`}
            color="purple"
            span="md:col-span-4"
          />
        </div>

        {/* FILTRES */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
          <div className="flex gap-2 flex-wrap">
            {[
              { value: 'all', label: 'Tous', icon: '📋' },
              { value: 'present', label: '✅ Présences', icon: '✅' },
              { value: 'justified', label: '✓ Justifiées', icon: '✓' },
              { value: 'absent', label: '❌ Absences', icon: '❌' },
            ].map((btn) => (
              <button
                key={btn.value}
                onClick={() => setFilter(btn.value)}
                className={`px-4 py-2 rounded font-medium transition ${
                  filter === btn.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* TABLEAU SÉANCES */}
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Module
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Professeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date & Heure
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSessions.length > 0 ? (
                  filteredSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {session.module_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {session.professor_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
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
                                className="text-indigo-600 hover:text-indigo-900 font-medium transition"
                              >
                                📝 Justifier
                              </button>
                            )}

                          {/* VOIR JUSTIFICATION */}
                          {session.justification && (
                            <button
                              onClick={() => setSelectedSession(session)}
                              className="text-blue-600 hover:text-blue-900 font-medium transition"
                            >
                              👁️ Détails
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
                      className="px-6 py-8 text-center text-gray-500"
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

      {/* MODAL DÉTAILS JUSTIFICATION */}
      {selectedSession &&
        selectedSession.justification &&
        !showJustifyModal && (
          <JustificationDetailsModal
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        )}
    </div>
  );
}

function StatCard({ title, value, color, span = 'col-span-1' }) {
  const colors = {
    blue: 'bg-blue-50 border-blue-500 text-blue-600',
    green: 'bg-green-50 border-green-500 text-green-600',
    red: 'bg-red-50 border-red-500 text-red-600',
    purple: 'bg-purple-50 border-purple-500 text-purple-600',
    cyan: 'bg-cyan-50 border-cyan-500 text-cyan-600',
  };

  return (
    <div
      className={`${colors[color]} overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 ${span}`}
    >
      <div className="text-sm font-semibold">{title}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
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
        icon: '✅',
        label: 'Approuvée',
      };
    }
    if (justification.status === 'rejected') {
      return {
        headerClass: 'bg-gradient-to-r from-red-600 to-red-700',
        badgeClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-900',
        icon: '❌',
        label: 'Rejetée',
      };
    }
    return {
      headerClass: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
      badgeClass: 'bg-yellow-50 border-yellow-200',
      textClass: 'text-yellow-900',
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
                {statusInfo.icon} Détails de la Justification
              </h2>
              <p className="text-white text-opacity-90 text-sm mt-1">
                {session.module_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-100 text-2xl transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="p-6 space-y-6">
          {/* STATUT */}
          <div className={`${statusInfo.badgeClass} p-4 rounded border`}>
            <p className={`${statusInfo.textClass} font-semibold`}>
              {statusInfo.icon} Statut: {statusInfo.label}
            </p>
          </div>

          {/* MODULE & DATE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Module
              </h3>
              <p className="text-gray-900 font-medium">{session.module_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Date Séance
              </h3>
              <p className="text-gray-900 font-medium">{session.started_at}</p>
            </div>
          </div>

          {/* RAISON */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Raison de l'absence
            </h3>
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">
                {justification.reason}
              </p>
            </div>
          </div>

          {/* MOTIF REJET */}
          {justification.status === 'rejected' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                ❌ Motif du Rejet
              </h3>
              <div className="bg-red-50 p-4 rounded border border-red-200">
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
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}