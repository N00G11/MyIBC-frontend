import { CmciLogo } from '@/components/cmci-logo';
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CmciLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-myibc-blue">
          Réinitialisation du mot de passe
        </h2>
        <p className="mt-2 text-center text-sm text-myibc-graytext">
          Récupérez l'accès à votre compte MyIBC
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
