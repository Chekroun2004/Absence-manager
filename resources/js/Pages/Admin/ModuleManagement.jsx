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
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Gestion des Modules</h1>
          <p className="text-blue-100 mt-2">Gérer les modules et leurs affectations</p>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CRÉER/MODIFIER */}
            <div className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-xl font-bold mb-4 text-blue-700">
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
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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

                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition transform hover:scale-105"
                  >
                    {editingModule ? 'Modifier' : 'Créer'}
                  </button>
                  {editingModule && (
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-lg shadow-md hover:shadow-lg transition"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* LISTE */}
            <div className="lg:col-span-2 bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-bold mb-6 text-blue-700">
                Modules ({modules.length})
              </h2>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {modules.map((module) => (
                  <div
                    key={module.id}
                    className="border-l-4 border-blue-300 bg-white rounded-lg p-4 hover:shadow-lg transition transform hover:scale-105 hover:border-blue-500"
                  >
                    <h3 className="font-bold text-lg text-gray-900">{module.name}</h3>
                    <p className="text-sm text-gray-600">
                      Classe: {module.schoolClass?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      Professeur: {module.professor?.user?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {module.students?.length || 0} étudiants
                    </p>

                    <div className="mt-4 flex gap-2">
                      <a
                        href={`/admin/modules/${module.id}/assign`}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition"
                      >
                        Assigner
                      </a>
                      <button
                        onClick={() =>
                          handleEditModule(module)
                        }
                        className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteModule(module)
                        }
                        className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm shadow-md hover:shadow-lg transition"
                      >
                        Supprimer
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