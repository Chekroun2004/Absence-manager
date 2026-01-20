import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentGradesEdit({ module, students, flash }) {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);

    const mentions = ['Très Bien', 'Bien', 'Assez Bien', 'Passable'];

    const handleEditStart = (student) => {
        setEditingId(student.id);
        setFormData({ ...formData, [student.id]: student.mention });
    };

    const handleSave = (gradeId, studentId) => {
        if (!gradeId) {
            alert('❌ Erreur : ID de note manquant');
            return;
        }

        const mention = formData[studentId];
        if (!mention) {
            alert('❌ Veuillez sélectionner une mention');
            return;
        }

        setLoading(true);
        router.patch(
            route('admin.grades.update', gradeId),
            { mention: mention },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setFormData({});
                    setLoading(false);
                },
                onError: (errors) => {
                    console.error('Erreur:', errors);
                    alert('❌ Erreur lors de la sauvegarde');
                    setLoading(false);
                },
            }
        );
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier mentions - ${module.name}`} />

            {/* HEADER - FULL WIDTH */}
            <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold">{module.name}</h1>
                    <p className="text-red-100 mt-2">Modifier les mentions des étudiants</p>
                </div>
            </div>

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* Messages flash */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg shadow-md">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
                            {flash.error}
                        </div>
                    )}

                    {/* Tableau des étudiants */}
                    <div className="bg-white shadow-md rounded-lg overflow-hidden border-l-4 border-red-500">
                        <table className="w-full">
                            <thead className="bg-red-50 border-b-2 border-red-500">
                                <tr>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Nom
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Email
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Mention
                                    </th>
                                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {students.map((student) => (
                                    <tr key={student.id} className="hover:bg-red-50 transition">
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {student.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {student.email}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === student.id ? (
                                                <select
                                                    value={formData[student.id] || student.mention}
                                                    onChange={(e) =>
                                                        setFormData({
                                                            ...formData,
                                                            [student.id]: e.target.value,
                                                        })
                                                    }
                                                    className="p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                                                >
                                                    {mentions.map((mention) => (
                                                        <option key={mention} value={mention}>
                                                            {mention}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                                                    {student.mention}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {editingId === student.id ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => {
                                                            if (!student.gradeId) {
                                                                alert('Erreur : Impossible de modifier cette note');
                                                                return;
                                                            }
                                                            handleSave(student.gradeId, student.id);
                                                        }}
                                                        disabled={loading || !student.gradeId}
                                                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm shadow-md hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
                                                    >
                                                        Sauver
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={loading}
                                                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg text-sm shadow-md hover:shadow-lg transition disabled:opacity-50"
                                                    >
                                                        Annuler
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditStart(student)}
                                                    className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm shadow-md hover:shadow-lg transition transform hover:scale-105"
                                                >
                                                    Modifier
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {students.length === 0 && (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <p className="text-gray-500">Aucun étudiant dans ce module</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}