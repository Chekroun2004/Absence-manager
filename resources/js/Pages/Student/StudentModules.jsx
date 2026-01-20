import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentModules({ modules }) {
  return (
    <AuthenticatedLayout>
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Mes Modules</h1>
          <p className="text-green-100 mt-2">Consulter vos modules assignés</p>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {modules.length === 0 ? (
            <div className="bg-white shadow-md rounded-lg p-12 border border-gray-200">
              <p className="text-gray-600 text-center text-lg">Aucun module assigné</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white shadow-md rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition transform hover:scale-105"
                >
                  <h2 className="text-xl font-bold text-green-700 mb-4">
                    {module.name}
                  </h2>
                  <div className="space-y-3 text-sm text-gray-700 border-t pt-4">
                    <p>
                      <strong className="text-gray-900">Professeur :</strong><br/>
                      <span className="text-gray-600">{module.professor?.user?.name || 'N/A'}</span>
                    </p>
                    <p>
                      <strong className="text-gray-900">Classe :</strong><br/>
                      <span className="text-gray-600">{module.school_class?.name || 'N/A'}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}