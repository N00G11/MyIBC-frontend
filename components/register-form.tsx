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

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        password,
        email,
      })

      const {token} = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('email', email);
      router.push(`/inscription/camp?email=${email}`);
    } catch (err: any) {
      if (err.response && err.response.data) {
        setError(
          typeof err.response.data === "string"
            ? err.response.data
            : JSON.stringify(err.response.data)
        )
      } else {
        setError(err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription")
      }
    }
  }

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
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adress email</Label>
              <Input
                id="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="Votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 bg-[#D4AF37] hover:bg-[#c09c31] text-white"
          >
            S'enregirtre
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-row justify-center">
        <Button variant="link" onClick={() => router.push("/auth")} className="text-[#001F5B]">
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}
