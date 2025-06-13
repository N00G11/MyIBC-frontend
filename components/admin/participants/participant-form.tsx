"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import axiosInstance from "@/components/request/reques"

type Participant = {
  id: number
  username: string
  email: string
}

export function ParticipantForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campId = searchParams.get("id")
  const email = searchParams.get("email")

  const [participant, setParticipant] = useState<Participant | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [sexe, setSexe] = useState("M")
  const [telephone, setTelephone] = useState("")
  const [dateNaissance, setDateNaissance] = useState("")
  const [ville, setVille] = useState("")
  const [pays, setPays] = useState("")
  const [delegation, setDelegation] = useState("")

  useEffect(() => {
    if (email) fetchUser()
  }, [email])

  const fetchUser = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get(`/participant/email/${email}`)
      setParticipant(response.data)
    } catch (err) {
      console.error("Erreur lors du chargement des données :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError(null)
      await axiosInstance.post(`/inscription/add/${email}/${campId}`, {
        sexe,
        telephone,
        dateNaissance,
        ville,
        pays,
        delegation
      })
      // Optionnel : notifier du succès ou rediriger
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Inscrire un participant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-2">
            <Label htmlFor="username">Nom complet</Label>
            <Input
              id="username"
              name="username"
              placeholder="Nom complet"
              value={participant?.username || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Adresse Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Adresse email"
              value={participant?.email || ""}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <RadioGroup value={sexe} onValueChange={setSexe} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="M" id="male" />
                <Label htmlFor="male">Masculin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="F" id="female" />
                <Label htmlFor="female">Féminin</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Date de naissance</Label>
            <Input
              id="birthDate"
              name="birthDate"
              type="date"
              value={dateNaissance}
              onChange={e => setDateNaissance(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telephone">Téléphone</Label>
            <Input
              id="telephone"
              name="telephone"
              placeholder="Téléphone"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pays">Pays</Label>
              <Input
                id="pays"
                name="pays"
                placeholder="Pays"
                value={pays}
                onChange={e => setPays(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ville">Ville</Label>
              <Input
                id="ville"
                name="ville"
                placeholder="Ville"
                value={ville}
                onChange={e => setVille(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="delegation">Délégation</Label>
            <Input
              id="delegation"
              name="delegation"
              placeholder="Délégation"
              value={delegation}
              onChange={e => setDelegation(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit"  onClick={() => router.push(`/participant/dashboard?email=${email}`)} className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            Inscrire le participant
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
