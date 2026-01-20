import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ModuleManagement({
  modules,
  professors,
  schoolClasses,
}) {
  const [editingModule, setEditingModule] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, setData, post, put, delete: destroy, errors, reset } =
    useForm({
      name: '',
      school_class_id: schoolClasses[0]?.id || '',
      professor_id: '',
    });

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (editingModule) {
      put(`/admin/modules/${editingModule.id}`, {
        onSuccess: () => {
          reset();
          setEditingModule(null);
          setShowForm(false);
        },
      });
    } else {
      post('/admin/modules', {
        onSuccess: () => {
          reset();
          setShowForm(false);
        },
      });
    }
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setData({
      name: module.name,
      school_class_id: module.school_class_id || '',
      professor_id: module.professor_id || '',
    });
    setShowForm(true);
  };

  const handleDeleteModule = (module) => {
    if (confirm(`Supprimer "${module.name}" ?`)) {
      destroy(`/admin/modules/${module.id}`, {
        onSuccess: () => reset(),
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingModule(null);
    reset();
  };

  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* HEADER GRADIENT */}
          <div className="mb-8 rounded-lg bg-gradient-to-r from-red-900 to-red-700 shadow-lg px-6 py-6">
            <h1 className="text-3xl font-bold text-white">Gestion des Modules</h1>
            <p className="text-red-100 mt-2">Gérer les modules et leurs affectations</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CRÉER/MODIFIER */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-red-500">
              <h2 className="text-xl font-bold mb-4 text-red-700">
                {editingModule ? 'Modifier' : 'Créer'}
              </h2>

              <form
                onSubmit={handleCreateModule}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Nom
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) =>
                      setData('name', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Classe
                  </label>
                  <select
                    value={data.school_class_id}
                    onChange={(e) =>
                      setData('school_class_id', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {schoolClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Professeur
                  </label>
                  <select
                    value={data.professor_id}
                    onChange={(e) =>
                      setData('professor_id', e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Sélectionner...</option>
                    {professors.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-semibold"
                  >
                    {editingModule ? 'Modifier' : 'Créer'}
                  </button>
                  {editingModule && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 rounded"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* LISTE */}
            <div className="lg:col-span-2 bg-white shadow rounded p-6">
              <h2 className="text-xl font-bold mb-4">
                Modules ({modules.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border rounded p-4 hover:bg-gray-50"
                  >
                    <h3 className="font-bold">{module.name}</h3>
                    <p className="text-sm text-gray-600">
                      🏫 {module.schoolClass?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      👨🏫 {module.professor?.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      👥 {module.students?.length || 0} étudiants
                    </p>

                    <div className="mt-3 flex gap-2">
                      <a
                        href={`/admin/modules/${module.id}/assign`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                      >
                        👥 Assigner
                      </a>
                      <button
                        onClick={() =>
                          handleEditModule(module)
                        }
                        className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteModule(module)
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
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