'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, User, ArrowRight, LogOut } from 'lucide-react';
import { CmciLogo } from '@/components/cmci-logo';

interface UserData {
  role: string;
}

export default function DashboardSelectionPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Récupérer seulement le token et le rôle
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || !role) {
      router.push('/auth/login');
      return;
    }

    // Vérifier si l'utilisateur a le droit d'accéder à cette page
    if (role !== 'ROLE_ADMIN' && role !== 'ROLE_TRESORIER') {
      // Rediriger vers le dashboard utilisateur si ce n'est ni admin ni trésorier
      router.push('/utilisateur/dashboard');
      return;
    }

    setUser({ role });
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('code');
    router.push('/auth/login');
  };

  const navigateToDashboard = (dashboardType: 'admin' | 'tresorier' | 'user') => {
    switch (dashboardType) {
      case 'admin':
        router.push('/admin/dashboard');
        break;
      case 'tresorier':
        router.push('/tresoriers');
        break;
      case 'user':
        router.push('/utilisateur/dashboard');
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-blue-600 font-medium">Chargement...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = user.role === 'ROLE_ADMIN';
  const isTresorier = user.role === 'ROLE_TRESORIER';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <CmciLogo className="scale-75" />
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {isAdmin ? 'Administrateur' : 'Trésorier'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Se déconnecter"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Sélection du Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choisissez le dashboard auquel vous souhaitez accéder selon vos besoins de gestion.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Dashboard Admin/Trésorier */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-blue-200 transition-all duration-200 hover:shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Dashboard {isAdmin ? 'Administrateur' : 'Trésorier'}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {isAdmin 
                  ? 'Accédez aux fonctionnalités complètes d\'administration, gestion des utilisateurs, paramètres système et rapports avancés.'
                  : 'Gérez les aspects financiers, cotisations, paiements et rapports trésorerie de la plateforme.'
                }
              </p>
              
              <button
                onClick={() => navigateToDashboard(isAdmin ? 'admin' : 'tresorier')}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <span>Accéder au Dashboard {isAdmin ? 'Admin' : 'Trésorier'}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Dashboard Utilisateur */}
          <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-transparent hover:border-green-200 transition-all duration-200 hover:shadow-xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Point focal – Enregistrement
              </h3>
              
              <p className="text-gray-600 mb-6">
                Consultez votre profil personnel, vos inscriptions aux camps, historique des paiements et informations générales.
              </p>
              
              <button
                onClick={() => navigateToDashboard('user')}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2 font-medium"
              >
                <span>Accéder au Dashboard Utilisateur</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-semibold text-sm">i</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Information importante
              </h4>
              <p className="text-sm text-blue-700">
                Vous pouvez basculer entre les différents dashboards à tout moment selon vos besoins. 
                Chaque dashboard offre des fonctionnalités spécifiques adaptées à votre rôle et aux tâches à accomplir.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
           