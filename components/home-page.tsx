"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";

export default function HomePage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    const result = await signIn("google", { redirect: false });
    if (result?.error) {
      alert("Erreur lors de la connexion Google");
    } else if (result?.url) {
      window.location.href = result.url;
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-[#f0f4f8] to-[#d9e2ec]">
      <section className="flex flex-col justify-center flex-1 max-w-4xl px-12 py-20 md:px-28 md:py-28">
        <h1 className="text-5xl md:text-6xl font-extrabold text-[#001F5B] leading-tight">
          Transformez votre expérience <br />
          aux{" "}
          <span className="text-[#D4AF37]">Camps Bibliques Internationaux</span>
        </h1>
        <p className="mt-8 text-xl text-gray-700 leading-relaxed max-w-2xl">
          Gérez votre inscription en quelques clics, recevez votre badge personnalisé et restez connecté avec la communauté mondiale CMCI.
        </p>
        <p className="mt-6 text-gray-600 italic text-base max-w-2xl">
          Une plateforme simple, sécurisée et pensée pour vous accompagner tout au long de votre parcours spirituel.
        </p>
        <p className="mt-4 text-gray-500 italic text-sm max-w-2xl">
          *L’accès est réservé aux membres avec un compte Google.
        </p>
        <a
            href="https://myibc-backend-production.up.railway.app/oauth2/authorization/google"
         >
           <Button
              className="mt-12 inline-flex items-center gap-4 bg-white text-gray-900 px-8 py-4 rounded-lg shadow-md hover:bg-[#D4AF37] hover:text-white transition-colors duration-300 active:scale-95 max-w-xs"
           >
              <FcGoogle className="text-3xl" />
              Se connecter avec Google
           </Button>
        </a>
      </section>

      <section className="hidden md:flex flex-1 items-center justify-center px-12 py-20">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
          alt="Illustration spirituelle"
          className="max-w-xl rounded-lg shadow-lg"
          loading="lazy"
        />
      </section>
    </main>
  );
}
