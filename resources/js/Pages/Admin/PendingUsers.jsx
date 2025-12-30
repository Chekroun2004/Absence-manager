import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function PendingUsers({ users }) {
  const handleApprove = (userId) => {
    router.post(`/admin/users/${userId}/approve`);
  };

  const handleReject = (userId) => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir rejeter cet utilisateur ?'
      )
    ) {
      router.delete(`/admin/users/${userId}/reject`);
    }
  };

  return (
    <AuthenticatedLayout
      header={
        <h2 className="text-xl font-semibold leading-tight text-gray-800">
          Utilisateurs en attente d'approbation
        </h2>
      }
    >
      <Head title="Utilisateurs en attente" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900">
              {users.length === 0 ? (
                <p className="text-gray-500">
                  Aucun utilisateur en attente d'approbation.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Nom
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Rôle
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          {user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              user.role === 'professor'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {user.role === 'professor'
                              ? 'Professeur'
                              : 'Étudiant'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <button
                            onClick={() => handleApprove(user.id)}
                            className="mr-2 rounded bg-green-500 px-3 py-1 text-white hover:bg-green-600"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="rounded bg-red-500 px-3 py-1 text-white hover:bg-red-600"
                          >
                            Rejeter
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}