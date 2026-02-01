import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function MarkPresence() {
  const { data, setData, post, processing, errors, reset } = useForm({
    code: '',
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/student/mark-presence', {
      onSuccess: () => {
        setMessageType('success');
        setMessage('Présence marquée avec succès !');
        reset();
        setTimeout(() => setMessage(null), 3000);
      },
      onError: () => {
        setMessageType('error');
        setMessage(errors.code || 'Erreur lors du marquage');
      },
    });
  };

  return (
    <AuthenticatedLayout>
      {/* HEADER - FULL WIDTH avec effet décoratif */}
      <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white py-12 overflow-hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-700/30 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-bold">Marquer Présence</h1>
              <p className="text-blue-200 mt-1">Entrez le code PIN pour marquer votre présence</p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-12 bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="mx-auto max-w-md sm:px-6 lg:px-8">
          {/* Carte principale avec effet glassmorphism */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* En-tête de la carte */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Saisie du code</h2>
                  <p className="text-blue-100 text-sm">Code à 6 caractères</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-xl font-medium flex items-center gap-3 animate-fade-in ${
                    messageType === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {messageType === 'success' ? (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Code PIN (6 caractères)
                  </label>
                  <input
                    type="text"
                    value={data.code}
                    onChange={(e) =>
                      setData('code', e.target.value.toUpperCase())
                    }
                    placeholder="• • • • • •"
                    maxLength="6"
                    className={`w-full px-4 py-4 text-center text-3xl font-bold tracking-[0.5em] border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
                      errors.code
                        ? 'border-red-400 focus:ring-red-100 bg-red-50'
                        : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500 hover:border-blue-300'
                    }`}
                  />
                  {errors.code && (
                    <p className="text-red-600 text-sm mt-2 font-medium flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {errors.code}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing || data.code.length !== 6}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-md flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Vérification...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Marquer Présence
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Carte d'information */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Comment ça marche ?</h3>
                <p className="text-sm text-blue-700">
                  Demandez le code PIN à votre professeur et saisissez-le dans le champ ci-dessus. 
                  Le code est valide pendant 20 secondes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}