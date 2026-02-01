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
            alert('Veuillez sélectionner un module');
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

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* HEADER GRADIENT avec effet décoratif */}
                <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
                    {/* Cercles décoratifs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Mes Lettres de Recommandation</h1>
                                <p className="text-blue-200 mt-1">Demander et télécharger vos lettres de recommandation</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-200 shadow-lg flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Nouvelle Demande
                        </button>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Messages Flash */}
                        {flash?.success && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.success}
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl font-medium flex items-center gap-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {flash.error}
                            </div>
                        )}

                        {/* MODAL NOUVELLE DEMANDE */}
                        {showModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                                <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden">
                                    {/* MODAL HEADER */}
                                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </div>
                                            <h2 className="text-xl font-bold text-white">Demander une Lettre</h2>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="p-6">
                                            <div className="mb-5">
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">Module :</label>
                                                <select
                                                    value={formData.module_id}
                                                    onChange={(e) => setFormData({ ...formData, module_id: e.target.value })}
                                                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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

                                            {/* AFFICHER LES INFOS DU MODULE ET LA MENTION */}
                                            {selectedModuleInfo && (
                                                <div className="mb-5 p-5 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl border border-blue-200">
                                                    <p className="text-sm text-slate-700 mb-2 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        <strong>Professeur :</strong> {selectedModuleInfo.professor.user.name}
                                                    </p>
                                                    <p className="text-sm text-slate-700 flex items-center gap-2">
                                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
                                                        <strong>Mention :</strong>
                                                        <span className="inline-block px-3 py-1 bg-blue-200 text-blue-900 rounded-full font-semibold text-xs">
                                                            {selectedModuleInfo.mention}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-3">
                                                        (Mention attribuée par le professeur pour ce module)
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex gap-3 border-t border-slate-200 pt-5">
                                                <button
                                                    type="submit"
                                                    disabled={loading || !formData.module_id}
                                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                                                >
                                                    Envoyer la demande
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowModal(false)}
                                                    disabled={loading}
                                                    className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 font-semibold rounded-xl transition-all duration-200"
                                                >
                                                    Annuler
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                        {/* LISTE DES DEMANDES */}
                        {myRequests.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 text-lg font-medium">Aucune demande pour l'instant</p>
                                <p className="text-slate-400 mt-1">Cliquez sur "Nouvelle Demande" pour commencer</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {myRequests.map((req) => (
                                    <div
                                        key={req.id}
                                        className={`p-6 transition-all duration-200 hover:bg-slate-50 ${
                                            req.status === 'pending'
                                                ? 'border-l-4 border-amber-400'
                                                : req.status === 'accepted'
                                                ? 'border-l-4 border-emerald-500'
                                                : 'border-l-4 border-red-400'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-start gap-4 flex-1">
                                                {/* AVATAR DU PROFESSEUR */}
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                                                    req.status === 'pending' 
                                                        ? 'bg-gradient-to-br from-amber-400 to-amber-500'
                                                        : req.status === 'accepted'
                                                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-500'
                                                        : 'bg-gradient-to-br from-red-400 to-red-500'
                                                }`}>
                                                    {req.professor.user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <p className="font-semibold text-slate-800 text-lg">
                                                            {req.professor.user.name}
                                                        </p>
                                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                                            req.status === 'pending'
                                                                ? 'bg-amber-100 text-amber-700'
                                                                : req.status === 'accepted'
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {req.status === 'pending' && (
                                                                <>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                    </svg>
                                                                    En attente
                                                                </>
                                                            )}
                                                            {req.status === 'accepted' && (
                                                                <>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                    Acceptée
                                                                </>
                                                            )}
                                                            {req.status === 'rejected' && (
                                                                <>
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                    </svg>
                                                                    Refusée
                                                                </>
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                                                        <p className="flex items-center gap-2 text-slate-600">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                            </svg>
                                                            {req.module ? req.module.name : 'Module supprimé'}
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-600">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                            </svg>
                                                            <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 rounded-lg font-semibold text-xs">{req.mention}</span>
                                                        </p>
                                                        <p className="flex items-center gap-2 text-slate-500 text-xs">
                                                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Demandé le {new Date(req.created_at).toLocaleDateString('fr-FR')}
                                                        </p>
                                                    </div>

                                                    {req.status === 'rejected' && req.rejection_reason && (
                                                        <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200">
                                                            <p className="text-sm text-red-700 flex items-start gap-2">
                                                                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                                </svg>
                                                                <span><strong>Raison du refus :</strong> {req.rejection_reason}</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* BOUTON TÉLÉCHARGER */}
                                            {req.status === 'accepted' && req.has_letter && (
                                                <button
                                                    onClick={() => handleDownload(req.id)}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-300 ml-4 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                                    </svg>
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
            </div>
        </AuthenticatedLayout>
    );
}