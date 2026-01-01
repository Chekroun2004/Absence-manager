import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function StudentModules({ modules }) {
  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">📚 Mes Modules</h1>

          {modules.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8">
              <p className="text-gray-600 text-center">
                Aucun module assigné
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => (
                <div
                  key={module.id}
                  className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-bold text-blue-600 mb-2">
                    {module.name}
                  </h2>
                  <div className="space-y-2 text-sm text-gray-700">
                    <p>
                      <strong>👨🏫 Professeur :</strong>{' '}
                      {module.professor?.user?.name || 'N/A'}
                    </p>
                    <p>
                      <strong>🎓 Classe :</strong>{' '}
                      {module.school_class?.name || 'N/A'}
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