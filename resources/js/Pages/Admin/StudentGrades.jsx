import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentGrades({ schoolClasses }) {
    const [selectedClass, setSelectedClass] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [modules, setModules] = useState([]);

    const handleClassSelect = (schoolClass) => {
        setSelectedClass(schoolClass);
        // Récupérer les modules de cette classe
        setModules(schoolClass.modules || []);
        setSelectedModule(null);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Mentions - Admin" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        📊 Gestion des Mentions par Étudiant
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* SÉLECTIONNER LA CLASSE */}
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">🎓 Sélectionner une Classe</h2>
                            <div className="space-y-2">
                                {schoolClasses.map((schoolClass) => (
                                    <button
                                        key={schoolClass.id}
                                        onClick={() => handleClassSelect(schoolClass)}
                                        className={`w-full text-left p-3 rounded border-l-4 transition ${
                                            selectedClass?.id === schoolClass.id
                                                ? 'bg-blue-50 border-blue-500 font-semibold'
                                                : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                        }`}
                                    >
                                        {schoolClass.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SÉLECTIONNER LE MODULE */}
                        {selectedClass && (
                            <div className="bg-white shadow rounded-lg p-6">
                                <h2 className="text-xl font-bold mb-4">📚 Sélectionner un Module</h2>
                                {modules.length === 0 ? (
                                    <p className="text-gray-500">Aucun module dans cette classe</p>
                                ) : (
                                    <div className="space-y-2">
                                        {modules.map((module) => (
                                            <Link
                                                key={module.id}
                                                href={route('admin.grades.module', module.id)}
                                                className={`block w-full text-left p-3 rounded border-l-4 transition ${
                                                    selectedModule?.id === module.id
                                                        ? 'bg-green-50 border-green-500 font-semibold'
                                                        : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                                                }`}
                                            >
                                                {module.name}
                                                <span className="text-xs text-gray-500">
                                                    ({module.students_count} étudiants)
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* INFO */}
                        <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-6">
                            <h3 className="font-bold text-blue-900 mb-2">ℹ️ Instructions</h3>
                            <p className="text-sm text-blue-800">
                                1. Sélectionnez une classe<br />
                                2. Sélectionnez un module<br />
                                3. Modifiez les mentions des étudiants
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}