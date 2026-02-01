import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function MarkAttendance() {
    const [lessonId, setLessonId] = useState('');
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
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
                setMessage('Présence marquée avec succès');
                setLessonId('');
                setCode('');
            } else {
                setMessage(
                    'Erreur: ' +
                        (data.message ||
                            'Code invalide ou leçon inactive')
                );
            }
        } catch (error) {
            setMessage('Erreur de connexion: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Marquer ma présence
                </h2>
            }
        >
            <Head title="Marquer Présence" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-6">
                                Scanner le code de présence
                            </h3>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="lesson_id"
                                        value="ID de la leçon"
                                    />
                                    <TextInput
                                        id="lesson_id"
                                        type="number"
                                        value={lessonId}
                                        onChange={(e) =>
                                            setLessonId(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        placeholder="Ex: 1"
                                        required
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="code"
                                        value="Code dynamique"
                                    />
                                    <TextInput
                                        id="code"
                                        type="text"
                                        value={code}
                                        onChange={(e) =>
                                            setCode(
                                                e.target.value.toUpperCase()
                                            )
                                        }
                                        className="mt-1 block w-full text-2xl font-mono text-center tracking-widest"
                                        placeholder="ABC123"
                                        maxLength={6}
                                        required
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Entrez le code affiché par le
                                        professeur
                                    </p>
                                </div>

                                <PrimaryButton
                                    disabled={loading}
                                    className="w-full justify-center"
                                >
                                    {loading
                                        ? 'Vérification...'
                                        : 'Valider ma présence'}
                                </PrimaryButton>
                            </form>

                            {message && (
                                <div
                                    className={`mt-6 rounded-lg p-4 ${
                                        message.includes('succès')
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