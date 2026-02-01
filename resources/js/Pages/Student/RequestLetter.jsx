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

            {/* HEADER - FULL WIDTH */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl font-bold">Mes Lettres de Recommandation</h1>
                        <p className="text-blue-100 mt-2">Demander et télécharger vos lettres de recommandation</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition shadow-md"
                    >
                        + Nouvelle Demande
                    </button>
                </div>
            </div>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Messages Flash */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg font-medium">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-lg font-medium">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">

                        {/* MODAL NOUVELLE DEMANDE */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden">
                                    {/* MODAL HEADER */}
                                    <div className="bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-4">
                                        <h2 className="text-xl font-bold text-white">Demander une Lettre</h2>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6">
                                        <div className="mb-4">
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">Module :</label>
                                            <select
                                                value={formData.module_id}
                                                onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                                                <p className="text-sm text-gray-900 mb-2">
                                                    <strong>Professeur :</strong> {selectedModuleInfo.professor.user.name}
                                                </p>
                                                <p className="text-sm text-gray-900">
                                                    <strong>Mention :</strong>{' '}
                                                    <span className="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full font-semibold text-xs mt-1">
                                                        {selectedModuleInfo.mention}
                                                    </span>
                                                </p>
                                                <p className="text-xs text-gray-600 mt-2">
                                                    (Mention attribuée par le professeur pour ce module)
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex gap-2 border-t pt-4">
                                            <button
                                                type="submit"
                                                disabled={loading || !formData.module_id}
                                                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
                                            >
                                                Envoyer
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                disabled={loading}
                                                className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 font-semibold rounded-lg transition"
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
                            <p className="text-gray-500 text-center py-12 text-lg">Aucune demande pour l'instant</p>
                        ) : (
                            <div className="space-y-4">
                                {myRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`p-4 rounded-lg border-l-4 transition ${
                                            req.status === 'pending'
                                                ? 'bg-yellow-50 border-yellow-500'
                                                : req.status === 'accepted'
                                                ? 'bg-green-50 border-green-500'
                                                : 'bg-red-50 border-red-500'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900 mb-2">
                                                    {req.status === 'pending' && '⏳ En attente - '}
                                                    {req.status === 'accepted' && '✅ Acceptée - '}
                                                    {req.status === 'rejected' && '❌ Refusée - '}
                                                    {req.professor.user.name}
                                                </p>
                                                <div className="space-y-1 text-sm">
                                                    <p className="text-gray-700">
                                                        <strong className="text-gray-900">Module :</strong> {req.module ? req.module.name : 'Module supprimé'}
                                                    </p>
                                                    <p className="text-gray-700">
                                                        <strong className="text-gray-900">Mention :</strong> <span className="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded font-semibold text-xs">{req.mention}</span>
                                                    </p>
                                                    <p className="text-gray-600 text-xs">
                                                        Demandé le {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>

                                                {req.status === 'rejected' && req.rejection_reason && (
                                                    <p className="text-sm text-red-700 mt-2 border-t pt-2">
                                                        <strong>Raison du refus :</strong> {req.rejection_reason}
                                                    </p>
                                                )}
                                            </div>

                                            {/* ✅ BOUTON TÉLÉCHARGER */}
                                            {req.status === 'accepted' && req.has_letter && (
                                                <button
                                                    onClick={() => handleDownload(req.id)}
                                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold whitespace-nowrap shadow-md hover:shadow-lg transition ml-4"
                                                >
                                                    Télécharger
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