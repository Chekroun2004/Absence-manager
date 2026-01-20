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
        <AuthenticatedLayout
            header={
                <div className="bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-8 rounded-lg shadow-lg">
                    <h1 className="text-3xl font-bold">Gestion des Mentions</h1>
                    <p className="text-red-100 mt-2">Consultez et modifiez les mentions par étudiant</p>
                </div>
            }
        >
            <Head title="Gestion des Mentions - Admin" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* SÉLECTIONNER LA CLASSE */}
                        <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
                            <h2 className="text-xl font-bold mb-4 text-red-700">Sélectionner une Classe</h2>
                            <div className="space-y-2">
                                {schoolClasses.map((schoolClass) => (
                                    <button
                                        key={schoolClass.id}
                                        onClick={() => handleClassSelect(schoolClass)}
                                        className={`w-full text-left p-3 rounded-lg border-l-4 transition shadow-sm hover:shadow-md ${
                                            selectedClass?.id === schoolClass.id
                                                ? 'bg-red-50 border-red-500 font-semibold text-red-900'
                                                : 'bg-gray-50 border-gray-300 hover:bg-red-50 hover:border-red-300'
                                        }`}
                                    >
                                        {schoolClass.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* SÉLECTIONNER LE MODULE */}
                        {selectedClass && (
                            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
                                <h2 className="text-xl font-bold mb-4 text-red-700">Sélectionner un Module</h2>
                                {modules.length === 0 ? (
                                    <p className="text-gray-500">Aucun module dans cette classe</p>
                                ) : (
                                    <div className="space-y-2">
                                        {modules.map((module) => (
                                            <Link
                                                key={module.id}
                                                href={route('admin.grades.module', module.id)}
                                                className={`block w-full text-left p-3 rounded-lg border-l-4 transition shadow-sm hover:shadow-md ${
                                                    selectedModule?.id === module.id
                                                        ? 'bg-red-50 border-red-500 font-semibold text-red-900'
                                                        : 'bg-gray-50 border-gray-300 hover:bg-red-50 hover:border-red-300'
                                                }`}
                                            >
                                                {module.name}
                                                <span className="text-xs text-gray-500 ml-2">
                                                    ({module.students_count} étudiants)
                                                </span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* INFO */}
                        <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-6 shadow-md">
                            <h3 className="font-bold text-red-900 mb-2 text-lg">Instructions</h3>
                            <p className="text-sm text-red-800">
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