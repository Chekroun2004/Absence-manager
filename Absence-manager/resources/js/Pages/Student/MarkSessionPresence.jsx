import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function MarkSessionPresence() {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error'
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setMessageType('');

        if (!code) {
            setMessage('Veuillez entrer le code PIN');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            
            const response = await fetch('/api/attendance/mark-by-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                credentials: 'include',
                body: JSON.stringify({
                    code: code.toUpperCase(),
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const successMsg = data.is_expired 
                    ? `Code expiré ! Marqué ABSENT (Retard: ${data.delay_seconds}s). Le professeur peut rafraîchir.`
                    : 'Présence marquée avec succès !';
                setMessage(successMsg);
                setMessageType('success');
                setCode('');
            } else {
                const errorMsg = data.error || 'Erreur lors du marquage de la présence';
                setMessage(errorMsg);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('Erreur de connexion: ' + error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Marquer ma Présence" />

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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Marquer ma présence</h1>
                                <p className="text-blue-200 mt-1">Entrez le code PIN donné par le professeur</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-xl rounded-2xl border border-slate-100">
                            <div className="p-8 text-slate-900">
                                {/* MESSAGE */}
                                {message && (
                                    <div className={`mb-6 p-4 rounded-2xl flex items-start gap-3 ${
                                        messageType === 'success'
                                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                                            : 'bg-red-50 border border-red-200 text-red-700'
                                    }`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            messageType === 'success' ? 'bg-emerald-200' : 'bg-red-200'
                                        }`}>
                                            {messageType === 'success' ? (
                                                <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <p className="font-medium pt-1">{message}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* CODE PIN */}
                                    <div>
                                        <InputLabel
                                            htmlFor="code"
                                            value="Code PIN"
                                            className="text-slate-700 font-semibold"
                                        />
                                        <TextInput
                                            id="code"
                                            type="text"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                                            placeholder="Ex: CODE001"
                                            className="mt-3 w-full p-4 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-mono text-center text-3xl tracking-widest bg-slate-50"
                                            disabled={loading}
                                            maxLength="20"
                                            autoFocus
                                        />
                                        <p className="text-xs text-slate-500 mt-3 flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Le code expire après 20 secondes
                                        </p>
                                    </div>

                                    {/* SUBMIT BUTTON */}
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading || !code}
                                            className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <>
                                                    <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    Traitement...
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    Valider
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCode('');
                                                setMessage('');
                                            }}
                                            disabled={loading}
                                            className="flex-1 px-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Effacer
                                        </button>
                                    </div>
                                </form>

                                {/* INSTRUCTIONS */}
                                <div className="mt-8 p-5 bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-2xl">
                                    <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Instructions
                                    </h3>
                                    <ul className="text-sm text-blue-800 space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0 mt-0.5">1</span>
                                            Demandez le code PIN au professeur
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0 mt-0.5">2</span>
                                            Entrez le code dans le champ ci-dessus
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0 mt-0.5">3</span>
                                            Cliquez sur "Valider"
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-amber-200 rounded-full flex items-center justify-center text-xs font-bold text-amber-700 flex-shrink-0 mt-0.5">!</span>
                                            Le code n'est valide que pendant 20 secondes
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="w-5 h-5 bg-red-200 rounded-full flex items-center justify-center text-xs font-bold text-red-700 flex-shrink-0 mt-0.5">!</span>
                                            Si vous l'entrez après 20 secondes, vous serez marqué ABSENT
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
