import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Recommendations({ pendingRequests, processedRequests, flash }) {
    const [showRejectModal, setShowRejectModal] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAccept = (id) => {
        if (confirm('Générer la lettre de recommandation ?')) {
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
            alert('Veuillez entrer une raison');
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

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* HEADER GRADIENT avec effet décoratif */}
                <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
                    {/* Cercles décoratifs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative max-w-6xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Lettres de Recommandation</h1>
                                <p className="text-blue-200 mt-1">Gérez les demandes de lettres de recommandation des étudiants</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-12">
                    {/* Messages Flash */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
                            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {flash.error}
                        </div>
                    )}

                    <div className="space-y-8">
                        {/* DEMANDES EN ATTENTE */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-white">Demandes En Attente</h2>
                                </div>
                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                    {pendingRequests.length} demande{pendingRequests.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="p-6">
                                {pendingRequests.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 font-medium">Aucune demande en attente</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {pendingRequests.map((req) => (
                                            <div key={req.id} className="bg-gradient-to-br from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-200 hover:shadow-md transition-all duration-200">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md">
                                                            <span className="text-white font-bold text-lg">{req.student.user.name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{req.student.user.name}</p>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                Mention demandée : <span className="font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">{req.mention}</span>
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Demandé le : {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleAccept(req.id)}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 flex items-center gap-1"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Accepter
                                                        </button>
                                                        <button
                                                            onClick={() => setShowRejectModal(req.id)}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                                                        >
                                                            Refuser
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Modal Refus */}
                                                {showRejectModal === req.id && (
                                                    <div className="mt-4 p-5 bg-red-50 rounded-xl border border-red-200 space-y-4">
                                                        <label className="block text-sm font-semibold text-red-900">Raison du refus :</label>
                                                        <textarea
                                                            value={rejectionReason}
                                                            onChange={(e) => setRejectionReason(e.target.value)}
                                                            placeholder="Expliquez pourquoi vous refusez..."
                                                            className="w-full p-3 border-2 border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                                                            rows="3"
                                                        />
                                                        <div className="flex gap-3">
                                                            <button
                                                                onClick={() => handleRejectSubmit(req.id)}
                                                                disabled={loading}
                                                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                                                            >
                                                                Confirmer le refus
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setShowRejectModal(null);
                                                                    setRejectionReason('');
                                                                }}
                                                                disabled={loading}
                                                                className="flex-1 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
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
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
                            <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h2 className="text-xl font-bold text-white">Demandes Traitées</h2>
                                </div>
                                <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                                    {processedRequests.length} demande{processedRequests.length > 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="p-6">
                                {processedRequests.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 font-medium">Aucune demande traitée</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {processedRequests.map((req) => (
                                            <div
                                                key={req.id}
                                                className={`p-5 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                                                    req.status === 'accepted'
                                                        ? 'bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200'
                                                        : 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${
                                                            req.status === 'accepted' 
                                                                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' 
                                                                : 'bg-gradient-to-br from-red-500 to-red-600'
                                                        }`}>
                                                            <span className="text-white font-bold text-lg">{req.student.user.name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-slate-900">{req.student.user.name}</p>
                                                            <p className="text-sm text-slate-600 mt-1">
                                                                Mention : <span className="font-medium">{req.mention}</span>
                                                            </p>
                                                            <p className="text-xs text-slate-500 mt-1">
                                                                Traité le : {new Date(req.responded_at).toLocaleDateString('fr-FR')}
                                                            </p>
                                                            {req.status === 'rejected' && req.rejection_reason && (
                                                                <p className="text-sm text-red-700 mt-2 bg-white px-3 py-2 rounded-xl border border-red-200">
                                                                    <strong>Raison :</strong> {req.rejection_reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {req.status === 'accepted' && req.letter && (
                                                        <a
                                                            href={route('professor.recommendations.download', req.id)}
                                                            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
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