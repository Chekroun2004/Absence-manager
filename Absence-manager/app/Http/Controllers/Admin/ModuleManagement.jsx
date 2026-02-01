import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function ModuleManagement({
  modules,
  professors,
  schoolClasses,
  students,
}) {
  const [selectedModule, setSelectedModule] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { data, setData, post, put, delete: destroy, errors, reset } = useForm({
    name: '',
    school_class_id: schoolClasses[0]?.id || '',
    professor_id: '',
  });

  const assignForm = useForm({
    student_ids: [],
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
      school_class_id: module.school_class_id,
      professor_id: module.professor_id,
    });
    setShowForm(true);
  };

  const handleDeleteModule = (module) => {
    if (confirm(`Supprimer le module "${module.name}" ?`)) {
      destroy(`/admin/modules/${module.id}`, {
        onSuccess: () => reset(),
      });
    }
  };

  const handleAssignStudents = (e) => {
    e.preventDefault();
    assignForm.post(
      `/admin/modules/${selectedModule.id}/assign-students`,
      {
        onSuccess: () => {
          setShowAssignForm(false);
          assignForm.reset();
        },
      }
    );
  };

  return (
    <AuthenticatedLayout>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">
            📚 Gestion des Modules
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CRÉER/MODIFIER MODULE */}
            <div className="bg-white shadow rounded p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingModule ? '✏️ Modifier' : '➕ Créer'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(!showForm);
                    setEditingModule(null);
                    reset();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showForm ? '✕' : '◈'}
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleCreateModule}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nom du module
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) =>
                        setData('name', e.target.value)
                      }
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Ex: Machine Learning"
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
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {schoolClasses.map((cls) => (
                        <option key={cls.id} value={cls.id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                    {errors.school_class_id && (
                      <p className="text-red-500 text-sm">
                        {errors.school_class_id}
                      </p>
                    )}
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
                      className="w-full px-3 py-2 border rounded"
                      required
                    >
                      <option value="">Sélectionner...</option>
                      {professors.map((prof) => (
                        <option key={prof.id} value={prof.id}>
                          {prof.user.name}
                        </option>
                      ))}
                    </select>
                    {errors.professor_id && (
                      <p className="text-red-500 text-sm">
                        {errors.professor_id}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                  >
                    {editingModule ? 'Modifier' : 'Créer'}
                  </button>
                </form>
              )}
            </div>

            {/* LISTE MODULES */}
            <div className="lg:col-span-2 bg-white shadow rounded p-6">
              <h2 className="text-xl font-bold mb-4">
                📚 Modules ({modules.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {modules.length === 0 ? (
                  <p className="text-gray-500">
                    Aucun module créé
                  </p>
                ) : (
                  modules.map((module) => (
                    <div
                      key={module.id}
                      className="border rounded p-4 hover:bg-gray-50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {module.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            🏫{' '}
                            {module.schoolClass?.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            👨🏫{' '}
                            {module.professor?.user
                              ?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            👥 Étudiants:{' '}
                            {module.students?.length ||
                              0}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setSelectedModule(module);
                              setShowAssignForm(true);
                            }}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            👥
                          </button>
                          <button
                            onClick={() =>
                              handleEditModule(module)
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteModule(module)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* MODAL ASSIGNER ÉTUDIANTS */}
          {showAssignForm && selectedModule && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6">
                <h2 className="text-xl font-bold mb-4">
                  Assigner des étudiants à "
                  {selectedModule.name}"
                </h2>

                <form
                  onSubmit={handleAssignStudents}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Sélectionner les étudiants :
                    </label>
                    <div className="border rounded p-4 max-h-64 overflow-y-auto bg-gray-50">
                      {students.length === 0 ? (
                        <p className="text-gray-500">
                          Aucun étudiant créé
                        </p>
                      ) : (
                        students.map((student) => (
                          <label
                            key={student.id}
                            className="flex items-center p-2 hover:bg-gray-100 rounded"
                          >
                            <input
                              type="checkbox"
                              value={student.student.id}
                              onChange={(e) => {
                                const ids =
                                  assignForm.data
                                    .student_ids;
                                if (e.target.checked) {
                                  assignForm.setData(
                                    'student_ids',
                                    [
                                      ...ids,
                                      e.target.value,
                                    ]
                                  );
                                } else {
                                  assignForm.setData(
                                    'student_ids',
                                    ids.filter(
                                      (id) =>
                                        id !==
                                        e.target.value
                                    )
                                  );
                                }
                              }}
                              className="mr-3"
                            />
                            <div>
                              <p className="font-medium">
                                {student.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {student.email}
                              </p>
                            </div>
                          </label>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-semibold"
                    >
                      Assigner ({
                        assignForm.data.student_ids
                          .length
                      })
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAssignForm(false);
                        assignForm.reset();
                      }}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                    >
                      Annuler
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}