import { Head, Link } from '@inertiajs/react';

export default function Pending() {
  return (
    <>
      <Head title="En attente d'approbation" />

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
              En attente de
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">
                validation
              </span>
            </h1>
            
            <p className="text-lg text-slate-300 mb-12 max-w-md leading-relaxed">
              Votre demande d'inscription est en cours de traitement par notre équipe administrative.
            </p>

            {/* Status steps */}
            <div className="space-y-4">
              {[
                { text: 'Inscription soumise avec succès', done: true },
                { text: 'Vérification en cours par l\'admin', pending: true },
                { text: 'Accès complet à la plateforme', upcoming: true },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    item.done ? 'bg-green-500/20' : item.pending ? 'bg-amber-500/20' : 'bg-slate-500/20'
                  }`}>
                    {item.done ? (
                      <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : item.pending ? (
                      <svg className="w-3 h-3 text-amber-400 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                    )}
                  </div>
                  <span className={item.done ? 'text-slate-400 line-through' : item.pending ? 'text-amber-300' : 'text-slate-500'}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-b from-slate-50 to-white">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <Link href="/" className="flex items-center gap-3 mb-8 lg:hidden justify-center">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">A</span>
              </div>
              <span className="text-slate-800 font-bold text-xl">AbsenceManager</span>
            </Link>

            <div className="text-center">
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <h1 className="mb-4 text-3xl font-bold text-slate-800">
                Demande en attente
              </h1>
              
              <p className="mb-6 text-slate-600 text-lg">
                Votre compte a été créé avec succès !
              </p>
              
              <p className="mb-8 text-slate-500">
                Votre demande d'accès est actuellement en attente d'approbation par un administrateur. 
                Vous recevrez une confirmation dès que votre compte sera validé.
              </p>

              {/* Info box */}
              <div className="mb-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-blue-900">
                    Pourquoi cette attente ?
                  </p>
                </div>
                <p className="text-sm text-blue-700">
                  Les administrateurs vérifient chaque nouvelle inscription pour assurer la sécurité de la plateforme.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
                Retour à la connexion
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}