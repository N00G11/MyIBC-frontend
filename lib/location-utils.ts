/**
 * Utilitaires pour la gestion des localisations
 */

export interface Delegation {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
  delegations: Delegation[];
}

export interface Country {
  id: number;
  name: string;
  cities: City[];
}

export interface LocationError {
  message: string;
  type: 'country' | 'city' | 'delegation' | 'general';
  id?: number;
}

export enum LocationErrorType {
  NOT_FOUND = 'NOT_FOUND',
  CONFLICT = 'CONFLICT',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Parse et normalise les erreurs de localisation
 */
export function parseLocationError(error: any): LocationError {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 404:
        return {
          message: typeof data === 'string' ? data : 'Élément non trouvé.',
          type: 'general'
        };
      case 409:
        return {
          message: typeof data === 'string' ? data : 'Conflit détecté.',
          type: 'general'
        };
      case 400:
        return {
          message: typeof data === 'string' ? data : 'Données invalides.',
          type: 'general'
        };
      case 500:
        return {
          message: 'Erreur serveur. Veuillez réessayer plus tard.',
          type: 'general'
        };
      default:
        return {
          message: typeof data === 'string' ? data : 'Une erreur inattendue s\'est produite.',
          type: 'general'
        };
    }
  } else if (error.request) {
    return {
      message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
      type: 'general'
    };
  } else if (error.message) {
    return {
      message: error.message,
      type: 'general'
    };
  }

  return {
    message: 'Une erreur inattendue s\'est produite.',
    type: 'general'
  };
}

/**
 * Validation côté client pour les noms de localisation
 */
export function validateLocationName(name: string, type: 'country' | 'city' | 'delegation'): { isValid: boolean; message?: string } {
  if (!name.trim()) {
    const typeNames = {
      country: 'pays',
      city: 'ville',
      delegation: 'délégation'
    };
    return { isValid: false, message: `Le nom du ${typeNames[type]} est requis.` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Le nom doit contenir au moins 2 caractères.' };
  }

  if (name.trim().length > 100) {
    return { isValid: false, message: 'Le nom ne peut pas dépasser 100 caractères.' };
  }

  // Vérifier les caractères spéciaux dangereux
  const forbiddenChars = /[<>'"&;]/;
  if (forbiddenChars.test(name)) {
    return { isValid: false, message: 'Le nom contient des caractères non autorisés.' };
  }

  return { isValid: true };
}

/**
 * Transforme les données de l'API backend en format frontend
 */
export function mapBackendToFrontend(rawCountries: any[]): Country[] {
  return rawCountries.map((country: any) => ({
    id: country.id,
    name: country.name,
    cities: (country.villes || []).map((city: any) => ({
      id: city.id,
      name: city.name,
      delegations: (city.delegations || []).map((delegation: any) => ({
        id: delegation.id,
        name: delegation.name,
      })),
    })),
  }));
}

/**
 * Trouve un pays par ID
 */
export function findCountryById(countries: Country[], id: number): Country | undefined {
  return countries.find(country => country.id === id);
}

/**
 * Trouve une ville par ID dans tous les pays
 */
export function findCityById(countries: Country[], cityId: number): { country: Country; city: City } | undefined {
  for (const country of countries) {
    const city = country.cities.find(city => city.id === cityId);
    if (city) {
      return { country, city };
    }
  }
  return undefined;
}

/**
 * Trouve une délégation par ID dans toutes les villes
 */
export function findDelegationById(countries: Country[], delegationId: number): { 
  country: Country; 
  city: City; 
  delegation: Delegation 
} | undefined {
  for (const country of countries) {
    for (const city of country.cities) {
      const delegation = city.delegations.find(delegation => delegation.id === delegationId);
      if (delegation) {
        return { country, city, delegation };
      }
    }
  }
  return undefined;
}
