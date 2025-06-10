"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus } from "lucide-react"

export function LeaderForm() {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    country: "",
    center: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, nous ajouterions la logique pour ajouter un dirigeant
    console.log("Nouveau dirigeant:", formData)
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      city: "",
      country: "",
      center: "",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          Ajouter un dirigeant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom complet</Label>
            <Input
              id="name"
              name="name"
              placeholder="Nom et prénom"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Ville</Label>
            <Input id="city" name="city" placeholder="Ville" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              name="country"
              placeholder="Pays"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="center">Centre de rattachement</Label>
            <Input
              id="center"
              name="center"
              placeholder="Centre de rattachement"
              value={formData.center}
              onChange={handleChange}
              required
            />
          </div>

          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            Ajouter le dirigeant
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
