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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold">Gestion des Mentions</h1>
                                <p className="text-blue-200 mt-1">Consultez et modifiez les mentions par étudiant</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* SÉLECTIONNER LA CLASSE */}
                            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                                <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-4">
                                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                        Sélectionner une Classe
                                    </h2>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-2">
                                        {schoolClasses.map((schoolClass) => (
                                            <button
                                                key={schoolClass.id}
                                                onClick={() => handleClassSelect(schoolClass)}
                                                className={`w-full text-left p-4 rounded-xl border-l-4 transition-all duration-200 shadow-sm hover:shadow-md ${
                                                    selectedClass?.id === schoolClass.id
                                                        ? 'bg-blue-50 border-blue-500 font-semibold text-blue-900'
                                                        : 'bg-slate-50 border-slate-300 hover:bg-blue-50 hover:border-blue-400'
                                                }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                                        selectedClass?.id === schoolClass.id ? 'bg-blue-200' : 'bg-slate-200'
                                                    }`}>
                                                        <svg className={`w-4 h-4 ${selectedClass?.id === schoolClass.id ? 'text-blue-700' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                    {schoolClass.name}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* SÉLECTIONNER LE MODULE */}
                            {selectedClass && (
                                <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                                    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 px-6 py-4">
                                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            Sélectionner un Module
                                        </h2>
                                    </div>
                                    <div className="p-6">
                                        {modules.length === 0 ? (
                                            <div className="text-center py-8">
                                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <p className="text-slate-500">Aucun module dans cette classe</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {modules.map((module) => (
                                                    <Link
                                                        key={module.id}
                                                        href={route('admin.grades.module', module.id)}
                                                        className="block w-full text-left p-4 rounded-xl border-l-4 transition-all duration-200 shadow-sm hover:shadow-md bg-slate-50 border-slate-300 hover:bg-blue-50 hover:border-blue-400"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                    </svg>
                                                                </div>
                                                                <span className="font-medium text-slate-800">{module.name}</span>
                                                            </div>
                                                            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-lg">
                                                                {module.students_count} étudiants
                                                            </span>
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* INFO */}
                            <div className="bg-gradient-to-br from-blue-50 to-slate-50 border border-blue-200 rounded-2xl p-6 shadow-xl">
                                <h3 className="font-bold text-blue-900 mb-4 text-lg flex items-center gap-2">
                                    <div className="w-8 h-8 bg-blue-200 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    Instructions
                                </h3>
                                <div className="space-y-3 text-sm text-blue-800">
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">1</span>
                                        <span>Sélectionnez une classe</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">2</span>
                                        <span>Sélectionnez un module</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">3</span>
                                        <span>Modifiez les mentions des étudiants</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}