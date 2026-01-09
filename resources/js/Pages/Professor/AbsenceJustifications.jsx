import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import RejectModal from './RejectModal';

export default function AbsenceJustifications({ justifications, pagination }) {
  const [filter, setFilter] = useState('all');
  const [selectedJustification, setSelectedJustification] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const filteredJustifications = justifications.filter((j) => {
    if (filter === 'all') return true;
    return j.status === filter;
  });

  const handleApprove = (justificationId) => {
    router.post(route('professor.absences.justifications.approve', justificationId), {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  const handleOpenRejectModal = (justification) => {
    setSelectedJustification(justification);
    setShowRejectModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: '⏳',
        label: 'En attente',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: '✅',
        label: 'Approuvée',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: '❌',
        label: 'Rejetée',
      },
    };

    const badge = badges[status] || badges.pending;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${badge.bg} ${badge.text}`}
      >
        {badge.icon} {badge.label}
      </span>
    );
  };

  return (
    <AuthenticatedLayout>
      <Head title="Justifications d'Absences" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              📝 Justifications d'Absences
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez les justifications d'absences des étudiants de vos modules
            </p>
          </div>

          {/* FILTRES */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtres</h3>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'all', label: 'Toutes', color: 'indigo' },
                { value: 'pending', label: '⏳ En attente', color: 'yellow' },
                { value: 'approved', label: '✅ Approuvées', color: 'green' },
                { value: 'rejected', label: '❌ Rejetées', color: 'red' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-4 py-2 rounded font-medium transition ${
                    filter === btn.value
                      ? `bg-${btn.color}-600 text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            {filteredJustifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Étudiant
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date Séance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Raison & Document
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
                    {filteredJustifications.map((justification) => (
                      <tr
                        key={justification.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="font-medium text-gray-900">
                              {justification.student_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {justification.student_email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {justification.module_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {justification.session_date}
                        </td>
                        {/* ✅ COLONNE AMÉLIORÉE : Raison + Document */}
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <p className="max-w-xs truncate font-medium text-gray-900">
                              {justification.reason}
                            </p>
                            {justification.document_path && (
                              <a
                                href={route(
                                  'professor.absences.justifications.download',
                                  justification.id
                                )}
                                className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-900 font-medium text-xs bg-indigo-50 px-3 py-1 rounded hover:bg-indigo-100 transition"
                              >
                                📎 Télécharger document
                              </a>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(justification.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            {/* BOUTON VOIR DÉTAILS */}
                            <button
                              onClick={() => setSelectedJustification(justification)}
                              className="text-blue-600 hover:text-blue-900 font-medium transition"
                            >
                              👁️ Voir
                            </button>

                            {/* BOUTON APPROUVER (si pending) */}
                            {justification.status === 'pending' && (
                              <button
                                onClick={() =>
                                  handleApprove(justification.id)
                                }
                                className="text-green-600 hover:text-green-900 font-medium transition"
                              >
                                ✅ Approuver
                              </button>
                            )}

                            {/* BOUTON REJETER (si pending) */}
                            {justification.status === 'pending' && (
                              <button
                                onClick={() =>
                                  handleOpenRejectModal(justification)
                                }
                                className="text-red-600 hover:text-red-900 font-medium transition"
                              >
                                ❌ Rejeter
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500">
                Aucune justification à afficher
              </div>
            )}
          </div>

          {/* DÉTAILS MODAL */}
          {selectedJustification && !showRejectModal && (
            <DetailsModal
              justification={selectedJustification}
              onClose={() => setSelectedJustification(null)}
            />
          )}
        </div>
      </div>

      {/* REJECT MODAL */}
      <RejectModal
        isOpen={showRejectModal}
        justification={selectedJustification}
        onClose={() => {
          setShowRejectModal(false);
          setSelectedJustification(null);
        }}
      />
    </AuthenticatedLayout>
  );
}

// ========== MODAL DÉTAILS AMÉLIORÉ ==========
function DetailsModal({ justification, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">👁️ Détails de la Justification</h2>
            <button
              onClick={onClose}
              className="text-blue-100 hover:text-white text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div className="p-6 space-y-6">
          {/* ÉTUDIANT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Étudiant
            </h3>
            <p className="text-gray-900 font-medium">{justification.student_name}</p>
            <p className="text-gray-600 text-sm">{justification.student_email}</p>
          </div>

          {/* MODULE & SÉANCE */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Module
              </h3>
              <p className="text-gray-900 font-medium">{justification.module_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Date Séance
              </h3>
              <p className="text-gray-900 font-medium">{justification.session_date}</p>
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

          {/* ✅ SECTION DOCUMENT */}
          {justification.document_path && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                📎 Document joint
              </h3>
              <div className="bg-indigo-50 p-4 rounded border border-indigo-200">
                <p className="text-sm text-indigo-900 mb-3">
                  L'étudiant a fourni un document justificatif
                </p>
                <a
                  href={route(
                    'professor.absences.justifications.download',
                    justification.id
                  )}
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 font-medium transition"
                >
                  📥 Télécharger le document
                </a>
              </div>
            </div>
          )}

          {/* JUSTIFICATION REJET */}
          {justification.status === 'rejected' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                ❌ Motif de Rejet
              </h3>
              <div className="bg-red-50 p-4 rounded border border-red-200">
                <p className="text-red-900 whitespace-pre-wrap">
                  {justification.rejection_reason}
                </p>
              </div>
            </div>
          )}

          {/* STATUT */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
              Statut
            </h3>
            <div className="flex gap-2">
              {justification.status === 'pending' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                  ⏳ En attente
                </span>
              )}
              {justification.status === 'approved' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  ✅ Approuvée
                </span>
              )}
              {justification.status === 'rejected' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  ❌ Rejetée
                </span>
              )}
            </div>
          </div>
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