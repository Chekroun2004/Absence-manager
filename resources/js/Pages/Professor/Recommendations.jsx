import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Recommendations({ recommendations }) {
  const { post, processing } = useForm();
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleAccept = (id) => {
    post(`/professor/recommendations/${id}/accept`, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  const handleRejectSubmit = (id) => {
    post(`/professor/recommendations/${id}/reject`, {
      data: { rejection_reason: rejectionReason },
      onSuccess: () => {
        setRejectingId(null);
        setRejectionReason('');
        window.location.reload();
      },
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        icon: '⏳',
        label: 'En attente',
      },
      accepted: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        icon: '✅',
        label: 'Acceptée',
      },
      rejected: {
        bg: 'bg-red-100',
        text: 'text-red-800',
        icon: '❌',
        label: 'Refusée',
      },
    };
    return badges[status] || badges.pending;
  };

  const pendingRequests = recommendations.filter((r) => r.status === 'pending');
  const processedRequests = recommendations.filter((r) => r.status !== 'pending');

  return (
    <AuthenticatedLayout>
      <Head title="Demandes de Lettres de Recommandation" />

      <div className="py-12">
        <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <h1 className="text-3xl font-bold">📝 Lettres de Recommandation</h1>
            <p className="text-gray-600 mt-2">
              Gérez les demandes de lettres de vos étudiants
            </p>
          </div>

          {/* DEMANDES EN ATTENTE */}
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <h2 className="text-2xl font-bold mb-6 text-yellow-700">
              ⏳ En attente ({pendingRequests.length})
            </h2>

            {pendingRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune demande en attente
              </p>
            ) : (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-yellow-200 rounded-lg p-6 bg-yellow-50"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold text-lg">
                          {request.student_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.student_email}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Mention : <span className="font-semibold">{request.mention}</span>
                        </p>
                        <p className="text-sm text-gray-500 mt-2">
                          Demandée le : {request.created_at}
                        </p>
                      </div>
                      <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                        ⏳ En attente
                      </span>
                    </div>

                    {/* Actions */}
                    {rejectingId === request.id ? (
                      <div className="mt-4 space-y-3 border-t pt-4">
                        <p className="text-sm font-semibold">
                          Raison du refus (optionnelle) :
                        </p>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Expliquez pourquoi..."
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                          rows="3"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleRejectSubmit(request.id)
                            }
                            disabled={processing}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                          >
                            {processing ? 'Refus...' : '✖ Confirmer refus'}
                          </button>
                          <button
                            onClick={() => setRejectingId(null)}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                          >
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleAccept(request.id)}
                          disabled={processing}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                        >
                          {processing ? 'Génération...' : '✅ Accepter & Générer'}
                        </button>
                        <button
                          onClick={() => setRejectingId(request.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                        >
                          ❌ Refuser
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* DEMANDES TRAITÉES */}
          {processedRequests.length > 0 && (
            <div className="bg-white shadow rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6">
                📋 Historique ({processedRequests.length})
              </h2>

              <div className="space-y-3">
                {processedRequests.map((request) => {
                  const badge = getStatusBadge(request.status);
                  return (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-4 flex justify-between items-center hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold">{request.student_name}</p>
                        <p className="text-sm text-gray-600">
                          {request.student_email}
                        </p>
                        {request.responded_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Traitée le : {request.responded_at}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`${badge.bg} ${badge.text} px-3 py-1 rounded-full text-sm font-semibold`}
                        >
                          {badge.icon} {badge.label}
                        </span>

                        {request.has_letter && (
                          <a
                            href={`/professor/recommendations/${request.id}/download`}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
                          >
                            📥 Voir PDF
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}