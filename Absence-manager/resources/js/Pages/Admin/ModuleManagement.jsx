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
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* HEADER GRADIENT avec effet décoratif */}
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
                <h1 className="text-4xl font-bold">Gestion des Modules</h1>
                <p className="text-blue-200 mt-1">Gérer les modules et leurs affectations</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* CRÉER/MODIFIER */}
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingModule ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                    </svg>
                    {editingModule ? 'Modifier le module' : 'Créer un module'}
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleCreateModule} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Nom du module
                      </label>
                      <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        placeholder="Ex: Mathématiques"
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Classe
                      </label>
                      <select
                        value={data.school_class_id}
                        onChange={(e) => setData('school_class_id', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      >
                        {schoolClasses.map((cls) => (
                          <option key={cls.id} value={cls.id}>{cls.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Professeur
                      </label>
                      <select
                        value={data.professor_id}
                        onChange={(e) => setData('professor_id', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        required
                      >
                        <option value="">Sélectionner un professeur...</option>
                        {professors.map((prof) => (
                          <option key={prof.id} value={prof.id}>{prof.user.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {editingModule ? 'Enregistrer' : 'Créer'}
                      </button>
                      {editingModule && (
                        <button
                          type="button"
                          onClick={handleCancel}
                          className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-semibold transition-all duration-200"
                        >
                          Annuler
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* LISTE DES MODULES */}
              <div className="lg:col-span-2 bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Modules
                  </h2>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {modules.length} module{modules.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="p-6">
                  {modules.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg">Aucun module disponible</p>
                      <p className="text-slate-400 text-sm mt-1">Créez votre premier module</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                      {modules.map((module) => (
                        <div
                          key={module.id}
                          className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-5 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-slate-900">{module.name}</h3>
                              <div className="mt-3 space-y-1">
                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                  Classe: <span className="font-medium">{module.schoolClass?.name}</span>
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  Professeur: <span className="font-medium">{module.professor?.user?.name}</span>
                                </p>
                                <p className="text-sm text-slate-600 flex items-center gap-2">
                                  <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                  </svg>
                                  <span className="font-medium">{module.students?.length || 0}</span> étudiants
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-5 flex gap-2">
                            <a
                              href={`/admin/modules/${module.id}/assign`}
                              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-300 text-center flex items-center justify-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                              </svg>
                              Assigner
                            </a>
                            <button
                              onClick={() => handleEditModule(module)}
                              className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module)}
                              className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}