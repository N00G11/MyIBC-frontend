import { CmciLogo } from '@/components/cmci-logo';
import { LoginForm } from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <CmciLogo />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-myibc-blue">
          Connexion à MyIBC
        </h2>
        <p className="mt-2 text-center text-sm text-myibc-graytext">
          Accédez à votre espace personnel
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <LoginForm />
      </div>
    </div>
  );
}
