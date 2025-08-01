'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Phone, Globe, User, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';
import Image from 'next/image';

// Types pour les erreurs
interface FormErrors {
  general?: string;
  fullName?: string;
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

const RegisterPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

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

  // Validation du mot de passe
  const validatePassword = (pwd: string): string[] => {
    const errors = [];
    if (pwd.length < 8) errors.push('Au moins 8 caractères');
    if (!/[A-Z]/.test(pwd)) errors.push('Une majuscule');
    if (!/[a-z]/.test(pwd)) errors.push('Une minuscule');
    if (!/[0-9]/.test(pwd)) errors.push('Un chiffre');
    return errors;
  };

  const passwordErrors = validatePassword(password);
  const isPasswordValid = passwordErrors.length === 0;

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du nom complet
    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation du pays
    if (!getSelectedCountryData()) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    // Validation du numéro de téléphone
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Le numéro doit contenir uniquement des chiffres';
    } else if (phoneNumber.length < 8) {
      newErrors.phoneNumber = 'Le numéro doit contenir au moins 8 chiffres';
    }

    // Validation du mot de passe
    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!isPasswordValid) {
      newErrors.password = 'Le mot de passe ne respecte pas les critères requis';
    }

    // Validation de la confirmation du mot de passe
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation des conditions d'utilisation
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

    try {
      const selectedCountryData = getSelectedCountryData();
      
      if (!selectedCountryData) {
        setErrors({ general: 'Erreur de sélection du pays' });
        return;
      }
      
      const registerData = {
        fullName: fullName.trim(),
        phoneNumber: selectedCountryData.dialCode + phoneNumber,
        country: selectedCountryData.name,
        countryCode: selectedCountryData.code,
        dialCode: selectedCountryData.dialCode,
        password
      };

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Register data:', registerData);
      
      // Redirection vers la page de connexion avec message de succès
      router.push('/auth/login?registered=true');
      
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      setErrors({ general: 'Échec de l\'inscription. Veuillez réessayer.' });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo et retour */}
        <div className="text-center mb-8">
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center text-myibc-graytext hover:text-myibc-blue mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à l'accueil
          </button>
          <div className="mb-6">
            <Image
              src="/CMCI.png"
              alt="CMCI Logo"
              width={120}
              height={120}
              className="object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-myibc-blue mb-2">Créer un compte</h1>
          <p className="text-myibc-graytext">Rejoignez la communauté MyIBC</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
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
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors(prev => ({ ...prev, fullName: '' }));
                }}
                placeholder="Votre nom complet"
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
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

            {/* Affichage de l'indicatif */}
            {selectedCountryData && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Indicatif pays:</strong> {selectedCountryData.dialCode}
                </p>
              </div>
            )}

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
              
              {/* Critères du mot de passe */}
              {password && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-myibc-blue font-medium">Critères du mot de passe :</p>
                  {['Au moins 8 caractères', 'Une majuscule', 'Une minuscule', 'Un chiffre'].map((criteria, index) => {
                    const checks = [
                      password.length >= 8,
                      /[A-Z]/.test(password),
                      /[a-z]/.test(password),
                      /[0-9]/.test(password)
                    ];
                    return (
                      <div key={index} className="flex items-center text-xs">
                        <CheckCircle className={`w-3 h-3 mr-1 ${checks[index] ? 'text-myibc-gold' : 'text-gray-300'}`} />
                        <span className={checks[index] ? 'text-myibc-blue' : 'text-myibc-graytext'}>
                          {criteria}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirmation du mot de passe */}
            <div>
              <label className="block text-sm font-medium text-myibc-blue mb-2">
                <Lock className="w-4 h-4 inline mr-1" />
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
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
            </div>

            {/* Conditions d'utilisation */}
            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                  }}
                  className="mt-1 mr-3 h-4 w-4 text-myibc-blue focus:ring-myibc-blue border-gray-300 rounded"
                />
                <span className="text-sm text-myibc-graytext">
                  J'accepte les{' '}
                  <Link href="/terms" className="text-myibc-blue hover:text-myibc-blue/80 underline">
                    conditions d'utilisation
                  </Link>
                  {' '}et la{' '}
                  <Link href="/privacy" className="text-myibc-blue hover:text-myibc-blue/80 underline">
                    politique de confidentialité
                  </Link>
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
              <p className="text-sm text-myibc-graytext">
                Vous avez déjà un compte ?{' '}
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
      </div>
    </div>
  );
};

export default RegisterPage;

