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
        icon: '',
        label: 'En attente',
      },
      approved: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: '',
        label: 'Approuvée',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: '',
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

      <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-8">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <h1 className="text-4xl font-bold">Justifications d'absences</h1>
            <p className="text-blue-100 mt-2">Examinez et approuvez les demandes</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* FILTRES */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrer par statut</h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'all', label: 'Toutes', color: '#1e40af' },
                { value: 'pending', label: 'En attente', color: '#d97706' },
                { value: 'approved', label: 'Approuvées', color: '#059669' },
                { value: 'rejected', label: 'Rejetées', color: '#dc2626' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  style={{
                    backgroundColor: filter === btn.value ? btn.color : '#e2e8f0',
                    color: filter === btn.value ? 'white' : '#64748b',
                  }}
                  className="px-4 py-2 rounded font-medium transition hover:shadow-md"
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            {filteredJustifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-700 to-blue-600">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Étudiant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Module</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Raison</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredJustifications.map((justification) => (
                      <tr
                        key={justification.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">
                              {justification.student_name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {justification.student_email}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {justification.module_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {justification.session_date}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="space-y-2">
                            <p className="max-w-xs truncate font-medium text-gray-900">
                              {justification.reason}
                            </p>
                            {justification.document_path && (
                              <p className="text-xs text-blue-600">Document joint</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(justification.status)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedJustification(justification)}
                              className="text-blue-600 hover:text-blue-900 font-medium transition"
                            >
                              Voir
                            </button>
                            {justification.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(justification.id)}
                                  className="text-green-600 hover:text-green-900 font-medium transition"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(justification)}
                                  className="text-red-600 hover:text-red-900 font-medium transition"
                                >
                                  Rejeter
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500">Aucune justification à afficher</p>
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
  const [showPdfViewer, setShowPdfViewer] = useState(false);

  const isPdf = justification.document_path && justification.document_path.toLowerCase().endsWith('.pdf');
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-11/12 mx-4 max-h-screen overflow-y-auto">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 sticky top-0">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Détails de la Justification</h2>
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
                Document joint
              </h3>

              {/* VUE PRÉALABLE PDF */}
              {showPdfViewer && isPdf ? (
                <div className="space-y-3">
                  <div className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden">
                    <iframe
                      src={route('professor.absences.justifications.view', justification.id) + '#toolbar=1&navpanes=0'}
                      className="w-full h-96 rounded-lg"
                      title="PDF Preview"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowPdfViewer(false)}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-medium transition"
                    >
                      Masquer l'aperçu
                    </button>
                    <a
                      href={route(
                        'professor.absences.justifications.download',
                        justification.id
                      )}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition"
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded border border-blue-200 space-y-3">
                  <p className="text-sm text-blue-900">
                    {isPdf ? 'Fichier PDF détecté' : 'Document justificatif joint'}
                  </p>
                  <div className="flex gap-2">
                    {isPdf && (
                      <button
                        onClick={() => setShowPdfViewer(true)}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition"
                      >
                        Voir l'aperçu
                      </button>
                    )}
                    <a
                      href={route(
                        'professor.absences.justifications.download',
                        justification.id
                      )}
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-medium transition"
                    >
                      Télécharger
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* JUSTIFICATION REJET */}
          {justification.status === 'rejected' && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                Motif de Rejet
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
                  En attente
                </span>
              )}
              {justification.status === 'approved' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Approuvée
                </span>
              )}
              {justification.status === 'rejected' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Rejetée
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