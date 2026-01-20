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
            setMessage('❌ Veuillez entrer le code PIN');
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
                    ? `⏰ Code expiré ! Marqué ABSENT (Retard: ${data.delay_seconds}s). Le professeur peut rafraîchir.`
                    : '✅ Présence marquée avec succès !';
                setMessage(successMsg);
                setMessageType('success');
                setCode('');
            } else {
                const errorMsg = data.error || 'Erreur lors du marquage de la présence';
                setMessage(errorMsg);
                setMessageType('error');
            }
        } catch (error) {
            setMessage('❌ Erreur de connexion: ' + error.message);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-green-900 to-green-700 text-white px-6 py-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold">Marquer ma présence</h1>
                    <p className="text-green-100 mt-2">Entrez le code PIN donné par le professeur</p>
                </div>
            }
        >
            <Head title="Marquer ma Présence" />

            <div className="py-12">
                <div className="max-w-md mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-lg sm:rounded-lg border-l-4 border-green-500">
                        <div className="p-8 text-gray-900">
                            {/* MESSAGE */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg border-l-4 ${
                                    messageType === 'success'
                                        ? 'bg-green-50 border-green-500 text-green-700'
                                        : 'bg-red-50 border-red-500 text-red-700'
                                }`}>
                                    <p className="font-medium">{message}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* CODE PIN */}
                                <div>
                                    <InputLabel
                                        htmlFor="code"
                                        value="Code PIN"
                                    />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                                        placeholder="Ex: CODE001"
                                        className="mt-2 w-full p-4 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition font-mono text-center text-3xl tracking-widest"
                                        disabled={loading}
                                        maxLength="20"
                                        autoFocus
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        ⚠️ Le code expire après 20 secondes
                                    </p>
                                </div>

                                {/* SUBMIT BUTTON */}
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || !code}
                                        className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow-md hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        {loading ? 'Traitement...' : '✓ Valider'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCode('');
                                            setMessage('');
                                        }}
                                        disabled={loading}
                                        className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg font-bold shadow-md hover:shadow-lg transition disabled:opacity-50"
                                    >
                                        Effacer
                                    </button>
                                </div>
                            </form>

                            {/* INSTRUCTIONS */}
                            <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg">
                                <h3 className="font-bold text-blue-900 mb-2">📋 Instructions</h3>
                                <ul className="text-sm text-blue-800 space-y-1">
                                    <li>✓ Demandez le code PIN au professeur</li>
                                    <li>✓ Entrez le code dans le champ ci-dessus</li>
                                    <li>✓ Cliquez sur "Valider"</li>
                                    <li>⚠️ Le code n'est valide que pendant 20 secondes</li>
                                    <li>⏰ Si vous l'entrez après 20 secondes, vous serez marqué ABSENT</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
