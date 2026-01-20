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
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Gestion des Classes</h1>
          <p className="text-red-100 mt-2">Créez et gérez les classes de l'établissement</p>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8 border-l-4 border-red-500">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-red-700">
                Gestion des Classes
              </h1>
              <button
                onClick={() => {
                  setEditingId(null);
                  reset();
                  setIsFormOpen(!isFormOpen);
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
              >
                {isFormOpen ? 'Fermer' : 'Créer'}
              </button>
            </div>

            {/* FORMULAIRE */}
            {isFormOpen && (
              <form
                onSubmit={handleSubmit}
                className="mb-8 p-6 bg-red-50 rounded-lg space-y-4 border-l-4 border-red-500"
              >
                {/* NOM */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la classe *
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) =>
                      setData('name', e.target.value)
                    }
                    placeholder="Ex: Master 1, Master 2"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* SPÉCIALITÉ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Spécialité *
                  </label>
                  <input
                    type="text"
                    value={data.speciality}
                    onChange={(e) =>
                      setData('speciality', e.target.value)
                    }
                    placeholder="Ex: Informatique, Génie Logiciel"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  {errors.speciality && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.speciality}
                    </p>
                  )}
                </div>

                {/* ANNÉE ACADÉMIQUE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Année académique *
                  </label>
                  <input
                    type="text"
                    value={data.academic_year}
                    onChange={(e) =>
                      setData('academic_year', e.target.value)
                    }
                    placeholder="Ex: 2025-2026"
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"
                  />
                  {errors.academic_year && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.academic_year}
                    </p>
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={processing}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
                  >
                    {processing
                      ? 'Traitement...'
                      : editingId
                        ? 'Modifier'
                        : 'Créer'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                      reset();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            )}

            {/* TABLEAU */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead className="bg-red-50 border-b-2 border-red-500">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Nom
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Spécialité
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Année académique
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left">
                      Modules
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {schoolClasses.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                      >
                        Aucune classe créée
                      </td>
                    </tr>
                  ) : (
                    schoolClasses.map((schoolClass) => (
                      <tr
                        key={schoolClass.id}
                        className="hover:bg-red-50 transition"
                      >
                        <td className="border border-gray-300 px-4 py-2">
                          <strong>{schoolClass.name}</strong>
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {schoolClass.speciality}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {schoolClass.academic_year}
                        </td>
                        <td className="border border-gray-300 px-4 py-2">
                          {schoolClass.modules
                            ? schoolClass.modules.length
                            : 0}{' '}
                          module(s)
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                          <button
                            onClick={() =>
                              handleEdit(schoolClass)
                            }
                            className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition transform hover:scale-105"
                          >
                            Modifier
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(schoolClass.id)
                            }
                            className="bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-lg text-sm shadow-md hover:shadow-lg transition transform hover:scale-105"
                          >
                            Supprimer
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}