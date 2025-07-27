"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { StatusAlert } from "@/components/ui/status-alert"
import { InlineEdit } from "@/components/ui/inline-edit"
import { DeleteConfirmation } from "@/components/ui/delete-confirmation"
import { useLocations } from "@/hooks/use-locations"
import { MapPin, Building, Flag, Plus, Loader2 } from "lucide-react"

export function OptimizedLocalisationsList() {
  const {
    countries,
    isLoading,
    error,
    clearError,
    addCountry,
    addCity,
    addDelegation,
    updateCountry,
    updateCity,
    updateDelegation,
    deleteCountry,
    deleteCity,
    deleteDelegation
  } = useLocations()

  const [newCountry, setNewCountry] = useState("")
  const [newCity, setNewCity] = useState("")
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null)
  const [newDelegation, setNewDelegation] = useState("")
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null)
  const [expandedCountries, setExpandedCountries] = useState<Set<number>>(new Set())

  // Gestion de l'expansion des pays
  const toggleCountryExpansion = (countryId: number) => {
    setExpandedCountries(prev => {
      const newSet = new Set(prev)
      if (newSet.has(countryId)) {
        newSet.delete(countryId)
      } else {
        newSet.add(countryId)
      }
      return newSet
    })
  }

  // Ajouter un pays
  const handleAddCountry = async () => {
    if (!newCountry.trim()) return
    const success = await addCountry(newCountry)
    if (success) {
      setNewCountry("")
    }
  }

  // Ajouter une ville
  const handleAddCity = async () => {
    if (!newCity.trim() || !selectedCountryId) return
    const success = await addCity(newCity, selectedCountryId)
    if (success) {
      setNewCity("")
      setSelectedCountryId(null)
    }
  }

  // Ajouter une délégation
  const handleAddDelegation = async () => {
    if (!newDelegation.trim() || !selectedCityId) return
    const success = await addDelegation(newDelegation, selectedCityId)
    if (success) {
      setNewDelegation("")
      setSelectedCityId(null)
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
          <CardTitle className="flex items-center gap-2 text-[#001F5B]">
            <MapPin className="h-5 w-5" />
            Gestion des localisations
          </CardTitle>
          <div className="flex gap-4 mt-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Flag className="h-3 w-3" />
              {countries.length} pays
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Building className="h-3 w-3" />
              {totalCities} villes
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {totalDelegations} délégations
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Gestion des erreurs */}
      {error && (
        <StatusAlert 
          type="error" 
          message={error.message} 
          className="mb-4" 
        />
      )}

      {/* Ajout d'un pays */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter un pays</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="new-country">Nom du pays</Label>
              <Input
                id="new-country"
                value={newCountry}
                onChange={(e) => {
                  setNewCountry(e.target.value)
                  clearError()
                }}
                placeholder="Entrez le nom du pays"
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleAddCountry()}
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleAddCountry} 
                disabled={isLoading || !newCountry.trim()}
                className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Ajouter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des pays */}
      {isLoading && countries.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            Chargement des localisations...
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {countries.map(country => (
            <Card key={country.id} className="border-l-4 border-l-[#D4AF37]">
              <CardHeader className="cursor-pointer" onClick={() => toggleCountryExpansion(country.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="h-5 w-5 text-[#001F5B]" />
                    <InlineEdit
                      initialValue={country.name}
                      onSave={(newName) => updateCountry(country.id, newName)}
                      placeholder="Nom du pays"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {country.cities.length} ville{country.cities.length !== 1 ? 's' : ''}
                    </Badge>
                    <DeleteConfirmation
                      title="Supprimer le pays"
                      description={`Êtes-vous sûr de vouloir supprimer "${country.name}" ? Cette action supprimera également toutes les villes et délégations associées.`}
                      onConfirm={() => deleteCountry(country.id)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </CardHeader>

              {expandedCountries.has(country.id) && (
                <CardContent className="pt-0">
                  <Separator className="mb-4" />
                  
                  {/* Ajout d'une ville */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Ajouter une ville</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={selectedCountryId === country.id ? newCity : ""}
                        onChange={(e) => {
                          setSelectedCountryId(country.id)
                          setNewCity(e.target.value)
                          clearError()
                        }}
                        placeholder="Nom de la ville"
                        disabled={isLoading}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCity()}
                      />
                      <Button
                        onClick={handleAddCity}
                        disabled={isLoading || selectedCountryId !== country.id || !newCity.trim()}
                        size="sm"
                        className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Liste des villes */}
                  <div className="space-y-3">
                    {country.cities.map(city => (
                      <Card key={city.id} className="ml-4 border-l-2 border-l-blue-200">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Building className="h-4 w-4 text-blue-600" />
                              <InlineEdit
                                initialValue={city.name}
                                onSave={(newName) => updateCity(city.id, newName)}
                                placeholder="Nom de la ville"
                                disabled={isLoading}
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {city.delegations.length} délégation{city.delegations.length !== 1 ? 's' : ''}
                              </Badge>
                              <DeleteConfirmation
                                title="Supprimer la ville"
                                description={`Êtes-vous sûr de vouloir supprimer "${city.name}" ? Cette action supprimera également toutes les délégations associées.`}
                                onConfirm={() => deleteCity(city.id)}
                                disabled={isLoading}
                              />
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {/* Ajout d'une délégation */}
                          <div className="mb-3 p-2 bg-blue-50 rounded">
                            <Label className="text-xs font-medium">Ajouter une délégation</Label>
                            <div className="flex gap-2 mt-1">
                              <Input
                                value={selectedCityId === city.id ? newDelegation : ""}
                                onChange={(e) => {
                                  setSelectedCityId(city.id)
                                  setNewDelegation(e.target.value)
                                  clearError()
                                }}
                                placeholder="Nom de la délégation"
                                className="text-sm"
                                disabled={isLoading}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddDelegation()}
                              />
                              <Button
                                onClick={handleAddDelegation}
                                disabled={isLoading || selectedCityId !== city.id || !newDelegation.trim()}
                                size="sm"
                                className="bg-blue-600 text-white hover:bg-blue-700"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>

                          {/* Liste des délégations */}
                          {city.delegations.length > 0 ? (
                            <div className="space-y-2">
                              {city.delegations.map(delegation => (
                                <div key={delegation.id} className="flex items-center justify-between p-2 bg-white rounded border">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-3 w-3 text-green-600" />
                                    <InlineEdit
                                      initialValue={delegation.name}
                                      onSave={(newName) => updateDelegation(delegation.id, newName)}
                                      placeholder="Nom de la délégation"
                                      disabled={isLoading}
                                      className="text-sm"
                                    />
                                  </div>
                                  <DeleteConfirmation
                                    title="Supprimer la délégation"
                                    description={`Êtes-vous sûr de vouloir supprimer "${delegation.name}" ?`}
                                    onConfirm={() => deleteDelegation(delegation.id)}
                                    disabled={isLoading}
                                    triggerVariant="ghost"
                                    className="h-6 w-6"
                                  />
                                </div>
                              ))}
                            </div>
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
              )}
            </Card>
          ))}
          
          {countries.length === 0 && (
            <Card>
              <CardContent className="text-center py-8 text-gray-500">
                <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucun pays enregistré</p>
                <p className="text-sm">Commencez par ajouter un pays ci-dessus</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
