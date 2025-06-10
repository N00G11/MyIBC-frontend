"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { QrCode, Download, Printer } from "lucide-react"

const participants = [
  { id: 1, name: "Pierre Dubois", campType: "Jeunes" },
  { id: 2, name: "Aminata Diallo", campType: "Jeunes" },
  { id: 3, name: "Lucas Martin", campType: "Agneaux" },
  { id: 4, name: "Kofi Mensah", campType: "Leaders" },
  { id: 5, name: "Fatou Sow", campType: "Jeunes" },
]

export function BadgeGenerator() {
  const [selectedParticipant, setSelectedParticipant] = useState("")
  const [badgeGenerated, setBadgeGenerated] = useState(false)

  const handleGenerateBadge = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedParticipant) {
      setBadgeGenerated(true)
    }
  }

  const selectedParticipantData = participants.find((p) => p.id.toString() === selectedParticipant)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="h-5 w-5" />
          Générer un badge
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleGenerateBadge} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="participant">Sélectionner un participant</Label>
            <Select value={selectedParticipant} onValueChange={setSelectedParticipant}>
              <SelectTrigger id="participant">
                <SelectValue placeholder="Choisir un participant" />
              </SelectTrigger>
              <SelectContent>
                {participants.map((participant) => (
                  <SelectItem key={participant.id} value={participant.id.toString()}>
                    {participant.name} - {participant.campType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#D4AF37] hover:bg-[#c09c31] text-white"
            disabled={!selectedParticipant}
          >
            Générer le badge
          </Button>
        </form>

        {badgeGenerated && selectedParticipantData && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-800">
                Badge généré avec succès pour <strong>{selectedParticipantData.name}</strong>
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
              <Button variant="outline" className="flex-1">
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
