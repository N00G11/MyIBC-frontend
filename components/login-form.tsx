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

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {    
      try {
        const response = await axiosInstance.post('/auth/login', {
          email,
          password,
        });

        const {token} = response.data;
        const {role} = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
    
        //document.cookie = "token=fake-token; path=/";

        if(role === "ROLE_PARTICIPANT"){
          const {badge} = response.data;
          if(badge == "true"){
            router.push(`/participant/dashboard?email=${email}`);
          }else{
            router.push(`/inscription/camp?email=${email}`);
          }
        }else if(role == "ROLE_DIRIGEANT"){
          router.push(`/leader/dashboard?email=${email}`);
        }else{
          router.push("/admin/dashboard");
        }
    
      } catch (error) {
        setError("Password or username is not correct");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion");
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
         {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Adress email</Label>
              <Input
                id="username"
                placeholder="example@gmail.com"
                type="email"
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
            Se connecter
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-row justify-between">
        <Button
          variant="link"
          onClick={() => router.push("/")}
          className="text-[#001F5B]"
        >
          S'enregistre
        </Button>
        <Button variant="link" className="text-[#001F5B]">
          Mot de passe oublié?
        </Button>
      </CardFooter>
    </Card>
  );
}
