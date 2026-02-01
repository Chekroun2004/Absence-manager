import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function MarkAttendance() {
    const [lessonId, setLessonId] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/attendance/mark-present', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-TOKEN': document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute('content'),
                },
                credentials: 'include',
                body: JSON.stringify({
                    lesson_id: lessonId,
                    dynamic_code: code,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessageType('success');
                setMessage('Présence marquée avec succès');
                setLessonId('');
                setCode('');
            } else {
                setMessageType('error');
                setMessage(
                    'Erreur: ' +
                        (data.message ||
                            'Code invalide ou leçon inactive')
                );
            }
        } catch (error) {
            setMessageType('error');
            setMessage('Erreur de connexion: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Marquer Présence" />

            {/* HEADER - FULL WIDTH avec effet décoratif */}
            <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
                {/* Cercles décoratifs */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold">Marquer ma Présence</h1>
                            <p className="text-blue-200 mt-1">Entrez le code pour valider votre présence en cours</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="py-12 bg-gradient-to-b from-slate-50 to-white min-h-screen">
                <div className="mx-auto max-w-lg sm:px-6 lg:px-8">
                    {/* Carte principale */}
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
                        {/* En-tête de la carte */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Scanner le code de présence</h2>
                                    <p className="text-blue-100 text-sm">Entrez les informations ci-dessous</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-6">
                            {message && (
                                <div
                                    className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 ${
                                        messageType === 'success'
                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                            : 'bg-red-50 text-red-800 border border-red-200'
                                    }`}
                                >
                                    {messageType === 'success' ? (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    )}
                                    {message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="lesson_id" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                        </svg>
                                        ID de la leçon
                                    </label>
                                    <input
                                        id="lesson_id"
                                        type="number"
                                        value={lessonId}
                                        onChange={(e) => setLessonId(e.target.value)}
                                        className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 px-4 py-3 text-lg"
                                        placeholder="Ex: 1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="code" className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Code dynamique
                                    </label>
                                    <input
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        className="w-full rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-3xl font-mono text-center tracking-[0.5em] py-4 uppercase"
                                        placeholder="ABC123"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="mt-2 text-sm text-slate-500 text-center">
                                        Entrez le code affiché par le professeur
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Vérification...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Valider ma présence
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Instructions
                        </h3>
                        <ul className="space-y-2 text-sm text-blue-700">
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                                Demandez l'ID de la leçon à votre professeur
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                                Entrez le code PIN à 6 caractères affiché en classe
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                                Cliquez sur Valider pour confirmer votre présence
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}