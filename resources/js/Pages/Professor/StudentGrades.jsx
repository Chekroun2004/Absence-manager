import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

export default function StudentGrades({ modules }) {
    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Mentions - Professeur" />

            <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-900 to-blue-700 px-6 py-12">
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-4xl font-bold text-white mb-2">Gestion des Mentions</h1>
                        <p className="text-blue-100">Gérez les mentions de vos étudiants par module</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto sm:px-6 lg:px-8 py-8">
                    {modules.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <p className="text-gray-500">Vous n'avez aucun module assigné</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {modules.map((module) => (
                                <Link
                                    key={module.id}
                                    href={route('professor.grades.module', module.id)}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition border-l-4 overflow-hidden"
                                    style={{ borderColor: '#1e40af' }}
                                >
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                                            {module.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {module.schoolClass.name}
                                        </p>
                                        <button style={{ backgroundColor: '#1e40af' }} className="w-full px-4 py-2 text-white rounded-lg text-sm font-semibold hover:opacity-90 transition">
                                            Gérer les mentions
                                        </button>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}