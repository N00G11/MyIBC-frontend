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

export function OptimizedLoginForm() {
  const router = useRouter()
  const { login, isLoading, error, clearError } = useAuth()
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [personalCode, setPersonalCode] = useState("")

  const isEmailMode = email !== "" || password !== ""
  const isCodeMode = personalCode !== ""

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    clearError();

    // Validation de mode
    if (isEmailMode && isCodeMode) {
      return;
    }

    if (!isEmailMode && !isCodeMode) {
      return;
    }

    if (isEmailMode) {
      await login({ email, password });
    } else if (isCodeMode) {
      await login({ personalCode });
    }
  }

  // Handlers pour gérer l'exclusivité mutuelle des modes
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (personalCode !== "") setPersonalCode("");
    clearError();
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (personalCode !== "") setPersonalCode("");
    clearError();
  };

  const handlePersonalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalCode(e.target.value);
    if (email !== "" || password !== "") {
      setEmail("");
      setPassword("");
    }
    clearError();
  };

  const isFormValid = () => {
    if (isEmailMode && isCodeMode) return false;
    if (!isEmailMode && !isCodeMode) return false;
    if (isEmailMode && (email === "" || password === "")) return false;
    if (isCodeMode && personalCode === "") return false;
    return true;
  };

  return (
    <Card className="w-full shadow-lg border-t-4 border-t-[#D4AF37]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center text-[#001F5B]">
          Connexion
        </CardTitle>
        <CardDescription className="text-center">
          Connectez-vous à votre compte MyIBC
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <StatusAlert type="error" message={error} className="mb-4" />
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Adresse email</Label>
              <Input
                id="username"
                placeholder="example@gmail.com"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isLoading}
                required={false}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={handlePasswordChange}
                disabled={isLoading}
                required={false}
              />
            </div>
          </div>

          <div className="flex justify-center my-6">
            <span className="text-gray-500 font-semibold">ou</span>
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalCode">Code personnel</Label>
            <Input
              id="personalCode"
              placeholder="Entrez votre code personnel"
              type="text"
              value={personalCode}
              onChange={handlePersonalCodeChange}
              disabled={isLoading}
              required={false}
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#D4AF37] hover:bg-[#c09c31] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading || !isFormValid()}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-row justify-between">
        <Button
          variant="link"
          onClick={() => router.push("/auth/register")}
          className="text-[#001F5B]"
          disabled={isLoading}
        >
          S'enregistrer
        </Button>
        <Button 
          variant="link" 
          className="text-[#001F5B]"
          disabled={isLoading}
        >
          Mot de passe oublié?
        </Button>
      </CardFooter>
    </Card>
  );
}
