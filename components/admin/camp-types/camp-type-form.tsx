"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Award } from "lucide-react"
import axiosInstance from "@/components/request/reques"

export function CampTypeForm() {
  const [error, setError] = useState<string | null>(null)
  const [ageRangeMax, setAgeRangeMax] = useState(0)
  const [ageRangeMin, setAgeRangeMin] = useState(0)
  const [type, setType] = useState("")
  const [prix, setPrix] = useState(0)
  const [description, setDescription] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    const trancheAge = `${ageRangeMin}-${ageRangeMax}`

    try {
      await axiosInstance.post("/camp/add", {
        type,
        trancheAge,
        prix,
        description,
      })
      // reset du formulaire après envoi
      setAgeRangeMax(0)
      setAgeRangeMin(0)
      setType("")
      setPrix(0)
      setDescription("")
      setError(null)
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Ajouter un type de camp
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du camp</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Camp des Agneaux"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRangeMin">Âge minimum</Label>
              <Input
                id="ageRangeMin"
                name="ageRangeMin"
                type="number"
                placeholder="Ex: 7"
                value={ageRangeMin}
                onChange={(e) => setAgeRangeMin(Number(e.target.value))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageRangeMax">Âge maximum</Label>
              <Input
                id="ageRangeMax"
                name="ageRangeMax"
                type="number"
                placeholder="Ex: 12"
                value={ageRangeMax}
                onChange={(e) => setAgeRangeMax(Number(e.target.value))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              placeholder="Description du camp"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              placeholder="Ex: 50"
              value={prix}
              onChange={(e) => setPrix(Number(e.target.value))}
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white"
          >
            Ajouter le type de camp
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
