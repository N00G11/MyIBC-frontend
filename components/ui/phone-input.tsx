"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Phone, Check, AlertCircle, Smartphone, Home, Globe, ChevronDown, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  validateInternationalPhone, 
  detectPhoneType,
  getPhoneSuggestions 
} from "@/lib/participant-utils";

// Liste complète des indicatifs de pays du monde
const COUNTRY_CODES = [
  // Afrique
  { code: "+237", flag: "🇨🇲" }, // Cameroun
  { code: "+221", flag: "🇸🇳" }, // Sénégal
  { code: "+225", flag: "🇨🇮" }, // Côte d'Ivoire
  { code: "+226", flag: "🇧🇫" }, // Burkina Faso
  { code: "+227", flag: "🇳🇪" }, // Niger
  { code: "+228", flag: "🇹🇬" }, // Togo
  { code: "+229", flag: "🇧🇯" }, // Bénin
  { code: "+233", flag: "🇬🇭" }, // Ghana
  { code: "+234", flag: "🇳🇬" }, // Nigeria
  { code: "+235", flag: "🇹🇩" }, // Tchad
  { code: "+236", flag: "🇨🇫" }, // République centrafricaine
  { code: "+238", flag: "🇨🇻" }, // Cap-Vert
  { code: "+239", flag: "🇸🇹" }, // São Tomé-et-Principe
  { code: "+240", flag: "🇬🇶" }, // Guinée équatoriale
  { code: "+241", flag: "�🇦" }, // Gabon
  { code: "+242", flag: "�🇨�" }, // République du Congo
  { code: "+243", flag: "🇨🇩" }, // République démocratique du Congo
  { code: "+244", flag: "🇦🇴" }, // Angola
  { code: "+245", flag: "🇬🇼" }, // Guinée-Bissau
  { code: "+246", flag: "🇮🇴" }, // Territoire britannique de l'océan Indien
  { code: "+248", flag: "🇸🇨" }, // Seychelles
  { code: "+249", flag: "🇸🇩" }, // Soudan
  { code: "+250", flag: "🇷🇼" }, // Rwanda
  { code: "+251", flag: "��" }, // Éthiopie
  { code: "+252", flag: "🇸🇴" }, // Somalie
  { code: "+253", flag: "🇩🇯" }, // Djibouti
  { code: "+254", flag: "🇰🇪" }, // Kenya
  { code: "+255", flag: "🇹🇿" }, // Tanzanie
  { code: "+256", flag: "🇺🇬" }, // Ouganda
  { code: "+257", flag: "🇧🇮" }, // Burundi
  { code: "+258", flag: "🇲🇿" }, // Mozambique
  { code: "+260", flag: "��" }, // Zambie
  { code: "+261", flag: "🇲🇬" }, // Madagascar
  { code: "+262", flag: "🇷🇪" }, // Réunion
  { code: "+263", flag: "🇿🇼" }, // Zimbabwe
  { code: "+264", flag: "🇳🇦" }, // Namibie
  { code: "+265", flag: "🇲🇼" }, // Malawi
  { code: "+266", flag: "🇱🇸" }, // Lesotho
  { code: "+267", flag: "🇧🇼" }, // Botswana
  { code: "+268", flag: "🇸🇿" }, // Eswatini
  { code: "+269", flag: "🇰🇲" }, // Comores
  { code: "+27", flag: "🇿🇦" }, // Afrique du Sud
  { code: "+212", flag: "🇲🇦" }, // Maroc
  { code: "+213", flag: "🇩🇿" }, // Algérie
  { code: "+216", flag: "🇹🇳" }, // Tunisie
  { code: "+218", flag: "🇱🇾" }, // Libye
  { code: "+220", flag: "🇬🇲" }, // Gambie
  { code: "+222", flag: "��" }, // Mauritanie
  { code: "+223", flag: "🇲🇱" }, // Mali
  { code: "+224", flag: "🇬🇳" }, // Guinée
  
  // Europe
  { code: "+33", flag: "🇫🇷" }, // France
  { code: "+49", flag: "🇩🇪" }, // Allemagne
  { code: "+44", flag: "🇬🇧" }, // Royaume-Uni
  { code: "+34", flag: "��" }, // Espagne
  { code: "+39", flag: "🇮🇹" }, // Italie
  { code: "+32", flag: "�🇧🇪" }, // Belgique
  { code: "+41", flag: "🇨🇭" }, // Suisse
  { code: "+31", flag: "🇳🇱" }, // Pays-Bas
  { code: "+43", flag: "🇦🇹" }, // Autriche
  { code: "+351", flag: "🇵🇹" }, // Portugal
  { code: "+30", flag: "🇬🇷" }, // Grèce
  { code: "+353", flag: "🇮🇪" }, // Irlande
  { code: "+45", flag: "🇩🇰" }, // Danemark
  { code: "+46", flag: "🇸🇪" }, // Suède
  { code: "+47", flag: "🇳🇴" }, // Norvège
  { code: "+358", flag: "🇫🇮" }, // Finlande
  { code: "+354", flag: "🇮🇸" }, // Islande
  { code: "+48", flag: "🇵🇱" }, // Pologne
  { code: "+420", flag: "�🇿" }, // République tchèque
  { code: "+421", flag: "🇸🇰" }, // Slovaquie
  { code: "+36", flag: "🇭🇺" }, // Hongrie
  { code: "+40", flag: "🇷🇴" }, // Roumanie
  { code: "+359", flag: "🇧🇬" }, // Bulgarie
  { code: "+385", flag: "🇭🇷" }, // Croatie
  { code: "+386", flag: "🇸🇮" }, // Slovénie
  { code: "+381", flag: "��" }, // Serbie
  { code: "+382", flag: "🇲🇪" }, // Monténégro
  { code: "+383", flag: "🇽🇰" }, // Kosovo
  { code: "+387", flag: "🇧🇦" }, // Bosnie-Herzégovine
  { code: "+389", flag: "🇲🇰" }, // Macédoine du Nord
  { code: "+355", flag: "🇦🇱" }, // Albanie
  { code: "+370", flag: "��" }, // Lituanie
  { code: "+371", flag: "🇱🇻" }, // Lettonie
  { code: "+372", flag: "🇪🇪" }, // Estonie
  { code: "+375", flag: "🇧🇾" }, // Biélorussie
  { code: "+380", flag: "��" }, // Ukraine
  { code: "+373", flag: "🇲🇩" }, // Moldavie
  { code: "+7", flag: "🇷🇺" }, // Russie
  { code: "+377", flag: "🇲🇨" }, // Monaco
  { code: "+378", flag: "🇸🇲" }, // Saint-Marin
  { code: "+379", flag: "🇻🇦" }, // Vatican
  { code: "+376", flag: "🇦�" }, // Andorre
  { code: "+423", flag: "🇱🇮" }, // Liechtenstein
  { code: "+352", flag: "🇱🇺" }, // Luxembourg
  { code: "+356", flag: "🇲🇹" }, // Malte
  { code: "+357", flag: "🇨🇾" }, // Chypre
  
  // Amérique du Nord
  { code: "+1", flag: "��" }, // États-Unis/Canada
  { code: "+52", flag: "🇲🇽" }, // Mexique
  
  // Amérique Centrale
  { code: "+501", flag: "🇧🇿" }, // Belize
  { code: "+502", flag: "🇬🇹" }, // Guatemala
  { code: "+503", flag: "🇸🇻" }, // Salvador
  { code: "+504", flag: "🇭🇳" }, // Honduras
  { code: "+505", flag: "🇳🇮" }, // Nicaragua
  { code: "+506", flag: "��" }, // Costa Rica
  { code: "+507", flag: "🇵�🇦" }, // Panama
  
  // Amérique du Sud
  { code: "+54", flag: "🇦🇷" }, // Argentine
  { code: "+55", flag: "🇧🇷" }, // Brésil
  { code: "+56", flag: "🇨🇱" }, // Chili
  { code: "+57", flag: "🇨🇴" }, // Colombie
  { code: "+58", flag: "🇻🇪" }, // Venezuela
  { code: "+591", flag: "🇧🇴" }, // Bolivie
  { code: "+592", flag: "🇬🇾" }, // Guyana
  { code: "+593", flag: "🇪🇨" }, // Équateur
  { code: "+594", flag: "🇬🇫" }, // Guyane française
  { code: "+595", flag: "��" }, // Paraguay
  { code: "+596", flag: "🇲🇶" }, // Martinique
  { code: "+597", flag: "🇸🇷" }, // Suriname
  { code: "+598", flag: "🇺🇾" }, // Uruguay
  { code: "+51", flag: "🇵🇪" }, // Pérou
  
  // Asie
  { code: "+86", flag: "🇨🇳" }, // Chine
  { code: "+91", flag: "�🇳" }, // Inde
  { code: "+81", flag: "🇯🇵" }, // Japon
  { code: "+82", flag: "🇰🇷" }, // Corée du Sud
  { code: "+66", flag: "🇹🇭" }, // Thaïlande
  { code: "+84", flag: "🇻🇳" }, // Vietnam
  { code: "+65", flag: "🇸🇬" }, // Singapour
  { code: "+60", flag: "🇲🇾" }, // Malaisie
  { code: "+62", flag: "🇮🇩" }, // Indonésie
  { code: "+63", flag: "🇵🇭" }, // Philippines
  { code: "+95", flag: "🇲🇲" }, // Myanmar
  { code: "+855", flag: "��" }, // Cambodge
  { code: "+856", flag: "🇱🇦" }, // Laos
  { code: "+673", flag: "🇧🇳" }, // Brunei
  { code: "+670", flag: "🇹🇱" }, // Timor oriental
  { code: "+92", flag: "🇵🇰" }, // Pakistan
  { code: "+880", flag: "🇧🇩" }, // Bangladesh
  { code: "+94", flag: "🇱🇰" }, // Sri Lanka
  { code: "+960", flag: "🇲🇻" }, // Maldives
  { code: "+975", flag: "🇧�" }, // Bhoutan
  { code: "+977", flag: "🇳🇵" }, // Népal
  { code: "+93", flag: "🇦🇫" }, // Afghanistan
  { code: "+98", flag: "🇮🇷" }, // Iran
  { code: "+964", flag: "🇮🇶" }, // Irak
  { code: "+965", flag: "🇰🇼" }, // Koweït
  { code: "+966", flag: "🇸🇦" }, // Arabie saoudite
  { code: "+967", flag: "🇾🇪" }, // Yémen
  { code: "+968", flag: "🇴🇲" }, // Oman
  { code: "+971", flag: "🇦🇪" }, // Émirats arabes unis
  { code: "+972", flag: "🇮�" }, // Israël
  { code: "+973", flag: "🇧🇭" }, // Bahreïn
  { code: "+974", flag: "🇶🇦" }, // Qatar
  { code: "+961", flag: "🇱�🇧" }, // Liban
  { code: "+962", flag: "🇯🇴" }, // Jordanie
  { code: "+963", flag: "🇸🇾" }, // Syrie
  { code: "+90", flag: "🇹🇷" }, // Turquie
  { code: "+994", flag: "🇦🇿" }, // Azerbaïdjan
  { code: "+995", flag: "🇬🇪" }, // Géorgie
  { code: "+374", flag: "🇦🇲" }, // Arménie
  { code: "+992", flag: "🇹🇯" }, // Tadjikistan
  { code: "+996", flag: "🇰🇬" }, // Kirghizistan
  { code: "+998", flag: "🇺🇿" }, // Ouzbékistan
  { code: "+993", flag: "🇹🇲" }, // Turkménistan
  { code: "+7", flag: "🇰🇿" }, // Kazakhstan
  { code: "+976", flag: "🇲🇳" }, // Mongolie
  
  // Océanie
  { code: "+61", flag: "🇦🇺" }, // Australie
  { code: "+64", flag: "��" }, // Nouvelle-Zélande
  { code: "+679", flag: "�🇫🇯" }, // Fidji
  { code: "+685", flag: "🇼🇸" }, // Samoa
  { code: "+686", flag: "🇰🇮" }, // Kiribati
  { code: "+687", flag: "🇳🇨" }, // Nouvelle-Calédonie
  { code: "+688", flag: "🇹🇻" }, // Tuvalu
  { code: "+689", flag: "🇵🇫" }, // Polynésie française
  { code: "+690", flag: "🇹🇰" }, // Tokelau
  { code: "+691", flag: "🇫🇲" }, // Micronésie
  { code: "+692", flag: "🇲🇭" }, // Îles Marshall
  { code: "+508", flag: "🇵🇲" }, // Saint-Pierre-et-Miquelon
  { code: "+675", flag: "🇵🇬" }, // Papouasie-Nouvelle-Guinée
  { code: "+676", flag: "🇹🇴" }, // Tonga
  { code: "+677", flag: "��" }, // Îles Salomon
  { code: "+678", flag: "🇻🇺" }, // Vanuatu
  { code: "+680", flag: "🇵🇼" }, // Palaos
  { code: "+681", flag: "🇼🇫" }, // Wallis-et-Futuna
  { code: "+682", flag: "🇨🇰" }, // Îles Cook
  { code: "+683", flag: "🇳🇺" }, // Niue
  { code: "+684", flag: "🇦🇸" }, // Samoa américaines
  { code: "+850", flag: "��" }, // Corée du Nord
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
}

export function PhoneInput({ value, onChange, error, required = true }: PhoneInputProps) {
  const [countryCode, setCountryCode] = useState<string>("+237");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [phoneType, setPhoneType] = useState<'mobile' | 'landline' | 'unknown'>('unknown');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // États pour le dropdown d'indicatifs
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Assurer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filtrer les codes pays selon la recherche
  const filteredCodes = COUNTRY_CODES.filter(country => 
    country.code.includes(searchTerm) || 
    country.code.replace("+", "").includes(searchTerm)
  );

  // Fermer le dropdown quand on clique ailleurs avec meilleure isolation
  useEffect(() => {
    function handleClickOutside(event: Event) {
      const target = event.target as Element;
      
      // Vérifier si le clic est dans notre dropdown Portal
      if (dropdownRef.current && dropdownRef.current.contains(target)) {
        return; // Ne pas fermer si c'est dans notre dropdown
      }
      
      // Vérifier si le clic est sur le trigger
      if (triggerRef.current && triggerRef.current.contains(target)) {
        return; // Ne pas fermer si c'est sur le trigger
      }
      
      // Fermer pour tous les autres clics
      setIsOpen(false);
      setIsManualInput(false);
      setSearchTerm("");
    }
    
    if (isOpen) {
      // Délai pour permettre au clic du trigger de s'exécuter d'abord
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, { passive: true });
      }, 10);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen]);

  // Initialiser les valeurs depuis le prop value SEULEMENT une fois
  useEffect(() => {
    if (value && !isInitialized) {
      // Trouver l'indicatif le plus long qui correspond (pour éviter les conflits comme +1 vs +1...)
      const sortedCodes = COUNTRY_CODES.sort((a, b) => b.code.length - a.code.length);
      const foundCode = sortedCodes.find(country => value.startsWith(country.code));
      
      if (foundCode) {
        setCountryCode(foundCode.code);
        setPhoneNumber(value.substring(foundCode.code.length).trim());
      } else {
        // Si aucun indicatif reconnu, extraire manuellement le code si possible
        const match = value.match(/^(\+\d{1,4})\s*(.*)$/);
        if (match) {
          setCountryCode(match[1]);
          setPhoneNumber(match[2]);
        } else {
          setPhoneNumber(value);
        }
      }
      setIsInitialized(true);
    } else if (!value && !isInitialized) {
      setIsInitialized(true);
    }
  }, [value, isInitialized]);

  // Validation quand countryCode ou phoneNumber change
  useEffect(() => {
    if (phoneNumber) {
      const fullNumber = `${countryCode} ${phoneNumber}`;
      const validation = validateInternationalPhone(fullNumber);
      setIsValid(validation.isValid);
      setValidationError(validation.error || "");
      setPhoneType(detectPhoneType(fullNumber));
    } else {
      setIsValid(null);
      setValidationError("");
      setPhoneType('unknown');
    }
  }, [countryCode, phoneNumber]); // Retirer onChange des dépendances

  // Fonctions pour le dropdown
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSearchTerm(newValue);
    setIsManualInput(true);
    
    // Si l'utilisateur tape un indicatif valide, l'accepter
    if (newValue.startsWith('+') && newValue.length >= 2) {
      setCountryCode(newValue);
      onChange(phoneNumber ? `${newValue} ${phoneNumber}` : "");
    }
  };

  const handleCodeSelect = (code: string) => {
    // Arrêter immédiatement la propagation et fermer proprement
    setCountryCode(code);
    
    // Mise à jour du parent immédiatement
    const fullNumber = phoneNumber ? `${code} ${phoneNumber}` : "";
    onChange(fullNumber);
    
    // Nettoyage synchrone des états
    setInputValue(code);
    setSearchTerm("");
    setIsManualInput(false);
    setIsOpen(false);
  };

  const toggleDropdown = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    if (isOpen) {
      setIsOpen(false);
      setIsManualInput(false);
      setSearchTerm("");
    } else {
      // Calculer la position du dropdown avec meilleure précision
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 200;
        
        // Déterminer si le dropdown doit s'ouvrir vers le haut ou le bas
        const spaceBelow = viewportHeight - rect.bottom;
        const shouldOpenUpward = spaceBelow < dropdownHeight && rect.top > dropdownHeight;
        
        setDropdownPosition({
          top: shouldOpenUpward 
            ? rect.top + window.scrollY - dropdownHeight - 4
            : rect.bottom + window.scrollY + 4,
          left: rect.left + window.scrollX,
          width: 280
        });
        
        setIsOpen(true);
        
        // Focus différé pour éviter les conflits
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
    }
  };

  const selectedCountry = COUNTRY_CODES.find(country => country.code === countryCode);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Nettoyer et formater le numéro (retirer espaces, tirets, etc.)
    let cleanNumber = e.target.value.replace(/[^\d]/g, "");
    
    // Formater selon l'indicatif pays
    if (countryCode === "+237") {
      // Cameroun: xxx xxx xxx
      cleanNumber = cleanNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    } else if (countryCode === "+33") {
      // France: xx xx xx xx xx
      cleanNumber = cleanNumber.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, "$1 $2 $3 $4 $5");
    } else if (countryCode === "+49") {
      // Allemagne: xxx xxx xxx
      cleanNumber = cleanNumber.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
    } else if (countryCode === "+1") {
      // USA/Canada: xxx xxx xxxx
      cleanNumber = cleanNumber.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    } else {
      // Format générique: groupes de 3 chiffres
      cleanNumber = cleanNumber.replace(/(\d{3})(?=\d)/g, "$1 ");
    }
    
    setPhoneNumber(cleanNumber);
    
    // Mettre à jour le parent avec le numéro complet
    const fullNumber = cleanNumber ? `${countryCode} ${cleanNumber}` : "";
    onChange(fullNumber);
  };

  const handleCountryCodeChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    
    // Mettre à jour le parent avec le nouveau code pays
    const fullNumber = phoneNumber ? `${newCountryCode} ${phoneNumber}` : "";
    onChange(fullNumber);
  };

  const getInputBorderColor = () => {
    if (error || validationError) return "border-red-500";
    if (isValid === true) return "border-green-500";
    if (isValid === false) return "border-red-300";
    return "border-gray-300";
  };

  const getPhoneTypeIcon = () => {
    switch (phoneType) {
      case 'mobile':
        return (
          <div title="Mobile">
            <Smartphone className="h-4 w-4 text-blue-500" />
          </div>
        );
      case 'landline':
        return (
          <div title="Fixe">
            <Home className="h-4 w-4 text-green-500" />
          </div>
        );
      default:
        return <Phone className="h-4 w-4 text-gray-400" />;
    }
  };

  const getPlaceholder = () => {
    switch (countryCode) {
      case "+237": return "xxx xxx xxx";
      case "+33": return "xx xx xx xx xx";
      case "+49": return "xxx xxx xxx";
      case "+1": return "xxx xxx xxxx";
      default: return "xxx xxx xxx";
    }
  };
    return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-myibc-blue font-medium">
        {getPhoneTypeIcon()}
        Numéro de téléphone
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Champ unifié avec deux parties */}
        <div className={`flex items-center border rounded-md bg-white ${getInputBorderColor()}`}>
          {/* Partie indicatif pays (compacte) */}
          <div className="relative">
            <div 
              ref={triggerRef}
              className="flex items-center px-2 py-2 cursor-pointer border-r border-gray-200 min-w-[80px] hover:bg-gray-50"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown();
              }}
            >
              <span className="text-sm mr-1">{selectedCountry?.flag || "🌍"}</span>
              <span className="font-mono text-xs font-semibold">{countryCode}</span>
              <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
          
          {/* Partie numéro de téléphone (flexible) */}
          <div className="flex-1 relative">
            <Input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder={getPlaceholder()}
              className="border-0 focus:ring-0 shadow-none pr-8 rounded-l-none"
            />
            
            {/* Icône de validation */}
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              {isValid === true && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {(isValid === false || error) && (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown rendu dans un portail avec isolation complète */}
      {isMounted && isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={{
            position: 'fixed',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: dropdownPosition.width,
            zIndex: 999999,
            isolation: 'isolate'
          }}
          className="bg-white border border-gray-200 rounded-md shadow-xl"
          role="listbox"
          aria-label="Sélection d'indicatif pays"
        >
          {/* Champ de recherche/saisie manuelle */}
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                ref={inputRef}
                type="text"
                placeholder="Rechercher ou saisir (+237...)"
                value={isManualInput ? inputValue : searchTerm}
                onChange={handleInputChange}
                className="pl-7 text-xs h-8"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setIsOpen(false);
                    setIsManualInput(false);
                    setSearchTerm("");
                  }
                }}
              />
            </div>
          </div>
          
          {/* Liste des indicatifs */}
          <div className="overflow-y-auto max-h-40">
            {filteredCodes.length > 0 ? (
              filteredCodes.slice(0, 20).map((country) => (
                <div
                  key={country.code}
                  className="flex items-center px-2 py-1.5 hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCodeSelect(country.code)}
                >
                  <span className="text-sm mr-2">{country.flag}</span>
                  <span className="font-mono font-semibold text-xs">{country.code}</span>
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-xs text-gray-500">
                Aucun résultat
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
      
      {/* Aperçu du numéro complet */}
      {phoneNumber && (
        <div className="text-xs text-gray-600 flex items-center gap-1">
          <Globe className="h-3 w-3" />
          <span>Numéro complet: <span className="font-mono">{countryCode} {phoneNumber}</span></span>
        </div>
      )}
      
      {/* Messages d'erreur et d'aide */}
      {(error || validationError) && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="h-3 w-3" />
          {error || validationError}
        </div>
      )}
      
      {!error && !validationError && phoneNumber && isValid === true && (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <Check className="h-3 w-3" />
          <span>Numéro {phoneType === 'mobile' ? 'mobile' : phoneType === 'landline' ? 'fixe' : ''} valide</span>
        </div>
      )}
    </div>
  );
}
