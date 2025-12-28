import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">
                        📋 Absence Manager
                    </h1>
                    <p className="text-xl text-gray-400 mb-8">
                        Gestion des absences et lettres de recommandation
                    </p>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                        >
                            Aller au Dashboard
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                href={route('login')}
                                className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-semibold"
                            >
                                S'inscrire
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}