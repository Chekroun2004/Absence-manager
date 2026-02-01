import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentModules({ modules }) {
  return (
    <AuthenticatedLayout>
      {/* HEADER - FULL WIDTH avec effet décoratif */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Mes Modules</h1>
              <p className="text-blue-200 mt-1">Consultez vos modules assignés et leurs professeurs</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {modules.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 border border-gray-100 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun module assigné</h3>
              <p className="text-gray-500">Vous n'avez pas encore de modules assignés à votre compte.</p>
            </div>
          ) : (
            <>
              {/* Statistiques rapides */}
              <div className="mb-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total des modules</p>
                      <p className="text-2xl font-bold text-gray-900">{modules.length}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Année académique</p>
                    <p className="text-lg font-semibold text-blue-600">2025-2026</p>
                  </div>
                </div>
              </div>

              {/* Grille des modules */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((module, index) => (
                  <div
                    key={module.id}
                    className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Header du module avec gradient */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {module.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h2 className="text-lg font-bold text-white truncate">
                          {module.name}
                        </h2>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6">
                      <div className="space-y-4">
                        {/* Professeur */}
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Professeur</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {module.professor?.user?.name || 'Non assigné'}
                            </p>
                          </div>
                        </div>

                        {/* Classe */}
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="w-5 h-5 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Classe</p>
                            <p className="text-sm font-semibold text-gray-900 truncate">
                              {module.school_class?.name || 'Non assignée'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer avec effet hover */}
                    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-100 group-hover:from-blue-50 group-hover:to-cyan-50 transition-colors duration-300">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Module actif</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          En cours
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}