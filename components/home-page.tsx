"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-white text-gray-800 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b shadow-sm bg-white">
        <h1 className="text-2xl font-bold text-ibc-navy">MyIBC</h1>
        <div className="space-x-4">
          <Button variant="outline" onClick={() => router.push("/connexion")}>
            Se connecter
          </Button>
          <Button onClick={() => router.push("/inscription")}>
            S’enregistrer
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-6 md:px-20 py-16 bg-ibc-navy text-white">
        <div className="max-w-xl space-y-6">
          <h2 className="text-4xl font-extrabold">
            Bienvenue sur la plateforme MyIBC
          </h2>
          <p className="text-lg">
            Gérez votre inscription aux Camps Bibliques Internationaux de la CMCI en toute simplicité.
          </p>
          <div className="space-x-4">
            <Button className="bg-white text-ibc-navy hover:bg-gray-100" onClick={() => router.push("/inscription")}>
              Je m'inscris
            </Button>
            <Button variant="outline" className="border-white text-white hover:bg-white hover:text-ibc-navy" onClick={() => router.push("/connexion")}>
              J’ai déjà un compte
            </Button>
          </div>
        </div>

        <div className="mt-10 md:mt-0">
          <Image
            src="/camp-illustration.svg" // Remplace par une image locale ou URL publique
            alt="Camp Biblique"
            width={400}
            height={300}
          />
        </div>
      </section>

      {/* Infos utiles */}
      <section className="px-6 md:px-20 py-12 space-y-10">
        <h3 className="text-2xl font-bold text-center text-ibc-navy">
          Pourquoi utiliser MyIBC ?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold mb-2 text-ibc-navy">Inscriptions faciles</h4>
            <p className="text-sm text-gray-700">Inscrivez-vous en ligne à votre camp biblique depuis n’importe quel appareil.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold mb-2 text-ibc-navy">Suivi personnalisé</h4>
            <p className="text-sm text-gray-700">Vos informations sont conservées et accessibles pour modification jusqu’au début du camp.</p>
          </div>
          <div className="p-6 border rounded-lg shadow hover:shadow-md transition">
            <h4 className="font-semibold mb-2 text-ibc-navy">Badge numérique</h4>
            <p className="text-sm text-gray-700">Téléchargez facilement votre badge avec QR code dès que votre inscription est validée.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 border-t mt-auto text-gray-500 bg-gray-50">
        © 2025 CMCI – Tous droits réservés.
      </footer>
    </main>
  );
}
