import { useEffect } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset('password');
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    post(route('login'));
  };

  return (
    <GuestLayout>
      <Head title="Connexion" />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Bon retour !</h1>
        <p className="text-slate-500 mt-1">Connectez-vous à votre compte</p>
      </div>

      {status && (
        <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 text-green-700 text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          {status}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
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
            />
          </div>
          <InputError message={errors.email} className="mt-2" />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <InputLabel htmlFor="password" value="Mot de passe" className="text-slate-700 font-medium" />
            {canResetPassword && (
              <Link
                href={route('password.request')}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            )}
          </div>
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
              autoComplete="current-password"
              placeholder="••••••••"
              onChange={(e) => setData('password', e.target.value)}
            />
          </div>
          <InputError message={errors.password} className="mt-2" />
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer group">
            <Checkbox
              name="remember"
              checked={data.remember}
              onChange={(e) => setData('remember', e.target.checked)}
              className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-slate-600 group-hover:text-slate-800 transition-colors">
              Se souvenir de moi
            </span>
          </label>
        </div>

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
              Connexion...
            </>
          ) : (
            <>
              Se connecter
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
            <span className="px-4 bg-white text-slate-400">Nouveau sur AbsenceManager ?</span>
          </div>
        </div>

        {/* Register link */}
        <Link
          href={route('register')}
          className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
        >
          Créer un compte
        </Link>
      </form>
    </GuestLayout>
  );
}