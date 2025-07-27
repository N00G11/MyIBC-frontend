"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/components/request/reques";
import { 
  validateName, 
  validateInternationalPhone, 
  validateBirthDate, 
  calculateAge 
} from "@/lib/participant-utils";

// Types
type Camp = {
  type: string;
  trancheAge: string;
};

type Delegation = { id: number; name: string };
type City = { id: number; name: string; delegations: Delegation[] };
type Country = { id: number; name: string; cities: City[] };

interface FormData {
  nom: string;
  prenom: string;
  sexe: string;
  telephone: string;
  dateNaissance: string;
  pays: string;
  ville: string;
  delegation: string;
}

interface FormErrors {
  nom?: string;
  prenom?: string;
  telephone?: string;
  dateNaissance?: string;
  pays?: string;
  ville?: string;
  delegation?: string;
  general?: string;
}

interface UseParticipantFormProps {
  campId?: string;
  code?: string;
}

export function useParticipantForm({ campId, code }: UseParticipantFormProps) {
  // États du formulaire
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    sexe: "Masculin",
    telephone: "",
    dateNaissance: "",
    pays: "",
    ville: "",
    delegation: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // États des données externes
  const [countries, setCountries] = useState<Country[]>([]);
  const [villes, setVilles] = useState<City[]>([]);
  const [delegations, setDelegations] = useState<Delegation[]>([]);

  // États du camp
  const [campType, setCampType] = useState<string | null>(null);
  const [minAge, setMinAge] = useState<number | null>(null);
  const [maxAge, setMaxAge] = useState<number | null>(null);
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);

  // Chargement initial
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          campId ? fetchTrancheAge(campId) : Promise.resolve(),
          fetchLocalisations()
        ]);
      } catch (error) {
        console.error("Erreur de chargement initial:", error);
        setErrors({ general: "Erreur lors du chargement des données" });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [campId]);

  // Gestion des localisations hiérarchiques
  useEffect(() => {
    if (formData.pays) {
      const selectedCountry = countries.find(c => c.name === formData.pays);
      if (selectedCountry) {
        setVilles(selectedCountry.cities);
        updateFormData({ ville: "", delegation: "" });
        setDelegations([]);
      }
    }
  }, [formData.pays, countries]);

  useEffect(() => {
    const selectedCountry = countries.find(c => c.name === formData.pays);
    const selectedCity = selectedCountry?.cities.find(v => v.name === formData.ville);
    if (selectedCity) {
      setDelegations(selectedCity.delegations);
      updateFormData({ delegation: "" });
    }
  }, [formData.ville, formData.pays, countries]);

  // Calcul de l'âge
  useEffect(() => {
    if (formData.dateNaissance) {
      const age = calculateAge(formData.dateNaissance);
      setCalculatedAge(age);
    } else {
      setCalculatedAge(null);
    }
  }, [formData.dateNaissance]);

  // Fonctions utilitaires
  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Effacer les erreurs des champs mis à jour
    const updatedFields = Object.keys(updates);
    setErrors(prev => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field as keyof FormErrors];
      });
      return newErrors;
    });
  };

  const clearError = (field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // Validation en temps réel
  const validateField = (field: keyof FormData, value: string): string | undefined => {
    switch (field) {
      case 'nom':
        const nomValidation = validateName(value, "Nom");
        return nomValidation.isValid ? undefined : nomValidation.error;
      
      case 'prenom':
        const prenomValidation = validateName(value, "Prénom");
        return prenomValidation.isValid ? undefined : prenomValidation.error;
      
      case 'telephone':
        const phoneValidation = validateInternationalPhone(value);
        return phoneValidation.isValid ? undefined : phoneValidation.error;
      
      case 'dateNaissance':
        const dateValidation = validateBirthDate(value, minAge || undefined, maxAge || undefined);
        return dateValidation.isValid ? undefined : dateValidation.error;
      
      case 'pays':
        return !value.trim() ? "Le pays est requis" : undefined;
      
      case 'ville':
        return !value.trim() ? "La ville est requise" : undefined;
      
      case 'delegation':
        return !value.trim() ? "La délégation est requise" : undefined;
      
      default:
        return undefined;
    }
  };

  // Validation complète du formulaire
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation de tous les champs
    Object.entries(formData).forEach(([field, value]) => {
      const error = validateField(field as keyof FormData, value);
      if (error) {
        newErrors[field as keyof FormErrors] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Récupération des données du camp
  const fetchTrancheAge = async (id: string) => {
    try {
      const response = await axiosInstance.get<Camp>(`/camp/${id}`);
      setCampType(response.data.type);
      const [min, max] = response.data.trancheAge.split("-").map(Number);
      setMinAge(min);
      setMaxAge(max);
    } catch (err) {
      console.error("Erreur fetchTrancheAge:", err);
      throw new Error("Erreur lors du chargement des données du camp");
    }
  };

  // Récupération des localisations
  const fetchLocalisations = async () => {
    try {
      const response = await axiosInstance.get("/localisations/pays");
      const rawCountries = response.data;

      const mappedCountries = rawCountries.map((country: any) => ({
        id: country.id,
        name: country.name,
        cities: (country.villes || []).map((city: any) => ({
          id: city.id,
          name: city.name,
          delegations: (city.delegations || []).map((deleg: any) => ({
            id: deleg.id,
            name: deleg.name,
          })),
        })),
      }));

      setCountries(mappedCountries);
    } catch (err) {
      console.error("Erreur fetchLocalisations:", err);
      throw new Error("Erreur lors du chargement des localisations");
    }
  };

  // Soumission du formulaire
  const submitForm = async (): Promise<{ success: boolean; inscriptionCode?: string }> => {
    if (!validateForm()) {
      return { success: false };
    }

    if (!code || !campId) {
      setErrors({ general: "Paramètres manquants pour l'inscription" });
      return { success: false };
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post(`/inscription/add/${code}/${campId}`, formData);
      return { 
        success: true, 
        inscriptionCode: response.data.code 
      };
    } catch (err: any) {
      console.error("Erreur inscription:", err);
      
      // Gestion des erreurs spécifiques
      if (err.response?.status === 400) {
        setErrors({ general: "Données invalides. Vérifiez vos informations." });
      } else if (err.response?.status === 409) {
        setErrors({ general: "Une inscription existe déjà avec ces informations." });
      } else if (err.response?.status === 404) {
        setErrors({ general: "Camp ou code d'inscription introuvable." });
      } else {
        setErrors({ general: "Une erreur est survenue lors de l'inscription." });
      }
      
      return { success: false };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // État du formulaire
    formData,
    errors,
    isSubmitting,
    isLoading,
    
    // Données externes
    countries,
    villes,
    delegations,
    
    // Informations du camp
    campType,
    minAge,
    maxAge,
    calculatedAge,
    
    // Actions
    updateFormData,
    clearError,
    validateField,
    submitForm,
    
    // État calculé
    isFormValid: Object.keys(errors).length === 0 && Object.values(formData).every(v => v.trim() !== ""),
  };
}
