'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronDown, 
  Phone, 
  Globe, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Shield
} from 'lucide-react';
import { parseAuthError } from '../../lib/auth-utils';
import axiosInstance from '../request/reques';

// Types pour les erreurs
interface FormErrors {
  general?: string;
  nomComplet?: string;
  country?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

// Type pour les pays
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

// Interface pour la validation du mot de passe
interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
}

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [nomComplet, setNomComplet] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Liste des pays avec leurs indicatifs
  const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF', dialCode: '+93' },
    { name: 'Afrique du Sud', code: 'ZA', dialCode: '+27' },
    { name: 'Algérie', code: 'DZ', dialCode: '+213' },
    { name: 'Allemagne', code: 'DE', dialCode: '+49' },
    { name: 'Canada', code: 'CA', dialCode: '+1' },
    { name: 'Cameroun', code: 'CM', dialCode: '+237' },
    { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225' },
    { name: 'Chine', code: 'CN', dialCode: '+86' },
    { name: 'Espagne', code: 'ES', dialCode: '+34' },
    { name: 'États-Unis', code: 'US', dialCode: '+1' },
    { name: 'France', code: 'FR', dialCode: '+33' },
    { name: 'Gabon', code: 'GA', dialCode: '+241' },
    { name: 'Ghana', code: 'GH', dialCode: '+233' },
    { name: 'Guinée', code: 'GN', dialCode: '+224' },
    { name: 'Italie', code: 'IT', dialCode: '+39' },
    { name: 'Mali', code: 'ML', dialCode: '+223' },
    { name: 'Maroc', code: 'MA', dialCode: '+212' },
    { name: 'Niger', code: 'NE', dialCode: '+227' },
    { name: 'Nigeria', code: 'NG', dialCode: '+234' },
    { name: 'Royaume-Uni', code: 'GB', dialCode: '+44' },
    { name: 'Sénégal', code: 'SN', dialCode: '+221' },
    { name: 'Suisse', code: 'CH', dialCode: '+41' },
    { name: 'Tchad', code: 'TD', dialCode: '+235' },
    { name: 'Togo', code: 'TG', dialCode: '+228' },
    { name: 'Tunisie', code: 'TN', dialCode: '+216' }
  ];

  // Trouver le pays sélectionné
  const getSelectedCountryData = (): Country | undefined => {
    return countries.find(country => country.code === selectedCountry);
  };

  const handleCountrySelect = (countryCode: string): void => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setCountrySearch('');
    setErrors(prev => ({ ...prev, country: '' }));
  };

  // Filtrer les pays selon la recherche
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dialCode.includes(countrySearch)
  );

  // Fonction pour évaluer la force du mot de passe
  const evaluatePasswordStrength = (password: string): PasswordStrength => {
    return {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password)
    };
  };

  const passwordStrength = evaluatePasswordStrength(newPassword);
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation nom complet
    if (!nomComplet.trim()) {
      newErrors.nomComplet = 'Le nom complet est requis';
    } else if (nomComplet.trim().length < 2) {
      newErrors.nomComplet = 'Le nom complet doit contenir au moins 2 caractères';
    }

    // Validation pays
    if (!getSelectedCountryData()) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    // Validation téléphone
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Le numéro doit contenir uniquement des chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword) {
      newErrors.password = 'Le nouveau mot de passe est requis';
    } else if (!isPasswordStrong) {
      newErrors.password = 'Le mot de passe ne respecte pas tous les critères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyIdentity = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const selectedCountryData = getSelectedCountryData();
      
      // Construire les données de vérification
      const verificationData = {
        username: nomComplet.trim(),
        telephone: `${selectedCountryData!.dialCode} ${phoneNumber}`,
        pays: selectedCountryData!.name
      };

      console.log('Envoi des données de vérification:', verificationData);

      // Appel à l'endpoint de vérification
      const response = await axiosInstance.post('/auth/verify-identity', verificationData);
      
      // La réponse doit contenir un booléen indiquant si la vérification est réussie
      const isVerificationSuccessful = response.data === true || response.data.success === true;
      
      if (isVerificationSuccessful) {
        console.log('Vérification réussie - passage à l\'étape 2');
        setIsVerified(true);
        setStep(2);
      } else {
        // Si la vérification échoue
        setErrors({ 
          general: 'Vérification échouée. Les informations fournies ne correspondent à aucun compte.' 
        });
      }
      
    } catch (error: any) {
      console.error('Erreur de vérification:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      
      // Messages d'erreur spécifiques selon le type d'erreur
      let errorMessage = authError.message;
      
      if (authError.status === 404) {
        errorMessage = 'Aucun compte trouvé avec ces informations.';
      } else if (authError.status === 400) {
        errorMessage = 'Informations de vérification invalides.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const selectedCountryData = getSelectedCountryData();
      
      const resetData = {
        username: nomComplet.trim(),
        telephone: `${selectedCountryData!.dialCode} ${phoneNumber}`,
        pays: selectedCountryData!.name,
        password: newPassword
      };

      console.log('Envoi des données de réinitialisation:', resetData);

      // Appel à l'endpoint de réinitialisation de mot de passe
      const response = await axiosInstance.post('/auth/reset-password', resetData);
      
      // Vérifier le succès de la réinitialisation
      const isResetSuccessful = response.data === true || response.data.success === true;
      
      if (isResetSuccessful) {
        console.log('Réinitialisation réussie - redirection vers login');
        
        // Redirection vers la page de connexion avec un message de succès
        router.push('/auth/login?passwordReset=true');
      } else {
        setErrors({ general: 'Échec de la réinitialisation du mot de passe.' });
      }
      
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      setErrors({ general: authError.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = (): void => {
    setStep(1);
    setIsVerified(false);
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      {/* Header avec indicateur d'étape */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4 w-full">
          <div className="flex items-center w-full max-w-md">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 1 
                ? 'bg-myibc-blue text-white' 
                : isVerified 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {isVerified ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`flex-1 h-2 mx-4 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 2 
                ? 'bg-myibc-blue text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>
        
        {/* Bouton retour positionné séparément */}
        {step === 2 && (
          <div className="flex justify-start mb-4">
            <button
              onClick={handleBackToStep1}
              className="flex items-center text-myibc-blue hover:text-myibc-blue/80 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </button>
          </div>
        )}
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-myibc-blue">
            {step === 1 ? 'Vérification d\'identité' : 'Nouveau mot de passe'}
          </h3>
          <p className="text-sm text-myibc-graytext mt-1">
            {step === 1 
              ? 'Confirmez votre identité pour réinitialiser votre mot de passe'
              : 'Choisissez un nouveau mot de passe sécurisé'
            }
          </p>
        </div>
      </div>

      {/* Messages d'erreur généraux */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Étape 1: Vérification d'identité */}
      {step === 1 && (
        <form onSubmit={handleVerifyIdentity} className="space-y-6">
          {/* Nom complet */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nom complet
            </label>
            <input
              type="text"
              value={nomComplet}
              onChange={(e) => {
                setNomComplet(e.target.value);
                if (errors.nomComplet) setErrors(prev => ({ ...prev, nomComplet: '' }));
              }}
              placeholder="Votre nom complet"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                errors.nomComplet ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nomComplet && (
              <p className="mt-1 text-sm text-red-600">{errors.nomComplet}</p>
            )}
          </div>

          {/* Sélection du pays */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <Globe className="w-4 h-4 inline mr-1" />
              Pays de provenance
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue bg-white text-left flex items-center justify-between hover:border-myibc-blue transition-colors ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <span className={selectedCountryData ? 'text-myibc-blue' : 'text-myibc-graytext'}>
                  {selectedCountryData ? selectedCountryData.name : 'Sélectionnez un pays'}
                </span>
                <ChevronDown className={`w-5 h-5 text-myibc-graytext transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Rechercher un pays..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-myibc-blue focus:border-myibc-blue"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country.code)}
                          className="w-full px-4 py-3 text-left hover:bg-myibc-blue/5 focus:bg-myibc-blue/10 focus:outline-none text-myibc-blue flex justify-between items-center"
                        >
                          <span>{country.name}</span>
                          <span className="text-sm text-myibc-graytext">{country.dialCode}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-myibc-graytext text-sm">
                        Aucun pays trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* Champ numéro de téléphone */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Numéro de téléphone
            </label>
            <div className="flex">
              {selectedCountryData && (
                <div className="flex items-center px-4 py-3 bg-myibc-light border border-r-0 border-gray-300 rounded-l-lg text-myibc-blue font-medium">
                  {selectedCountryData.dialCode}
                </div>
              )}
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  if (errors.phoneNumber) setErrors(prev => ({ ...prev, phoneNumber: '' }));
                }}
                placeholder="Votre numéro"
                className={`flex-1 px-4 py-3 border shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  selectedCountryData ? 'rounded-r-lg' : 'rounded-lg'
                } ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Aperçu du numéro complet */}
          {selectedCountryData && phoneNumber && (
            <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-3">
              <p className="text-sm text-myibc-blue">
                <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{phoneNumber}
              </p>
            </div>
          )}

          {/* Bouton de vérification */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Vérification...
              </div>
            ) : (
              'Vérifier mon identité'
            )}
          </button>
        </form>
      )}

      {/* Étape 2: Nouveau mot de passe */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Confirmation de vérification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-sm text-green-800">
                Identité vérifiée avec succès ! Vous pouvez maintenant définir un nouveau mot de passe.
              </p>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Votre nouveau mot de passe"
                className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-myibc-graytext hover:text-myibc-blue"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}

            {/* Indicateur de force du mot de passe */}
            {newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-myibc-blue mb-2">Critères du mot de passe :</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    {passwordStrength.hasMinLength ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordStrength.hasMinLength ? 'text-green-700' : 'text-red-600'}>
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordStrength.hasUpperCase ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordStrength.hasUpperCase ? 'text-green-700' : 'text-red-600'}>
                      Une lettre majuscule
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordStrength.hasLowerCase ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordStrength.hasLowerCase ? 'text-green-700' : 'text-red-600'}>
                      Une lettre minuscule
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordStrength.hasNumbers ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordStrength.hasNumbers ? 'text-green-700' : 'text-red-600'}>
                      Un chiffre
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation du nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              Confirmation du nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirmez votre nouveau mot de passe"
                className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-myibc-graytext hover:text-myibc-blue"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
            )}
            {confirmPassword && newPassword === confirmPassword && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Bouton de réinitialisation */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Réinitialisation...
              </div>
            ) : (
              'Réinitialiser le mot de passe'
            )}
          </button>
        </form>
      )}

      {/* Lien de retour vers la connexion */}
      <div className="text-center pt-6 border-t border-gray-200 mt-8">
        <Link 
          href="/auth/login"
          className="inline-flex items-center text-sm text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};
