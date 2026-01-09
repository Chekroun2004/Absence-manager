import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function JustifyAbsenceModal({ isOpen, session, onClose }) {
  const { data, setData, post, processing, errors } = useForm({
    reason: '',
    document: null,
  });

  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('document', file);
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ VÉRIFICATION : Session existe et a un ID
    if (!session || !session.id) {
      console.error('❌ Session ID manquante!', session);
      alert('❌ Erreur : Session non trouvée');
      return;
    }

    // ✅ VÉRIFICATION : Raison minimum 10 caractères
    if (data.reason.length < 10) {
      console.error('❌ Raison trop courte!', data.reason.length);
      alert('❌ La raison doit faire minimum 10 caractères');
      return;
    }

    console.log('🎯 Soumission justification', {
      session_id: session.id,
      reason_length: data.reason.length,
      has_document: !!data.document,
    });

    post(route('student.justifications.store', session.id), {
      forceFormData: true,
      onSuccess: () => {
        console.log('✅ Justification créée avec succès');
        setData({ reason: '', document: null });
        setFileName('');
        onClose();
      },
      onError: (errors) => {
        console.error('❌ Erreurs de validation:', errors);
      },
    });
  };

  if (!isOpen || !session) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">
                📝 Justifier votre absence
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                {session.module_name} - {session.professor_name}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-indigo-100 hover:text-white transition text-2xl"
            >
              ✕
            </button>
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* RAISON */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Raison de l'absence <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.reason}
              onChange={(e) => setData('reason', e.target.value)}
              rows="5"
              placeholder="Expliquez la raison de votre absence (minimum 10 caractères)..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
            {errors.reason && (
              <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
            )}
            <p className="text-gray-500 text-xs mt-2">
              {data.reason.length}/10 caractères minimum
            </p>
          </div>

          {/* DOCUMENT */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Document justificatif (optionnel)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-500 transition cursor-pointer relative">
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              {fileName ? (
                <div>
                  <p className="text-green-600 font-semibold">✅ {fileName}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    PDF, DOC, JPG, PNG (Max 5MB)
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-600 font-medium">
                    📎 Cliquez ou glissez un fichier
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    PDF, DOC, JPG, PNG (Max 5MB)
                  </p>
                </div>
              )}
            </div>
            {errors.document && (
              <p className="text-red-500 text-sm mt-1">{errors.document}</p>
            )}
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
              disabled={processing || data.reason.length < 10}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <span className="animate-spin">⏳</span>
                  Envoi en cours...
                </>
              ) : (
                <>✅ Soumettre</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}