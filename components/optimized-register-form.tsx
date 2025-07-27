"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { StatusAlert } from "@/components/ui/status-alert"
import { useAuth } from "@/hooks/use-auth"

export function OptimizedRegisterForm() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuth()
  
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
  }>({})

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});

    const success = await register({
      username,
      email,
      password
    });

    // Le hook gère la redirection automatiquement en cas de succès
  };

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string>>, field: keyof typeof fieldErrors) => 
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
      clearError();
      // Effacer l'erreur de champ spécifique
      if (fieldErrors[field]) {
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    };

  const isFormValid = () => {
    return username.trim() !== "" && email.trim() !== "" && password !== "";
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-[#D4AF37]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-[#001F5B]">
          S'inscrire
        </CardTitle>
        <CardDescription className="text-center">
          Enregistrez-vous sur notre plateforme MyIBC
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <StatusAlert type="error" message={error} className="mb-4" />
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                placeholder="Nom complet"
                value={username}
                onChange={handleInputChange(setUsername, 'username')}
                disabled={isLoading}
                className={fieldErrors.username ? "border-red-500 focus-visible:ring-red-500" : ""}
                required
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-600 mt-1">{fieldErrors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Adresse email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={handleInputChange(setEmail, 'email')}
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
                onChange={handleInputChange(setPassword, 'password')}
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
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? "Inscription en cours..." : "S'enregistrer"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-row justify-center">
        <Button 
          variant="link" 
          onClick={() => router.push("/auth/login")} 
          className="text-[#001F5B]"
          disabled={isLoading}
        >
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}
