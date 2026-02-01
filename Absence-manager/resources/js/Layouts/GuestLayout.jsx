import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
                {/* Background decorations */}
                <div className="absolute inset-0">
                    <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    
                    {/* Grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                    <Link href="/" className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                            <span className="text-white text-2xl font-bold">A</span>
                        </div>
                        <span className="text-white font-bold text-2xl">AbsenceManager</span>
                    </Link>

                    <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
                        Bienvenue dans votre 
                        <span className="block bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
                            espace académique
                        </span>
                    </h1>
                    
                    <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
                        Gérez vos présences, soumettez vos justifications et suivez votre parcours académique en toute simplicité.
                    </p>

                    {/* Features list */}
                    <div className="space-y-4">
                        {[
                            { text: 'Marquage de présence en temps réel' },
                            { text: 'Justifications d\'absences simplifiées' },
                            { text: 'Lettres de recommandation en ligne' },
                        ].map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                                    <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <span className="text-slate-300">{item.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="mt-16 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
                        <p className="text-slate-300 italic mb-4">
                            "Une solution indispensable pour notre établissement. La gestion des présences n'a jamais été aussi simple."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                                A
                            </div>
                            <div>
                                <div className="text-white font-medium">Dr. Ahmed Benali</div>
                                <div className="text-slate-400 text-sm">Directeur Académique</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col bg-slate-50">
                {/* Mobile header */}
                <div className="lg:hidden p-6 bg-gradient-to-r from-blue-600 to-blue-700">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="text-white text-xl font-bold">A</span>
                        </div>
                        <span className="text-white font-bold text-xl">AbsenceManager</span>
                    </Link>
                </div>

                {/* Form container */}
                <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
                    <div className="w-full max-w-md">
                        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
                            {children}
                        </div>
                        
                        {/* Footer */}
                        <p className="text-center text-slate-400 text-sm mt-8">
                            © 2026 AbsenceManager. Tous droits réservés.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
