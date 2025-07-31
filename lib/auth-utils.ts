/**
 * Utilitaires pour la gestion de l'authentification
 */

export interface AuthResponse {
  token: string;
  role: string;
  code?: string;
  type?: string;
}

export interface AuthError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Types d'erreurs d'authentification
 */
export enum AuthErrorType {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_EXISTS = 'EMAIL_EXISTS',
  USERNAME_EXISTS = 'USERNAME_EXISTS',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

/**
 * Parse et normalise les erreurs d'authentification
 */
export function parseAuthError(error: any): AuthError {
  if (error.response) {
    // Erreur de réponse du serveur
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 400:
        return {
          message: typeof data === 'string' ? data : 'Données invalides.',
          status,
          code: AuthErrorType.VALIDATION_ERROR
        };
      case 401:
        return {
          message: 'identifiant invalide ou code incorrect.',
          status,
          code: AuthErrorType.INVALID_CREDENTIALS
        };
      case 404:
        return {
          message: 'Utilisateur non trouvé.',
          status,
          code: AuthErrorType.USER_NOT_FOUND
        };
      case 409:
        // Déterminer si c'est un conflit d'email ou de nom d'utilisateur
        const conflictMessage = typeof data === 'string' ? data : '';
        if (conflictMessage.includes("nom d'utilisateur") || conflictMessage.includes("username")) {
          return {
            message: conflictMessage,
            status,
            code: AuthErrorType.USERNAME_EXISTS
          };
        } else {
          return {
            message: conflictMessage || 'Un compte avec cette adresse email existe déjà.',
            status,
            code: AuthErrorType.EMAIL_EXISTS
          };
        }
      case 429:
        return {
          message: 'Trop de tentatives. Veuillez attendre avant de réessayer.',
          status,
          code: AuthErrorType.RATE_LIMIT
        };
      case 500:
        return {
          message: 'Erreur serveur. Veuillez réessayer plus tard.',
          status,
          code: AuthErrorType.SERVER_ERROR
        };
      default:
        return {
          message: typeof data === 'string' ? data : 'Une erreur inattendue s\'est produite.',
          status,
          code: AuthErrorType.UNKNOWN_ERROR
        };
    }
  } else if (error.request) {
    // Erreur de réseau
    return {
      message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
      code: AuthErrorType.NETWORK_ERROR
    };
  } else if (error.message) {
    // Erreur de configuration ou autre
    return {
      message: error.message,
      code: AuthErrorType.UNKNOWN_ERROR
    };
  }

  return {
    message: 'Une erreur inattendue s\'est produite.',
    code: AuthErrorType.UNKNOWN_ERROR
  };
}

/**
 * Valide les données d'authentification reçues du serveur
 */
export function validateAuthResponse(data: any): AuthResponse {
  if (!data) {
    throw new Error('Réponse invalide du serveur');
  }

  if (!data.token) {
    throw new Error('Token d\'authentification manquant');
  }

  if (!data.role) {
    throw new Error('Rôle utilisateur manquant');
  }

  return {
    token: data.token,
    role: data.role,
    code: data.code,
    type: data.type || 'Bearer'
  };
}

/**
 * Sauvegarde sécurisée des données d'authentification
 * Le code est sauvegardé avec un nom spécifique selon le rôle
 */
export function saveAuthData(authData: AuthResponse, personalCode?: string): void {
  try {
    localStorage.setItem('token', authData.token);
    localStorage.setItem('role', authData.role);
    
    // Déterminer le nom de la clé pour le code selon le rôle
    const codeKey = authData.role === 'ROLE_TRESORIER' ? 'tresorierCode' : 'code';
    
    if (authData.code) {
      localStorage.setItem(codeKey, authData.code);
    } else if (personalCode) {
      localStorage.setItem(codeKey, personalCode);
    }
    
    // Nettoyer l'ancienne clé si le rôle a changé
    if (authData.role === 'ROLE_TRESORIER') {
      localStorage.removeItem('code');
    } else {
      localStorage.removeItem('tresorierCode');
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des données d\'authentification:', error);
    throw new Error('Impossible de sauvegarder les données d\'authentification');
  }
}

/**
 * Détermine la route de redirection basée sur le rôle
 */
export const getRedirectPath = (role: string): string => {
  switch (role) {
    case 'ROLE_ADMIN':
      return '/dashboard-selection';
    case 'ROLE_TRESORIER':
      return '/dashboard-selection';
    case 'ROLE_UTILISATEUR':
      return 'utilisateur/dashboard';
    default:
      return '/dashboard';
  }
};

/**
 * Récupère le code utilisateur depuis le localStorage selon le rôle
 */
export function getUserCode(role?: string): string | null {
  if (typeof window === 'undefined') return null;
  
  if (role === 'ROLE_TRESORIER') {
    return localStorage.getItem('tresorierCode');
  }
  
  // Pour les autres rôles, essayer d'abord 'code', puis 'tresorierCode' en fallback
  return localStorage.getItem('code') || localStorage.getItem('tresorierCode');
}

/**
 * Nettoie toutes les données d'authentification du localStorage
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  
  localStorage.removeItem('token');
  localStorage.removeItem('code');
  localStorage.removeItem('tresorierCode');
}

/**
 * Validation côté client pour l'email
 */
export function validateEmail(email: string): { isValid: boolean; message?: string } {
  if (!email.trim()) {
    return { isValid: false, message: 'L\'adresse email est requise.' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: 'Veuillez entrer une adresse email valide.' };
  }

  return { isValid: true };
}

/**
 * Validation côté client pour le mot de passe
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password) {
    return { isValid: false, message: 'Le mot de passe est requis.' };
  }

  return { isValid: true };
}

/**
 * Validation côté client pour le nom d'utilisateur
 */
export function validateUsername(username: string): { isValid: boolean; message?: string } {
  if (!username.trim()) {
    return { isValid: false, message: 'Le nom complet est requis.' };
  }

  if (username.trim().length < 2) {
    return { isValid: false, message: 'Le nom doit contenir au moins 2 caractères.' };
  }

  if (username.trim().length > 50) {
    return { isValid: false, message: 'Le nom ne peut pas dépasser 50 caractères.' };
  }

  // Vérifier les caractères spéciaux dangereux
  const forbiddenChars = /[<>'"&;]/;
  if (forbiddenChars.test(username)) {
    return { isValid: false, message: 'Le nom contient des caractères non autorisés.' };
  }

  return { isValid: true };
}

/**
 * Validation côté client pour le code personnel
 */
export function validatePersonalCode(code: string): { isValid: boolean; message?: string } {
  if (!code.trim()) {
    return { isValid: false, message: 'Le code personnel est requis.' };
  }

  // Vous pouvez ajouter d'autres validations spécifiques au format du code
  if (code.trim().length < 3) {
    return { isValid: false, message: 'Le code personnel doit contenir au moins 3 caractères.' };
  }

  return { isValid: true };
}