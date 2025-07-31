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
  nomComplet?: string;
  country?: string;
  phoneNumber?: string;
  password?: string;
}

// Type pour les pays - corrigé pour correspondre aux données
interface Pays {
  nom: string;
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
    nomComplet: '',
    phoneNumber: '',
    password: ''
  });
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [countrySearch, setCountrySearch] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});

  
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

  // Trouver le pays sélectionné - corrigé
  const getSelectedCountryData = (): Pays | undefined => {
    return paysList.find(country => country.code === selectedCountry);
  };

  const handleCountrySelect = (countryCode: string): void => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setCountrySearch('');
    setErrors(prev => ({ ...prev, country: '' }));
  };

  // Filtrer les pays selon la recherche - corrigé
  const filteredCountries = paysList.filter(country =>
    country.nom.toLowerCase().includes(countrySearch.toLowerCase()) ||
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

    // Validation nom complet
    if (!formData.nomComplet.trim()) {
      newErrors.nomComplet = 'Le nom complet est requis';
    } else if (formData.nomComplet.trim().length < 2) {
      newErrors.nomComplet = 'Le nom complet doit contenir au moins 2 caractères';
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
      
      const username = formData.nomComplet.trim();
      const telephone = `${selectedCountryData!.dialCode} ${formData.phoneNumber}`;
      
      await axiosInstance.post("/tresoriers", {
        username,
        telephone,
        pays: selectedCountryData!.nom, // corrigé: nom au lieu de name
        password: formData.password,
      });
      
      setFormData({
        nomComplet: '',
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
          {/* Nom complet */}
          <div className="space-y-2">
            <Label htmlFor="nomComplet" className="flex items-center gap-1">
              <User className="w-4 h-4" />
              Nom complet
            </Label>
            <Input
              id="nomComplet"
              value={formData.nomComplet}
              onChange={(e) => handleInputChange('nomComplet', e.target.value)}
              placeholder="Nom complet du trésorier"
              className={errors.nomComplet ? 'border-red-300' : ''}
            />
            {errors.nomComplet && (
              <p className="text-sm text-red-600">{errors.nomComplet}</p>
            )}
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
                  {selectedCountryData ? selectedCountryData.nom : 'Sélectionnez un pays'}
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
                          <span>{country.nom}</span>
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