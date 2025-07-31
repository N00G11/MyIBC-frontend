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
import { SetStateAction, useState } from "react";

// Type pour les pays
interface Country {
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
  const pays: Country[] = [
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
    return pays.find(country => country.code === selectedCountry);
  };

  const handleCountrySelect = (countryCode: string): void => {
    setSelectedCountry(countryCode);
    setIsDropdownOpen(false);
    setCountrySearch('');
  };


  // Fonction de validation du numéro de téléphone (chiffres uniquement, longueur minimale)
  const validatePhoneInput = (input: string, countryDialCode?: string): { isValid: boolean; error?: string } => {
    // Nettoyer l'entrée
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

  // Filtrer les pays selon la recherche
  const filteredCountries = pays.filter(country =>
    country.nom.toLowerCase().includes(countrySearch.toLowerCase()) ||
    country.dialCode.includes(countrySearch)
  );

  // Mettre à jour le téléphone dans le formulaire avec nettoyage
  const updatePhoneInForm = (phone: string, country: string) => {
    const selectedCountryData = pays.find(c => c.code === country);
    if (selectedCountryData && phone) {
      const cleanedPhone = cleanPhoneNumber(phone);
      const fullPhone = `${selectedCountryData.dialCode} ${cleanedPhone}`;
      updateFormData({ telephone: fullPhone });
    } else {
      updateFormData({ telephone: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Nettoyer le nom complet avant soumission
    if (formData.nomComplet) {
      const cleanedNomComplet = cleanFullName(formData.nomComplet);
      updateFormData({ nomComplet: cleanedNomComplet });
    }
    
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
                    onChange={(e) => {
                      // Nettoyer automatiquement lors de la saisie
                      const cleanedValue = e.target.value.replace(/\s+/g, ' ');
                      updateFormData({ nomComplet: cleanedValue });
                    }}
                    onBlur={(e) => {
                      // Nettoyage final lors de la perte de focus
                      const cleanedValue = cleanFullName(e.target.value);
                      updateFormData({ nomComplet: cleanedValue });
                    }}
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
                        const inputValue = e.target.value;
                        
                        // Nettoyer automatiquement l'entrée
                        const cleanedValue = inputValue.replace(/[^\d]/g, '');
                        
                        // Validation en temps réel
                        const validation = validatePhoneInput(cleanedValue, selectedCountryData?.dialCode);
                        
                        // Mettre à jour les états locaux
                        setPhoneNumber(cleanedValue);
                        
                        // Mettre à jour le formulaire
                        updatePhoneInForm(cleanedValue, selectedCountry);
                        
                        // Afficher l'avertissement si des caractères ont été supprimés
                        if (inputValue !== cleanedValue && inputValue.length > 0) {
                          console.warn('Caractères non autorisés supprimés du numéro de téléphone');
                        }
                      }}
                      onBlur={() => {
                        // Validation finale au blur
                        const validation = validatePhoneInput(phoneNumber, selectedCountryData?.dialCode);
                        if (!validation.isValid && phoneNumber.length > 0) {
                          console.warn('Numéro de téléphone invalide:', validation.error);
                        }
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
                    {selectedCountryData?.dialCode === '+33' ? 'Format: 123456789 (9 chiffres)' :
                     selectedCountryData?.dialCode === '+237' ? 'Format: 123456789 (9 chiffres)' :
                     selectedCountryData?.dialCode === '+1' ? 'Format: 1234567890 (10 chiffres)' :
                     'Saisissez le numéro sans l\'indicatif pays (chiffres uniquement)'}
                  </p>

                  {/* Aperçu du numéro complet */}
                  {selectedCountryData && phoneNumber && (
                    <div className="bg-myibc-blue/10 border border-myibc-blue/30 rounded-lg p-3 mt-2">
                      <p className="text-sm text-myibc-blue">
                        <strong>Numéro complet:</strong> {selectedCountryData.dialCode} {phoneNumber}
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