"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, Plus, Save, X, AlertTriangle } from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axiosInstance from "@/components/request/reques"
import { StatusAlert } from "@/components/ui/status-alert"
import { parseLocationError, validateLocationName, mapBackendToFrontend } from "@/lib/location-utils"

type Delegation = { id: number; name: string }
type City = { id: number; name: string; delegations: Delegation[] }
type Country = { id: number; name: string; cities: City[] }

export function LocalisationsList() {
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newCountry, setNewCountry] = useState("")
  const [newCity, setNewCity] = useState("")
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [newDelegation, setNewDelegation] = useState("")
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  
  // États pour l'édition
  const [editingCountry, setEditingCountry] = useState<number | null>(null)
  const [editingCity, setEditingCity] = useState<number | null>(null)
  const [editingDelegation, setEditingDelegation] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    fetchLocalisations()
  }, [])

  const fetchLocalisations = async () => {
    try {
      setError(null)
      setIsLoading(true)
      const response = await axiosInstance.get("/localisations/pays")
      const mappedCountries = mapBackendToFrontend(response.data)
      setCountries(mappedCountries)
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Ajout d'un pays
  const handleAddCountry = async () => {
    const validation = validateLocationName(newCountry, 'country')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.post("/localisations/pays", { name: newCountry.trim() })
      setNewCountry("")
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Ajout d'une ville à un pays
  const handleAddCity = async () => {
    if (!selectedCountryId) return
    const validation = validateLocationName(newCity, 'city')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.post(`/localisations/ville/${selectedCountryId}`, { name: newCity.trim() })
      setNewCity("")
      setSelectedCountryId(null)
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Ajout d'une délégation à une ville
  const handleAddDelegation = async () => {
    if (!selectedCityId) return
    const validation = validateLocationName(newDelegation, 'delegation')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.post(`/localisations/delegation/${selectedCityId}`, { name: newDelegation.trim() })
      setNewDelegation("")
      setSelectedCityId(null)
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions d'édition
  const startEditCountry = (id: number, name: string) => {
    setEditingCountry(id)
    setEditValue(name)
  }

  const startEditCity = (id: number, name: string) => {
    setEditingCity(id)
    setEditValue(name)
  }

  const startEditDelegation = (id: number, name: string) => {
    setEditingDelegation(id)
    setEditValue(name)
  }

  const cancelEdit = () => {
    setEditingCountry(null)
    setEditingCity(null)
    setEditingDelegation(null)
    setEditValue("")
  }

  const saveEditCountry = async () => {
    if (!editingCountry) return
    const validation = validateLocationName(editValue, 'country')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.put(`/localisations/pays/${editingCountry}`, editValue.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      })
      cancelEdit()
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const saveEditCity = async () => {
    if (!editingCity) return
    const validation = validateLocationName(editValue, 'city')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.put(`/localisations/ville/${editingCity}`, editValue.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      })
      cancelEdit()
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const saveEditDelegation = async () => {
    if (!editingDelegation) return
    const validation = validateLocationName(editValue, 'delegation')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.put(`/localisations/delegation/${editingDelegation}`, editValue.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      })
      cancelEdit()
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions de suppression
  const handleDeleteCountry = async (id: number) => {
    try {
      setIsLoading(true)
      await axiosInstance.delete(`/localisations/pays/${id}`)
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCity = async (id: number) => {
    try {
      setIsLoading(true)
      await axiosInstance.delete(`/localisations/ville/${id}`)
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteDelegation = async (id: number) => {
    try {
      setIsLoading(true)
      await axiosInstance.delete(`/localisations/delegation/${id}`)
      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Statistiques
  const totalCities = countries.reduce((sum, country) => sum + country.cities.length, 0)
  const totalDelegations = countries.reduce((sum, country) => 
    sum + country.cities.reduce((citySum, city) => citySum + city.delegations.length, 0), 0)

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#001F5B]">Gestion des localisations</CardTitle>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary">{countries.length} pays</Badge>
            <Badge variant="secondary">{totalCities} villes</Badge>
            <Badge variant="secondary">{totalDelegations} délégations</Badge>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <StatusAlert type="error" message={error} className="mb-4" />
      )}

      {/* Ajout d'un pays */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter un pays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={newCountry}
              onChange={e => {
                setNewCountry(e.target.value)
                setError(null)
              }}
              placeholder="Nom du pays"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
            />
            <Button 
              onClick={handleAddCountry} 
              disabled={isLoading || !newCountry.trim()}
              className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des pays */}
      <div className="space-y-6">
        {countries.map(country => (
          <Card key={country.id} className="border border-l-4 border-l-[#D4AF37]">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                {editingCountry === country.id ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      autoFocus
                      disabled={isLoading}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveEditCountry()
                        if (e.key === 'Escape') cancelEdit()
                      }}
                    />
                    <Button variant="outline" size="icon" onClick={saveEditCountry} disabled={isLoading || !editValue.trim()}>
                      <Save size={16} />
                    </Button>
                    <Button variant="outline" size="icon" onClick={cancelEdit} disabled={isLoading}>
                      <X size={16} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-[#001F5B] flex-1">{country.name}</CardTitle>
                    <Badge variant="outline">{country.cities.length} ville{country.cities.length !== 1 ? 's' : ''}</Badge>
                  </>
                )}
              </div>
              {editingCountry !== country.id && (
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => startEditCountry(country.id, country.name)}
                    disabled={isLoading}
                  >
                    <Edit size={16} />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" disabled={isLoading}>
                        <Trash size={16} />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                          Supprimer le pays
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer "{country.name}" ? Cette action supprimera également toutes les villes et délégations associées.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteCountry(country.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {/* Ajout d'une ville */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex gap-2">
                  <Input
                    value={selectedCountryId === country.id ? newCity : ""}
                    onChange={e => {
                      setSelectedCountryId(country.id)
                      setNewCity(e.target.value)
                      setError(null)
                    }}
                    placeholder="Ajouter une ville"
                    disabled={isLoading}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                  />
                  <Button
                    onClick={handleAddCity}
                    className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
                    disabled={isLoading || selectedCountryId !== country.id || !newCity.trim()}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Liste des villes */}
              <div className="space-y-4">
                {country.cities.map(city => (
                  <Card key={city.id} className="border ml-4 border-l-2 border-l-blue-200">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        {editingCity === city.id ? (
                          <div className="flex items-center gap-2 flex-1">
                            <Input
                              value={editValue}
                              onChange={e => setEditValue(e.target.value)}
                              autoFocus
                              disabled={isLoading}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditCity()
                                if (e.key === 'Escape') cancelEdit()
                              }}
                            />
                            <Button variant="outline" size="icon" onClick={saveEditCity} disabled={isLoading || !editValue.trim()}>
                              <Save size={16} />
                            </Button>
                            <Button variant="outline" size="icon" onClick={cancelEdit} disabled={isLoading}>
                              <X size={16} />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <CardTitle className="text-[#001F5B] text-base flex-1">{city.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">{city.delegations.length} délégation{city.delegations.length !== 1 ? 's' : ''}</Badge>
                          </>
                        )}
                      </div>
                      {editingCity !== city.id && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => startEditCity(city.id, city.name)}
                            disabled={isLoading}
                          >
                            <Edit size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" disabled={isLoading}>
                                <Trash size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <AlertTriangle className="h-5 w-5 text-red-600" />
                                  Supprimer la ville
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Êtes-vous sûr de vouloir supprimer "{city.name}" ? Cette action supprimera également toutes les délégations associées.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCity(city.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Supprimer
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      {/* Ajout d'une délégation */}
                      <div className="mb-3 p-2 bg-blue-50 rounded">
                        <div className="flex gap-2">
                          <Input
                            value={selectedCityId === city.id ? newDelegation : ""}
                            onChange={e => {
                              setSelectedCityId(city.id)
                              setNewDelegation(e.target.value)
                              setError(null)
                            }}
                            placeholder="Ajouter une délégation"
                            disabled={isLoading}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddDelegation()}
                          />
                          <Button
                            onClick={handleAddDelegation}
                            className="bg-blue-600 text-white hover:bg-blue-700"
                            disabled={isLoading || selectedCityId !== city.id || !newDelegation.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Liste des délégations */}
                      {city.delegations.length > 0 ? (
                        <ul className="space-y-2">
                          {city.delegations.map(delegation => (
                            <li key={delegation.id} className="flex items-center justify-between p-2 bg-white rounded border">
                              {editingDelegation === delegation.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    autoFocus
                                    disabled={isLoading}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') saveEditDelegation()
                                      if (e.key === 'Escape') cancelEdit()
                                    }}
                                  />
                                  <Button variant="outline" size="icon" onClick={saveEditDelegation} disabled={isLoading || !editValue.trim()}>
                                    <Save size={16} />
                                  </Button>
                                  <Button variant="outline" size="icon" onClick={cancelEdit} disabled={isLoading}>
                                    <X size={16} />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="flex-1">{delegation.name}</span>
                                  <span className="flex gap-2">
                                    <Button 
                                      variant="outline" 
                                      size="icon" 
                                      onClick={() => startEditDelegation(delegation.id, delegation.name)}
                                      disabled={isLoading}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <AlertDialog>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" disabled={isLoading}>
                                          <Trash size={16} />
                                        </Button>
                                      </AlertDialogTrigger>
                                      <AlertDialogContent>
                                        <AlertDialogHeader>
                                          <AlertDialogTitle className="flex items-center gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                            Supprimer la délégation
                                          </AlertDialogTitle>
                                          <AlertDialogDescription>
                                            Êtes-vous sûr de vouloir supprimer "{delegation.name}" ?
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                                          <AlertDialogAction 
                                            onClick={() => handleDeleteDelegation(delegation.id)}
                                            className="bg-red-600 hover:bg-red-700"
                                          >
                                            Supprimer
                                          </AlertDialogAction>
                                        </AlertDialogFooter>
                                      </AlertDialogContent>
                                    </AlertDialog>
                                  </span>
                                </>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">Aucune délégation</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
                {country.cities.length === 0 && (
                  <p className="text-sm text-gray-500 italic ml-4">Aucune ville</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {countries.length === 0 && (
          <Card>
            <CardContent className="text-center py-8 text-gray-500">
              <p>Aucun pays enregistré</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}