import { RegisterForm } from '@/components/auth/register-form';
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/CMCI.png"
            alt="CMCI Logo"
            width={120}
            height={120}
            className="object-contain"
            priority
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-[#001F5B]">
          Créer un compte MyIBC
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Rejoignez la communauté MyIBC
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
