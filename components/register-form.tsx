"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosInstance from "./request/reques"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle } from "lucide-react"
import { UsernameSuggestions } from "./ui/username-suggestions"
import { 
  parseAuthError, 
  validateAuthResponse, 
  saveAuthData, 
  getRedirectPath,
  validateEmail,
  validatePassword,
  validateUsername
} from "@/lib/auth-utils"

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({})
  const [showUsernameSuggestions, setShowUsernameSuggestions] = useState(false)
  const [conflictedUsername, setConflictedUsername] = useState("")

  // Validation côté client
  const validateForm = () => {
    const errors: typeof fieldErrors = {};
    let isValid = true;

    const usernameValidation = validateUsername(username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.message!;
      isValid = false;
    }

    const emailValidation = validateEmail(email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.message!;
      isValid = false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.message!;
      isValid = false;
    }

    setFieldErrors(errors);
    
    if (!isValid) {
      setError("Veuillez corriger les erreurs ci-dessus.");
      return false;
    }

    return true;
  };

  const clearFieldError = (field: keyof typeof fieldErrors) => {
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
    if (error && Object.keys(fieldErrors).length <= 1) {
      setError(null);
    }
    // Masquer les suggestions si on efface l'erreur de nom d'utilisateur
    if (field === 'username') {
      setShowUsernameSuggestions(false);
      setConflictedUsername("");
    }
  };

  const handleUsernameSuggestionSelect = (suggestedUsername: string) => {
    setUsername(suggestedUsername);
    setShowUsernameSuggestions(false);
    setConflictedUsername("");
    clearFieldError('username');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validation côté client
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post('/auth/register', {
        username: username.trim(),
        password,
        email: email.trim().toLowerCase(),
      });

      // Validation et normalisation de la réponse
      const authData = validateAuthResponse(response.data);

      // Sauvegarde sécurisée
      saveAuthData(authData);

      // Redirection basée sur le rôle (par défaut utilisateur)
      const redirectPath = getRedirectPath(authData.role || "ROLE_UTILISATEUR");
      router.push(redirectPath);
      
    } catch (err: any) {
      console.error("Erreur d'inscription:", err);
      const authError = parseAuthError(err);
      
      // Gestion spéciale pour les erreurs de conflit
      if (err.response?.status === 409) {
        const message = err.response.data;
        if (typeof message === 'string' && (message.includes("nom d'utilisateur") || message.includes("username"))) {
          setFieldErrors({ username: message });
          setError("Ce nom d'utilisateur est déjà utilisé. Veuillez en choisir un autre.");
          setConflictedUsername(username.trim());
          setShowUsernameSuggestions(true);
        } else {
          setFieldErrors({ email: "Cette adresse email est déjà utilisée." });
          setError("Cette adresse email est déjà associée à un compte existant.");
        }
      } else {
        setError(authError.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-[#D4AF37]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-[#001F5B]">
          S'inscrire
        </CardTitle>
        <CardDescription className="text-center">
          Enregistrer vous sur notre platforme MyIBC
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Nom complet"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  clearFieldError('username');
                }}
                disabled={isLoading}
                className={fieldErrors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.username}</p>
              )}
              
              {showUsernameSuggestions && conflictedUsername && (
                <UsernameSuggestions
                  originalUsername={conflictedUsername}
                  onSelectSuggestion={handleUsernameSuggestionSelect}
                  className="mt-2"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearFieldError('email');
                }}
                disabled={isLoading}
                className={fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearFieldError('password');
                }}
                disabled={isLoading}
                className={fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.password && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.password}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#D4AF37] hover:bg-[#c09c31] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !username.trim() || !email.trim() || !password}
          >
            {isLoading ? "Inscription en cours..." : "S'enregistrer"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-row justify-center">
        <Button variant="link" onClick={() => router.push("/auth/login")} className="text-[#001F5B]">
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}
