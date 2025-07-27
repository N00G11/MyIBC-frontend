"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, UserPlus, ChevronDown, Phone, Globe, User, Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react"
import axiosInstance from "@/components/request/reques"

// Types pour les erreurs
interface FormErrors {
  general?: string;
  nom?: string;
  prenom?: string;
  country?: string;
  phoneNumber?: string;
  password?: string;
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

export function TresorierForm({ onAdded }: { onAdded?: () => void }) {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    phoneNumber: '',
    password: ''
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
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

    // Validation nom
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    } else if (formData.nom.trim().length < 2) {
      newErrors.nom = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation prénom
    if (!formData.prenom.trim()) {
      newErrors.prenom = 'Le prénom est requis';
    } else if (formData.prenom.trim().length < 2) {
      newErrors.prenom = 'Le prénom doit contenir au moins 2 caractères';
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return;
    }

    try {
      const selectedCountryData = getSelectedCountryData();
      
      // Construire le username en combinant nom et prénom
      const username = `${formData.nom.trim()} ${formData.prenom.trim()}`;
      const telephone = `${selectedCountryData!.dialCode} ${formData.phoneNumber}`;
      
      await axiosInstance.post("/tresoriers", {
        username,
        telephone,
        pays: selectedCountryData!.name,
        password: formData.password,
      });
      
      setFormData({
        nom: '',
        prenom: '',
        phoneNumber: '',
        password: ''
      });
      setSelectedCountry('');
      setErrors({});
      onAdded && onAdded();
    } catch (err: any) {
      if (err.response && err.response.data) {
        setErrors({
          general: typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
        });
      } else {
        setErrors({
          general: err instanceof Error ? err.message : "Une erreur est survenue lors de l'ajout"
        });
      }
    }
  }

  const selectedCountryData = getSelectedCountryData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un trésorier
        </CardTitle>
      </CardHeader>
      <CardContent>
        {errors.general && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="flex items-center gap-1">
                <User className="w-4 h-4" />
                Nom
              </Label>
              <Input
                id="nom"
                value={formData.nom}
                onChange={(e) => handleInputChange('nom', e.target.value)}
                placeholder="Nom du trésorier"
                className={errors.nom ? 'border-red-300' : ''}
              />
              {errors.nom && (
                <p className="text-sm text-red-600">{errors.nom}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={formData.prenom}
                onChange={(e) => handleInputChange('prenom', e.target.value)}
                placeholder="Prénom du trésorier"
                className={errors.prenom ? 'border-red-300' : ''}
              />
              {errors.prenom && (
                <p className="text-sm text-red-600">{errors.prenom}</p>
              )}
            </div>
          </div>

          {/* Sélection du pays */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              Pays de provenance
            </Label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white text-left flex items-center justify-between hover:border-[#D4AF37] transition-colors ${
                  errors.country ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <span className={selectedCountryData ? 'text-gray-900' : 'text-gray-500'}>
                  {selectedCountryData ? selectedCountryData.name : 'Sélectionnez un pays'}
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 sticky top-0 bg-white">
                    <input
                      type="text"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      placeholder="Rechercher un pays..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
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
                          className="w-full px-4 py-3 text-left hover:bg-[#D4AF37]/10 focus:bg-[#D4AF37]/20 focus:outline-none text-gray-900 flex justify-between items-center"
                        >
                          <span>{country.name}</span>
                          <span className="text-sm text-gray-500">{country.dialCode}</span>
                        </button>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-gray-500 text-sm">
                        Aucun pays trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {errors.country && (
              <p className="text-sm text-red-600">{errors.country}</p>
            )}
          </div>

          {/* Champ numéro de téléphone */}
          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              Numéro de téléphone
            </Label>
            <div className="flex">
              {selectedCountryData && (
                <div className="flex items-center px-4 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-md text-gray-900 font-medium">
                  {selectedCountryData.dialCode}
                </div>
              )}
              <Input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Votre numéro"
                className={`${selectedCountryData ? 'rounded-l-none' : ''} ${errors.phoneNumber ? 'border-red-300' : ''}`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-sm text-red-600">{errors.phoneNumber}</p>
            )}
            <p className="text-xs text-gray-500">
              Saisissez le numéro sans l'indicatif pays
            </p>
          </div>

          {/* Aperçu du numéro complet */}
          {selectedCountryData && formData.phoneNumber && (
            <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-md p-3">
              <p className="text-sm text-gray-900">
                <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{formData.phoneNumber}
              </p>
            </div>
          )}

          {/* Mot de passe */}
          <div className="space-y-2">
            <Label htmlFor="password" className="flex items-center gap-1">
              <Lock className="w-4 h-4" />
              Mot de passe
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Mot de passe"
                className={`pr-12 ${errors.password ? 'border-red-300' : ''}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password}</p>
            )}

            {/* Indicateur de force du mot de passe */}
            {formData.password && (
              <div className="mt-3 p-3 bg-gray-50 rounded-md">
                <p className="text-sm font-medium text-gray-900 mb-2">Critères du mot de passe :</p>
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

          <Button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white"
          >
            Ajouter le trésorier
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}