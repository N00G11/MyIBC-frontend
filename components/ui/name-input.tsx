"use client";

import { useState, useEffect } from "react";
import { User, Check, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateName } from "@/lib/participant-utils";

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function NameInput({ 
  value, 
  onChange, 
  label, 
  placeholder, 
  error, 
  required = true 
}: NameInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string>("");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (value) {
      const validation = validateName(value, label);
      setIsValid(validation.isValid);
      setValidationError(validation.error || "");
      setCharCount(value.trim().length);
    } else {
      setIsValid(null);
      setValidationError("");
      setCharCount(0);
    }
  }, [value, label]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Capitalise automatiquement la première lettre de chaque mot
    newValue = newValue.replace(/\b\w/g, (char) => char.toUpperCase());
    
    onChange(newValue);
  };

  const getInputBorderColor = () => {
    if (error || validationError) return "border-red-500";
    if (isValid === true) return "border-green-500";
    if (isValid === false) return "border-red-300";
    return "border-gray-300";
  };

  const getCharCountColor = () => {
    if (charCount < 2) return "text-red-500";
    if (charCount > 45) return "text-orange-500";
    if (charCount > 50) return "text-red-500";
    return "text-gray-400";
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2 text-myibc-blue font-medium">
        <User className="h-4 w-4" />
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || `Entrez votre ${label.toLowerCase()}`}
          className={`pr-10 ${getInputBorderColor()}`}
          maxLength={50}
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
      
      {/* Compteur de caractères */}
      <div className="flex justify-between items-center">
        <div>
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
              {label} valide
            </div>
          )}
        </div>
        
        {/* Compteur de caractères */}
        {value && (
          <div className={`text-xs ${getCharCountColor()}`}>
            {charCount}/50
          </div>
        )}
      </div>
    </div>
  );
}
