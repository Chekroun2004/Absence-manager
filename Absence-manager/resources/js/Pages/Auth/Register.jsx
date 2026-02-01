import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm(
    {
      name: '',
      email: '',
      role: 'student',
      password: '',
      password_confirmation: '',
    }
  );

  const submit = (e) => {
    e.preventDefault();
    post(route('register'));
  };

  const roles = [
    { value: 'student', label: 'Étudiant', description: 'Marquer ma présence et suivre mes absences' },
    { value: 'professor', label: 'Professeur', description: 'Gérer les séances et les recommandations' },
  ];

  return (
    <GuestLayout>
      <Head title="Inscription" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Créer un compte</h1>
        <p className="text-slate-500 mt-1">Rejoignez AbsenceManager aujourd'hui</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        {/* Name */}
        <div>
          <InputLabel htmlFor="name" value="Nom complet" className="text-slate-700 font-medium" />
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <TextInput
              id="name"
              name="name"
              value={data.name}
              className="block w-full pl-10 pr-4 py-3 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoComplete="name"
              placeholder="Votre nom complet"
              onChange={(e) => setData('name', e.target.value)}
              required
            />
          </div>
          <InputError message={errors.name} className="mt-2" />
        </div>

        {/* Email */}
        <div>
          <InputLabel htmlFor="email" value="Adresse email" className="text-slate-700 font-medium" />
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <TextInput
              id="email"
              type="email"
              name="email"
              value={data.email}
              className="block w-full pl-10 pr-4 py-3 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoComplete="username"
              placeholder="vous@exemple.com"
              onChange={(e) => setData('email', e.target.value)}
              required
            />
          </div>
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* Role Selection */}
        <div>
          <InputLabel htmlFor="role" value="Je suis un(e)" className="text-slate-700 font-medium mb-3" />
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <label
                key={role.value}
                className={`relative flex flex-col p-4 cursor-pointer rounded-xl border-2 transition-all duration-200 ${
                  data.role === role.value
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value={role.value}
                  checked={data.role === role.value}
                  onChange={(e) => setData('role', e.target.value)}
                  className="sr-only"
                />
                <div className="flex items-center gap-3 mb-1">
                  <span className={`font-semibold ${data.role === role.value ? 'text-blue-700' : 'text-slate-700'}`}>
                    {role.label}
                  </span>
                </div>
                <p className={`text-xs ${data.role === role.value ? 'text-blue-600' : 'text-slate-400'}`}>
                  {role.description}
                </p>
                {data.role === role.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </label>
            ))}
          </div>
          <InputError message={errors.role} className="mt-2" />
        </div>

        {/* Password */}
        <div>
          <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-700 font-medium" />
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <TextInput
              id="password"
              type="password"
              name="password"
              value={data.password}
              className="block w-full pl-10 pr-4 py-3 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoComplete="new-password"
              placeholder="Min. 8 caractères"
              onChange={(e) => setData('password', e.target.value)}
              required
            />
          </div>
          <InputError message={errors.password} className="mt-2" />
        </div>

        {/* Password Confirmation */}
        <div>
          <InputLabel htmlFor="password_confirmation" value="Confirmer le mot de passe" className="text-slate-700 font-medium" />
          <div className="relative mt-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <TextInput
              id="password_confirmation"
              type="password"
              name="password_confirmation"
              value={data.password_confirmation}
              className="block w-full pl-10 pr-4 py-3 border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              autoComplete="new-password"
              placeholder="Confirmez votre mot de passe"
              onChange={(e) => setData('password_confirmation', e.target.value)}
              required
            />
          </div>
          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        {/* Terms notice */}
        <p className="text-xs text-slate-500 text-center">
          En créant un compte, vous acceptez nos{' '}
          <a href="#" className="text-blue-600 hover:underline">conditions d'utilisation</a>
          {' '}et notre{' '}
          <a href="#" className="text-blue-600 hover:underline">politique de confidentialité</a>.
        </p>

        {/* Submit button */}
        <button
          type="submit"
          disabled={processing}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Création du compte...
            </>
          ) : (
            <>
              Créer mon compte
              <span>→</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-slate-400">Déjà inscrit ?</span>
          </div>
        </div>

        {/* Login link */}
        <Link
          href={route('login')}
          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          Se connecter
        </Link>
      </form>
    </GuestLayout>
  );
}