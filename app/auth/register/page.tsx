import { CmciLogo } from '@/components/cmci-logo';
import { RegisterForm } from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CmciLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-myibc-blue">
          Créer un compte MyIBC
        </h2>
        <p className="mt-2 text-center text-sm text-myibc-graytext">
          S'inscrire à l'espace Point focal – Enregistrement
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <RegisterForm />
      </div>
    </div>
  );
}
