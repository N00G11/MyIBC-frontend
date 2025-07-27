"use client";

import { useState, useEffect } from "react";
import { Calendar, Check, AlertCircle, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateBirthDate, calculateAge } from "@/lib/participant-utils";

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  minAge?: number;
  maxAge?: number;
  error?: string;
  required?: boolean;
}

export function DateInput({ 
  value, 
  onChange, 
  minAge, 
  maxAge, 
  error, 
  required = true 
}: DateInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [calculatedAge, setCalculatedAge] = useState<number | null>(null);
  const [showAgeInfo, setShowAgeInfo] = useState(false);

  // Calcule les limites de dates
  const getDateLimits = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    const currentDay = today.getDate().toString().padStart(2, '0');
    
    // Date maximum = aujourd'hui
    const maxDate = `${currentYear}-${currentMonth}-${currentDay}`;
    
    // Date minimum = il y a 120 ans
    const minDate = `${currentYear - 120}-${currentMonth}-${currentDay}`;
    
    // Si on a des limites d'âge, calculer les dates correspondantes
    let suggestedMin = minDate;
    let suggestedMax = maxDate;
    
    if (maxAge) {
      const minYear = currentYear - maxAge - 1;
      suggestedMin = `${minYear}-01-01`;
    }
    
    if (minAge) {
      const maxYear = currentYear - minAge;
      suggestedMax = `${maxYear}-${currentMonth}-${currentDay}`;
    }
    
    return { minDate, maxDate, suggestedMin, suggestedMax };
  };

  useEffect(() => {
    if (value) {
      const validation = validateBirthDate(value, minAge, maxAge);
      setIsValid(validation.isValid);
      setValidationError(validation.error || "");
      
      if (validation.isValid) {
        const age = calculateAge(value);
        setCalculatedAge(age);
        setShowAgeInfo(true);
      } else {
        setCalculatedAge(null);
        setShowAgeInfo(false);
      }
    } else {
      setIsValid(null);
      setValidationError("");
      setCalculatedAge(null);
      setShowAgeInfo(false);
    }
  }, [value, minAge, maxAge]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const getInputBorderColor = () => {
    if (error || validationError) return "border-red-500";
    if (isValid === true) return "border-green-500";
    if (isValid === false) return "border-red-300";
    return "border-gray-300";
  };

  const getAgeStatusColor = () => {
    if (!calculatedAge || !minAge || !maxAge) return "text-blue-600";
    
    if (calculatedAge >= minAge && calculatedAge <= maxAge) {
      return "text-green-600";
    }
    return "text-red-600";
  };

  const { minDate, maxDate, suggestedMin, suggestedMax } = getDateLimits();

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-myibc-blue font-medium">
        <Calendar className="h-4 w-4" />
        Date de naissance
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={handleChange}
          min={minDate}
          max={maxDate}
          className={`pr-10 ${getInputBorderColor()}`}
        />
        
        {/* Icône de validation */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isValid === true && (
            <Check className="h-4 w-4 text-green-500" />
          )}
          {(isValid === false || error) && (
            <AlertCircle className="h-4 w-4 text-red-500" />
          )}
        </div>
      </div>
      
      {/* Affichage de l'âge calculé */}
      {showAgeInfo && calculatedAge !== null && (
        <div className={`flex items-center gap-1 text-sm ${getAgeStatusColor()}`}>
          <Clock className="h-3 w-3" />
          Âge calculé : {calculatedAge} ans
          {minAge && maxAge && (
            <span className="text-gray-500 ml-1">
              (requis: {minAge}-{maxAge} ans)
            </span>
          )}
        </div>
      )}
      
      {/* Messages d'erreur */}
      {(error || validationError) && (
        <div className="flex items-center gap-1 text-red-600 text-sm">
          <AlertCircle className="h-3 w-3" />
          {error || validationError}
        </div>
      )}
      
      {/* Message de validation réussie */}
      {!error && !validationError && value && isValid === true && (
        <div className="flex items-center gap-1 text-green-600 text-sm">
          <Check className="h-3 w-3" />
          Date de naissance valide
        </div>
      )}
    </div>
  );
}
