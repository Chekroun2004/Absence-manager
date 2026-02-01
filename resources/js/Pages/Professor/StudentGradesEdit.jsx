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

        setLoading(true);
        router.post(
            route('professor.grades.update', gradeId),
            { mention: formData[studentId] },
            {
                onSuccess: () => {
                    setEditingId(null);
                    setFormData({});
                    setLoading(false);
                },
                onError: (errors) => {
                    console.error('Erreur:', errors);
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
            <Head title={`Mentions - ${module.name}`} />

            <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">{module.name}</h1>
                        <p className="text-blue-100">{module.class}</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
                    {/* Messages flash */}
                    {flash?.success && (
                        <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Tableau des étudiants */}
                    {students.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500">Aucun étudiant dans ce module</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-700 to-blue-600">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Nom</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Mention</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {students.map((student) => (
                                        <tr key={student.id} className="hover:bg-gray-50 transition">
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
                                                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {mentions.map((mention) => (
                                                            <option key={mention} value={mention}>
                                                                {mention}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
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
                                                            style={{ backgroundColor: '#059669' }}
                                                            className="px-3 py-1 text-white rounded text-sm font-medium hover:opacity-90 transition disabled:opacity-50"
                                                        >
                                                            Sauver
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={loading}
                                                            className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm font-medium transition disabled:opacity-50"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditStart(student)}
                                                        style={{ backgroundColor: '#1e40af' }}
                                                        className="px-3 py-1 text-white rounded text-sm font-medium hover:opacity-90 transition"
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
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}