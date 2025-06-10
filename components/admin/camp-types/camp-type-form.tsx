"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award } from "lucide-react"

export function CampTypeForm() {
  const [formData, setFormData] = useState({
    name: "",
    ageRangeMin: "",
    ageRangeMax: "",
    amount: "",
    currency: "EUR",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCurrencyChange = (value: string) => {
    setFormData((prev) => ({ ...prev, currency: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, nous ajouterions la logique pour ajouter un type de camp
    console.log("Nouveau type de camp:", formData)
    // Réinitialiser le formulaire
    setFormData({
      name: "",
      ageRangeMin: "",
      ageRangeMax: "",
      amount: "",
      currency: "EUR",
    })
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du camp</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Camp des Agneaux"
              value={formData.name}
              onChange={handleChange}
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
                value={formData.ageRangeMin}
                onChange={handleChange}
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
                value={formData.ageRangeMax}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                placeholder="Ex: 50"
                value={formData.amount}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Devise</Label>
              <Select value={formData.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Sélectionner une devise" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="XOF">XOF (FCFA)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white">
            Ajouter le type de camp
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
