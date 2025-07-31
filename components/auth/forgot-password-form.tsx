'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronDown, 
  Phone, 
  Globe, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  CheckCircle, 
  XCircle,
  Shield
} from 'lucide-react';
import { parseAuthError } from '../../lib/auth-utils';
import axiosInstance from '../request/reques';

// Types pour les erreurs
interface FormErrors {
  general?: string;
  nomComplet?: string;
  country?: string;
  phoneNumber?: string;
  password?: string;
  confirmPassword?: string;
}

// Type pour les pays
interface Country {
  name: string;
  code: string;
  dialCode: string;
}

interface Pays {
  nom: string;
  code: string;
  dialCode: string;
}

// Fonctions utilitaires pour nettoyer les données
const cleanPhoneNumber = (phone: string): string => {
  // Supprimer tous les espaces, tirets, points et parenthèses
  return phone.replace(/[\s\-\.\(\)]/g, '');
};

const cleanFullName = (name: string): string => {
  // Supprimer les espaces en début/fin et remplacer les espaces multiples par un seul
  return name.trim().replace(/\s+/g, ' ');
};

// Interface pour la validation du mot de passe
interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasNumbers: boolean;
}

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [nomComplet, setNomComplet] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

   // Liste des pays avec leurs indicatifs
  const pays: Pays[] = [
    { nom: 'Afghanistan', code: 'AF', dialCode: '+93' },
    { nom: 'Albanie', code: 'AL', dialCode: '+355' },
    { nom: 'Algérie', code: 'DZ', dialCode: '+213' },
    { nom: 'Samoa américaines', code: 'AS', dialCode: '+1-684' },
    { nom: 'Andorre', code: 'AD', dialCode: '+376' },
    { nom: 'Angola', code: 'AO', dialCode: '+244' },
    { nom: 'Anguilla', code: 'AI', dialCode: '+1-264' },
    { nom: 'Antarctique', code: 'AQ', dialCode: '' },
    { nom: 'Antigua-et-Barbuda', code: 'AG', dialCode: '+1-268' },
    { nom: 'Argentine', code: 'AR', dialCode: '+54' },
    { nom: 'Arménie', code: 'AM', dialCode: '+374' },
    { nom: 'Aruba', code: 'AW', dialCode: '+297' },
    { nom: 'Australie', code: 'AU', dialCode: '+61' },
    { nom: 'Autriche', code: 'AT', dialCode: '+43' },
    { nom: 'Azerbaïdjan', code: 'AZ', dialCode: '+994' },
    { nom: 'Bahamas', code: 'BS', dialCode: '+1-242' },
    { nom: 'Bahreïn', code: 'BH', dialCode: '+973' },
    { nom: 'Bangladesh', code: 'BD', dialCode: '+880' },
    { nom: 'Barbade', code: 'BB', dialCode: '+1-246' },
    { nom: 'Biélorussie', code: 'BY', dialCode: '+375' },
    { nom: 'Belgique', code: 'BE', dialCode: '+32' },
    { nom: 'Belize', code: 'BZ', dialCode: '+501' },
    { nom: 'Bénin', code: 'BJ', dialCode: '+229' },
    { nom: 'Bermudes', code: 'BM', dialCode: '+1-441' },
    { nom: 'Bhoutan', code: 'BT', dialCode: '+975' },
    { nom: 'Bolivie, État plurinational de', code: 'BO', dialCode: '+591' },
    { nom: 'Bonaire, Saint-Eustache et Saba', code: 'BQ', dialCode: '+599' },
    { nom: 'Bosnie-Herzégovine', code: 'BA', dialCode: '+387' },
    { nom: 'Botswana', code: 'BW', dialCode: '+267' },
    { nom: 'Île Bouvet', code: 'BV', dialCode: '' },
    { nom: 'Brésil', code: 'BR', dialCode: '+55' },
    { nom: 'Territoire britannique de l\'océan Indien', code: 'IO', dialCode: '+246' },
    { nom: 'Brunéi Darussalam', code: 'BN', dialCode: '+673' },
    { nom: 'Bulgarie', code: 'BG', dialCode: '+359' },
    { nom: 'Burkina Faso', code: 'BF', dialCode: '+226' },
    { nom: 'Burundi', code: 'BI', dialCode: '+257' },
    { nom: 'Cap-Vert', code: 'CV', dialCode: '+238' },
    { nom: 'Cambodge', code: 'KH', dialCode: '+855' },
    { nom: 'Cameroun', code: 'CM', dialCode: '+237' },
    { nom: 'Canada', code: 'CA', dialCode: '+1' },
    { nom: 'Îles Caïmans', code: 'KY', dialCode: '+1-345' },
    { nom: 'République centrafricaine', code: 'CF', dialCode: '+236' },
    { nom: 'Tchad', code: 'TD', dialCode: '+235' },
    { nom: 'Chili', code: 'CL', dialCode: '+56' },
    { nom: 'Chine', code: 'CN', dialCode: '+86' },
    { nom: 'Île Christmas', code: 'CX', dialCode: '+61' },
    { nom: 'Îles Cocos (Keeling)', code: 'CC', dialCode: '+61' },
    { nom: 'Colombie', code: 'CO', dialCode: '+57' },
    { nom: 'Comores', code: 'KM', dialCode: '+269' },
    { nom: 'Congo', code: 'CG', dialCode: '+242' },
    { nom: 'Congo, République démocratique du', code: 'CD', dialCode: '+243' },
    { nom: 'Îles Cook', code: 'CK', dialCode: '+682' },
    { nom: 'Costa Rica', code: 'CR', dialCode: '+506' },
    { nom: 'Croatie', code: 'HR', dialCode: '+385' },
    { nom: 'Cuba', code: 'CU', dialCode: '+53' },
    { nom: 'Curaçao', code: 'CW', dialCode: '+599' },
    { nom: 'Chypre', code: 'CY', dialCode: '+357' },
    { nom: 'Tchéquie', code: 'CZ', dialCode: '+420' },
    { nom: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225' },
    { nom: 'Danemark', code: 'DK', dialCode: '+45' },
    { nom: 'Djibouti', code: 'DJ', dialCode: '+253' },
    { nom: 'Dominique', code: 'DM', dialCode: '+1-767' },
    { nom: 'République dominicaine', code: 'DO', dialCode: '+1-809' },
    { nom: 'Équateur', code: 'EC', dialCode: '+593' },
    { nom: 'Égypte', code: 'EG', dialCode: '+20' },
    { nom: 'El Salvador', code: 'SV', dialCode: '+503' },
    { nom: 'Guinée équatoriale', code: 'GQ', dialCode: '+240' },
    { nom: 'Érythrée', code: 'ER', dialCode: '+291' },
    { nom: 'Estonie', code: 'EE', dialCode: '+372' },
    { nom: 'Eswatini', code: 'SZ', dialCode: '+268' },
    { nom: 'Éthiopie', code: 'ET', dialCode: '+251' },
    { nom: 'Îles Falkland (Malvinas)', code: 'FK', dialCode: '' },
    { nom: 'Îles Féroé', code: 'FO', dialCode: '' },
    { nom: 'Fidji', code: 'FJ', dialCode: '+679' },
    { nom: 'Finlande', code: 'FI', dialCode: '+358' },
    { nom: 'France', code: 'FR', dialCode: '+33' },
    { nom: 'Guyane française', code: 'GF', dialCode: '+594' },
    { nom: 'Polynésie française', code: 'PF', dialCode: '+689' },
    { nom: 'Terres australes françaises', code: 'TF', dialCode: '' },
    { nom: 'Gabon', code: 'GA', dialCode: '+241' },
    { nom: 'Gambie', code: 'GM', dialCode: '+220' },
    { nom: 'Géorgie', code: 'GE', dialCode: '+995' },
    { nom: 'Allemagne', code: 'DE', dialCode: '+49' },
    { nom: 'Ghana', code: 'GH', dialCode: '+233' },
    { nom: 'Gibraltar', code: 'GI', dialCode: '+350' },
    { nom: 'Grèce', code: 'GR', dialCode: '+30' },
    { nom: 'Groenland', code: 'GL', dialCode: '+299' },
    { nom: 'Grenade', code: 'GD', dialCode: '+1-473' },
    { nom: 'Guadeloupe', code: 'GP', dialCode: '+590' },
    { nom: 'Guam', code: 'GU', dialCode: '+1-671' },
    { nom: 'Guatemala', code: 'GT', dialCode: '+502' },
    { nom: 'Guernesey', code: 'GG', dialCode: '+44' },
    { nom: 'Guinée', code: 'GN', dialCode: '+224' },
    { nom: 'Guinée-Bissau', code: 'GW', dialCode: '+245' },
    { nom: 'Guyane', code: 'GY', dialCode: '+592' },
    { nom: 'Haïti', code: 'HT', dialCode: '+509' },
    { nom: 'Îles Heard et McDonald', code: 'HM', dialCode: '' },
    { nom: 'Saint-Siège (État de la Cité du Vatican)', code: 'VA', dialCode: '+379' },
    { nom: 'Honduras', code: 'HN', dialCode: '+504' },
    { nom: 'Hong Kong', code: 'HK', dialCode: '+852' },
    { nom: 'Hongrie', code: 'HU', dialCode: '+36' },
    { nom: 'Islande', code: 'IS', dialCode: '+354' },
    { nom: 'Inde', code: 'IN', dialCode: '+91' },
    { nom: 'Indonésie', code: 'ID', dialCode: '+62' },
    { nom: 'Iran, République islamique d\'', code: 'IR', dialCode: '+98' },
    { nom: 'Irak', code: 'IQ', dialCode: '+964' },
    { nom: 'Irlande', code: 'IE', dialCode: '+353' },
    { nom: 'Île de Man', code: 'IM', dialCode: '+44' },
    { nom: 'Israël', code: 'IL', dialCode: '+972' },
    { nom: 'Italie', code: 'IT', dialCode: '+39' },
    { nom: 'Jamaïque', code: 'JM', dialCode: '+1-876' },
    { nom: 'Japon', code: 'JP', dialCode: '+81' },
    { nom: 'Jersey', code: 'JE', dialCode: '+44' },
    { nom: 'Jordanie', code: 'JO', dialCode: '+962' },
    { nom: 'Kazakhstan', code: 'KZ', dialCode: '+7' },
    { nom: 'Kenya', code: 'KE', dialCode: '+254' },
    { nom: 'Kiribati', code: 'KI', dialCode: '+686' },
    { nom: 'Corée, République populaire démocratique de', code: 'KP', dialCode: '+850' },
    { nom: 'Corée, République de', code: 'KR', dialCode: '+82' },
    { nom: 'Koweït', code: 'KW', dialCode: '+965' },
    { nom: 'Kirghizistan', code: 'KG', dialCode: '+996' },
    { nom: 'République démocratique populaire lao', code: 'LA', dialCode: '+856' },
    { nom: 'Lettonie', code: 'LV', dialCode: '+371' },
    { nom: 'Liban', code: 'LB', dialCode: '+961' },
    { nom: 'Lesotho', code: 'LS', dialCode: '+266' },
    { nom: 'Libéria', code: 'LR', dialCode: '+231' },
    { nom: 'Libye', code: 'LY', dialCode: '+218' },
    { nom: 'Liechtenstein', code: 'LI', dialCode: '+423' },
    { nom: 'Lituanie', code: 'LT', dialCode: '+370' },
    { nom: 'Luxembourg', code: 'LU', dialCode: '+352' },
    { nom: 'Macao', code: 'MO', dialCode: '+853' },
    { nom: 'Madagascar', code: 'MG', dialCode: '+261' },
    { nom: 'Malawi', code: 'MW', dialCode: '+265' },
    { nom: 'Malaisie', code: 'MY', dialCode: '+60' },
    { nom: 'Maldives', code: 'MV', dialCode: '+960' },
    { nom: 'Mali', code: 'ML', dialCode: '+223' },
    { nom: 'Malte', code: 'MT', dialCode: '+356' },
    { nom: 'Îles Marshall', code: 'MH', dialCode: '+692' },
    { nom: 'Martinique', code: 'MQ', dialCode: '+596' },
    { nom: 'Mauritanie', code: 'MR', dialCode: '+222' },
    { nom: 'Maurice', code: 'MU', dialCode: '+230' },
    { nom: 'Mayotte', code: 'YT', dialCode: '+262' },
    { nom: 'Mexique', code: 'MX', dialCode: '+52' },
    { nom: 'Micronésie, États fédérés de', code: 'FM', dialCode: '+691' },
    { nom: 'Moldavie, République de', code: 'MD', dialCode: '+373' },
    { nom: 'Monaco', code: 'MC', dialCode: '+377' },
    { nom: 'Mongolie', code: 'MN', dialCode: '+976' },
    { nom: 'Monténégro', code: 'ME', dialCode: '+382' },
    { nom: 'Montserrat', code: 'MS', dialCode: '+1-664' },
    { nom: 'Maroc', code: 'MA', dialCode: '+212' },
    { nom: 'Mozambique', code: 'MZ', dialCode: '+258' },
    { nom: 'Myanmar', code: 'MM', dialCode: '+95' },
    { nom: 'Namibie', code: 'NA', dialCode: '+264' },
    { nom: 'Nauru', code: 'NR', dialCode: '+674' },
    { nom: 'Népal', code: 'NP', dialCode: '+977' },
    { nom: 'Pays-Bas', code: 'NL', dialCode: '+31' },
    { nom: 'Nouvelle-Calédonie', code: 'NC', dialCode: '+687' },
    { nom: 'Nouvelle-Zélande', code: 'NZ', dialCode: '+64' },
    { nom: 'Nicaragua', code: 'NI', dialCode: '+505' },
    { nom: 'Niger', code: 'NE', dialCode: '+227' },
    { nom: 'Nigeria', code: 'NG', dialCode: '+234' },
    { nom: 'Niue', code: 'NU', dialCode: '+683' },
    { nom: 'Île Norfolk', code: 'NF', dialCode: '+672' },
    { nom: 'Macédoine du Nord', code: 'MK', dialCode: '+389' },
    { nom: 'Îles Mariannes du Nord', code: 'MP', dialCode: '+1-670' },
    { nom: 'Norvège', code: 'NO', dialCode: '+47' },
    { nom: 'Oman', code: 'OM', dialCode: '+968' },
    { nom: 'Pakistan', code: 'PK', dialCode: '+92' },
    { nom: 'Palau', code: 'PW', dialCode: '+680' },
    { nom: 'Palestine, État de', code: 'PS', dialCode: '+970' },
    { nom: 'Panama', code: 'PA', dialCode: '+507' },
    { nom: 'Papouasie-Nouvelle-Guinée', code: 'PG', dialCode: '+675' },
    { nom: 'Paraguay', code: 'PY', dialCode: '+595' },
    { nom: 'Pérou', code: 'PE', dialCode: '+51' },
    { nom: 'Philippines', code: 'PH', dialCode: '+63' },
    { nom: 'Pitcairn', code: 'PN', dialCode: '' },
    { nom: 'Pologne', code: 'PL', dialCode: '+48' },
    { nom: 'Portugal', code: 'PT', dialCode: '+351' },
    { nom: 'Porto Rico', code: 'PR', dialCode: '+1-787' },
    { nom: 'Qatar', code: 'QA', dialCode: '+974' },
    { nom: 'Roumanie', code: 'RO', dialCode: '+40' },
    { nom: 'Fédération de Russie', code: 'RU', dialCode: '+7' },
    { nom: 'Rwanda', code: 'RW', dialCode: '+250' },
    { nom: 'Réunion', code: 'RE', dialCode: '+262' },
    { nom: 'Saint Barthélemy', code: 'BL', dialCode: '+590' },
    { nom: 'Sainte-Hélène, Ascension et Tristan da Cunha', code: 'SH', dialCode: '+290' },
    { nom: 'Saint-Kitts-et-Nevis', code: 'KN', dialCode: '+1-869' },
    { nom: 'Sainte-Lucie', code: 'LC', dialCode: '+1-758' },
    { nom: 'Saint Martin (partie française)', code: 'MF', dialCode: '+590' },
    { nom: 'Saint Pierre et Miquelon', code: 'PM', dialCode: '+508' },
    { nom: 'Saint-Vincent-et-les Grenadines', code: 'VC', dialCode: '+1-784' },
    { nom: 'Samoa', code: 'WS', dialCode: '+685' },
    { nom: 'Saint-Marin', code: 'SM', dialCode: '+378' },
    { nom: 'Sao Tomé-et-Principe', code: 'ST', dialCode: '+239' },
    { nom: 'Arabie Saoudite', code: 'SA', dialCode: '+966' },
    { nom: 'Sénégal', code: 'SN', dialCode: '+221' },
    { nom: 'Serbie', code: 'RS', dialCode: '+381' },
    { nom: 'Seychelles', code: 'SC', dialCode: '+248' },
    { nom: 'Sierra Leone', code: 'SL', dialCode: '+232' },
    { nom: 'Singapour', code: 'SG', dialCode: '+65' },
    { nom: 'Sint Maarten (partie néerlandaise)', code: 'SX', dialCode: '+1-721' },
    { nom: 'Slovaquie', code: 'SK', dialCode: '+421' },
    { nom: 'Slovénie', code: 'SI', dialCode: '+386' },
    { nom: 'Îles Salomon', code: 'SB', dialCode: '+677' },
    { nom: 'Somalie', code: 'SO', dialCode: '+252' },
    { nom: 'Afrique du Sud', code: 'ZA', dialCode: '+27' },
    { nom: 'Géorgie du Sud et îles Sandwich du Sud', code: 'GS', dialCode: '' },
    { nom: 'Soudan du Sud', code: 'SS', dialCode: '+211' },
    { nom: 'Espagne', code: 'ES', dialCode: '+34' },
    { nom: 'Sri Lanka', code: 'LK', dialCode: '+94' },
    { nom: 'Soudan', code: 'SD', dialCode: '+249' },
    { nom: 'Suriname', code: 'SR', dialCode: '+597' },
    { nom: 'Svalbard et Jan Mayen', code: 'SJ', dialCode: '' },
    { nom: 'Suède', code: 'SE', dialCode: '+46' },
    { nom: 'Suisse', code: 'CH', dialCode: '+41' },
    { nom: 'République arabe syrienne', code: 'SY', dialCode: '+963' },
    { nom: 'Taïwan, province de Chine', code: 'TW', dialCode: '+886' },
    { nom: 'Tadjikistan', code: 'TJ', dialCode: '+992' },
    { nom: 'Tanzanie, République-Unie de', code: 'TZ', dialCode: '+255' },
    { nom: 'Thaïlande', code: 'TH', dialCode: '+66' },
    { nom: 'Timor-Leste', code: 'TL', dialCode: '+670' },
    { nom: 'Togo', code: 'TG', dialCode: '+228' },
    { nom: 'Tokelau', code: 'TK', dialCode: '+690' },
    { nom: 'Tonga', code: 'TO', dialCode: '+676' },
    { nom: 'Trinité-et-Tobago', code: 'TT', dialCode: '+1-868' },
    { nom: 'Tunisie', code: 'TN', dialCode: '+216' },
    { nom: 'Turquie', code: 'TR', dialCode: '+90' },
    { nom: 'Turkménistan', code: 'TM', dialCode: '+993' },
    { nom: 'Îles Turques-et-Caïques', code: 'TC', dialCode: '+1-649' },
    { nom: 'Tuvalu', code: 'TV', dialCode: '+688' },
    { nom: 'Ouganda', code: 'UG', dialCode: '+256' },
    { nom: 'Ukraine', code: 'UA', dialCode: '+380' },
    { nom: 'Émirats arabes unis', code: 'AE', dialCode: '+971' },
    { nom: 'Royaume-Uni', code: 'GB', dialCode: '+44' },
    { nom: 'États-Unis', code: 'US', dialCode: '+1' },
    { nom: 'Îles mineures éloignées des États-Unis', code: 'UM', dialCode: '' },
    { nom: 'Uruguay', code: 'UY', dialCode: '+598' },
    { nom: 'Ouzbékistan', code: 'UZ', dialCode: '+998' },
    { nom: 'Vanuatu', code: 'VU', dialCode: '+678' },
    { nom: 'Venezuela, République bolivarienne du', code: 'VE', dialCode: '+58' },
    { nom: 'Viet Nam', code: 'VN', dialCode: '+84' },
    { nom: 'Îles Vierges britanniques', code: 'VG', dialCode: '+1-284' },
    { nom: 'Îles Vierges américaines', code: 'VI', dialCode: '+1-340' },
    { nom: 'Wallis et Futuna', code: 'WF', dialCode: '' },
    { nom: 'Sahara Occidental', code: 'EH', dialCode: '+212' },
    { nom: 'Yémen', code: 'YE', dialCode: '+967' },
    { nom: 'Zambie', code: 'ZM', dialCode: '+260' },
    { nom: 'Zimbabwe', code: 'ZW', dialCode: '+263' },
    { nom: 'Îles Åland', code: 'AX', dialCode: '' },
  ];

  // Convert pays to countries format for compatibility
  const countries: Country[] = pays.map(p => ({
    name: p.nom,
    code: p.code,
    dialCode: p.dialCode
  }));

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

  // Fonction de validation du numéro de téléphone (chiffres uniquement, longueur minimale)
  const validatePhoneInput = (input: string, countryDialCode?: string): { isValid: boolean; error?: string } => {
    // Nettoyer l'entrée (supprimer espaces et caractères spéciaux)
    const cleanInput = input.replace(/[^\d]/g, '');
    
    // Vérifier si vide
    if (!cleanInput) {
      return { isValid: false, error: 'Le numéro de téléphone est requis' };
    }
    
    // Vérifier la longueur minimale
    if (cleanInput.length < 6) {
      return { isValid: false, error: 'Le numéro doit contenir au moins 6 chiffres' };
    }
    
    // Vérifier la longueur maximale (15 chiffres max selon ITU-T E.164)
    if (cleanInput.length > 15) {
      return { isValid: false, error: 'Le numéro ne peut pas dépasser 15 chiffres' };
    }
    
    // Validation spécifique selon le pays (optionnel)
    if (countryDialCode) {
      switch (countryDialCode) {
        case '+33': // France
          if (cleanInput.length !== 9) {
            return { isValid: false, error: 'Le numéro français doit contenir 9 chiffres' };
          }
          break;
        case '+237': // Cameroun
          if (cleanInput.length !== 9) {
            return { isValid: false, error: 'Le numéro camerounais doit contenir 9 chiffres' };
          }
          break;
        case '+1': // USA/Canada
          if (cleanInput.length !== 10) {
            return { isValid: false, error: 'Le numéro doit contenir 10 chiffres' };
          }
          break;
        default:
          // Validation générale pour autres pays
          if (cleanInput.length < 7 || cleanInput.length > 12) {
            return { isValid: false, error: 'Le numéro doit contenir entre 7 et 12 chiffres' };
          }
      }
    }
    
    return { isValid: true };
  };

  // Fonction de validation du mot de passe (étape 2)
  const validatePassword = (password: string, confirmPassword: string): FormErrors => {
    const newErrors: FormErrors = {};
    const passwordStrength = evaluatePasswordStrength(password);
    const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (!isPasswordStrong) {
      newErrors.password = 'Le mot de passe ne respecte pas tous les critères';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'La confirmation du mot de passe est requise';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const [passwordCriteria, setPasswordCriteria] = useState<PasswordStrength | null>(null);

  const handlePasswordChange = (password: string): void => {
    setNewPassword(password);
    
    // Mettre à jour les critères de mot de passe
    if (password) {
      setPasswordCriteria(evaluatePasswordStrength(password));
    } else {
      setPasswordCriteria(null);
    }
    
    // Effacer les erreurs de mot de passe
    setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
  };

  // Fonction de validation pour l'étape 1
  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    // Validation du nom complet
    const cleanedNomComplet = cleanFullName(nomComplet);
    if (!cleanedNomComplet) {
      newErrors.nomComplet = 'Le nom complet est requis';
    } else if (cleanedNomComplet.length < 2) {
      newErrors.nomComplet = 'Le nom doit contenir au moins 2 caractères';
    }

    // Validation du pays
    if (!selectedCountry) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }

    // Validation du numéro de téléphone
    const selectedCountryData = getSelectedCountryData();
    const phoneValidation = validatePhoneInput(phoneNumber, selectedCountryData?.dialCode);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fonction de validation pour l'étape 2
  const validateStep2 = (): boolean => {
    const passwordErrors = validatePassword(newPassword, confirmPassword);
    setErrors(passwordErrors);
    return Object.keys(passwordErrors).length === 0;
  };

  const handleVerifyIdentity = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateStep1()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const selectedCountryData = getSelectedCountryData();
      
      // Nettoyer les données avant envoi
      const cleanedNomComplet = cleanFullName(nomComplet);
      const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
      
      // Construire les données de vérification
      const verificationData = {
        username: cleanedNomComplet,
        telephone: `${selectedCountryData!.dialCode} ${cleanedPhoneNumber}`,
        pays: selectedCountryData!.name
      };

      console.log('Envoi des données de vérification:', verificationData);

      // Appel à l'endpoint de vérification
      const response = await axiosInstance.post('/auth/verify-identity', verificationData);
      
      // La réponse doit contenir un booléen indiquant si la vérification est réussie
      const isVerificationSuccessful = response.data === true || response.data.success === true;
      
      if (isVerificationSuccessful) {
        console.log('Vérification réussie - passage à l\'étape 2');
        setIsVerified(true);
        setStep(2);
      } else {
        // Si la vérification échoue
        setErrors({ 
          general: 'Vérification échouée. Les informations fournies ne correspondent à aucun compte.' 
        });
      }
      
    } catch (error: any) {
      console.error('Erreur de vérification:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      
      // Messages d'erreur spécifiques selon le type d'erreur
      let errorMessage = authError.message;
      
      if (authError.status === 404) {
        errorMessage = 'Aucun compte trouvé avec ces informations.';
      } else if (authError.status === 400) {
        errorMessage = 'Informations de vérification invalides.';
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateStep2()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      const selectedCountryData = getSelectedCountryData();
      
      // Nettoyer les données avant envoi
      const cleanedNomComplet = cleanFullName(nomComplet);
      const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
      
      const resetData = {
        username: cleanedNomComplet,
        telephone: `${selectedCountryData!.dialCode} ${cleanedPhoneNumber}`,
        pays: selectedCountryData!.name,
        password: newPassword
      };

      console.log('Envoi des données de réinitialisation:', resetData);

      // Appel à l'endpoint de réinitialisation de mot de passe
      const response = await axiosInstance.post('/auth/reset-password', resetData);
      
      // Vérifier le succès de la réinitialisation
      const isResetSuccessful = response.data === true || response.data.success === true;
      
      if (isResetSuccessful) {
        console.log('Réinitialisation réussie - redirection vers login');
        
        // Redirection vers la page de connexion avec un message de succès
        router.push('/auth/login?passwordReset=true');
      } else {
        setErrors({ general: 'Échec de la réinitialisation du mot de passe.' });
      }
      
    } catch (error: any) {
      console.error('Erreur de réinitialisation:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      setErrors({ general: authError.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = (): void => {
    setStep(1);
    setIsVerified(false);
    setNewPassword('');
    setConfirmPassword('');
    setErrors({});
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      {/* Header avec indicateur d'étape */}
      <div className="mb-8">
        <div className="flex items-center justify-center mb-4 w-full">
          <div className="flex items-center w-full max-w-md">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 1 
                ? 'bg-myibc-blue text-white' 
                : isVerified 
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
            }`}>
              {isVerified ? <CheckCircle className="w-4 h-4" /> : '1'}
            </div>
            <div className={`flex-1 h-2 mx-4 rounded-full ${isVerified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              step === 2 
                ? 'bg-myibc-blue text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
        </div>
        
        {/* Bouton retour positionné séparément */}
        {step === 2 && (
          <div className="flex justify-start mb-4">
            <button
              onClick={handleBackToStep1}
              className="flex items-center text-myibc-blue hover:text-myibc-blue/80 text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour
            </button>
          </div>
        )}
        
        <div className="text-center">
          <h3 className="text-lg font-semibold text-myibc-blue">
            {step === 1 ? 'Vérification d\'identité' : 'Nouveau mot de passe'}
          </h3>
          <p className="text-sm text-myibc-graytext mt-1">
            {step === 1 
              ? 'Confirmez votre identité pour réinitialiser votre mot de passe'
              : 'Choisissez un nouveau mot de passe sécurisé'
            }
          </p>
        </div>
      </div>

      {/* Messages d'erreur généraux */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <XCircle className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-800 text-sm">{errors.general}</p>
          </div>
        </div>
      )}

      {/* Étape 1: Vérification d'identité */}
      {step === 1 && (
        <form onSubmit={handleVerifyIdentity} className="space-y-6">
          {/* Nom complet */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Nom complet
            </label>
            <input
              type="text"
              value={nomComplet}
              onChange={(e) => {
                setNomComplet(e.target.value);
                if (errors.nomComplet) setErrors(prev => ({ ...prev, nomComplet: '' }));
              }}
              placeholder="Votre nom complet"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                errors.nomComplet ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.nomComplet && (
              <p className="mt-1 text-sm text-red-600">{errors.nomComplet}</p>
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
                  const inputValue = e.target.value;
                  
                  // Nettoyer automatiquement l'entrée
                  const cleanedValue = inputValue.replace(/[^\d]/g, '');
                  
                  // Validation en temps réel
                  const validation = validatePhoneInput(cleanedValue, selectedCountryData?.dialCode);
                  
                  // Mettre à jour la valeur (toujours nettoyer)
                  setPhoneNumber(cleanedValue);
                  
                  // Mettre à jour les erreurs
                  if (!validation.isValid && cleanedValue.length > 0) {
                    setErrors(prev => ({ ...prev, phoneNumber: validation.error }));
                  } else {
                    setErrors(prev => ({ ...prev, phoneNumber: '' }));
                  }
                  
                  // Afficher un avertissement si des caractères non autorisés ont été supprimés
                  if (inputValue !== cleanedValue && inputValue.length > 0) {
                    // Temporairement afficher l'erreur
                    setErrors(prev => ({ ...prev, phoneNumber: 'Seuls les chiffres sont autorisés' }));
                    // Effacer l'erreur après 2 secondes
                    setTimeout(() => {
                      setErrors(prev => {
                        if (prev.phoneNumber === 'Seuls les chiffres sont autorisés') {
                          const newValidation = validatePhoneInput(cleanedValue, selectedCountryData?.dialCode);
                          return { ...prev, phoneNumber: newValidation.isValid ? '' : newValidation.error || '' };
                        }
                        return prev;
                      });
                    }, 2000);
                  }
                }}
                onBlur={() => {
                  // Validation finale au blur
                  const validation = validatePhoneInput(phoneNumber, selectedCountryData?.dialCode);
                  if (!validation.isValid) {
                    setErrors(prev => ({ ...prev, phoneNumber: validation.error }));
                  }
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
              {selectedCountryData?.dialCode === '+33' ? 'Format: 123456789 (9 chiffres)' :
               selectedCountryData?.dialCode === '+237' ? 'Format: 123456789 (9 chiffres)' :
               selectedCountryData?.dialCode === '+1' ? 'Format: 1234567890 (10 chiffres)' :
               'Saisissez votre numéro sans l\'indicatif pays (chiffres uniquement)'}
            </p>
          </div>

          {/* Aperçu du numéro complet */}
          {selectedCountryData && phoneNumber && !errors.phoneNumber && (
            <div className="bg-myibc-gold/10 border border-myibc-gold/30 rounded-lg p-3">
              <p className="text-sm text-myibc-blue">
                <strong>Numéro complet:</strong> {selectedCountryData.dialCode} {phoneNumber}
              </p>
            </div>
          )}

          {/* Bouton de vérification */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Vérification...
              </div>
            ) : (
              'Vérifier mon identité'
            )}
          </button>
        </form>
      )}

      {/* Étape 2: Nouveau mot de passe */}
      {step === 2 && (
        <form onSubmit={handleResetPassword} className="space-y-6">
          {/* Confirmation de vérification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <p className="text-sm text-green-800">
                Identité vérifiée avec succès ! Vous pouvez maintenant définir un nouveau mot de passe.
              </p>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <Lock className="w-4 h-4 inline mr-1" />
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                placeholder="Votre nouveau mot de passe"
                className={`w-full px-4 py-3 pr-12 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-myibc-graytext hover:text-myibc-blue"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}

            {/* Indicateur de force du mot de passe */}
            {newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-myibc-blue mb-2">Critères du mot de passe :</p>
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    {passwordCriteria?.hasMinLength ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordCriteria?.hasMinLength ? 'text-green-700' : 'text-red-600'}>
                      Au moins 8 caractères
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordCriteria?.hasUpperCase ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordCriteria?.hasUpperCase ? 'text-green-700' : 'text-red-600'}>
                      Une lettre majuscule
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordCriteria?.hasLowerCase ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordCriteria?.hasLowerCase ? 'text-green-700' : 'text-red-600'}>
                      Une lettre minuscule
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    {passwordCriteria?.hasNumbers ? (
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span className={passwordCriteria?.hasNumbers ? 'text-green-700' : 'text-red-600'}>
                      Un chiffre
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirmation du nouveau mot de passe */}
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              Confirmation du nouveau mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                placeholder="Confirmez votre nouveau mot de passe"
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
            {confirmPassword && newPassword === confirmPassword && (
              <p className="mt-1 text-sm text-green-600 flex items-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Les mots de passe correspondent
              </p>
            )}
          </div>

          {/* Bouton de réinitialisation */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
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
        </form>
      )}

      {/* Lien de retour vers la connexion */}
      <div className="text-center pt-6 border-t border-gray-200 mt-8">
        <Link 
          href="/auth/login"
          className="inline-flex items-center text-sm text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
};
