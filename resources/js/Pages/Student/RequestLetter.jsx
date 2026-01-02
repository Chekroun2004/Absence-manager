import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function RequestLetter({ professors, myRequests }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    professor_id: '',
  });

  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/student/letters/request', {
      onSuccess: () => {
        reset();
        setShowForm(false);
      },
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', label: 'En attente' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', label: 'Acceptée' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: '❌', label: 'Refusée' },
    };
    return badges[status] || badges.pending;
  };

  return (
    <AuthenticatedLayout>
      <Head title="Mes Lettres de Recommandation" />

      <div className="py-12">
        <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
          {/* HEADER */}
          <div className="bg-white shadow rounded-lg p-8 mb-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">📜 Mes Lettres</h1>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                {showForm ? '✖ Fermer' : '+ Demander une lettre'}
              </button>
            </div>
          </div>

          {/* FORMULAIRE DE DEMANDE */}
          {showForm && (
            <div className="bg-white shadow rounded-lg p-8 mb-6">
              <h2 className="text-2xl font-bold mb-6">Nouvelle demande</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sélectionnez un professeur
                  </label>
                  <select
                    value={data.professor_id}
                    onChange={(e) => setData('professor_id', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Choisir un prof --</option>
                    {professors.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.user.name}
                      </option>
                    ))}
                  </select>
                  {errors.professor_id && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.professor_id}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                  >
                    {processing ? 'Envoi...' : '📤 Envoyer demande'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      reset();
                    }}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MES DEMANDES */}
          <div className="bg-white shadow rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Mes demandes</h2>

            {myRequests.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aucune demande pour le moment
              </p>
            ) : (
              <div className="space-y-4">
                {myRequests.map((request) => {
                  const badge = getStatusBadge(request.status);
                  return (
                    <div
                      key={request.id}
                      className="border border-gray-200 rounded-lg p-6 flex justify-between items-center hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-lg">
                          {request.professor_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Demandée le : {request.created_at}
                        </p>
                        {request.responded_at && (
                          <p className="text-sm text-gray-600">
                            Réponse le : {request.responded_at}
                          </p>
                        )}
                        {request.status === 'rejected' &&
                          request.rejection_reason && (
                            <p className="text-sm text-red-600 mt-2">
                              Raison : {request.rejection_reason}
                            </p>
                          )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`${badge.bg} ${badge.text} px-4 py-2 rounded-full font-semibold text-sm`}
                        >
                          {badge.icon} {badge.label}
                        </span>

                        {request.has_letter && (
                          <a
                            href={`/student/letters/${request.id}/download`}
                            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                          >
                            📥 Télécharger
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}