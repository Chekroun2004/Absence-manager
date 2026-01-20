import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Recommendations({ pendingRequests, processedRequests, flash }) {
    const [showRejectModal, setShowRejectModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAccept = (id) => {
        if (confirm('✅ Générer la lettre de recommandation ?')) {
            setLoading(true);
            router.post(route('professor.recommendations.accept', id), {}, {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            });
        }
    };

    const handleRejectSubmit = (id) => {
        if (!rejectionReason.trim()) {
            alert('⚠️ Veuillez entrer une raison');
            return;
        }
        
        setLoading(true);
        router.post(route('professor.recommendations.reject', id), {
            rejection_reason: rejectionReason,
        }, {
            onSuccess: () => {
                setShowRejectModal(null);
                setRejectionReason('');
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Lettres de Recommandation" />

            <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">Lettres de Recommandation</h1>
                        <p className="text-blue-100">Gérez les demandes de lettres de recommandation des étudiants</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
                    {/* Messages Flash */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* DEMANDES EN ATTENTE */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4">
                                <h2 className="text-2xl font-bold text-white">
                                    Demandes En Attente
                                </h2>
                                <p className="text-amber-100 text-sm mt-1">{pendingRequests.length} demande(s)</p>
                            </div>

                            <div className="p-6">
                                {pendingRequests.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Aucune demande en attente</p>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingRequests.map((req) => (
                                            <div key={req.id} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">
                                                            {req.student.user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Mention demandée : <span className="font-medium text-amber-700">{req.mention}</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Demandé le : {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAccept(req.id)}
                                                            disabled={loading}
                                                            style={{ backgroundColor: '#059669' }}
                                                            className="px-4 py-2 text-white rounded-lg font-medium transition hover:opacity-90 disabled:opacity-50"
                                                        >
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => setShowRejectModal(req.id)}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition disabled:opacity-50"
                                                        >
                                                            Refuser
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Modal Refus */}
                                                {showRejectModal === req.id && (
                                                    <div className="mt-4 p-4 bg-red-100 rounded-lg border border-red-300 space-y-3">
                                                        <label className="block text-sm font-semibold text-red-900">Raison du refus :</label>
                                                        <textarea
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                            placeholder="Expliquez pourquoi vous refusez..."
                                                            className="w-full p-2 border border-red-300 rounded-lg text-sm"
                                                            rows="3"
                                                        />
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => handleRejectSubmit(req.id)}
                                                                disabled={loading}
                                                                className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                                                            >
                                                                Confirmer
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowRejectModal(null);
                                                                    setRejectionReason('');
                                                                }}
                                                                disabled={loading}
                                                                className="flex-1 px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
                                                            >
                                                                Annuler
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* DEMANDES TRAITÉES */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-800 to-gray-700 px-6 py-4">
                                <h2 className="text-2xl font-bold text-white">
                                    Demandes Traitées
                                </h2>
                                <p className="text-gray-300 text-sm mt-1">{processedRequests.length} demande(s)</p>
                            </div>

                            <div className="p-6">
                                {processedRequests.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">Aucune demande traitée</p>
                                ) : (
                                    <div className="space-y-4">
                                        {processedRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className={`p-4 rounded-lg border ${
                                                    req.status === 'accepted'
                                                        ? 'bg-green-50 border-green-200'
                                                        : 'bg-red-50 border-red-200'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900">
                                                            {req.student.user.name}
                                                        </p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            Mention : <span className="font-medium">{req.mention}</span>
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            Traité le : {new Date(req.responded_at).toLocaleDateString('fr-FR')}
                                                        </p>
                                                        {req.status === 'rejected' && req.rejection_reason && (
                                                            <p className="text-sm text-red-700 mt-2 bg-white px-3 py-2 rounded border border-red-200">
                                                                <strong>Raison :</strong> {req.rejection_reason}
                                                            </p>
                                                        )}
                                                    </div>
                                                    {req.status === 'accepted' && req.letter && (
                                                        <a
                                                            href={route('professor.recommendations.download', req.id)}
                                                            style={{ backgroundColor: '#059669' }}
                                                            className="px-4 py-2 text-white rounded-lg font-medium transition hover:opacity-90"
                                                        >
                                                            Télécharger
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}