import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentGrades({ modules }) {
    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Mentions - Professeur" />

            <div className="py-12">
                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        📊 Gestion des Mentions de mes Étudiants
                    </h1>

                    {modules.length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <p className="text-gray-500">Vous n'avez aucun module assigné</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((module) => (
                                <Link
                                    key={module.id}
                                    href={route('professor.grades.module', module.id)}
                                    className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition border-l-4 border-purple-500"
                                >
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                                        {module.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        📚 {module.schoolClass.name}
                                    </p>
                                    <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold">
                                        Gérer les mentions
                                    </button>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}