'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronDown, Phone, Globe, User, Lock, Eye, EyeOff } from 'lucide-react';
import axiosInstance from '@/components/request/reques';
import { 
  parseAuthError, 
  validateAuthResponse, 
  saveAuthData, 
  getRedirectPath 
} from '@/lib/auth-utils';

// Types pour les erreurs
interface FormErrors {
  general?: string;
  password?: string;
  country?: string;
  phoneNumber?: string;
  myibcCode?: string;
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

export const LoginForm = () => {
  const router = useRouter();
  const [loginMethod, setLoginMethod] = useState<'phone' | 'code'>('phone');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [myibcCode, setMyibcCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Liste des pays avec leurs indicatifs
  const pays: Pays[] = [
    { nom: 'Afghanistan', code: 'AF', dialCode: '+93' },
    { nom: 'Afrique du Sud', code: 'ZA', dialCode: '+27' },
    { nom: 'Îles Åland', code: 'AX', dialCode: '+358' },
    { nom: 'Albanie', code: 'AL', dialCode: '+355' },
    { nom: 'Algérie', code: 'DZ', dialCode: '+213' },
    { nom: 'Allemagne', code: 'DE', dialCode: '+49' },
    { nom: 'Andorre', code: 'AD', dialCode: '+376' },
    { nom: 'Angola', code: 'AO', dialCode: '+244' },
    { nom: 'Anguilla', code: 'AI', dialCode: '+1-264' },
    { nom: 'Antigua-et-Barbuda', code: 'AG', dialCode: '+1-268' },
    { nom: 'Arabie saoudite', code: 'SA', dialCode: '+966' },
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
    { nom: 'Bélarus', code: 'BY', dialCode: '+375' },
    { nom: 'Belgique', code: 'BE', dialCode: '+32' },
    { nom: 'Belize', code: 'BZ', dialCode: '+501' },
    { nom: 'Bénin', code: 'BJ', dialCode: '+229' },
    { nom: 'Bermudes', code: 'BM', dialCode: '+1-441' },
    { nom: 'Bhoutan', code: 'BT', dialCode: '+975' },
    { nom: 'Bolivie, État plurinational de', code: 'BO', dialCode: '+591' },
    { nom: 'Bonaire, Saint-Eustache et Saba', code: 'BQ', dialCode: '+599' },
    { nom: 'Bosnie-Herzégovine', code: 'BA', dialCode: '+387' },
    { nom: 'Botswana', code: 'BW', dialCode: '+267' },
    { nom: 'Brésil', code: 'BR', dialCode: '+55' },
    { nom: 'Territoire britannique de l\'océan Indien', code: 'IO', dialCode: '+246' },
    { nom: 'Brunéi Darussalam', code: 'BN', dialCode: '+673' },
    { nom: 'Bulgarie', code: 'BG', dialCode: '+359' },
    { nom: 'Burkina Faso', code: 'BF', dialCode: '+226' },
    { nom: 'Burundi', code: 'BI', dialCode: '+257' },
    { nom: 'Cabo Verde', code: 'CV', dialCode: '+238' },
    { nom: 'Îles Caïmans', code: 'KY', dialCode: '+1-345' },
    { nom: 'Cambodge', code: 'KH', dialCode: '+855' },
    { nom: 'Cameroun', code: 'CM', dialCode: '+237' },
    { nom: 'Canada', code: 'CA', dialCode: '+1' },
    { nom: 'République centrafricaine', code: 'CF', dialCode: '+236' },
    { nom: 'Chili', code: 'CL', dialCode: '+56' },
    { nom: 'Chine', code: 'CN', dialCode: '+86' },
    { nom: 'Île Christmas', code: 'CX', dialCode: '+61' },
    { nom: 'Chypre', code: 'CY', dialCode: '+357' },
    { nom: 'Îles Cocos (Keeling)', code: 'CC', dialCode: '+61' },
    { nom: 'Colombie', code: 'CO', dialCode: '+57' },
    { nom: 'Comores', code: 'KM', dialCode: '+269' },
    { nom: 'République du Congo', code: 'CG', dialCode: '+242' },
    { nom: 'République démocratique du Congo', code: 'CD', dialCode: '+243' },
    { nom: 'Îles Cook', code: 'CK', dialCode: '+682' },
    { nom: 'Corée du Nord', code: 'KP', dialCode: '+850' },
    { nom: 'Corée du Sud', code: 'KR', dialCode: '+82' },
    { nom: 'Costa Rica', code: 'CR', dialCode: '+506' },
    { nom: 'Côte d\'Ivoire', code: 'CI', dialCode: '+225' },
    { nom: 'Croatie', code: 'HR', dialCode: '+385' },
    { nom: 'Cuba', code: 'CU', dialCode: '+53' },
    { nom: 'Curaçao', code: 'CW', dialCode: '+599' },
    { nom: 'Danemark', code: 'DK', dialCode: '+45' },
    { nom: 'Djibouti', code: 'DJ', dialCode: '+253' },
    { nom: 'Dominique', code: 'DM', dialCode: '+1-767' },
    { nom: 'République dominicaine', code: 'DO', dialCode: '+1-809' },
    { nom: 'Égypte', code: 'EG', dialCode: '+20' },
    { nom: 'El Salvador', code: 'SV', dialCode: '+503' },
    { nom: 'Émirats arabes unis', code: 'AE', dialCode: '+971' },
    { nom: 'Équateur', code: 'EC', dialCode: '+593' },
    { nom: 'Érythrée', code: 'ER', dialCode: '+291' },
    { nom: 'Espagne', code: 'ES', dialCode: '+34' },
    { nom: 'Estonie', code: 'EE', dialCode: '+372' },
    { nom: 'Eswatini', code: 'SZ', dialCode: '+268' },
    { nom: 'États-Unis', code: 'US', dialCode: '+1' },
    { nom: 'Éthiopie', code: 'ET', dialCode: '+251' },
    { nom: 'Îles Falkland (Malvinas)', code: 'FK', dialCode: '+500' },
    { nom: 'Îles Féroé', code: 'FO', dialCode: '+298' },
    { nom: 'Fidji', code: 'FJ', dialCode: '+679' },
    { nom: 'Finlande', code: 'FI', dialCode: '+358' },
    { nom: 'France', code: 'FR', dialCode: '+33' },
    { nom: 'Gabon', code: 'GA', dialCode: '+241' },
    { nom: 'Gambie', code: 'GM', dialCode: '+220' },
    { nom: 'Géorgie', code: 'GE', dialCode: '+995' },
    { nom: 'Ghana', code: 'GH', dialCode: '+233' },
    { nom: 'Gibraltar', code: 'GI', dialCode: '+350' },
    { nom: 'Grèce', code: 'GR', dialCode: '+30' },
    { nom: 'Grenade', code: 'GD', dialCode: '+1-473' },
    { nom: 'Groenland', code: 'GL', dialCode: '+299' },
    { nom: 'Guadeloupe', code: 'GP', dialCode: '+590' },
    { nom: 'Guam', code: 'GU', dialCode: '+1-671' },
    { nom: 'Guatemala', code: 'GT', dialCode: '+502' },
    { nom: 'Guernesey', code: 'GG', dialCode: '+44' },
    { nom: 'Guinée', code: 'GN', dialCode: '+224' },
    { nom: 'Guinée-Bissau', code: 'GW', dialCode: '+245' },
    { nom: 'Guinée équatoriale', code: 'GQ', dialCode: '+240' },
    { nom: 'Guyana', code: 'GY', dialCode: '+592' },
    { nom: 'Guyane française', code: 'GF', dialCode: '+594' },
    { nom: 'Haïti', code: 'HT', dialCode: '+509' },
    { nom: 'Honduras', code: 'HN', dialCode: '+504' },
    { nom: 'Hong Kong', code: 'HK', dialCode: '+852' },
    { nom: 'Hongrie', code: 'HU', dialCode: '+36' },
    { nom: 'Île de Man', code: 'IM', dialCode: '+44' },
    { nom: 'Inde', code: 'IN', dialCode: '+91' },
    { nom: 'Indonésie', code: 'ID', dialCode: '+62' },
    { nom: 'Iran', code: 'IR', dialCode: '+98' },
    { nom: 'Irak', code: 'IQ', dialCode: '+964' },
    { nom: 'Irlande', code: 'IE', dialCode: '+353' },
    { nom: 'Islande', code: 'IS', dialCode: '+354' },
    { nom: 'Israël', code: 'IL', dialCode: '+972' },
    { nom: 'Italie', code: 'IT', dialCode: '+39' },
    { nom: 'Jamaïque', code: 'JM', dialCode: '+1-876' },
    { nom: 'Japon', code: 'JP', dialCode: '+81' },
    { nom: 'Jersey', code: 'JE', dialCode: '+44' },
    { nom: 'Jordanie', code: 'JO', dialCode: '+962' },
    { nom: 'Kazakhstan', code: 'KZ', dialCode: '+7' },
    { nom: 'Kenya', code: 'KE', dialCode: '+254' },
    { nom: 'Kirghizistan', code: 'KG', dialCode: '+996' },
    { nom: 'Kiribati', code: 'KI', dialCode: '+686' },
    { nom: 'Koweït', code: 'KW', dialCode: '+965' },
    { nom: 'Laos', code: 'LA', dialCode: '+856' },
    { nom: 'Lesotho', code: 'LS', dialCode: '+266' },
    { nom: 'Lettonie', code: 'LV', dialCode: '+371' },
    { nom: 'Liban', code: 'LB', dialCode: '+961' },
    { nom: 'Libéria', code: 'LR', dialCode: '+231' },
    { nom: 'Libye', code: 'LY', dialCode: '+218' },
    { nom: 'Liechtenstein', code: 'LI', dialCode: '+423' },
    { nom: 'Lituanie', code: 'LT', dialCode: '+370' },
    { nom: 'Luxembourg', code: 'LU', dialCode: '+352' },
    { nom: 'Macao', code: 'MO', dialCode: '+853' },
    { nom: 'Macédoine du Nord', code: 'MK', dialCode: '+389' },
    { nom: 'Madagascar', code: 'MG', dialCode: '+261' },
    { nom: 'Malaisie', code: 'MY', dialCode: '+60' },
    { nom: 'Malawi', code: 'MW', dialCode: '+265' },
    { nom: 'Maldives', code: 'MV', dialCode: '+960' },
    { nom: 'Mali', code: 'ML', dialCode: '+223' },
    { nom: 'Malte', code: 'MT', dialCode: '+356' },
    { nom: 'Îles Mariannes du Nord', code: 'MP', dialCode: '+1-670' },
    { nom: 'Maroc', code: 'MA', dialCode: '+212' },
    { nom: 'Îles Marshall', code: 'MH', dialCode: '+692' },
    { nom: 'Martinique', code: 'MQ', dialCode: '+596' },
    { nom: 'Maurice', code: 'MU', dialCode: '+230' },
    { nom: 'Mauritanie', code: 'MR', dialCode: '+222' },
    { nom: 'Mayotte', code: 'YT', dialCode: '+262' },
    { nom: 'Mexique', code: 'MX', dialCode: '+52' },
    { nom: 'Micronésie', code: 'FM', dialCode: '+691' },
    { nom: 'Moldavie', code: 'MD', dialCode: '+373' },
    { nom: 'Monaco', code: 'MC', dialCode: '+377' },
    { nom: 'Mongolie', code: 'MN', dialCode: '+976' },
    { nom: 'Monténégro', code: 'ME', dialCode: '+382' },
    { nom: 'Montserrat', code: 'MS', dialCode: '+1-664' },
    { nom: 'Mozambique', code: 'MZ', dialCode: '+258' },
    { nom: 'Myanmar', code: 'MM', dialCode: '+95' },
    { nom: 'Namibie', code: 'NA', dialCode: '+264' },
    { nom: 'Nauru', code: 'NR', dialCode: '+674' },
    { nom: 'Népal', code: 'NP', dialCode: '+977' },
    { nom: 'Nicaragua', code: 'NI', dialCode: '+505' },
    { nom: 'Niger', code: 'NE', dialCode: '+227' },
    { nom: 'Nigeria', code: 'NG', dialCode: '+234' },
    { nom: 'Niue', code: 'NU', dialCode: '+683' },
    { nom: 'Île Norfolk', code: 'NF', dialCode: '+672' },
    { nom: 'Norvège', code: 'NO', dialCode: '+47' },
    { nom: 'Nouvelle-Calédonie', code: 'NC', dialCode: '+687' },
    { nom: 'Nouvelle-Zélande', code: 'NZ', dialCode: '+64' },
    { nom: 'Oman', code: 'OM', dialCode: '+968' },
    { nom: 'Ouganda', code: 'UG', dialCode: '+256' },
    { nom: 'Ouzbékistan', code: 'UZ', dialCode: '+998' },
    { nom: 'Pakistan', code: 'PK', dialCode: '+92' },
    { nom: 'Palaos', code: 'PW', dialCode: '+680' },
    { nom: 'Palestine', code: 'PS', dialCode: '+970' },
    { nom: 'Panama', code: 'PA', dialCode: '+507' },
    { nom: 'Papouasie-Nouvelle-Guinée', code: 'PG', dialCode: '+675' },
    { nom: 'Paraguay', code: 'PY', dialCode: '+595' },
    { nom: 'Pays-Bas', code: 'NL', dialCode: '+31' },
    { nom: 'Pérou', code: 'PE', dialCode: '+51' },
    { nom: 'Philippines', code: 'PH', dialCode: '+63' },
    { nom: 'Îles Pitcairn', code: 'PN', dialCode: '+872' },
    { nom: 'Pologne', code: 'PL', dialCode: '+48' },
    { nom: 'Polynésie française', code: 'PF', dialCode: '+689' },
    { nom: 'Porto Rico', code: 'PR', dialCode: '+1-787' },
    { nom: 'Portugal', code: 'PT', dialCode: '+351' },
    { nom: 'Qatar', code: 'QA', dialCode: '+974' },
    { nom: 'République tchèque', code: 'CZ', dialCode: '+420' },
    { nom: 'Réunion', code: 'RE', dialCode: '+262' },
    { nom: 'Roumanie', code: 'RO', dialCode: '+40' },
    { nom: 'Royaume-Uni', code: 'GB', dialCode: '+44' },
    { nom: 'Russie', code: 'RU', dialCode: '+7' },
    { nom: 'Rwanda', code: 'RW', dialCode: '+250' },
    { nom: 'Sahara occidental', code: 'EH', dialCode: '+212' },
    { nom: 'Saint-Barthélemy', code: 'BL', dialCode: '+590' },
    { nom: 'Sainte-Hélène, Ascension et Tristan da Cunha', code: 'SH', dialCode: '+290' },
    { nom: 'Sainte-Lucie', code: 'LC', dialCode: '+1-758' },
    { nom: 'Saint-Kitts-et-Nevis', code: 'KN', dialCode: '+1-869' },
    { nom: 'Saint-Marin', code: 'SM', dialCode: '+378' },
    { nom: 'Saint-Martin (partie française)', code: 'MF', dialCode: '+590' },
    { nom: 'Saint-Pierre-et-Miquelon', code: 'PM', dialCode: '+508' },
    { nom: 'Saint-Siège', code: 'VA', dialCode: '+379' },
    { nom: 'Saint-Vincent-et-les-Grenadines', code: 'VC', dialCode: '+1-784' },
    { nom: 'Îles Salomon', code: 'SB', dialCode: '+677' },
    { nom: 'Samoa', code: 'WS', dialCode: '+685' },
    { nom: 'Samoa américaines', code: 'AS', dialCode: '+1-684' },
    { nom: 'Sao Tomé-et-Principe', code: 'ST', dialCode: '+239' },
    { nom: 'Sénégal', code: 'SN', dialCode: '+221' },
    { nom: 'Serbie', code: 'RS', dialCode: '+381' },
    { nom: 'Seychelles', code: 'SC', dialCode: '+248' },
    { nom: 'Sierra Leone', code: 'SL', dialCode: '+232' },
    { nom: 'Singapour', code: 'SG', dialCode: '+65' },
    { nom: 'Sint Maarten (partie néerlandaise)', code: 'SX', dialCode: '+1-721' },
    { nom: 'Slovaquie', code: 'SK', dialCode: '+421' },
    { nom: 'Slovénie', code: 'SI', dialCode: '+386' },
    { nom: 'Somalie', code: 'SO', dialCode: '+252' },
    { nom: 'Soudan', code: 'SD', dialCode: '+249' },
    { nom: 'Soudan du Sud', code: 'SS', dialCode: '+211' },
    { nom: 'Sri Lanka', code: 'LK', dialCode: '+94' },
    { nom: 'Suède', code: 'SE', dialCode: '+46' },
    { nom: 'Suisse', code: 'CH', dialCode: '+41' },
    { nom: 'Suriname', code: 'SR', dialCode: '+597' },
    { nom: 'Svalbard et Jan Mayen', code: 'SJ', dialCode: '+47' },
    { nom: 'Syrie', code: 'SY', dialCode: '+963' },
    { nom: 'Tadjikistan', code: 'TJ', dialCode: '+992' },
    { nom: 'Taïwan', code: 'TW', dialCode: '+886' },
    { nom: 'Tanzanie', code: 'TZ', dialCode: '+255' },
    { nom: 'Tchad', code: 'TD', dialCode: '+235' },
    { nom: 'Thaïlande', code: 'TH', dialCode: '+66' },
    { nom: 'Timor-Leste', code: 'TL', dialCode: '+670' },
    { nom: 'Togo', code: 'TG', dialCode: '+228' },
    { nom: 'Tokelau', code: 'TK', dialCode: '+690' },
    { nom: 'Tonga', code: 'TO', dialCode: '+676' },
    { nom: 'Trinité-et-Tobago', code: 'TT', dialCode: '+1-868' },
    { nom: 'Tunisie', code: 'TN', dialCode: '+216' },
    { nom: 'Turkménistan', code: 'TM', dialCode: '+993' },
    { nom: 'Turquie', code: 'TR', dialCode: '+90' },
    { nom: 'Îles Turques-et-Caïques', code: 'TC', dialCode: '+1-649' },
    { nom: 'Tuvalu', code: 'TV', dialCode: '+688' },
    { nom: 'Ukraine', code: 'UA', dialCode: '+380' },
    { nom: 'Uruguay', code: 'UY', dialCode: '+598' },
    { nom: 'Vanuatu', code: 'VU', dialCode: '+678' },
    { nom: 'Venezuela', code: 'VE', dialCode: '+58' },
    { nom: 'Viêt Nam', code: 'VN', dialCode: '+84' },
    { nom: 'Îles Vierges américaines', code: 'VI', dialCode: '+1-340' },
    { nom: 'Îles Vierges britanniques', code: 'VG', dialCode: '+1-284' },
    { nom: 'Wallis-et-Futuna', code: 'WF', dialCode: '+681' },
    { nom: 'Yémen', code: 'YE', dialCode: '+967' },
    { nom: 'Zambie', code: 'ZM', dialCode: '+260' },
    { nom: 'Zimbabwe', code: 'ZW', dialCode: '+263' },
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

  const handleLoginMethodChange = (method: 'phone' | 'code'): void => {
    setLoginMethod(method);
    setSelectedCountry('');
    setPhoneNumber('');
    setMyibcCode('');
    setPassword('');
    setCountrySearch('');
    setErrors({});
  };

  // Fonction pour valider le numéro de téléphone en temps réel
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
    
    // Vérifier la longueur maximale
    if (cleanInput.length > 15) {
      return { isValid: false, error: 'Le numéro ne peut pas dépasser 15 chiffres' };
    }
    
    // Validation spécifique selon le pays
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
          if (cleanInput.length < 7 || cleanInput.length > 12) {
            return { isValid: false, error: 'Le numéro doit contenir entre 7 et 12 chiffres' };
          }
      }
    }
    
    return { isValid: true };
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    }

    if (loginMethod === 'phone') {
      if (!getSelectedCountryData()) {
        newErrors.country = 'Veuillez sélectionner un pays';
      }
      
      // Utiliser la nouvelle validation
      const phoneValidation = validatePhoneInput(phoneNumber, getSelectedCountryData()?.dialCode);
      if (!phoneValidation.isValid) {
        newErrors.phoneNumber = phoneValidation.error;
      }
    } else {
      if (!myibcCode.trim()) {
        newErrors.myibcCode = 'Le code MyIBC est requis';
      }
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
    setErrors({}); // Clear previous errors

    try {
      let response;
      
      if (loginMethod === 'phone') {
        // Connexion par téléphone + mot de passe
        const selectedCountryData = getSelectedCountryData();
        // Nettoyer le numéro de téléphone avant de l'envoyer
        const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
        const fullPhoneNumber = selectedCountryData ? 
          `${selectedCountryData.dialCode} ${cleanedPhoneNumber}` : cleanedPhoneNumber;
        
        response = await axiosInstance.post('/auth/login/telephone', {
          telephone: fullPhoneNumber,
          password,
          pays: selectedCountryData?.name
        });
      } else {
        // Connexion par code MyIBC + mot de passe
        // Nettoyer le code MyIBC (supprimer les espaces)
        const cleanedCode = myibcCode.trim().replace(/\s+/g, '');
        
        response = await axiosInstance.post('/auth/login/code', {
          code: cleanedCode,
          password
        });
      }

      // Validation et normalisation de la réponse en utilisant les utilitaires
      const authData = validateAuthResponse(response.data);

      // Sauvegarde sécurisée en utilisant les utilitaires (qui gèrent automatiquement le stockage par rôle)
      saveAuthData(authData);

      // Redirection basée sur le rôle en utilisant les utilitaires
      const redirectPath = getRedirectPath(authData.role);

      console.log(`Connexion réussie - Rôle: ${authData.role}, Redirection vers: ${redirectPath}`);
      
      // Redirection
      router.push(redirectPath);
      
    } catch (error: any) {
      console.error('Erreur de connexion:', error);
      
      // Utiliser parseAuthError pour une gestion cohérente des erreurs
      const authError = parseAuthError(error);
      setErrors({ general: authError.message });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
      {/* Messages d'erreur généraux */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{errors.general}</p>
        </div>
      )}

      {/* Sélection de la méthode de connexion */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-myibc-blue mb-3">
          Méthode de connexion
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleLoginMethodChange('phone')}
            className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
              loginMethod === 'phone'
                ? 'bg-myibc-blue text-white border-myibc-blue shadow-md'
                : 'bg-white text-myibc-graytext border-gray-300 hover:border-myibc-blue hover:text-myibc-blue'
            }`}
          >
            <Phone className="w-4 h-4 inline mr-2" />
            Téléphone
          </button>
          <button
            type="button"
            onClick={() => handleLoginMethodChange('code')}
            className={`px-4 py-3 text-sm font-medium rounded-lg border transition-all duration-200 ${
              loginMethod === 'code'
                ? 'bg-myibc-blue text-white border-myibc-blue shadow-md'
                : 'bg-white text-myibc-graytext border-gray-300 hover:border-myibc-blue hover:text-myibc-blue'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Code MyIBC
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Connexion par numéro de téléphone */}
        {loginMethod === 'phone' && (
          <>
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
                    
                    // Mettre à jour la valeur
                    setPhoneNumber(cleanedValue);
                    
                    // Mettre à jour les erreurs
                    if (!validation.isValid && cleanedValue.length > 0) {
                      setErrors(prev => ({ ...prev, phoneNumber: validation.error }));
                    } else {
                      setErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }
                    
                    // Avertissement pour caractères supprimés
                    if (inputValue !== cleanedValue && inputValue.length > 0) {
                      setErrors(prev => ({ ...prev, phoneNumber: 'Seuls les chiffres sont autorisés' }));
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
          </>
        )}

        {/* Connexion par code MyIBC */}
        {loginMethod === 'code' && (
          <div>
            <label className="block text-sm font-medium text-myibc-blue mb-2">
              <User className="w-4 h-4 inline mr-1" />
              Code d'identification MyIBC
            </label>
            <input
              type="text"
              value={myibcCode}
              onChange={(e) => {
                setMyibcCode(e.target.value);
                if (errors.myibcCode) setErrors(prev => ({ ...prev, myibcCode: '' }));
              }}
              placeholder="Votre code MyIBC"
              className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:border-myibc-blue ${
                errors.myibcCode ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.myibcCode && (
              <p className="mt-1 text-sm text-red-600">{errors.myibcCode}</p>
            )}
            <p className="text-xs text-myibc-graytext mt-1">
              Code fourni lors de la création de votre compte
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
        </div>

        {/* Bouton de connexion */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-myibc-blue text-white py-3 px-4 rounded-lg hover:bg-myibc-blue/90 focus:outline-none focus:ring-2 focus:ring-myibc-blue focus:ring-offset-2 transition duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Connexion...
            </div>
          ) : (
            'Se connecter'
          )}
        </button>

        {/* Mot de passe oublié */}
        <div className="text-center">
          <Link 
            href="/auth/forgot-password"
            className="text-sm text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
          >
            Mot de passe oublié ?
          </Link>
        </div>

        {/* Lien vers création de compte */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-myibc-graytext">
            Pas encore de compte ?{' '}
            <Link 
              href="/auth/register"
              className="text-myibc-blue hover:text-myibc-blue/80 font-medium hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
