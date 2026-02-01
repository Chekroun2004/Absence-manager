import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-b from-blue-900 to-blue-800 flex items-center justify-center">
                <div className="text-center text-white px-4">
                    <h1 className="text-5xl font-bold mb-4">
                        📋 Absence Manager
                    </h1>
                    <p className="text-xl text-blue-200 mb-8">
                        Gestion des absences et lettres de recommandation
                    </p>

                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                        >
                            Aller au Dashboard
                        </Link>
                    ) : (
                        <div className="space-x-4">
                            <Link
                                href={route('login')}
                                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-600 font-semibold"
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