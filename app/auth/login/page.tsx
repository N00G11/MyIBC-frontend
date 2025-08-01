import { CmciLogo } from '@/components/cmci-logo';
import Image from "next/image";
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="flex justify-center mb-6">
                <Image
                  src="/CMCI.png"
                  alt="CMCI Logo"
                  width={180}
                  height={180}
                  className="object-contain"
                  priority
                />
              </div>
              <h2 className="mt-6 text-center text-3xl font-bold text-[#001F5B]">
                  Connexion à MyIBC
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                Connectez-vous à l'espace Point focal – Enregistrement
              </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
