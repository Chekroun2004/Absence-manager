import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function UserManagement({ users }) {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUser) {
      put(`/admin/users/${editingUser.id}`, {
        onSuccess: () => {
          reset();
          setEditingUser(null);
          setShowForm(false);
        },
      });
    } else {
      post('/admin/users', {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    setShowForm(true);
  };

  const handleDelete = (user) => {
    if (confirm(`Supprimer ${user.name} ?`)) {
      destroy(`/admin/users/${user.id}`, {
        onSuccess: () => reset(),
      });
    }
  };

  const professors = users.filter((u) => u.role === 'professor');
  const students = users.filter((u) => u.role === 'student');

  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* HEADER GRADIENT */}
          <div className="mb-8 rounded-lg bg-gradient-to-r from-red-900 to-red-700 shadow-lg px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Gestion des Utilisateurs</h1>
            <p className="text-red-100 mt-2">Gérer les comptes utilisateurs du système</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* AJOUTER/MODIFIER UTILISATEUR */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-red-700">
                  {editingUser ? 'Modifier' : 'Ajouter'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingUser(null);
                    reset();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showForm ? '✕' : '◈'}
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom complet
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) =>
                        setData('name', e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) =>
                        setData('email', e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      required
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mot de passe
                      {editingUser && (
                        <span className="text-gray-500 text-xs">
                          {' '}
                          (laisser vide pour garder)
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={data.password}
                      onChange={(e) =>
                        setData('password', e.target.value)
                      }
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      required={!editingUser}
                    />
                    {errors.password && (
                      <p className="text-red-500 text-sm">
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {!editingUser && (
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Rôle
                      </label>
                      <select
                        value={data.role}
                        onChange={(e) =>
                          setData('role', e.target.value)
                        }
                        className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                      >
                        <option value="student">
                          Étudiant
                        </option>
                        <option value="professor">
                          Professeur
                        </option>
                      </select>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition shadow-md font-semibold"
                  >
                    {editingUser ? 'Modifier' : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingUser(null);
                      reset();
                    }}
                    className="w-full rounded-lg bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400 transition"
                  >
                    Annuler
                  </button>
                </form>
              )}
            </div>

            {/* PROFESSEURS */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 text-red-700">
                Professeurs ({professors.length})
              </h2>
              <div className="space-y-3">
                {professors.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucun professeur
                  </p>
                ) : (
                  professors.map((user) => (
                    <div
                      key={user.id}
                      className="border rounded p-3 hover:bg-gray-50"
                    >
                      <p className="font-semibold">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-xs bg-red-200 text-red-800 px-3 py-1 rounded hover:bg-red-300 font-medium transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ÉTUDIANTS */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 text-red-700">
                Étudiants ({students.length})
              </h2>
              <div className="space-y-3">
                {students.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aucun étudiant
                  </p>
                ) : (
                  students.map((user) => (
                    <div
                      key={user.id}
                      className="border rounded p-3 hover:bg-gray-50"
                    >
                      <p className="font-semibold">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {user.email}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 font-medium transition"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(user)}
                          className="text-xs bg-red-200 text-red-800 px-3 py-1 rounded hover:bg-red-300 font-medium transition"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}