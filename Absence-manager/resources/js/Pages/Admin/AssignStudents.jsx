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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-bold">Assigner des Étudiants</h1>
                <p className="text-blue-200 mt-1">Module : <span className="font-semibold text-white">{module.name}</span></p>
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
                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                  <h2 className="text-xl font-bold text-white">Étudiants disponibles</h2>
                </div>
                <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold">
                  {data.student_ids.length} sélectionné{data.student_ids.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {students.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                      </div>
                      <p className="text-slate-500 text-lg font-medium">Aucun étudiant disponible</p>
                      <p className="text-slate-400 text-sm mt-1">Créez d'abord des comptes étudiants</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-2">
                      {students.map((student) => (
                        <label
                          key={student.id}
                          className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                            data.student_ids.includes(student.id.toString())
                              ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-400 shadow-md'
                              : 'bg-white border-slate-200 hover:border-blue-300'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${
                            data.student_ids.includes(student.id.toString())
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {data.student_ids.includes(student.id.toString()) ? (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <span className="text-lg font-semibold">
                                {student.user.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>
                          <input
                            type="checkbox"
                            checked={data.student_ids.includes(student.id.toString())}
                            onChange={() => handleToggle(student.id)}
                            className="hidden"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 truncate">
                              {student.user.name}
                            </p>
                            <p className="text-sm text-slate-500 truncate">
                              {student.user.email}
                            </p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-4 pt-4 border-t border-slate-100">
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {processing
                        ? 'Assignation...'
                        : `Assigner ${data.student_ids.length} étudiant(s)`}
                    </button>
                    <a
                      href="/admin/modules"
                      className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl text-center transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Retour
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}