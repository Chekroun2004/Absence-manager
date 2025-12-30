import { Head, Link } from '@inertiajs/react';

export default function Pending() {
  return (
    <>
      <Head title="En attente d'approbation" />

      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-4 text-5xl">⏳</div>
            <h1 className="mb-4 text-2xl font-bold text-gray-900">
              Demande en attente
            </h1>
            <p className="mb-6 text-gray-600">
              Votre compte a été créé avec succès !
            </p>
            <p className="mb-6 text-sm text-gray-500">
              Votre demande d'accès est actuellement en attente
              d'approbation par un administrateur. Vous recevrez
              une confirmation dès que votre compte sera validé.
            </p>

            <div className="mb-8 rounded-lg bg-blue-50 p-4">
              <p className="text-sm font-semibold text-blue-900">
                ℹ️ Qu'est-ce que j'attends ?
              </p>
              <p className="mt-2 text-xs text-blue-700">
                Les administrateurs vérifient chaque nouvelle
                inscription pour assurer la sécurité de la
                plateforme.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-block rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}