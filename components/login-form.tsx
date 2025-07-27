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
import { 
  parseAuthError, 
  validateAuthResponse, 
  saveAuthData, 
  getRedirectPath,
  validateEmail,
  validatePassword,
  validatePersonalCode
} from "@/lib/auth-utils"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [personalCode, setPersonalCode] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const isEmailMode = email !== "" || password !== ""
  const isCodeMode = personalCode !== ""

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation côté client
    if (isEmailMode && isCodeMode) {
      setError("Veuillez choisir soit l'email/mot de passe, soit le code personnel.");
      setIsLoading(false);
      return;
    }

    if (!isEmailMode && !isCodeMode) {
      setError("Veuillez remplir soit l'email et le mot de passe, soit le code personnel.");
      setIsLoading(false);
      return;
    }

    // Validation spécifique par mode
    if (isEmailMode) {
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        setError(emailValidation.message!);
        setIsLoading(false);
        return;
      }

      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        setError(passwordValidation.message!);
        setIsLoading(false);
        return;
      }
    }

    if (isCodeMode) {
      const codeValidation = validatePersonalCode(personalCode);
      if (!codeValidation.isValid) {
        setError(codeValidation.message!);
        setIsLoading(false);
        return;
      }
    }

    try {
      let response;
      
      if (isEmailMode && !isCodeMode) {
        response = await axiosInstance.post('/auth/login', {
          email: email.trim().toLowerCase(),
          password,
        });
      } else if (isCodeMode && !isEmailMode) {
        response = await axiosInstance.post(`/auth/login/${personalCode.trim()}`);
      }

      // Validation et normalisation de la réponse
      const authData = validateAuthResponse(response!.data);

      // Sauvegarde sécurisée
      saveAuthData(authData, personalCode);

      // Redirection basée sur le rôle
      const redirectPath = getRedirectPath(authData.role);
      router.push(redirectPath);
      
    } catch (err: any) {
      console.error("Erreur de connexion:", err);
      const authError = parseAuthError(err);
      setError(authError.message);
    } finally {
      setIsLoading(false);
    }
  }

  // Handlers pour vider le code si on écrit dans email ou password
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (personalCode !== "") setPersonalCode("");
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (personalCode !== "") setPersonalCode("");
  };
  // Handler pour vider email et password si on écrit dans le code
  const handlePersonalCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalCode(e.target.value);
    if (email !== "" || password !== "") {
      setEmail("");
      setPassword("");
    }
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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
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
            disabled={
              isLoading ||
              (isEmailMode && isCodeMode) ||
              (!isEmailMode && !isCodeMode) ||
              (isEmailMode && (email === "" || password === "")) ||
              (isCodeMode && personalCode === "")
            }
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
        >
          S'enregistrer
        </Button>
        <Button variant="link" className="text-[#001F5B]">
          Mot de passe oublié?
        </Button>
      </CardFooter>
    </Card>
  );
}
