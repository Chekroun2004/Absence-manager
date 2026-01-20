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
      <div className="py-12">
        <div className="mx-auto max-w-md sm:px-6 lg:px-8">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            {/* HEADER GRADIENT */}
            <div className="bg-gradient-to-r from-green-900 to-green-700 px-6 py-6">
              <h1 className="text-3xl font-bold text-white text-center">Marquer Présence</h1>
            </div>

            <div className="p-8">
              {message && (
                <div
                  className={`mb-6 p-4 rounded-lg font-medium ${
                    messageType === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-300'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
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
                    placeholder="Entrez le code"
                    maxLength="6"
                    className={`w-full px-4 py-3 text-center text-3xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 transition ${
                      errors.code
                        ? 'border-red-500 focus:ring-red-500 bg-red-50'
                        : 'border-green-300 focus:ring-green-500 focus:border-green-500'
                    }`}
                  />
                  {errors.code && (
                    <p className="text-red-600 text-sm mt-2 font-medium">
                      {errors.code}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing || data.code.length !== 6}
                  className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition shadow-md hover:shadow-lg"
                >
                  {processing ? 'Traitement...' : 'Marquer Présence'}
                </button>
              </form>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-sm text-gray-700">
                  <strong className="text-green-900">Information :</strong> Demandez le code PIN au professeur. Vous avez 20 secondes pour marquer votre présence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}