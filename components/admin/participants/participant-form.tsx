"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { DateInput } from "@/components/ui/date-input";
import { NameInput } from "@/components/ui/name-input";
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { calculateAge } from "@/lib/participant-utils";
import { error } from "console";
import { SetStateAction } from "react";

export function ParticipantForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const campId = searchParams.get("id");
  const code = searchParams.get("id2");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitForm();
    if (result.success) {
      router.push("/utilisateur/dashboard");
    }
  };

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
            {minAge && maxAge && (
              <div className="mt-2 flex items-center gap-2 text-sm text-white/90">
                <Users className="h-4 w-4" />
                <span>Tranche d'âge autorisée : {minAge} à {maxAge} ans</span>
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
                
                {/* Nom et Prénom */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <NameInput
                    value={formData.nom}
                    onChange={(value) => updateFormData({ nom: value })}
                    label="Nom"
                    placeholder="Votre nom de famille"
                    error={errors.nom}
                  />
                  <NameInput
                    value={formData.prenom}
                    onChange={(value) => updateFormData({ prenom: value })}
                    label="Prénom"
                    placeholder="Votre prénom"
                    error={errors.prenom}
                  />
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

                {/* Numéro de téléphone - ligne séparée */}
                <div>
                  <PhoneInput
                    value={formData.telephone}
                    onChange={(value) => updateFormData({ telephone: value })}
                    error={errors.telephone}
                  />
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
                      Délégation <span className="text-red-500">*</span>
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