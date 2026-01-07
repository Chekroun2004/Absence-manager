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

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
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

                    <div className="bg-white shadow-lg rounded-lg">
                        {/* DEMANDES EN ATTENTE */}
                        <div className="p-6 border-b">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                📬 Demandes En Attente ({pendingRequests.length})
                            </h2>

                            {pendingRequests.length === 0 ? (
                                <p className="text-gray-500">Aucune demande en attente</p>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map((req) => (
                                        <div key={req.id} className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        📌 {req.student.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Mention demandée : <span className="font-semibold">{req.mention}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Demandé le : {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleAccept(req.id)}
                                                        disabled={loading}
                                                        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50"
                                                    >
                                                        ✅ Accepter
                                                    </button>
                                                    <button
                                                        onClick={() => setShowRejectModal(req.id)}
                                                        disabled={loading}
                                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg disabled:opacity-50"
                                                    >
                                                        ❌ Refuser
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Modal Refus */}
                                            {showRejectModal === req.id && (
                                                <div className="mt-4 p-4 bg-red-100 rounded-lg">
                                                    <label className="block text-sm font-semibold mb-2">Raison du refus :</label>
                                                    <textarea
                                                        value={rejectionReason}
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        placeholder="Expliquez pourquoi vous refusez..."
                                                        className="w-full p-2 border rounded-lg text-sm"
                                                        rows="3"
                                                    />
                                                    <div className="flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleRejectSubmit(req.id)}
                                                            disabled={loading}
                                                            className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm disabled:opacity-50"
                                                        >
                                                            Confirmer
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setShowRejectModal(null);
                                                                setRejectionReason('');
                                                            }}
                                                            disabled={loading}
                                                            className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm disabled:opacity-50"
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

                        {/* DEMANDES TRAITÉES */}
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                ✔️ Demandes Traitées ({processedRequests.length})
                            </h2>

                            {processedRequests.length === 0 ? (
                                <p className="text-gray-500">Aucune demande traitée</p>
                            ) : (
                                <div className="space-y-4">
                                    {processedRequests.map((req) => (
                                        <div
                                            key={req.id}
                                            className={`p-4 rounded-lg border-l-4 ${
                                                req.status === 'accepted'
                                                    ? 'bg-green-50 border-green-500'
                                                    : 'bg-red-50 border-red-500'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-900">
                                                        {req.status === 'accepted' ? '✅' : '❌'} {req.student.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        Mention : <span className="font-semibold">{req.mention}</span>
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        Traité le : {new Date(req.responded_at).toLocaleDateString('fr-FR')}
                                                    </p>
                                                    {req.status === 'rejected' && req.rejection_reason && (
                                                        <p className="text-sm text-red-700 mt-2">
                                                            <strong>Raison :</strong> {req.rejection_reason}
                                                        </p>
                                                    )}
                                                </div>
                                                {req.status === 'accepted' && req.letter && (
                                                    <a
                                                        href={route('professor.recommendations.download', req.id)}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                                                    >
                                                        📥 Télécharger
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
        </AuthenticatedLayout>
    );
}