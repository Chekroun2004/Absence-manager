import { useState } from 'react';
import JustifyAbsenceModal from '@/Pages/Student/JustifyAbsenceModal';

export default function StudentDashboard({ stats, sessions }) {
  const [filter, setFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState(null);
  const [showJustifyModal, setShowJustifyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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
          Présent
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
          Absence Justifiée
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
          En attente
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
          Justification Rejetée
        </span>
      );
    }

    // Absence non justifiée
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
        Absent
      </span>
    );
  };

  return (
    <>
      {/* HEADER - FULL WIDTH avec effet décoratif */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Mon Historique de Présence</h1>
              <p className="text-blue-200 mt-1">Consultez vos présences, absences et justifications</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* ALERTE ABSENCES ÉLEVÉES */}
          {stats.has_high_absence && (
            <div className="mb-8 bg-white rounded-2xl shadow-xl border border-red-200 overflow-hidden">
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Alerte: Vous avez dépassé 3 absences</h2>
                    <p className="text-red-100 text-sm">{stats.total_absences} absences enregistrées</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700">
                  Veuillez justifier vos absences au plus tôt pour éviter des mesures disciplinaires.
                </p>
              </div>
            </div>
          )}

          {/* STATISTIQUES avec icônes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <StatCard
              title="Total Séances"
              value={stats.total_sessions}
              color="blue"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            />
            <StatCard
              title="Présences"
              value={stats.present_count}
              color="emerald"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Justifiées"
              value={stats.justified_count}
              color="cyan"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
            />
            <StatCard
              title="Absences"
              value={stats.absent_count}
              color="red"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            />
            <StatCard
              title="Taux Présence"
              value={`${stats.attendance_rate}%`}
              color="violet"
              icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
            />
          </div>

          {/* FILTRES */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Filtrer les séances</h3>
              <span className="text-sm text-gray-500">{filteredSessions.length} résultat(s)</span>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'all', label: 'Tous', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg> },
                { value: 'present', label: 'Présences', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> },
                { value: 'justified', label: 'Justifiées', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
                { value: 'absent', label: 'Absences', icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    filter === btn.value
                      ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700 border border-gray-200'
                  }`}
                >
                  {btn.icon}
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU SÉANCES */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Module
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Professeur
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Date & Heure
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filteredSessions.length > 0 ? (
                    filteredSessions.map((session, index) => (
                      <tr
                        key={session.id}
                        className={`hover:bg-blue-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
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
                                  className="text-blue-600 hover:text-blue-900 font-medium transition hover:underline"
                                >
                                  Justifier
                                </button>
                              )}

                            {/* VOIR JUSTIFICATION */}
                            {session.justification && (
                              <button
                                onClick={() => {
                                  setSelectedSession(session);
                                  setShowDetailsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-900 font-medium transition hover:underline"
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

      {/* MODAL DÉTAILS JUSTIFICATION */}
      {showDetailsModal && selectedSession && selectedSession.justification && (
        <JustificationDetailsModal
          session={selectedSession}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedSession(null);
          }}
        />
      )}
      </div>
    </>
  );
}

function StatCard({ title, value, color, icon }) {
  const colors = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      text: 'text-blue-900',
      subtext: 'text-blue-700',
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      text: 'text-emerald-900',
      subtext: 'text-emerald-700',
    },
    cyan: {
      bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      text: 'text-cyan-900',
      subtext: 'text-cyan-700',
    },
    red: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      text: 'text-red-900',
      subtext: 'text-red-700',
    },
    violet: {
      bg: 'bg-gradient-to-br from-violet-50 to-violet-100',
      iconBg: 'bg-violet-100',
      iconColor: 'text-violet-600',
      text: 'text-violet-900',
      subtext: 'text-violet-700',
    },
  };

  const colorClass = colors[color];

  return (
    <div className={`${colorClass.bg} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-white/50`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 ${colorClass.iconBg} rounded-xl flex items-center justify-center ${colorClass.iconColor}`}>
            {icon}
          </div>
        </div>
        <div className={`text-3xl font-bold ${colorClass.text}`}>{value}</div>
        <div className={`text-sm font-medium ${colorClass.subtext} mt-1`}>{title}</div>
      </div>
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
        icon: '',
        label: 'Approuvée',
      };
    }
    if (justification.status === 'rejected') {
      return {
        headerClass: 'bg-gradient-to-r from-red-600 to-red-700',
        badgeClass: 'bg-red-50 border-red-200',
        textClass: 'text-red-900',
        icon: '',
        label: 'Rejetée',
      };
    }
    return {
      headerClass: 'bg-gradient-to-r from-amber-600 to-amber-700',
      badgeClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-900',
      icon: '',
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
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition shadow-md"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}