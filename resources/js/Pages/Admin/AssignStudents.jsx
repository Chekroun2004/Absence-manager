import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function AssignStudents({ module, students }) {
  const { data, setData, post, processing } = useForm({
    student_ids: module.students ? module.students.map((s) => s.id.toString()) : [],
  });

  const handleToggle = (studentId) => {
    const idStr = studentId.toString();
    if (data.student_ids.includes(idStr)) {
      setData('student_ids', data.student_ids.filter((id) => id !== idStr));
    } else {
      setData('student_ids', [...data.student_ids, idStr]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    post(`/admin/modules/${module.id}/assign-students`);
  };

  return (
    <AuthenticatedLayout>
      {/* HEADER - FULL WIDTH */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 text-white py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold">Assigner des Étudiants</h1>
          <p className="text-red-100 mt-2">Module : <span className="font-semibold">{module.name}</span></p>
        </div>
      </div>

      <div className="py-12">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="bg-white shadow-md rounded-lg p-8 border-l-4 border-red-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-red-700 mb-3 font-semibold">
                  Sélectionner les étudiants ({data.student_ids.length})
                </label>

                <div className="space-y-2 border-2 border-gray-300 rounded-lg p-4 bg-red-50 max-h-96 overflow-y-auto focus-within:ring-2 focus-within:ring-red-500">
                  {students.length === 0 ? (
                    <p className="text-gray-500">
                      Aucun étudiant créé
                    </p>
                  ) : (
                    students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center p-3 hover:bg-red-100 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-red-500 transition shadow-sm hover:shadow-md bg-white"
                      >
                        <input
                          type="checkbox"
                          checked={data.student_ids.includes(
                            student.id.toString()
                          )}
                          onChange={() =>
                            handleToggle(student.id)
                          }
                          className="w-4 h-4 text-red-600 rounded focus:ring-2 focus:ring-red-500 accent-red-600"
                        />
                        <div className="ml-3 flex-1">
                          <p className="font-medium text-gray-900">
                            {student.user.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {student.user.email}
                          </p>
                        </div>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={processing}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50"
                >
                  {processing
                    ? 'Assignation...'
                    : `Assigner ${data.student_ids.length} étudiant(s)`}
                </button>
                <a
                  href="/admin/modules"
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-bold py-2 px-4 rounded-lg text-center shadow-md hover:shadow-lg transition"
                >
                  Retour
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}