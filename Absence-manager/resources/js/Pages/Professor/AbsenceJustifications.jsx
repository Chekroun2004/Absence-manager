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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Justifications d'absences</h1>
                <p className="text-blue-200 mt-1">Examinez et approuvez les demandes</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-12">
          {/* FILTRES */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filtrer par statut
            </h3>
            <div className="flex gap-3 flex-wrap">
              {[
                { value: 'all', label: 'Toutes', icon: 'M4 6h16M4 10h16M4 14h16M4 18h16' },
                { value: 'pending', label: 'En attente', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
                { value: 'approved', label: 'Approuvées', icon: 'M5 13l4 4L19 7' },
                { value: 'rejected', label: 'Rejetées', icon: 'M6 18L18 6M6 6l12 12' },
              ].map((btn) => (
                <button
                  key={btn.value}
                  onClick={() => setFilter(btn.value)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    filter === btn.value 
                      ? btn.value === 'pending' ? 'bg-amber-600 text-white shadow-lg'
                        : btn.value === 'approved' ? 'bg-emerald-600 text-white shadow-lg'
                        : btn.value === 'rejected' ? 'bg-red-600 text-white shadow-lg'
                        : 'bg-blue-600 text-white shadow-lg'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={btn.icon} />
                  </svg>
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* TABLEAU */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
            {filteredJustifications.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Étudiant</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Module</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Raison</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Statut</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredJustifications.map((justification, index) => (
                      <tr
                        key={justification.id}
                        className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-500 flex items-center justify-center">
                              <span className="text-white font-bold">{justification.student_name.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{justification.student_name}</p>
                              <p className="text-sm text-slate-500">{justification.student_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          {justification.module_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {justification.session_date}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          <div className="space-y-2">
                            <p className="max-w-xs truncate font-medium text-slate-900">
                              {justification.reason}
                            </p>
                            {justification.document_path && (
                              <span className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                </svg>
                                Document joint
                              </span>
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
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-all duration-200 text-sm"
                            >
                              Voir
                            </button>
                            {justification.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleApprove(justification.id)}
                                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-lg font-medium transition-all duration-200 text-sm"
                                >
                                  Approuver
                                </button>
                                <button
                                  onClick={() => handleOpenRejectModal(justification)}
                                  className="px-3 py-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-medium transition-all duration-200 text-sm"
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
              <div className="p-16 text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-slate-500 text-lg font-medium">Aucune justification</p>
                <p className="text-slate-400 text-sm mt-1">Aucune justification à afficher pour ce filtre</p>
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