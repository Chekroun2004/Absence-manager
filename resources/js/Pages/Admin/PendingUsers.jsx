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
        <div className="bg-gradient-to-r from-red-900 to-red-700 text-white px-6 py-8 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold">Utilisateurs en Attente</h1>
          <p className="text-red-100 mt-2">Gérez les demandes d'inscription</p>
        </div>
      }
    >
      <Head title="Utilisateurs en attente" />

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white shadow-md rounded-lg border-l-4 border-red-500">
            <div className="p-6 text-gray-900">
              {users.length === 0 ? (
                <p className="text-gray-500">
                  Aucun utilisateur en attente d'approbation.
                </p>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-red-50 border-b-2 border-red-500">
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
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5 ${
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
                            className="mr-2 rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => handleReject(user.id)}
                            className="rounded-lg bg-rose-600 px-4 py-2 text-white hover:bg-rose-700 shadow-md hover:shadow-lg transition transform hover:scale-105"
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