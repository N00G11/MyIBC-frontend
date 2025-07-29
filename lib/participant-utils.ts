// Utilitaires pour la validation du formulaire participant

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Validation du téléphone international
export function validateInternationalPhone(phone: string): ValidationResult {
  if (!phone.trim()) {
    return { isValid: false, error: "Le numéro de téléphone est requis" };
  }

  // Nettoie le numéro (retire espaces, tirets, parenthèses)
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Format international: +[1-4 chiffres pays][4-15 chiffres numéro]
  const internationalPattern = /^\+[1-9][0-9]{0,3}[0-9]{4,15}$/;
  
  // Format local: 6-15 chiffres
  const localPattern = /^[0-9]{6,15}$/;

  const isValid = internationalPattern.test(cleanPhone) || localPattern.test(cleanPhone);
  
  if (!isValid) {
    return { 
      isValid: false, 
      error: "Format invalide" 
    };
  }

  return { isValid: true };
}

// Formate le numéro de téléphone pour l'affichage
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Si commence par + (format international)
  if (cleanPhone.startsWith('+')) {
    return cleanPhone; // Retourne tel quel pour l'international
  }
  
  // Si c'est un numéro local, ajoute un + au début
  if (/^[0-9]{6,15}$/.test(cleanPhone)) {
    return `+${cleanPhone}`;
  }
  
  return phone; // Retourne tel quel si format non reconnu
}

// Validation de la date de naissance
export function validateBirthDate(
  dateString: string, 
  minAge?: number, 
  maxAge?: number | null
): ValidationResult {
  if (!dateString.trim()) {
    return { isValid: false, error: "La date de naissance est requise" };
  }

  const birthDate = new Date(dateString);
  if (isNaN(birthDate.getTime())) {
    return { isValid: false, error: "Format de date invalide" };
  }

  const age = calculateAge(dateString);
  
  if (minAge !== undefined && age < minAge) {
    return { 
      isValid: false, 
      error: `L'âge minimum requis est de ${minAge} ans` 
    };
  }
  
  // Vérifier l'âge maximum seulement s'il est défini (pas null)
  if (maxAge !== undefined && maxAge !== null && age > maxAge) {
    return { 
      isValid: false, 
      error: `L'âge maximum autorisé est de ${maxAge} ans` 
    };
  }

  return { isValid: true };
}

// Calcule l'âge précis
export function calculateAge(dateString: string): number {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

// Validation du nom/prénom
export function validateName(name: string, fieldName: string): ValidationResult {
  if (!name.trim()) {
    return { isValid: false, error: `${fieldName} est requis` };
  }
  
  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} doit contenir au moins 2 caractères` };
  }
  
  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} ne peut pas dépasser 50 caractères` };
  }
  
  // Vérifie les caractères autorisés (lettres, espaces, tirets, apostrophes)
  const namePattern = /^[a-zA-ZÀ-ÿ\s\-']+$/;
  if (!namePattern.test(name.trim())) {
    return { 
      isValid: false, 
      error: `${fieldName} ne peut contenir que des lettres, espaces, tirets et apostrophes` 
    };
  }
  
  return { isValid: true };
}

// Suggestions de format pour le téléphone
export function getPhoneSuggestions(input: string): string[] {
  const cleanInput = input.replace(/[\s\-\(\)]/g, '');
  const suggestions: string[] = [];
  
  // Si c'est un numéro sans indicatif
  if (cleanInput.length >= 6 && !cleanInput.startsWith('+')) {
    suggestions.push(`+${cleanInput}`);
  }
  
  return suggestions;
}

// Détecte le type de numéro automatiquement
export function detectPhoneType(phone: string): 'mobile' | 'landline' | 'unknown' {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Pour les numéros internationaux, on ne peut pas déterminer le type facilement
  if (cleanPhone.startsWith('+')) {
    return 'unknown';
  }
  
  return 'unknown';
}

// Formate automatiquement pendant la saisie avec patterns spécifiques par pays
export function autoFormatPhone(input: string, previousValue: string): string {
  // Retire tout sauf les chiffres et le +
  let cleaned = input.replace(/[^\d+]/g, '');
  
  // Si l'utilisateur efface, on respecte sa volonté
  if (input.length < previousValue.length) {
    return input;
  }
  
  // Limite la longueur
  if (cleaned.length > 18) {
    cleaned = cleaned.substring(0, 18);
  }
  
  // Si ne commence pas par +, l'ajouter automatiquement
  if (cleaned.length > 0 && !cleaned.startsWith('+') && /^[0-9]/.test(cleaned)) {
    cleaned = `+${cleaned}`;
  }
  
  // Formatage intelligent par pays
  if (cleaned.startsWith('+') && cleaned.length > 1) {
    return formatByCountryCode(cleaned);
  }
  
  return cleaned;
}

// Formatage spécifique par indicatif pays
function formatByCountryCode(phone: string): string {
  const withoutPlus = phone.substring(1);
  
  // Patterns de formatage par pays
  const countryPatterns = [
    // Cameroun (+237) - 3 + 9 chiffres
    { 
      code: '237', 
      pattern: (num: string) => {
        if (num.length <= 3) return `+${num}`;
        if (num.length <= 6) return `+${num.substring(0, 3)} ${num.substring(3)}`;
        if (num.length <= 9) return `+${num.substring(0, 3)} ${num.substring(3, 6)} ${num.substring(6)}`;
        return `+${num.substring(0, 3)} ${num.substring(3, 6)} ${num.substring(6, 9)} ${num.substring(9)}`;
      }
    },
    // France (+33) - 2 + 10 chiffres
    { 
      code: '33', 
      pattern: (num: string) => {
        if (num.length <= 2) return `+${num}`;
        if (num.length <= 4) return `+${num.substring(0, 2)} ${num.substring(2)}`;
        if (num.length <= 6) return `+${num.substring(0, 2)} ${num.substring(2, 4)} ${num.substring(4)}`;
        if (num.length <= 8) return `+${num.substring(0, 2)} ${num.substring(2, 4)} ${num.substring(4, 6)} ${num.substring(6)}`;
        if (num.length <= 10) return `+${num.substring(0, 2)} ${num.substring(2, 4)} ${num.substring(4, 6)} ${num.substring(6, 8)} ${num.substring(8)}`;
        return `+${num.substring(0, 2)} ${num.substring(2, 4)} ${num.substring(4, 6)} ${num.substring(6, 8)} ${num.substring(8, 10)} ${num.substring(10)}`;
      }
    },
    // Allemagne (+49) - 2 + variable
    { 
      code: '49', 
      pattern: (num: string) => {
        if (num.length <= 2) return `+${num}`;
        if (num.length <= 5) return `+${num.substring(0, 2)} ${num.substring(2)}`;
        if (num.length <= 8) return `+${num.substring(0, 2)} ${num.substring(2, 5)} ${num.substring(5)}`;
        if (num.length <= 11) return `+${num.substring(0, 2)} ${num.substring(2, 5)} ${num.substring(5, 8)} ${num.substring(8)}`;
        return `+${num.substring(0, 2)} ${num.substring(2, 5)} ${num.substring(5, 8)} ${num.substring(8, 11)} ${num.substring(11)}`;
      }
    },
    // USA/Canada (+1) - 1 + 10 chiffres
    { 
      code: '1', 
      pattern: (num: string) => {
        if (num.length <= 1) return `+${num}`;
        if (num.length <= 4) return `+${num.substring(0, 1)} ${num.substring(1)}`;
        if (num.length <= 7) return `+${num.substring(0, 1)} ${num.substring(1, 4)} ${num.substring(4)}`;
        return `+${num.substring(0, 1)} ${num.substring(1, 4)} ${num.substring(4, 7)} ${num.substring(7, 11)}`;
      }
    }
  ];
  
  // Chercher le pattern correspondant
  for (const country of countryPatterns) {
    if (withoutPlus.startsWith(country.code)) {
      return country.pattern(withoutPlus);
    }
  }
  
  // Format générique si pas de pattern spécifique
  if (withoutPlus.length <= 3) {
    return `+${withoutPlus}`;
  } else if (withoutPlus.length <= 6) {
    return `+${withoutPlus.substring(0, 3)} ${withoutPlus.substring(3)}`;
  } else if (withoutPlus.length <= 9) {
    return `+${withoutPlus.substring(0, 3)} ${withoutPlus.substring(3, 6)} ${withoutPlus.substring(6)}`;
  } else {
    return `+${withoutPlus.substring(0, 3)} ${withoutPlus.substring(3, 6)} ${withoutPlus.substring(6, 9)} ${withoutPlus.substring(9)}`;
  }
}