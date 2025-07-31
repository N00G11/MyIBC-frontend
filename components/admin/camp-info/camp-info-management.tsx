"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Save, X, MapPin, Calendar, AlertTriangle, Plus } from "lucide-react"
import axiosInstance from "@/components/request/reques"
import { StatusAlert } from "@/components/ui/status-alert"

interface CampInfo {
  id?: number
  lieu: string
  date: string
}

export function CampInfoManagement() {
  const [campInfo, setCampInfo] = useState<CampInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Form state
  const [formData, setFormData] = useState({
    lieu: "",
    date: ""
  })

  useEffect(() => {
    fetchCampInfo()
  }, [])

  const fetchCampInfo = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axiosInstance.get<CampInfo>("/info")
      setCampInfo(response.data)
      setFormData({
        lieu: response.data.lieu || "",
        date: response.data.date || ""
      })
    } catch (err) {
      console.error("Erreur lors du chargement des informations du camp:", err)
      setError("Impossible de charger les informations du camp")
      // Si aucune info n'existe, on permet la création
      setCampInfo(null)
      setFormData({ lieu: "", date: "" })
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = () => {
    if (!formData.lieu.trim()) {
      setError("Le lieu est obligatoire")
      return false
    }
    if (!formData.date.trim()) {
      setError("La date est obligatoire")
      return false
    }
    
    // Validation de la date
    const selectedDate = new Date(formData.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    if (selectedDate < today) {
      setError("La date ne peut pas être dans le passé")
      return false
    }

    return true
  }

  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setIsLoading(true)
      setError(null)
      setSuccessMessage(null)

      const dataToSave = {
        lieu: formData.lieu.trim(),
        date: formData.date
      }

      let response: { data: CampInfo }
      
      if (campInfo?.id) {
        // Mise à jour
        response = await axiosInstance.put<CampInfo>(`/info/${campInfo.id}`, dataToSave)
        setSuccessMessage("Informations du camp mises à jour avec succès !")
      } else {
        // Création
        response = await axiosInstance.post<CampInfo>("/info", dataToSave)
        setSuccessMessage("Informations du camp créées avec succès !")
      }

      setCampInfo(response.data)
      setIsEditing(false)
      
      // Effacer le message de succès après 3 secondes
      setTimeout(() => setSuccessMessage(null), 3000)
      
    } catch (err) {
      console.error("Erreur lors de la sauvegarde:", err)
      setError("Impossible de sauvegarder les informations du camp")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
    setError(null)
    setSuccessMessage(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
    setSuccessMessage(null)
    
    // Restaurer les valeurs originales
    if (campInfo) {
      setFormData({
        lieu: campInfo.lieu || "",
        date: campInfo.date || ""
      })
    } else {
      setFormData({ lieu: "", date: "" })
    }
  }

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError(null)
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return "Non définie"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  if (isLoading && !campInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des informations du camp...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#001F5B] flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Gestion du déroulement du camp
          </CardTitle>
          <p className="text-sm text-gray-600">
            Configurez le lieu et la date de déroulement du camp Douala 2025
          </p>
        </CardHeader>
      </Card>

      {/* Messages d'état */}
      {error && (
        <StatusAlert type="error" message={error} className="mb-4" />
      )}
      
      {successMessage && (
        <StatusAlert type="success" message={successMessage} className="mb-4" />
      )}

      {/* Section principale */}
      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">
            {campInfo ? "Informations actuelles du camp" : "Configurer le camp"}
          </CardTitle>
          {campInfo && !isEditing && (
            <Button
              onClick={handleEdit}
              disabled={isLoading}
              className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!campInfo && !isEditing && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune information configurée
              </h3>
              <p className="text-gray-600 mb-4">
                Vous devez configurer le lieu et la date du camp
              </p>
              <Button
                onClick={() => setIsEditing(true)}
                className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Configurer maintenant
              </Button>
            </div>
          )}

          {/* Mode affichage */}
          {campInfo && !isEditing && (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-blue-700">
                    <MapPin className="h-5 w-5" />
                    Lieu de déroulement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">
                    {campInfo.lieu || "Non défini"}
                  </p>
                </CardContent>
              </Card>

              <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-green-700">
                    <Calendar className="h-5 w-5" />
                    Date de déroulement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDisplayDate(campInfo.date)}
                  </p>
                  {campInfo.date && (
                    <p className="text-sm text-gray-600 mt-1">
                      {campInfo.date}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Mode édition */}
          {isEditing && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Lieu */}
                <div className="space-y-2">
                  <Label htmlFor="lieu" className="text-sm font-medium flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    Lieu de déroulement *
                  </Label>
                  <Input
                    id="lieu"
                    value={formData.lieu}
                    onChange={(e) => handleInputChange("lieu", e.target.value)}
                    placeholder="Ex: Centre de conférences de Douala"
                    disabled={isLoading}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    Indiquez le lieu exact où se déroulera le camp
                  </p>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Date de déroulement *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    disabled={isLoading}
                    className="w-full"
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500">
                    Sélectionnez la date de début du camp
                  </p>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isLoading || !formData.lieu.trim() || !formData.date.trim()}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* Information sur l'impact */}
          {campInfo && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900">
                    Impact des modifications
                  </h4>
                  <p className="text-xs text-blue-700 mt-1">
                    Les modifications seront visibles sur tous les badges générés après la sauvegarde.
                    Les badges déjà téléchargés ne seront pas affectés.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
