'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Phone, Globe, KeyRound, User, ArrowLeft, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { CmciLogo } from "@/components/cmci-logo";

// Types pour les erreurs
interface FormErrors {
  general?: string;
  fullName?: string;
  country?: string;
  phoneNumber?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Type pour les pays
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Liste complète des pays avec leurs indicatifs
  const countries: Country[] = [
    { name: 'Afghanistan', code: 'AF', dialCode: '+93' },
    { name: 'Afrique du Sud', code: 'ZA', dialCode: '+27' },
    { name: 'Albanie', code: 'AL', dialCode: '+355' },
    { name: 'Algérie', code: 'DZ', dialCode: '+213' },
    { name: 'Allemagne', code: 'DE', dialCode: '+49' },
    { name: 'Andorre', code: 'AD', dialCode: '+376' },
    { name: 'Angola', code: 'AO', dialCode: '+244' },
    { name: 'Arabie Saoudite', code: 'SA', dialCode: '+966' },
    { name: 'Argentine', code: 'AR', dialCode: '+54' },
    { name: 'Arménie', code: 'AM', dialCode: '+374' },
    { name: 'Australie', code: 'AU', dialCode: '+61' },
    { name: 'Autriche', code: 'AT', dialCode: '+43' },
    { name: 'Azerbaïdjan', code: 'AZ', dialCode: '+994' },
    { name: 'Bahamas', code: 'BS', dialCode: '+1242' },
    { name: 'Bahreïn', code: 'BH', dialCode: '+973' },
    { name: 'Bangladesh', code: 'BD', dialCode: '+880' },
    { name: 'Barbade', code: 'BB', dialCode: '+1246' },
    { name: 'Belgique', code: 'BE', dialCode: '+32' },
    { name: 'Belize', code: 'BZ', dialCode: '+501' },
    { name: 'Bénin', code: 'BJ', dialCode: '+229' },
    { name: 'Bolivie', code: 'BO', dialCode: '+591' },
    { name: 'Brésil', code: 'BR', dialCode: '+55' },
    { name: 'Bulgarie', code: 'BG', dialCode: '+359' },
    { name: 'Burkina Faso', code: 'BF', dialCode: '+226' },
    { name: 'Burundi', code: 'BI', dialCode: '+257' },
    { name: 'Cambodge', code: 'KH', dialCode: '+855' },
    { name: 'Cameroun', code: 'CM', dialCode: '+237' },
    { name: 'Canada', code: 'CA', dialCode: '+1' },
    { name: 'Cap-Vert', code: 'CV', dialCode: '+238' },
    { name: 'Chili', code: 'CL', dialCode: '+56' },
    { name: 'Chine', code: 'CN', dialCode: '+86' },
    { name: 'Chypre', code: 'CY', dialCode: '+357' },
    { name: 'Colombie', code: 'CO', dialCode: '+57' },
    { name: 'Comores', code: 'KM', dialCode: '+269' },
    { name: 'Congo', code: 'CG', dialCode: '+242' },
    { name: 'Corée du Sud', code: 'KR', dialCode: '+82' },
    { name: 'Costa Rica', code: 'CR', dialCode: '+506' },
    { name: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225' },
    { name: 'Croatie', code: 'HR', dialCode: '+385' },
    { name: 'Cuba', code: 'CU', dialCode: '+53' },
    { name: 'Danemark', code: 'DK', dialCode: '+45' },
    { name: 'Djibouti', code: 'DJ', dialCode: '+253' },
    { name: 'Égypte', code: 'EG', dialCode: '+20' },
    { name: 'Émirats Arabes Unis', code: 'AE', dialCode: '+971' },
    { name: 'Équateur', code: 'EC', dialCode: '+593' },
    { name: 'Espagne', code: 'ES', dialCode: '+34' },
    { name: 'Estonie', code: 'EE', dialCode: '+372' },
    { name: 'États-Unis', code: 'US', dialCode: '+1' },
    { name: 'Éthiopie', code: 'ET', dialCode: '+251' },
    { name: 'Finlande', code: 'FI', dialCode: '+358' },
    { name: 'France', code: 'FR', dialCode: '+33' },
    { name: 'Gabon', code: 'GA', dialCode: '+241' },
    { name: 'Gambie', code: 'GM', dialCode: '+220' },
    { name: 'Géorgie', code: 'GE', dialCode: '+995' },
    { name: 'Ghana', code: 'GH', dialCode: '+233' },
    { name: 'Grèce', code: 'GR', dialCode: '+30' },
    { name: 'Guatemala', code: 'GT', dialCode: '+502' },
    { name: 'Guinée', code: 'GN', dialCode: '+224' },
    { name: 'Haïti', code: 'HT', dialCode: '+509' },
    { name: 'Honduras', code: 'HN', dialCode: '+504' },
    { name: 'Hongrie', code: 'HU', dialCode: '+36' },
    { name: 'Inde', code: 'IN', dialCode: '+91' },
    { name: 'Indonésie', code: 'ID', dialCode: '+62' },
    { name: 'Irak', code: 'IQ', dialCode: '+964' },
    { name: 'Iran', code: 'IR', dialCode: '+98' },
    { name: 'Irlande', code: 'IE', dialCode: '+353' },
    { name: 'Islande', code: 'IS', dialCode: '+354' },
    { name: 'Israël', code: 'IL', dialCode: '+972' },
    { name: 'Italie', code: 'IT', dialCode: '+39' },
    { name: 'Jamaïque', code: 'JM', dialCode: '+1876' },
    { name: 'Japon', code: 'JP', dialCode: '+81' },
    { name: 'Jordanie', code: 'JO', dialCode: '+962' },
    { name: 'Kazakhstan', code: 'KZ', dialCode: '+7' },
    { name: 'Kenya', code: 'KE', dialCode: '+254' },
    { name: 'Koweït', code: 'KW', dialCode: '+965' },
    { name: 'Laos', code: 'LA', dialCode: '+856' },
    { name: 'Lettonie', code: 'LV', dialCode: '+371' },
    { name: 'Liban', code: 'LB', dialCode: '+961' },
    { name: 'Libéria', code: 'LR', dialCode: '+231' },
    { name: 'Libye', code: 'LY', dialCode: '+218' },
    { name: 'Lituanie', code: 'LT', dialCode: '+370' },
    { name: 'Luxembourg', code: 'LU', dialCode: '+352' },
    { name: 'Madagascar', code: 'MG', dialCode: '+261' },
    { name: 'Malaisie', code: 'MY', dialCode: '+60' },
    { name: 'Malawi', code: 'MW', dialCode: '+265' },
    { name: 'Mali', code: 'ML', dialCode: '+223' },
    { name: 'Malte', code: 'MT', dialCode: '+356' },
    { name: 'Maroc', code: 'MA', dialCode: '+212' },
    { name: 'Maurice', code: 'MU', dialCode: '+230' },
    { name: 'Mauritanie', code: 'MR', dialCode: '+222' },
    { name: 'Mexique', code: 'MX', dialCode: '+52' },
    { name: 'Moldavie', code: 'MD', dialCode: '+373' },
    { name: 'Monaco', code: 'MC', dialCode: '+377' },
    { name: 'Mongolie', code: 'MN', dialCode: '+976' },
    { name: 'Mozambique', code: 'MZ', dialCode: '+258' },
    { name: 'Myanmar', code: 'MM', dialCode: '+95' },
    { name: 'Namibie', code: 'NA', dialCode: '+264' },
    { name: 'Népal', code: 'NP', dialCode: '+977' },
    { name: 'Nicaragua', code: 'NI', dialCode: '+505' },
    { name: 'Niger', code: 'NE', dialCode: '+227' },
    { name: 'Nigeria', code: 'NG', dialCode: '+234' },
    { name: 'Norvège', code: 'NO', dialCode: '+47' },
    { name: 'Nouvelle-Zélande', code: 'NZ', dialCode: '+64' },
    { name: 'Oman', code: 'OM', dialCode: '+968' },
    { name: 'Ouganda', code: 'UG', dialCode: '+256' },
    { name: 'Pakistan', code: 'PK', dialCode: '+92' },
    { name: 'Panama', code: 'PA', dialCode: '+507' },
    { name: 'Paraguay', code: 'PY', dialCode: '+595' },
    { name: 'Pays-Bas', code: 'NL', dialCode: '+31' },
    { name: 'Pérou', code: 'PE', dialCode: '+51' },
    { name: 'Philippines', code: 'PH', dialCode: '+63' },
    { name: 'Pologne', code: 'PL', dialCode: '+48' },
    { name: 'Portugal', code: 'PT', dialCode: '+351' },
    { name: 'Qatar', code: 'QA', dialCode: '+974' },
    { name: 'République Tchèque', code: 'CZ', dialCode: '+420' },
    { name: 'Roumanie', code: 'RO', dialCode: '+40' },
    { name: 'Royaume-Uni', code: 'GB', dialCode: '+44' },
    { name: 'Russie', code: 'RU', dialCode: '+7' },
    { name: 'Rwanda', code: 'RW', dialCode: '+250' },
    { name: 'Salvador', code: 'SV', dialCode: '+503' },
    { name: 'Sénégal', code: 'SN', dialCode: '+221' },
    { name: 'Serbie', code: 'RS', dialCode: '+381' },
    { name: 'Singapour', code: 'SG', dialCode: '+65' },
    { name: 'Slovaquie', code: 'SK', dialCode: '+421' },
    { name: 'Slovénie', code: 'SI', dialCode: '+386' },
    { name: 'Somalie', code: 'SO', dialCode: '+252' },
    { name: 'Soudan', code: 'SD', dialCode: '+249' },
    { name: 'Sri Lanka', code: 'LK', dialCode: '+94' },
    { name: 'Suède', code: 'SE', dialCode: '+46' },
    { name: 'Suisse', code: 'CH', dialCode: '+41' },
    { name: 'Suriname', code: 'SR', dialCode: '+597' },
    { name: 'Syrie', code: 'SY', dialCode: '+963' },
    { name: 'Tadjikistan', code: 'TJ', dialCode: '+992' },
    { name: 'Tanzanie', code: 'TZ', dialCode: '+255' },
    { name: 'Tchad', code: 'TD', dialCode: '+235' },
    { name: 'Thaïlande', code: 'TH', dialCode: '+66' },
    { name: 'Togo', code: 'TG', dialCode: '+228' },
    { name: 'Trinité-et-Tobago', code: 'TT', dialCode: '+1868' },
    { name: 'Tunisie', code: 'TN', dialCode: '+216' },
    { name: 'Turkménistan', code: 'TM', dialCode: '+993' },
    { name: 'Turquie', code: 'TR', dialCode: '+90' },
    { name: 'Ukraine', code: 'UA', dialCode: '+380' },
    { name: 'Uruguay', code: 'UY', dialCode: '+598' },
    { name: 'Venezuela', code: 'VE', dialCode: '+58' },
    { name: 'Vietnam', code: 'VN', dialCode: '+84' },
    { name: 'Yémen', code: 'YE', dialCode: '+967' },
    { name: 'Zambie', code: 'ZM', dialCode: '+260' },
    { name: 'Zimbabwe', code: 'ZW', dialCode: '+263' }
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

  const validateIdentityForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Le nom complet est requis';
    }

    if (!getSelectedCountryData()) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    } else if (!/^\d+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Le numéro doit contenir uniquement des chiffres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!newPassword.trim()) {
      newErrors.newPassword = 'Le nouveau mot de passe est requis';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Le mot de passe doit contenir au moins 8 caractères';
    } else if (!/^[a-zA-Z0-9]+$/.test(newPassword)) {
      newErrors.newPassword = 'Le mot de passe doit contenir uniquement des caractères alphanumériques';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Veuillez confirmer votre mot de passe';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyIdentity = async (): Promise<void> => {
    if (!validateIdentityForm()) {
      return;
    }

    setIsVerifying(true);
    setErrors({});

    try {
      // Simulation d'une vérification d'identité
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsVerified(true);
    } catch (error) {
      console.error('Erreur de vérification:', error);
      setErrors({ general: 'Erreur lors de la vérification. Veuillez réessayer.' });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!isVerified) {
      setErrors({ general: 'Veuillez d\'abord vérifier votre identité' });
      return;
    }

    if (!validatePasswordForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const selectedCountryData = getSelectedCountryData();
      
      const resetData = {
        fullName,
        phoneNumber: selectedCountryData!.dialCode + phoneNumber,
        country: selectedCountryData!.name,
        newPassword
      };

      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Reset password data:', resetData);
      
      // Redirection vers la page de connexion avec un message de succès
      router.push('/auth/login?message=password-reset-success');
      
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      setErrors({ general: 'Erreur lors de la réinitialisation. Veuillez réessayer.' });
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
            onClick={() => router.push('/auth/login')}
            className="inline-flex items-center text-myibc-graytext hover:text-myibc-blue mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Retour à la connexion
          </button>
          <div className="mb-6">
            <CmciLogo className="h-16 w-auto mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-myibc-blue mb-2 flex items-center justify-center gap-2">
            <KeyRound className="w-8 h-8" />
            Réinitialiser le mot de passe
          </h1>
          <p className="text-myibc-graytext">
            Suivez les étapes pour récupérer l'accès à votre compte
          </p>
        </div>

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
              <label className={`block text-sm font-medium mb-2 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-blue'}`}>
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
                disabled={isVerified}
                className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  isVerified 
                    ? 'bg-gray-100 text-myibc-graytext cursor-not-allowed' 
                    : 'bg-white'
                } ${errors.fullName ? 'border-red-300' : 'border-gray-300'}`}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
              )}
              <p className={`text-xs mt-1 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-graytext'}`}>
                Nom utilisé lors de la création de votre compte
              </p>
            </div>

            {/* Sélection du pays */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-blue'}`}>
                <Globe className="w-4 h-4 inline mr-1" />
                Pays de provenance
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => !isVerified && setIsDropdownOpen(!isDropdownOpen)}
                  disabled={isVerified}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none text-left flex items-center justify-between ${
                    isVerified 
                      ? 'bg-gray-100 cursor-not-allowed border-gray-200' 
                      : 'focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue bg-white hover:border-myibc-blue'
                  } ${errors.country ? 'border-red-300' : 'border-gray-300'}`}
                >
                  <span className={selectedCountryData ? (isVerified ? 'text-myibc-graytext' : 'text-myibc-blue') : 'text-myibc-graytext'}>
                    {selectedCountryData ? selectedCountryData.name : 'Sélectionnez un pays'}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-myibc-graytext transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isDropdownOpen && !isVerified && (
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
              <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-3">
                <p className="text-sm text-myibc-blue">
                  <strong>Indicatif pays:</strong> {selectedCountryData.dialCode}
                </p>
              </div>
            )}

            {/* Champ numéro de téléphone */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-blue'}`}>
                <Phone className="w-4 h-4 inline mr-1" />
                Numéro de téléphone
              </label>
              <div className="flex">
                {selectedCountryData && (
                  <div className={`flex items-center px-4 py-3 border border-r-0 border-gray-300 rounded-l-lg font-medium ${
                    isVerified ? 'bg-gray-100 text-myibc-graytext' : 'bg-myibc-light text-myibc-blue'
                  }`}>
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
                  disabled={isVerified}
                  className={`flex-1 px-4 py-3 border shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                    selectedCountryData ? 'rounded-r-lg' : 'rounded-lg'
                  } ${isVerified ? 'bg-gray-100 text-myibc-graytext cursor-not-allowed' : 'bg-white'} ${
                    errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
              <p className="text-xs text-myibc-graytext mt-1">
                Saisissez votre numéro sans l'indicatif pays pour confirmation
              </p>
            </div>

            {/* Aperçu du numéro complet */}
            {selectedCountryData && phoneNumber && (
              <div className="bg-myibc-blue/5 border border-myibc-blue/20 rounded-lg p-3">
                <p className="text-sm text-myibc-blue">
                  <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{phoneNumber}
                </p>
              </div>
            )}

            {/* Bouton de vérification d'identité */}
            {!isVerified && (
              <button
                type="button"
                onClick={handleVerifyIdentity}
                disabled={isVerifying || !fullName.trim() || !selectedCountry || !phoneNumber.trim()}
                className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isVerifying || !fullName.trim() || !selectedCountry || !phoneNumber.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-myibc-gold text-white hover:bg-myibc-gold/90 focus:outline-none focus:ring-2 focus:ring-myibc-gold focus:ring-offset-2 shadow-md'
                }`}
              >
                {isVerifying ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Vérification en cours...
                  </div>
                ) : (
                  'Vérifier mon identité'
                )}
              </button>
            )}

            {/* Statut de vérification */}
            {isVerified && (
              <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-myibc-gold mr-2" />
                  <p className="text-sm text-myibc-blue font-medium">
                    Identité vérifiée - Vous pouvez maintenant définir votre nouveau mot de passe
                  </p>
                </div>
              </div>
            )}

            {/* Nouveau mot de passe */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isVerified ? 'text-myibc-blue' : 'text-myibc-graytext'}`}>
                <Lock className="w-4 h-4 inline mr-1" />
                Nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: '' }));
                  }}
                  placeholder={isVerified ? "Votre nouveau mot de passe" : "Vérifiez d'abord votre identité"}
                  disabled={!isVerified}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none ${
                    isVerified 
                      ? 'border-gray-300 focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue bg-white text-myibc-blue' 
                      : 'border-gray-200 bg-gray-100 text-myibc-graytext cursor-not-allowed'
                  } ${errors.newPassword ? 'border-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={!isVerified}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isVerified ? 'text-myibc-graytext hover:text-myibc-blue' : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
              <p className={`text-xs mt-1 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-graytext'}`}>
                Le mot de passe doit contenir au moins 8 caractères alphanumériques
              </p>
            </div>

            {/* Confirmation du nouveau mot de passe */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${isVerified ? 'text-myibc-blue' : 'text-myibc-graytext'}`}>
                <Lock className="w-4 h-4 inline mr-1" />
                Confirmer le nouveau mot de passe
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                  }}
                  placeholder={isVerified ? "Confirmez votre nouveau mot de passe" : "Vérifiez d'abord votre identité"}
                  disabled={!isVerified}
                  className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none ${
                    isVerified 
                      ? 'border-gray-300 focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue bg-white text-myibc-blue' 
                      : 'border-gray-200 bg-gray-100 text-myibc-graytext cursor-not-allowed'
                  } ${errors.confirmPassword ? 'border-red-300' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={!isVerified}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${
                    isVerified ? 'text-myibc-graytext hover:text-myibc-blue' : 'text-gray-300 cursor-not-allowed'
                  }`}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
              <p className={`text-xs mt-1 ${isVerified ? 'text-myibc-graytext' : 'text-myibc-graytext'}`}>
                Répétez exactement le même mot de passe
              </p>
            </div>

            {/* Vérification de correspondance des mots de passe */}
            {isVerified && newPassword && confirmPassword && (
              <div className={`rounded-lg p-3 ${
                newPassword === confirmPassword 
                  ? 'bg-myibc-gold/10 border border-myibc-gold/30' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <p className={`text-sm ${
                  newPassword === confirmPassword 
                    ? 'text-myibc-blue' 
                    : 'text-red-800'
                }`}>
                  {newPassword === confirmPassword 
                    ? '✓ Les mots de passe correspondent' 
                    : '✗ Les mots de passe ne correspondent pas'
                  }
                </p>
              </div>
            )}

            {/* Information sur les étapes */}
            {!isVerified ? (
              <div className="bg-myibc-blue/5 border border-myibc-blue/20 rounded-lg p-4">
                <p className="text-sm text-myibc-blue">
                  <strong>Étape 1:</strong> Vérifiez d'abord votre identité avec votre nom et numéro de téléphone.
                </p>
              </div>
            ) : (
              <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-4">
                <p className="text-sm text-myibc-blue">
                  <strong>Étape 2:</strong> Définissez maintenant votre nouveau mot de passe.
                </p>
              </div>
            )}

            {/* Bouton de soumission */}
            {isVerified && (
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                className={`w-full py-3 px-4 rounded-lg font-medium transition duration-200 ${
                  isLoading || !newPassword || !confirmPassword || newPassword !== confirmPassword
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-myibc-blue text-white hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 shadow-md'
                }`}
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
            )}

            {/* Retour à la connexion */}
            <div className="text-center pt-6 border-t border-gray-200">
              <Link
                href="/auth/login"
                className="text-sm text-myibc-blue hover:text-myibc-blue/80 font-medium flex items-center justify-center gap-1 hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
