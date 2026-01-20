import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function CreateLesson() {
    const [moduleId, setModuleId] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const response = await fetch('/api/lessons', {
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
                    module_id: moduleId,
                    start_time: startTime,
                    end_time: endTime,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(`Leçon créée avec succès ! ID: ${data.id}`);
                setModuleId('');
                setStartTime('');
                setEndTime('');
            } else {
                setMessage(data.message || 'Erreur lors de la création');
            }
        } catch (error) {
            setMessage('Erreur de connexion: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Créer une leçon" />

            <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
                    <div className="max-w-2xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">Créer une Leçon</h1>
                        <p className="text-blue-100">Planifiez une nouvelle leçon pour vos étudiants</p>
                    </div>
                </div>

                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-8 text-gray-900 space-y-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="module_id" className="block text-sm font-semibold text-gray-700 mb-2">
                                        ID du module
                                    </label>
                                    <input
                                        id="module_id"
                                        type="number"
                                        value={moduleId}
                                        onChange={(e) => setModuleId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Ex: 1"
                                        required
                                    />
                                    <p className="mt-2 text-sm text-gray-500">
                                        Pour ce test, utilise l'ID 1 ou 2
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date et heure de début
                                    </label>
                                    <input
                                        id="start_time"
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="end_time" className="block text-sm font-semibold text-gray-700 mb-2">
                                        Date et heure de fin
                                    </label>
                                    <input
                                        id="end_time"
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{ backgroundColor: '#1e40af' }}
                                    className="w-full px-6 py-3 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50"
                                >
                                    {loading ? 'Création en cours...' : 'Créer la leçon'}
                                </button>
                            </form>

                            {message && (
                                <div
                                    className={`rounded-lg p-4 border-l-4 ${
                                        message.includes('succès')
                                            ? 'bg-green-50 border-green-500 text-green-800'
                                            : 'bg-red-50 border-red-500 text-red-800'
                                    }`}
                                >
                                    {message}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}