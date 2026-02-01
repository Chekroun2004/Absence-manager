import React from 'react';
import { useForm } from '@inertiajs/react';

export default function RejectModal({ isOpen, justification, onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    rejection_reason: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    post(
      route(
        'professor.absences.justifications.reject',
        justification.id
      ),
      {
        onSuccess: () => {
          setData('rejection_reason', '');
          onClose();
          window.location.reload();
        },
      }
    );
  };

  if (!isOpen || !justification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-gray-700 to-gray-600 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                Rejeter la Justification
              </h2>
              <p className="text-gray-200 text-sm mt-1">
                {justification.student_name} - {justification.module_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-200 hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* RAISON INITIALE */}
          <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Raison fournie par l'étudiant:
            </h3>
            <p className="text-gray-900 whitespace-pre-wrap">
              {justification.reason}
            </p>
          </div>

          {/* MOTIF DE REJET */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Motif du rejet <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.rejection_reason}
              onChange={(e) => setData('rejection_reason', e.target.value)}
              rows="6"
              placeholder="Expliquez pourquoi vous rejetez cette justification (minimum 10 caractères)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {errors.rejection_reason && (
              <p className="text-red-500 text-sm mt-1">
                {errors.rejection_reason}
              </p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              {data.rejection_reason.length}/10 caractères minimum
            </p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={processing}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={processing || data.rejection_reason.length < 10}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Envoi en cours...
                </>
              ) : (
                <>Rejeter avec raison</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}