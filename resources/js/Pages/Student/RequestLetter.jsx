import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function RequestLetter({ myRequests, modulesWithGrades, flash }) {
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        module_id: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!formData.module_id) {
            alert('⚠️ Veuillez sélectionner un module');
            return;
        }

        setLoading(true);
        router.post(route('student.letters.request'), formData, {
            onSuccess: () => {
                setShowModal(false);
                setFormData({ module_id: '' });
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleDownload = (requestId) => {
        window.location.href = route('student.letters.download', requestId);
    };

    // ✅ RÉCUPÉRER LES INFOS DU MODULE SÉLECTIONNÉ
    const selectedModuleInfo = formData.module_id
        ? modulesWithGrades.find(m => m.id === parseInt(formData.module_id))
        : null;

    return (
        <AuthenticatedLayout>
            <Head title="Mes Lettres de Recommandation" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Messages Flash */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold text-gray-900">📝 Mes Lettres</h1>
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                ➕ Nouvelle Demande
                            </button>
                        </div>

                        {/* MODAL NOUVELLE DEMANDE */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                                    <h2 className="text-xl font-bold mb-4">Demander une Lettre</h2>
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold mb-2">Module :</label>
                                            <select
                                                value={formData.module_id}
                                                onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                                                className="w-full p-2 border rounded-lg"
                                                required
                                            >
                                                <option value="">-- Sélectionner --</option>
                                                {modulesWithGrades.map((module) => (
                                                    <option key={module.id} value={module.id}>
                                                        {module.name} (Prof: {module.professor.user.name})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* ✅ AFFICHER LES INFOS DU MODULE ET LA MENTION */}
                                        {selectedModuleInfo && (
                                            <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <p className="text-sm text-gray-700 mb-2">
                                                    <strong>Professeur :</strong> {selectedModuleInfo.professor.user.name}
                                                </p>
                                                <p className="text-sm text-gray-700">
                                                    <strong>Mention :</strong>{' '}
                                                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded font-semibold">
                                                        {selectedModuleInfo.mention}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    (Mention attribuée par le professeur pour ce module)
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={loading || !formData.module_id}
                                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                                            >
                                                Envoyer
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                disabled={loading}
                                                className="flex-1 px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg disabled:opacity-50"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* LISTE DES DEMANDES */}
                        {myRequests.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">Aucune demande pour l'instant</p>
                        ) : (
                            <div className="space-y-4">
                                {myRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`p-4 rounded-lg border-l-4 ${
                                            req.status === 'pending'
                                                ? 'bg-yellow-50 border-yellow-500'
                                                : req.status === 'accepted'
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-red-50 border-red-500'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {req.status === 'pending' && '⏳ En attente - '}
                                                    {req.status === 'accepted' && '✅ Acceptée - '}
                                                    {req.status === 'rejected' && '❌ Refusée - '}
                                                    {req.professor.user.name}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Module : <span className="font-semibold">{req.module.name}</span>
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    Mention : <span className="font-semibold">{req.mention}</span>
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Demandé le : {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                </p>

                                                {req.status === 'rejected' && req.rejection_reason && (
                                                    <p className="text-sm text-red-700 mt-2">
                                                        <strong>Raison du refus :</strong> {req.rejection_reason}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ✅ BOUTON TÉLÉCHARGER */}
                                            {req.status === 'accepted' && req.has_letter && (
                                                <button
                                                    onClick={() => handleDownload(req.id)}
                                                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold flex items-center gap-2 whitespace-nowrap"
                                                >
                                                    📥 Télécharger
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}