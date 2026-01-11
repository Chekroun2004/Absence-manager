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
            route('admin.grades.update', gradeId),
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

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {module.name}
                        </h1>
                        <p className="text-gray-600">
                            {module.class}
                        </p>
                    </div>

                    {/* Messages flash */}
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {flash.error}
                        </div>
                    )}

                    {/* Tableau des étudiants */}
                    <div className="bg-white shadow rounded-lg overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100 border-b">
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
                                    <tr key={student.id} className="hover:bg-gray-50">
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
                                                    className="p-2 border rounded-lg"
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
                                                                alert('❌ Erreur : Impossible de modifier cette note');
                                                                return;
                                                            }
                                                            handleSave(student.gradeId, student.id);
                                                        }}
                                                        disabled={loading || !student.gradeId}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm disabled:opacity-50"
                                                    >
                                                        ✅ Sauver
                                                    </button>
                                                    <button
                                                        onClick={handleCancel}
                                                        disabled={loading}
                                                        className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm disabled:opacity-50"
                                                    >
                                                        ❌ Annuler
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleEditStart(student)}
                                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                                                >
                                                    ✏️ Modifier
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