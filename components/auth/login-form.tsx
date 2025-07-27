'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Phone, Globe, User, Lock, Eye, EyeOff } from 'lucide-react';
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
  password?: string;
  country?: string;
  phoneNumber?: string;
  myibcCode?: string;
}

// Type pour les pays
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export const LoginForm = () => {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'code'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [myibcCode, setMyibcCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
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

  const handleLoginMethodChange = (method: 'phone' | 'code'): void => {
    setLoginMethod(method);
    setSelectedCountry('');
    setPhoneNumber('');
    setMyibcCode('');
    setPassword('');
    setCountrySearch('');
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    if (loginMethod === 'phone') {
      if (!getSelectedCountryData()) {
        newErrors.country = 'Veuillez sélectionner un pays';
      }
      if (!phoneNumber.trim()) {
        newErrors.phoneNumber = 'Le numéro de téléphone est requis';
      } else if (!/^\d+$/.test(phoneNumber)) {
        newErrors.phoneNumber = 'Le numéro doit contenir uniquement des chiffres';
      }
    } else {
      if (!myibcCode.trim()) {
        newErrors.myibcCode = 'Le code MyIBC est requis';
      }
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
      let response;
      
      if (loginMethod === 'phone') {
        // Connexion par téléphone + mot de passe
        const selectedCountryData = getSelectedCountryData();
        const fullPhoneNumber = selectedCountryData ? 
          `${selectedCountryData.dialCode} ${phoneNumber}` : phoneNumber;
        
        response = await axiosInstance.post('/auth/login/telephone', {
          telephone: fullPhoneNumber,
          password,
          pays: selectedCountryData?.name
        });
      } else {
        // Connexion par code MyIBC + mot de passe
        response = await axiosInstance.post('/auth/login/code', {
          code: myibcCode.trim(),
          password
        });
      }

      // Validation et normalisation de la réponse en utilisant les utilitaires
      const authData = validateAuthResponse(response.data);

      // Sauvegarde sécurisée en utilisant les utilitaires (qui gèrent automatiquement le stockage par rôle)
      saveAuthData(authData);

      // Redirection basée sur le rôle en utilisant les utilitaires
      const redirectPath = getRedirectPath(authData.role);

      console.log(`Connexion réussie - Rôle: ${authData.role}, Redirection vers: ${redirectPath}`);
      
      // Redirection
      router.push(redirectPath);
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
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

      {/* Sélection de la méthode de connexion */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-myibc-blue mb-3">
          Méthode de connexion
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLoginMethodChange('phone')}
            className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
              loginMethod === 'phone'
                ? 'bg-myibc-blue text-white border-myibc-blue shadow-md'
                : 'bg-white text-myibc-graytext border-gray-300 hover:border-myibc-blue hover:text-myibc-blue'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Téléphone
          </button>
          <button
            type="button"
            onClick={() => handleLoginMethodChange('code')}
            className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
              loginMethod === 'code'
                ? 'bg-myibc-blue text-white border-myibc-blue shadow-md'
                : 'bg-white text-myibc-graytext border-gray-300 hover:border-myibc-blue hover:text-myibc-blue'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Code MyIBC
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Connexion par numéro de téléphone */}
        {loginMethod === 'phone' && (
          <>
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
              <p className="text-xs text-myibc-graytext mt-1">
                Saisissez votre numéro sans l'indicatif pays
              </p>
            </div>

            {/* Aperçu du numéro complet */}
            {selectedCountryData && phoneNumber && (
              <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-3">
                <p className="text-sm text-myibc-blue">
                  <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{phoneNumber}
                </p>
              </div>
            )}
          </>
        )}

        {/* Connexion par code MyIBC */}
        {loginMethod === 'code' && (
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Code d'identification MyIBC
            </label>
            <input
              type="text"
              value={myibcCode}
              onChange={(e) => {
                setMyibcCode(e.target.value);
                if (errors.myibcCode) setErrors(prev => ({ ...prev, myibcCode: '' }));
              }}
              placeholder="Votre code MyIBC"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                errors.myibcCode ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.myibcCode && (
              <p className="mt-1 text-sm text-red-600">{errors.myibcCode}</p>
            )}
            <p className="text-xs text-myibc-graytext mt-1">
              Code fourni lors de la création de votre compte
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
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
              }}
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
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Connexion...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Mot de passe oublié */}
        <div className="text-center">
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Lien vers création de compte */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-myibc-graytext">
            Pas encore de compte ?{' '}
            <Link 
              href="/auth/register"
              className="text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
