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
      <div className="py-12">
        <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg p-8">
            <h1 className="text-3xl font-bold mb-2">
              Assigner des étudiants
            </h1>
            <p className="text-gray-600 mb-6">
              Module : <span className="font-semibold">{module.name}</span>
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Sélectionner les étudiants ({data.student_ids.length})
                </label>

                <div className="space-y-2 border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
                  {students.length === 0 ? (
                    <p className="text-gray-500">
                      Aucun étudiant créé
                    </p>
                  ) : (
                    students.map((student) => (
                      <label
                        key={student.id}
                        className="flex items-center p-3 hover:bg-white rounded cursor-pointer border border-gray-200"
                      >
                        <input
                          type="checkbox"
                          checked={data.student_ids.includes(
                            student.id.toString()
                          )}
                          onChange={() =>
                            handleToggle(student.id)
                          }
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
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
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
                >
                  {processing
                    ? 'Assignation...'
                    : `Assigner ${data.student_ids.length} étudiant(s)`}
                </button>
                <a
                  href="/admin/modules"
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg text-center"
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