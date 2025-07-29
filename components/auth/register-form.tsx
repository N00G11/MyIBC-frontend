'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Phone, Globe, User, Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import axiosInstance from '@/components/request/reques';
import { 
  parseAuthError, 
  validateAuthResponse, 
  saveAuthData, 
  getRedirectPath 
} from '@/lib/auth-utils';

// Types pour les erreurs
interface FormErrors {
  general?: string;
  nomComplet?: string;
  country?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
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

export const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nomComplet: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Liste des pays avec leurs indicatifs
  const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF', dialCode: '+93' },
    { name: 'Afrique du Sud', code: 'ZA', dialCode: '+27' },
    { name: 'Algérie', code: 'DZ', dialCode: '+213' },
    { name: 'Allemagne', code: 'DE', dialCode: '+49' },
    { name: 'Canada', code: 'CA', dialCode: '+1' },
    { name: 'Cameroun', code: 'CM', dialCode: '+237' },
    { name: 'Chine', code: 'CN', dialCode: '+86' },
    { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225' },
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

  const passwordStrength = evaluatePasswordStrength(formData.password);
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  const handleInputChange = (field: keyof typeof formData, value: string): void => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Effacer l'erreur du champ modifié
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation nom complet
    if (!formData.nomComplet.trim()) {
      newErrors.nomComplet = 'Le nom complet est requis';
    } else if (formData.nomComplet.trim().length < 2) {
      newErrors.nomComplet = 'Le nom complet doit contenir au moins 2 caractères';
    }

    // Validation pays
    if (!getSelectedCountryData()) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    // Validation téléphone
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^\d+$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Le numéro doit contenir uniquement des chiffres';
    }

    // Validation mot de passe
    if (!formData.password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!isPasswordStrong) {
      newErrors.password = 'Le mot de passe ne respecte pas tous les critères';
    }

    // Validation confirmation mot de passe
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation acceptation des conditions
    if (!acceptTerms) {
      newErrors.terms = 'Vous devez accepter les conditions d\'utilisation';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const selectedCountryData = getSelectedCountryData();
      
      const username = formData.nomComplet.trim();
      const telephone =  `${selectedCountryData!.dialCode} ${formData.phoneNumber}`
      
      const registrationData = {
        username,
        telephone,
        pays: selectedCountryData!.name,
        password: formData.password
      };

      console.log('Envoi des données d\'inscription:', registrationData);

      // Appel à l'API d'inscription
      const response = await axiosInstance.post('/auth/register', registrationData);

      // Validation et normalisation de la réponse en utilisant les utilitaires
      const authData = validateAuthResponse(response.data);

      // Pour l'inscription, le rôle est toujours ROLE_UTILISATEUR
      // Sauvegarde sécurisée en utilisant les utilitaires
      saveAuthData(authData);

      console.log(`Inscription réussie - Rôle: ${authData.role}, Code stocké dans localStorage`);

      // Redirection basée sur le rôle (devrait être ROLE_UTILISATEUR pour l'inscription)
      const redirectPath = getRedirectPath(authData.role);
      
      // Redirection
      router.push(redirectPath);
      
    } catch (error: any) {
      console.error('Erreur d\'inscription:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      setErrors({ general: authError.message });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      {/* Messages d'erreur généraux */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom complet */}
        <div>
          <label className="block text-sm font-medium text-myibc-blue mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Nom complet
          </label>
          <input
            type="text"
            value={formData.nomComplet}
            onChange={(e) => handleInputChange('nomComplet', e.target.value)}
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
              <div className="flex items-center px-4 py-3 bg-blue-50 border border-r-0 border-gray-300 rounded-l-lg text-myibc-blue font-medium">
                {selectedCountryData.dialCode}
              </div>
            )}
            <input
              type="tel"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
              placeholder="Votre numéro"
              className={`flex-1 px-4 py-3 border shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                selectedCountryData ? 'rounded-r-lg' : 'rounded-lg'
              } ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Saisissez votre numéro sans l'indicatif pays
          </p>
        </div>

        {/* Aperçu du numéro complet */}
        {selectedCountryData && formData.phoneNumber && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-myibc-blue">
              <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{formData.phoneNumber}
            </p>
          </div>
        )}

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-myibc-blue mb-2">
            <Lock className="w-4 h-4 inline mr-1" />
            Mot de passe
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Votre mot de passe"
              className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                errors.password ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-myibc-graytext hover:text-myibc-blue"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}

          {/* Indicateur de force du mot de passe */}
          {formData.password && (
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

        {/* Confirmation du mot de passe */}
        <div>
          <label className="block text-sm font-medium text-myibc-blue mb-2">
            Confirmation du mot de passe
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              placeholder="Confirmez votre mot de passe"
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
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="mt-1 text-sm text-green-600 flex items-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Les mots de passe correspondent
            </p>
          )}
        </div>

        {/* Acceptation des conditions */}
        <div>
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => {
                setAcceptTerms(e.target.checked);
                if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
              }}
              className="mt-1 h-4 w-4 text-myibc-blue focus:ring-myibc-blue border-gray-300 rounded"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              J'accepte les{' '}
              <a href="#" className="text-myibc-blue hover:underline font-medium">
                conditions d'utilisation
              </a>{' '}
              et la{' '}
              <a href="#" className="text-myibc-blue hover:underline font-medium">
                politique de confidentialité
              </a>{' '}
              de MyIBC.
            </span>
          </label>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
          )}
        </div>

        {/* Bouton d'inscription */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Création du compte...
            </div>
          ) : (
            'Créer mon compte'
          )}
        </button>

        {/* Lien vers connexion */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link 
              href="/auth/login"
              className="text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};