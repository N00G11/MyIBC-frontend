"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateInput } from "@/components/ui/date-input";
import { useParticipantForm } from "@/hooks/use-participant-form";
import {
  UserPlus,
  MapPin,
  Globe,
  Building2,
  AlertCircle,
  Loader2,
  CheckCircle,
  Users,
  Calendar,
  Phone,
  User,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculateAge } from "@/lib/participant-utils";
import { error } from "console";
import { SetStateAction, useState } from "react";

// Type pour les pays
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

export function ParticipantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campId = searchParams.get("id");
  const code = searchParams.get("id2");

  // États pour la gestion du téléphone
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  // Liste des pays avec leurs indicatifs
  const phoneCountries: Country[] = [
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

  const {
    formData,
    errors,
    isSubmitting,
    isLoading,
    countries,
    villes,
    delegations,
    campType,
    minAge,
    maxAge,
    calculatedAge,
    updateFormData,
    submitForm,
    isFormValid,
  } = useParticipantForm({ campId: campId || undefined, code: code || undefined });

  // Trouver le pays sélectionné pour le téléphone
  const getSelectedCountryData = (): Country | undefined => {
    return phoneCountries.find(country => country.code === selectedCountry);
  };

  const handleCountrySelect = (countryCode: string): void => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setCountrySearch('');
  };

  // Filtrer les pays selon la recherche
  const filteredCountries = phoneCountries.filter(country =>
    country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dialCode.includes(countrySearch)
  );

  // Mettre à jour le téléphone dans le formulaire
  const updatePhoneInForm = (phone: string, country: string) => {
    const selectedCountryData = phoneCountries.find(c => c.code === country);
    if (selectedCountryData && phone) {
      const fullPhone = `${selectedCountryData.dialCode} ${phone}`;
      updateFormData({ telephone: fullPhone });
    } else {
      updateFormData({ telephone: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm();
    if (result.success) {
      router.push("/utilisateur/dashboard");
    }
  };

  const selectedCountryData = getSelectedCountryData();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-myibc-light flex items-center justify-center">
        <Card className="w-96 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 text-myibc-blue animate-spin mb-4" />
            <p className="text-myibc-blue font-medium">Chargement des données...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-myibc-light p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border border-gray-200 bg-white">
          <CardHeader className="bg-myibc-blue text-white rounded-t-md">
            <CardTitle className="flex items-center gap-2 text-lg font-semibold">
              <UserPlus className="h-5 w-5" />
              Inscription au {campType || "camp"}
            </CardTitle>
            {minAge && (
              <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <Users className="h-4 w-4" />
                <span>
                  {maxAge 
                    ? `Tranche d'âge autorisée : ${minAge} à ${maxAge} ans`
                    : `Âge minimum requis : ${minAge} ans et plus`
                  }
                </span>
              </div>
            )}
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-myibc-blue border-b border-gray-200 pb-2">
                  Informations personnelles
                </h3>
                
                {/* Nom complet */}
                <div>
                  <Label className="text-myibc-blue font-medium flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Nom complet <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={formData.nomComplet || ''}
                    onChange={(e) => updateFormData({ nomComplet: e.target.value })}
                    placeholder="Nom complet du participant"
                    className={errors.nomComplet ? "border-red-500" : ""}
                  />
                  {errors.nomComplet && (
                    <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.nomComplet}
                    </div>
                  )}
                </div>

                {/* Genre */}
                <div>
                  <Label className="text-myibc-blue font-medium flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4" />
                    Genre <span className="text-red-500">*</span>
                  </Label>
                  <RadioGroup 
                    value={formData.sexe} 
                    onValueChange={(value) => updateFormData({ sexe: value })} 
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Masculin" id="male" />
                      <Label htmlFor="male" className="cursor-pointer">Masculin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Feminin" id="female" />
                      <Label htmlFor="female" className="cursor-pointer">Féminin</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Date de naissance */}
                <div>
                  <DateInput
                    value={formData.dateNaissance}
                    onChange={(value) => updateFormData({ dateNaissance: value })}
                    minAge={minAge || undefined}
                    maxAge={maxAge || undefined}
                    error={errors.dateNaissance}
                  />
                </div>

                {/* Numéro de téléphone */}
                <div>
                  <Label className="text-myibc-blue font-medium flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4" />
                    Numéro de téléphone <span className="text-red-500">*</span>
                  </Label>
                  
                  {/* Sélection du pays */}
                  <div className="mb-3">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue bg-white text-left flex items-center justify-between hover:border-myibc-blue transition-colors border-gray-300"
                      >
                        <span className={selectedCountryData ? 'text-myibc-blue' : 'text-gray-500'}>
                          {selectedCountryData ? selectedCountryData.name : 'Sélectionnez un pays'}
                        </span>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
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
                  </div>

                  {/* Champ numéro de téléphone */}
                  <div className="flex">
                    {selectedCountryData && (
                      <div className="flex items-center px-4 py-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-myibc-blue font-medium">
                        {selectedCountryData.dialCode}
                      </div>
                    )}
                    <Input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                        updatePhoneInForm(e.target.value, selectedCountry);
                      }}
                      placeholder="Votre numéro"
                      className={`${selectedCountryData ? 'rounded-l-none' : ''} ${errors.telephone ? 'border-red-300' : ''}`}
                    />
                  </div>
                  
                  {errors.telephone && (
                    <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.telephone}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-1">
                    Saisissez le numéro sans l'indicatif pays
                  </p>

                  {/* Aperçu du numéro complet */}
                  {selectedCountryData && phoneNumber && (
                    <div className="bg-myibc-blue/10 border border-myibc-blue/30 rounded-lg p-3 mt-2">
                      <p className="text-sm text-myibc-blue">
                        <strong>Numéro complet:</strong> {selectedCountryData.dialCode}{phoneNumber}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-myibc-blue border-b border-gray-200 pb-2 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Localisation
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Pays */}
                  <div>
                    <Label className="flex items-center gap-2 text-myibc-blue font-medium mb-2">
                      <Globe className="h-4 w-4" />
                      Pays <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.pays} 
                      onValueChange={(value) => updateFormData({ pays: value })}
                    >
                      <SelectTrigger className={errors.pays ? "border-red-500" : ""}>
                        <SelectValue placeholder="Sélectionner un pays" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.id} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.pays && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.pays}
                      </div>
                    )}
                  </div>

                  {/* Ville */}
                  <div>
                    <Label className="flex items-center gap-2 text-myibc-blue font-medium mb-2">
                      <Building2 className="h-4 w-4" />
                      Ville <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.ville} 
                      onValueChange={(value) => updateFormData({ ville: value })}
                      disabled={!formData.pays}
                    >
                      <SelectTrigger className={errors.ville ? "border-red-500" : ""}>
                        <SelectValue placeholder={formData.pays ? "Sélectionner une ville" : "Choisir un pays d'abord"} />
                      </SelectTrigger>
                      <SelectContent>
                        {villes.map((ville) => (
                          <SelectItem key={ville.id} value={ville.name}>
                            {ville.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.ville && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.ville}
                      </div>
                    )}
                  </div>

                  {/* Délégation */}
                  <div className="md:col-span-2 lg:col-span-1">
                    <Label className="flex items-center gap-2 text-myibc-blue font-medium mb-2">
                      <MapPin className="h-4 w-4" />
                      Localité <span className="text-red-500">*</span>
                    </Label>
                    <Select 
                      value={formData.delegation} 
                      onValueChange={(value) => updateFormData({ delegation: value })}
                      disabled={!formData.ville}
                    >
                      <SelectTrigger className={errors.delegation ? "border-red-500" : ""}>
                        <SelectValue placeholder={formData.ville ? "Sélectionner une délégation" : "Choisir une ville d'abord"} />
                      </SelectTrigger>
                      <SelectContent>
                        {delegations.map((delegation) => (
                          <SelectItem key={delegation.id} value={delegation.name}>
                            {delegation.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.delegation && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.delegation}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Erreur générale */}
              {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Erreur d'inscription</p>
                    <p className="text-sm">{errors.general}</p>
                  </div>
                </div>
              )}

              {/* Message de validation */}
              {isFormValid && !errors.general && (
                <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Formulaire valide</p>
                    <p className="text-sm">Vous pouvez procéder à l'inscription</p>
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-myibc-blue hover:bg-[#001942] text-white py-3"
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Confirmer l'inscription
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}