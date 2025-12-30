import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

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
                setMessage(`✅ Leçon créée avec succès ! ID: ${data.id}`);
                setModuleId('');
                setStartTime('');
                setEndTime('');
            } else {
                setMessage('❌ ' + (data.message || 'Erreur'));
            }
        } catch (error) {
            setMessage('❌ Erreur de connexion: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Créer une leçon
                </h2>
            }
        >
            <Head title="Créer une leçon" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-6">
                                Nouvelle leçon
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="module_id"
                                        value="ID du module"
                                    />
                                    <TextInput
                                        id="module_id"
                                        type="number"
                                        value={moduleId}
                                        onChange={(e) =>
                                            setModuleId(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="Ex: 1"
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Pour ce test, utilise l'ID 1 ou 2
                                    </p>
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="start_time"
                                        value="Date et heure de début"
                                    />
                                    <TextInput
                                        id="start_time"
                                        type="datetime-local"
                                        value={startTime}
                                        onChange={(e) =>
                                            setStartTime(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="end_time"
                                        value="Date et heure de fin"
                                    />
                                    <TextInput
                                        id="end_time"
                                        type="datetime-local"
                                        value={endTime}
                                        onChange={(e) =>
                                            setEndTime(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        required
                                    />
                                </div>

                                <PrimaryButton disabled={loading}>
                                    {loading
                                        ? 'Création en cours...'
                                        : 'Créer la leçon'}
                                </PrimaryButton>
                            </form>

                            {message && (
                                <div
                                    className={`mt-6 rounded-lg p-4 ${
                                        message.includes('✅')
                                            ? 'bg-green-50 border border-green-200 text-green-800'
                                            : 'bg-red-50 border border-red-200 text-red-800'
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