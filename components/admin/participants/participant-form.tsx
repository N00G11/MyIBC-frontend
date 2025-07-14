"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axiosInstance from "@/components/request/reques"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { UserPlus, MapPin, Phone, Calendar, User, Mail, Globe, Building2, Truck, AlertCircle } from "lucide-react"

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

const TRANSPORT_PRICE = 10000; // FCFA, adapte si besoin

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

  const [payTransport, setPayTransport] = useState(false);

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
        sexe, telephone, dateNaissance, ville, pays, delegation, payTransport
      })
      router.push(`/participant/dashboard?email=${email}`)
    } catch (err) {
      console.error("Erreur lors de l'inscription :", err)
      setError(err instanceof Error ? err.message : "Une erreur inconnue est survenue")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl font-semibold">
              <div className="p-2 bg-white/20 rounded-full">
                <UserPlus className="h-6 w-6" />
              </div>
              Inscription au camp
            </CardTitle>
            {minAge !== null && maxAge !== null && (
              <div className="flex items-center gap-2 mt-2 text-blue-100">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">
                  Tranche d'âge autorisée : {minAge} à {maxAge} ans
                </p>
              </div>
            )}
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Section Informations personnelles */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Informations personnelles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <User className="h-4 w-4" />
                      Nom complet
                    </Label>
                    <Input 
                      value={participant?.username || ""}
                      placeholder="Nom complet"
                      disabled
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input 
                      value={participant?.email || ""} 
                      placeholder="Email"
                      disabled 
                      className="bg-gray-50 border-gray-300"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium">
                    <User className="h-4 w-4" />
                    Genre
                  </Label>
                  <RadioGroup value={sexe} onValueChange={setSexe} className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Masculin" id="male" className="text-blue-600" />
                      <Label htmlFor="male" className="cursor-pointer">Masculin</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Feminin" id="female" className="text-blue-600" />
                      <Label htmlFor="female" className="cursor-pointer">Féminin</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Calendar className="h-4 w-4" />
                      Date de naissance
                    </Label>
                    <Input
                      type="date"
                      value={dateNaissance}
                      onChange={e => {
                        setDateNaissance(e.target.value)
                        if (e.target.value) setAge(calculateAge(e.target.value))
                      }}
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                    {age !== null && (
                      <p className="text-sm text-blue-600 font-medium">
                        Âge : {age} ans
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Phone className="h-4 w-4" />
                      Téléphone
                    </Label>
                    <Input
                      placeholder="Ex : +237 690000000"
                      value={telephone}
                      onChange={e => setTelephone(e.target.value)}
                      required
                      className="border-gray-300 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Section Localisation */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Localisation
                </h3>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-gray-700 font-medium">
                    <Globe className="h-4 w-4" />
                    Pays
                  </Label>
                  <select 
                    value={pays} 
                    onChange={e => setPays(e.target.value)} 
                    required 
                    className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                  >
                    <option value="">-- Sélectionner un pays --</option>
                    {Object.keys(countriesData).map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <MapPin className="h-4 w-4" />
                      Ville
                    </Label>
                    <select
                      value={ville}
                      onChange={e => setVille(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors disabled:bg-gray-100"
                      disabled={!pays}
                    >
                      <option value="">-- Sélectionner une ville --</option>
                      {villes.map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2 text-gray-700 font-medium">
                      <Building2 className="h-4 w-4" />
                      Délégation
                    </Label>
                    <select
                      value={delegation}
                      onChange={e => setDelegation(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded-md p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors disabled:bg-gray-100"
                      disabled={!ville}
                    >
                      <option value="">-- Sélectionner une délégation --</option>
                      {delegations.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section Transport */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                  Options de transport
                </h3>
                
                <div className="border border-amber-200 rounded-lg p-6 bg-gradient-to-r from-amber-50 to-orange-50">
                  <div className="flex items-start gap-3">
                    <Truck className="h-5 w-5 text-amber-600 mt-1" />
                    <div className="flex-1">
                      <Label className="text-lg font-semibold text-amber-800">
                        Frais de transport
                      </Label>
                      <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                        Bénéficiez d'un transport organisé depuis votre délégation jusqu'au site du camp.
                      </p>
                      <div className="mt-3 p-3 bg-white/80 rounded-md">
                        <p className="font-bold text-amber-800 text-lg">
                          Prix : {TRANSPORT_PRICE.toLocaleString()} FCFA
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                          Départ le jour officiel depuis votre délégation
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 mt-4">
                        <input
                          type="checkbox"
                          id="payTransport"
                          checked={payTransport}
                          onChange={e => setPayTransport(e.target.checked)}
                          className="h-5 w-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <Label htmlFor="payTransport" className="cursor-pointer text-gray-800 font-medium">
                          Je souhaite payer les frais de transport
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 font-medium">{error}</p>
                  </div>
                </div>
              )}

              {/* Bouton de soumission */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Confirmer l'inscription
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}