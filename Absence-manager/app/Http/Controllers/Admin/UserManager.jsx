import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';

export default function UserManagement({ users }) {
  const { data, setData, post, errors } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/admin/users/create');
  };

  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CRÉER UTILISATEUR */}
            <div className="bg-white shadow rounded p-6">
              <h2 className="text-xl font-bold mb-4">
                ➕ Créer un Compte
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) =>
                      setData('name', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    value={data.email}
                    onChange={(e) =>
                      setData('email', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Mot de passe
                  </label>
                  <input
                    type="password"
                    value={data.password}
                    onChange={(e) =>
                      setData('password', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Rôle
                  </label>
                  <select
                    value={data.role}
                    onChange={(e) =>
                      setData('role', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="student">
                      Étudiant
                    </option>
                    <option value="professor">
                      Professeur
                    </option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Créer
                </button>
              </form>
            </div>

            {/* LISTE USERS */}
            <div className="lg:col-span-2 bg-white shadow rounded p-6">
              <h2 className="text-xl font-bold mb-4">
                👥 Utilisateurs ({users.length})
              </h2>
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="border rounded p-3 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email}
                      </p>
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}