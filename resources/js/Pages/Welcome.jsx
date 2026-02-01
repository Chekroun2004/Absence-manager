import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const features = [
        {
            icon: '1',
            title: 'Suivi des Présences',
            description: 'Gérez les présences en temps réel avec des codes PIN dynamiques'
        },
        {
            icon: '2',
            title: 'Justifications',
            description: 'Soumettez et gérez les justifications d\'absences facilement'
        },
        {
            icon: '3',
            title: 'Lettres de Recommandation',
            description: 'Demandez et recevez des lettres de recommandation professionnelles'
        },
        {
            icon: '4',
            title: 'Statistiques',
            description: 'Visualisez les données de présence avec des tableaux de bord détaillés'
        }
    ];

    return (
        <>
            <Head title="Absence Manager - Gestion Intelligente des Présences" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
                {/* Navigation */}
                <nav className="absolute top-0 left-0 right-0 z-50">
                    <div className="max-w-7xl mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <span className="text-white text-xl font-bold">A</span>
                                </div>
                                <span className="text-white font-bold text-xl">AbsenceManager</span>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={route('dashboard')}
                                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route('login')}
                                            className="px-5 py-2.5 text-blue-200 hover:text-white font-medium transition-colors"
                                        >
                                            Connexion
                                        </Link>
                                        <Link
                                            href={route('register')}
                                            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105"
                                        >
                                            S'inscrire
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="relative min-h-screen flex items-center">
                    {/* Background decorations */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
                        
                        {/* Grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
                    </div>

                    <div className="relative max-w-7xl mx-auto px-6 py-32">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left content */}
                            <div className="text-center lg:text-left">
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-300 text-sm font-medium mb-8">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                    Plateforme académique moderne
                                </div>
                                
                                <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                                    Gestion des
                                    <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                                        Présences Simplifiée
                                    </span>
                                </h1>
                                
                                <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                                    Une solution complète pour gérer les absences, les justifications et les lettres de recommandation. 
                                    Conçue pour les établissements d'enseignement modernes.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    {auth.user ? (
                                        <Link
                                            href={route('dashboard')}
                                            className="group px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-3"
                                        >
                                            Accéder au Dashboard
                                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route('register')}
                                                className="group px-8 py-4 bg-blue-500 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 flex items-center justify-center gap-3"
                                            >
                                                Commencer Gratuitement
                                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                                            </Link>
                                            <Link
                                                href={route('login')}
                                                className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                Se connecter
                                            </Link>
                                        </>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-8 mt-16 pt-8 border-t border-white/10">
                                    <div>
                                        <div className="text-3xl font-bold text-white">99%</div>
                                        <div className="text-slate-400 text-sm">Fiabilité</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white">24/7</div>
                                        <div className="text-slate-400 text-sm">Disponibilité</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-white">+500</div>
                                        <div className="text-slate-400 text-sm">Utilisateurs</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right - Dashboard Preview */}
                            <div className="relative hidden lg:block">
                                <div className="relative">
                                    {/* Glow effect */}
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-20"></div>
                                    
                                    {/* Dashboard mockup */}
                                    <div className="relative bg-slate-800/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
                                        {/* Window controls */}
                                        <div className="flex items-center gap-2 mb-6">
                                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                            <div className="ml-4 flex-1 bg-slate-700/50 rounded-lg h-6 flex items-center px-3">
                                                <span className="text-xs text-slate-400">absence-manager.edu</span>
                                            </div>
                                        </div>
                                        
                                        {/* Mock stats */}
                                        <div className="grid grid-cols-3 gap-4 mb-6">
                                            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-white">248</div>
                                                <div className="text-xs text-slate-400">Étudiants</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/20 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-white">94%</div>
                                                <div className="text-xs text-slate-400">Présences</div>
                                            </div>
                                            <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/20 rounded-xl p-4">
                                                <div className="text-2xl font-bold text-white">12</div>
                                                <div className="text-xs text-slate-400">Modules</div>
                                            </div>
                                        </div>

                                        {/* Mock table */}
                                        <div className="bg-slate-700/30 rounded-xl overflow-hidden">
                                            <div className="bg-slate-700/50 px-4 py-3 border-b border-white/5">
                                                <span className="text-sm font-medium text-white">Séances Récentes</span>
                                            </div>
                                            <div className="divide-y divide-white/5">
                                                {['Mathématiques', 'Informatique', 'Physique'].map((subject, i) => (
                                                    <div key={i} className="px-4 py-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                                                i === 0 ? 'bg-blue-500/20 text-blue-400' :
                                                                i === 1 ? 'bg-cyan-500/20 text-cyan-400' :
                                                                'bg-purple-500/20 text-purple-400'
                                                            }`}>
                                                                {subject.charAt(0)}
                                                            </div>
                                                            <span className="text-sm text-white">{subject}</span>
                                                        </div>
                                                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                                                            {95 - i * 3}%
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="relative py-24 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                                Fonctionnalités Puissantes
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">
                                Tout ce dont vous avez besoin pour gérer efficacement les présences dans votre établissement
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="group p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <footer className="border-t border-white/5 py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-slate-400">
                                <div className="w-6 h-6 bg-blue-500/30 rounded flex items-center justify-center text-xs font-bold text-blue-400">A</div>
                                <span className="font-medium">AbsenceManager</span>
                            </div>
                            <div className="text-slate-500 text-sm">
                                © 2026 AbsenceManager. Tous droits réservés.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}