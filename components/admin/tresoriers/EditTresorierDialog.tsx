"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Edit, CheckCircle, ChevronDown, Phone, Globe, User } from "lucide-react";
import axiosInstance from "@/components/request/reques";

interface Tresorier {
  id: number;
  username: string;
  email?: string;
  telephone?: string;
  pays?: string;
}

interface FormErrors {
  username?: string;
  country?: string;
  phoneNumber?: string;
}

// Type pour les pays
interface Pays {
  nom: string;
  code: string;
  dialCode: string;
}

// Fonctions utilitaires
const cleanPhoneNumber = (phone: string): string => {
  return phone.replace(/[\s\-\.\(\)]/g, '');
};

const parsePhoneNumber = (fullPhone: string): { dialCode: string; number: string } => {
  if (!fullPhone) return { dialCode: '', number: '' };
  
  const phoneStr = fullPhone.trim();
  
  // Rechercher l'indicatif dans la chaîne
  for (const pays of paysList) {
    if (pays.dialCode && phoneStr.startsWith(pays.dialCode)) {
      return {
        dialCode: pays.dialCode,
        number: phoneStr.substring(pays.dialCode.length).trim()
      };
    }
  }
  
  return { dialCode: '', number: phoneStr };
};

// Liste complète des pays
const paysList: Pays[] = [
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

export function EditTresorierDialog({
  tresorier,
  onSuccess,
}: {
  tresorier: Tresorier;
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [username, setUsername] = useState(tresorier.username);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');

  // Initialiser les données du téléphone au chargement
  useEffect(() => {
    if (tresorier.telephone) {
      const { dialCode, number } = parsePhoneNumber(tresorier.telephone);
      setPhoneNumber(number);
      
      // Trouver le pays correspondant à l'indicatif
      const country = paysList.find(p => p.dialCode === dialCode);
      if (country) {
        setSelectedCountry(country.code);
      }
    }
    
    // Si on a les informations du pays du trésorier
    if (tresorier.pays && !selectedCountry) {
      const country = paysList.find(p => p.nom === tresorier.pays);
      if (country) {
        setSelectedCountry(country.code);
      }
    }
  }, [tresorier]);

  // Trouver le pays sélectionné
  const getSelectedCountryData = (): Pays | undefined => {
    return paysList.find(pays => pays.code === selectedCountry);
  };

  const handleCountrySelect = (countryCode: string): void => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setCountrySearch('');
    setErrors(prev => ({ ...prev, country: '' }));
  };

  // Filtrer les pays selon la recherche
  const filteredCountries = paysList.filter(pays =>
    pays.nom.toLowerCase().includes(countrySearch.toLowerCase()) ||
    pays.dialCode.includes(countrySearch)
  );

  // Fonction de validation du numéro de téléphone
  const validatePhoneInput = (input: string, countryDialCode?: string): { isValid: boolean; error?: string } => {
    const cleanInput = input.replace(/[^\d]/g, '');
    
    if (!cleanInput) {
      return { isValid: false, error: 'Le numéro de téléphone est requis' };
    }
    
    if (cleanInput.length < 6) {
      return { isValid: false, error: 'Le numéro doit contenir au moins 6 chiffres' };
    }
    
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

  const resetForm = () => {
    setUsername(tresorier.username);
    
    if (tresorier.telephone) {
      const { dialCode, number } = parsePhoneNumber(tresorier.telephone);
      setPhoneNumber(number);
      const country = paysList.find(p => p.dialCode === dialCode);
      setSelectedCountry(country?.code || '');
    } else {
      setPhoneNumber('');
      setSelectedCountry('');
    }
    
    setErrors({});
    setShowSuccess(false);
    setCountrySearch('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Nom requis.";
    }
    
    if (!getSelectedCountryData()) {
      newErrors.country = 'Veuillez sélectionner un pays';
    }
    
    const phoneValidation = validatePhoneInput(phoneNumber, getSelectedCountryData()?.dialCode);
    if (!phoneValidation.isValid) {
      newErrors.phoneNumber = phoneValidation.error;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const selectedCountryData = getSelectedCountryData();
      const cleanedPhoneNumber = cleanPhoneNumber(phoneNumber);
      const fullPhoneNumber = selectedCountryData ? 
        `${selectedCountryData.dialCode} ${cleanedPhoneNumber}` : cleanedPhoneNumber;

      await axiosInstance.put(`/tresorier/update/${tresorier.id}`, {
        username: username.trim(),
        telephone: fullPhoneNumber,
        pays: selectedCountryData?.nom
      });
      
      setShowSuccess(true);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setOpen(false);
        setShowSuccess(false);
      }, 1500);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Erreur lors de la modification du trésorier:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen && !isLoading) {
      resetForm();
    }
    setOpen(newOpen);
  };

  const selectedCountryData = getSelectedCountryData();

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start">
          <Edit className="h-4 w-4 mr-2" />
          Modifier
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#001F5B]">
            <Edit className="h-5 w-5" />
            Modifier le trésorier
          </DialogTitle>
          <DialogDescription>
            Modifiez les informations du trésorier puis validez.
          </DialogDescription>
        </DialogHeader>

        {showSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Trésorier modifié avec succès !
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Nom complet */}
            <div>
              <label className="block text-sm font-medium text-[#001F5B] mb-2">
                <User className="w-4 h-4 inline mr-1" />
                Nom complet
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Nom complet"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className={errors.username ? "border-red-500" : ""}
                disabled={isLoading}
              />
              {errors.username && (
                <span className="text-xs text-red-600">{errors.username}</span>
              )}
            </div>

            {/* Sélection du pays */}
            <div>
              <label className="block text-sm font-medium text-[#001F5B] mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Pays de provenance
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] bg-white text-left flex items-center justify-between hover:border-[#D4AF37] transition-colors ${
                    errors.country ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <span className={selectedCountryData ? 'text-[#001F5B]' : 'text-gray-500'}>
                    {selectedCountryData ? selectedCountryData.nom : 'Sélectionnez un pays'}
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
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37]"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((pays) => (
                          <button
                            key={pays.code}
                            type="button"
                            onClick={() => handleCountrySelect(pays.code)}
                            className="w-full px-4 py-3 text-left hover:bg-[#D4AF37]/10 focus:bg-[#D4AF37]/20 focus:outline-none text-[#001F5B] flex justify-between items-center"
                          >
                            <span>{pays.nom}</span>
                            <span className="text-sm text-gray-500">{pays.dialCode}</span>
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
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>

            {/* Champ numéro de téléphone */}
            <div>
              <label className="block text-sm font-medium text-[#001F5B] mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Numéro de téléphone
              </label>
              <div className="flex">
                {selectedCountryData && (
                  <div className="flex items-center px-4 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-[#001F5B] font-medium">
                    {selectedCountryData.dialCode}
                  </div>
                )}
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const cleanedValue = inputValue.replace(/[^\d]/g, '');
                    const validation = validatePhoneInput(cleanedValue, selectedCountryData?.dialCode);
                    
                    setPhoneNumber(cleanedValue);
                    
                    if (!validation.isValid && cleanedValue.length > 0) {
                      setErrors(prev => ({ ...prev, phoneNumber: validation.error }));
                    } else {
                      setErrors(prev => ({ ...prev, phoneNumber: '' }));
                    }
                  }}
                  placeholder="Votre numéro"
                  className={`flex-1 px-4 py-3 border shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] ${
                    selectedCountryData ? 'rounded-r-lg' : 'rounded-lg'
                  } ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'}`}
                  disabled={isLoading}
                />
              </div>
              {errors.phoneNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {selectedCountryData?.dialCode === '+33' ? 'Format: 123456789 (9 chiffres)' :
                 selectedCountryData?.dialCode === '+237' ? 'Format: 123456789 (9 chiffres)' :
                 selectedCountryData?.dialCode === '+1' ? 'Format: 1234567890 (10 chiffres)' :
                 'Saisissez votre numéro sans l\'indicatif pays (chiffres uniquement)'}
              </p>
            </div>

            {/* Aperçu du numéro complet */}
            {selectedCountryData && phoneNumber && !errors.phoneNumber && (
              <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-lg p-3">
                <p className="text-sm text-[#001F5B]">
                  <strong>Numéro complet:</strong> {selectedCountryData.dialCode} {phoneNumber}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              className="bg-[#D4AF37] hover:bg-[#c09c31] text-white"
              disabled={isLoading || showSuccess}
            >
              Modifier
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}