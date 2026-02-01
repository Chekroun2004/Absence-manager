import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SchoolClassManagement({ schoolClasses }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const { data, setData, post, put, processing, reset, errors } = useForm({
    name: '',
    speciality: '',  // ✅ AJOUTÉ
    academic_year: '',  // ✅ AJOUTÉ
  });

  const handleEdit = (schoolClass) => {
    setEditingId(schoolClass.id);
    setData({
      name: schoolClass.name,
      speciality: schoolClass.speciality,  // ✅ AJOUTÉ
      academic_year: schoolClass.academic_year,  // ✅ AJOUTÉ
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      put(`/admin/school-classes/${editingId}`, {
        onSuccess: () => {
          reset();
          setEditingId(null);
          setIsFormOpen(false);
        },
      });
    } else {
      post('/admin/school-classes', {
        onSuccess: () => {
          reset();
          setIsFormOpen(false);
        },
      });
    }
  };

  const handleDelete = (id) => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer cette classe ?'
      )
    ) {
      router.delete(`/admin/school-classes/${id}`);
    }
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Gestion des Classes</h1>
                <p className="text-blue-200 mt-1">Créez et gérez les classes de l'établissement</p>
              </div>
            </div>
          </div>
        </div>

        <div className="py-12">
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-100">
              {/* Header section */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h2 className="text-xl font-bold text-white">Classes</h2>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {schoolClasses.length} classe{schoolClasses.length > 1 ? 's' : ''}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setEditingId(null);
                    reset();
                    setIsFormOpen(!isFormOpen);
                  }}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold py-2 px-5 rounded-xl transition-all duration-200 flex items-center gap-2"
                >
                  {isFormOpen ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Fermer
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Créer une classe
                    </>
                  )}
                </button>
              </div>

              <div className="p-6">
                {/* FORMULAIRE */}
                {isFormOpen && (
                  <form
                    onSubmit={handleSubmit}
                    className="mb-8 p-6 bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl space-y-5 border border-blue-100"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                      {/* NOM */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Nom de la classe
                        </label>
                        <input
                          type="text"
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          placeholder="Ex: Master 1, Master 2"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-1">{errors.name}</p>
                        )}
                      </div>

                      {/* SPÉCIALITÉ */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Spécialité
                        </label>
                        <input
                          type="text"
                          value={data.speciality}
                          onChange={(e) => setData('speciality', e.target.value)}
                          placeholder="Ex: Informatique, Génie Logiciel"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        {errors.speciality && (
                          <p className="text-red-600 text-sm mt-1">{errors.speciality}</p>
                        )}
                      </div>

                      {/* ANNÉE ACADÉMIQUE */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Année académique
                        </label>
                        <input
                          type="text"
                          value={data.academic_year}
                          onChange={(e) => setData('academic_year', e.target.value)}
                          placeholder="Ex: 2025-2026"
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        {errors.academic_year && (
                          <p className="text-red-600 text-sm mt-1">{errors.academic_year}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                      <button
                        type="submit"
                        disabled={processing}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {processing ? 'Traitement...' : editingId ? 'Enregistrer' : 'Créer'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsFormOpen(false);
                          setEditingId(null);
                          reset();
                        }}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl transition-all duration-200"
                      >
                        Annuler
                      </button>
                    </div>
                  </form>
                )}

                {/* TABLEAU MODERNE */}
                {schoolClasses.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-medium">Aucune classe créée</p>
                    <p className="text-slate-400 text-sm mt-1">Cliquez sur "Créer une classe" pour commencer</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-slate-200">
                    <table className="w-full">
                      <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Nom
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Spécialité
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Année académique
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">
                            Modules
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {schoolClasses.map((schoolClass, index) => (
                          <tr
                            key={schoolClass.id}
                            className={`hover:bg-blue-50/50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`}
                          >
                            <td className="px-6 py-4">
                              <span className="font-semibold text-slate-900">{schoolClass.name}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-600">
                              {schoolClass.speciality}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                {schoolClass.academic_year}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                {schoolClass.modules ? schoolClass.modules.length : 0} module(s)
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center gap-2">
                                <button
                                  onClick={() => handleEdit(schoolClass)}
                                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Modifier
                                </button>
                                <button
                                  onClick={() => handleDelete(schoolClass.id)}
                                  className="bg-red-50 hover:bg-red-100 text-red-600 py-2 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Supprimer
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}