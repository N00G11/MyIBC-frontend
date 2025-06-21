"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axiosInstance from "@/components/request/reques"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus } from "lucide-react"

type Participant = {
  id: number
  username: string
  email: string
}

type camp = {
  trancheAge: string
}

const countriesData: Record<string, { villes: Record<string, string[]> }> = {
  "Cameroun": {
    villes: {
      "Yaoundé": ["Délégation du Centre", "Délégation Nkolbisson", "Délégation Mvog-Ada"],
      "Douala": ["Délégation Bonaberi", "Délégation Akwa", "Délégation Deïdo"],
      "Bafoussam": ["Délégation Bapi", "Délégation Tamdja", "Délégation Kamkop"],
      "Garoua": ["Délégation Plateau", "Délégation Poumpoumré", "Délégation Ngaoundéré"],
      "Maroua": ["Délégation Domayo", "Délégation Kongola", "Délégation Hardé"]
    }
  },
  "France": {
    villes: {
      "Paris": ["Délégation Nord", "Délégation Sud", "Délégation Centre"],
      "Lyon": ["Croix-Rousse", "Part-Dieu", "Gerland"],
      "Marseille": ["Castellane", "Noailles", "La Joliette"],
      "Toulouse": ["Compans", "Mirail", "Saint-Cyprien"]
    }
  }
}

function calculateAge(dateString: string): number {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--
  return age
}

export function ParticipantForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campId = searchParams.get("id")
  const email = searchParams.get("email")

  const [participant, setParticipant] = useState<Participant | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [sexe, setSexe] = useState("Masculin")
  const [telephone, setTelephone] = useState("")
  const [dateNaissance, setDateNaissance] = useState("")
  const [pays, setPays] = useState("")
  const [ville, setVille] = useState("")
  const [delegation, setDelegation] = useState("")

  const [villes, setVilles] = useState<string[]>([])
  const [delegations, setDelegations] = useState<string[]>([])

  const [age, setAge] = useState<number | null>(null)
  const [minAge, setMinAge] = useState<number | null>(null)
  const [maxAge, setMaxAge] = useState<number | null>(null)

  useEffect(() => {
    if (email) fetchUser()
    if (campId) {
      fetchTrancheAge(campId)

    }
  }, [email, campId])

  useEffect(() => {
    if (pays && countriesData[pays]) {
      setVilles(Object.keys(countriesData[pays].villes))
      setVille("")
      setDelegation("")
      setDelegations([])
    }
  }, [pays])

  useEffect(() => {
    if (pays && ville && countriesData[pays]?.villes[ville]) {
      setDelegations(countriesData[pays].villes[ville])
      setDelegation("")
    }
  }, [ville, pays])

  const fetchTrancheAge = async (id: string) => {
    try {
      setError(null)
      const response = await axiosInstance.get<camp>(`/camp/${id}`)
      const camp = response.data;
      const [min, max] = camp.trancheAge.split("-").map((n: string) => parseInt(n, 10))
      if (!isNaN(min) && !isNaN(max)) {
        setMinAge(min)
        setMaxAge(max)
      }
    } catch (err) {
      console.error("Erreur lors du chargement :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const fetchUser = async () => {
    try {
      setError(null)
      const response = await axiosInstance.get(`/participant/email/${email}`)
      setParticipant(response.data)
    } catch (err) {
      console.error("Erreur lors du chargement :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!telephone || !dateNaissance || !pays || !ville || !delegation) {
      setError("Tous les champs sont obligatoires.")
      return
    }

    const phoneRegex = /^\+\d{9,15}$/
    if (!phoneRegex.test(telephone)) {
      setError("Le numéro de téléphone doit commencer par '+' et contenir entre 9 et 15 chiffres.")
      return
    }

    const calculatedAge = calculateAge(dateNaissance)
    setAge(calculatedAge)

    if (minAge !== null && maxAge !== null) {
      if (calculatedAge < minAge || calculatedAge > maxAge) {
        setError(`L'âge doit être entre ${minAge} et ${maxAge} ans.`)
        return
      }
    }

    try {
      await axiosInstance.post(`/inscription/add/${email}/${campId}`, {
        sexe, telephone, dateNaissance, ville, pays, delegation
      })
      router.push(`/participant/dashboard?email=${email}`)
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
        {minAge !== null && maxAge !== null && (
          <p className="text-sm text-muted-foreground">
            Tranche d’âge autorisée : {minAge} à {maxAge} ans
          </p>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input 
              value={participant?.username || ""}
              placeholder="Nom complet"
              disabled
             />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input 
              value={participant?.email || ""} 
              placeholder="Email"
              disabled 
            />
          </div>

          <div className="space-y-2">
            <Label>Genre</Label>
            <RadioGroup value={sexe} onValueChange={setSexe} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Masculin" id="male" />
                <Label htmlFor="male">Masculin</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Feminin" id="female" />
                <Label htmlFor="female">Féminin</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>Date de naissance</Label>
            <Input
              type="date"
              value={dateNaissance}
              onChange={e => {
                setDateNaissance(e.target.value)
                if (e.target.value) setAge(calculateAge(e.target.value))
              }}
              required
            />
            {age !== null && <p className="text-sm text-muted-foreground">Vous avez : <strong>{age} ans</strong></p>}
          </div>

          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              placeholder="Ex : +237 690000000"
              value={telephone}
              onChange={e => setTelephone(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Pays</Label>
            <select value={pays} onChange={e => setPays(e.target.value)} required className="w-full border rounded p-2">
              <option value="">-- Sélectionner un pays --</option>
              {Object.keys(countriesData).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Ville</Label>
            <select
              value={ville}
              onChange={e => setVille(e.target.value)}
              required
              className="w-full border rounded p-2"
              disabled={!pays}
            >
              <option value="">-- Sélectionner une ville --</option>
              {villes.map(v => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>Délégation</Label>
            <select
              value={delegation}
              onChange={e => setDelegation(e.target.value)}
              required
              className="w-full border rounded p-2"
              disabled={!ville}
            >
              <option value="">-- Sélectionner une délégation --</option>
              {delegations.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            Inscrire le participant
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
