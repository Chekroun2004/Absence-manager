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
            alert('Erreur : ID de note manquant');
            return;
        }

        const mention = formData[studentId];
        if (!mention) {
            alert('Veuillez sélectionner une mention');
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
                    alert('Erreur lors de la sauvegarde');
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

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                {/* HEADER avec effet décoratif */}
                <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
                    {/* Cercles décoratifs */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
                    
                    <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">{module.name}</h1>
                                <p className="text-blue-200 mt-1">Modifier les mentions des étudiants</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                        {/* Messages flash */}
                        {flash?.success && (
                            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 shadow-lg">
                                <div className="w-8 h-8 bg-emerald-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="font-medium">{flash.success}</span>
                            </div>
                        )}
                        {flash?.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3 shadow-lg">
                                <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <span className="font-medium">{flash.error}</span>
                            </div>
                        )}

                        {/* Tableau des étudiants */}
                        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Nom
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Mention
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {students.map((student, index) => (
                                        <tr key={student.id} className={`hover:bg-blue-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold">
                                                        {student.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{student.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
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
                                                        className="p-2 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                                    >
                                                        {mentions.map((mention) => (
                                                            <option key={mention} value={mention}>
                                                                {mention}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                                        </svg>
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
                                                            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50 flex items-center gap-1 shadow-md hover:shadow-lg"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            Sauver
                                                        </button>
                                                        <button
                                                            onClick={handleCancel}
                                                            disabled={loading}
                                                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-50"
                                                        >
                                                            Annuler
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => handleEditStart(student)}
                                                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1 shadow-md hover:shadow-lg"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
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
                            <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-slate-100">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <p className="text-slate-500 text-lg font-medium">Aucun étudiant dans ce module</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}