"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function RegisterForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("")
  const [userType, setUserType] = useState("admin")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Dans un cas réel, nous ferions une authentification ici
    if (userType === "admin") {
      router.push("/admin/dashboard")
    } else {
      router.push("/participant/dashboard")
    }
  }

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
        <Button variant="link" className="text-[#001F5B]">
          Se connecter
        </Button>
      </CardFooter>
    </Card>
  );
}
