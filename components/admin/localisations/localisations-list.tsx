"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash, Plus, Save, X, AlertTriangle, Check, Clock } from "lucide-react"
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

// Types pour le stockage temporaire
type TempDelegation = { tempId: string; name: string }
type TempCity = { tempId: string; name: string; delegations: TempDelegation[] }
type TempCountry = { tempId: string; name: string; cities: TempCity[] }

export function LocalisationsList() {
  // États pour les données persistées
  const [countries, setCountries] = useState<Country[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  
  // États pour les données temporaires
  const [tempCountries, setTempCountries] = useState<TempCountry[]>([])
  
  // États pour l'édition des données persistées
  const [editingCountry, setEditingCountry] = useState<number | null>(null)
  const [editingCity, setEditingCity] = useState<number | null>(null)
  const [editingDelegation, setEditingDelegation] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  // États pour l'ajout de nouvelles données
  const [newCountryName, setNewCountryName] = useState("")
  const [newCityName, setNewCityName] = useState("")
  const [newDelegationName, setNewDelegationName] = useState("")
  const [selectedTempCountryId, setSelectedTempCountryId] = useState<string | null>(null)
  const [selectedTempCityId, setSelectedTempCityId] = useState<string | null>(null)

  // Nouveaux états pour l'ajout à des structures existantes
  const [addingCityToCountryId, setAddingCityToCountryId] = useState<number | null>(null)
  const [addingDelegationToCityId, setAddingDelegationToCityId] = useState<number | null>(null)
  const [newCityForExistingCountry, setNewCityForExistingCountry] = useState("")
  const [newDelegationForExistingCity, setNewDelegationForExistingCity] = useState("")
  
  // États pour les villes temporaires ajoutées à des pays existants
  const [tempCitiesForExistingCountries, setTempCitiesForExistingCountries] = useState<{[countryId: number]: TempCity[]}>({})
  
  // États pour les délégations temporaires ajoutées à des villes existantes
  const [tempDelegationsForExistingCities, setTempDelegationsForExistingCities] = useState<{[cityId: number]: TempDelegation[]}>({})

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

  // Fonctions pour gérer les données temporaires
  const generateTempId = () => `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  const addTempCountry = () => {
    // Vérifier s'il y a déjà un pays temporaire incomplet
    const incompleteCountry = tempCountries.find(country => !isStructureComplete(country))
    if (incompleteCountry) {
      setError(`Vous devez d'abord terminer le pays "${incompleteCountry.name}" avant d'en créer un nouveau. Ajoutez au moins une ville avec une localité.`)
      return
    }

    const validation = validateLocationName(newCountryName, 'country')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempCountry: TempCountry = {
      tempId: generateTempId(),
      name: newCountryName.trim(),
      cities: []
    }

    setTempCountries(prev => [...prev, newTempCountry])
    setSelectedTempCountryId(newTempCountry.tempId)
    setNewCountryName("")
    setError(null)
  }

  const addTempCity = () => {
    if (!selectedTempCountryId) return
    
    const validation = validateLocationName(newCityName, 'city')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempCity: TempCity = {
      tempId: generateTempId(),
      name: newCityName.trim(),
      delegations: []
    }

    setTempCountries(prev => prev.map(country => 
      country.tempId === selectedTempCountryId
        ? { ...country, cities: [...country.cities, newTempCity] }
        : country
    ))

    setSelectedTempCityId(newTempCity.tempId)
    setNewCityName("")
    setError(null)
  }

  const addTempDelegation = () => {
    if (!selectedTempCountryId || !selectedTempCityId) return
    
    const validation = validateLocationName(newDelegationName, 'delegation')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempDelegation: TempDelegation = {
      tempId: generateTempId(),
      name: newDelegationName.trim()
    }

    setTempCountries(prev => prev.map(country => 
      country.tempId === selectedTempCountryId
        ? {
            ...country,
            cities: country.cities.map(city =>
              city.tempId === selectedTempCityId
                ? { ...city, delegations: [...city.delegations, newTempDelegation] }
                : city
            )
          }
        : country
    ))

    setNewDelegationName("")
    setError(null)
  }

  // Nouvelles fonctions pour ajouter à des structures existantes
  const addTempCityToExistingCountry = (countryId: number) => {
    const validation = validateLocationName(newCityForExistingCountry, 'city')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempCity: TempCity = {
      tempId: generateTempId(),
      name: newCityForExistingCountry.trim(),
      delegations: []
    }

    setTempCitiesForExistingCountries(prev => ({
      ...prev,
      [countryId]: [...(prev[countryId] || []), newTempCity]
    }))

    setNewCityForExistingCountry("")
    setAddingCityToCountryId(null)
    setError(null)
  }

  const addTempDelegationToExistingCity = (cityId: number) => {
    const validation = validateLocationName(newDelegationForExistingCity, 'delegation')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempDelegation: TempDelegation = {
      tempId: generateTempId(),
      name: newDelegationForExistingCity.trim()
    }

    setTempDelegationsForExistingCities(prev => ({
      ...prev,
      [cityId]: [...(prev[cityId] || []), newTempDelegation]
    }))

    setNewDelegationForExistingCity("")
    setAddingDelegationToCityId(null)
    setError(null)
  }

  // Fonction pour sauvegarder une structure complète
  const saveCompleteStructure = async (tempCountry: TempCountry) => {
    try {
      setIsLoading(true)
      
      // 1. Créer le pays
      const countryResponse = await axiosInstance.post("/localisations/pays", { 
        name: tempCountry.name 
      })
      const countryId = countryResponse.data.id || countryResponse.data

      // 2. Créer toutes les villes et leurs délégations
      for (const tempCity of tempCountry.cities) {
        const cityResponse = await axiosInstance.post(`/localisations/ville/${countryId}`, { 
          name: tempCity.name 
        })
        const cityId = cityResponse.data.id || cityResponse.data

        // 3. Créer toutes les délégations pour cette ville
        for (const tempDelegation of tempCity.delegations) {
          await axiosInstance.post(`/localisations/delegation/${cityId}`, { 
            name: tempDelegation.name 
          })
        }
      }

      // 4. Supprimer la structure temporaire et recharger les données
      setTempCountries(prev => prev.filter(c => c.tempId !== tempCountry.tempId))
      await fetchLocalisations()
      setError(`Pays "${tempCountry.name}" sauvegardé avec succès !`)
      
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour sauvegarder les villes temporaires d'un pays existant
  const saveTempCitiesForCountry = async (countryId: number) => {
    const tempCities = tempCitiesForExistingCountries[countryId] || []
    if (tempCities.length === 0) return

    // Vérifier que toutes les villes ont au moins une délégation
    const incompleteCities = tempCities.filter(city => city.delegations.length === 0)
    if (incompleteCities.length > 0) {
      setError(`Impossible de sauvegarder : ${incompleteCities.length} ville(s) n'ont pas de localité.`)
      return
    }

    try {
      setIsLoading(true)

      // Créer toutes les villes et leurs délégations
      for (const tempCity of tempCities) {
        const cityResponse = await axiosInstance.post(`/localisations/ville/${countryId}`, { 
          name: tempCity.name 
        })
        const cityId = cityResponse.data.id || cityResponse.data

        // Créer toutes les délégations pour cette ville
        for (const tempDelegation of tempCity.delegations) {
          await axiosInstance.post(`/localisations/delegation/${cityId}`, { 
            name: tempDelegation.name 
          })
        }
      }

      // Supprimer les villes temporaires et recharger les données
      setTempCitiesForExistingCountries(prev => {
        const newState = { ...prev }
        delete newState[countryId]
        return newState
      })
      
      await fetchLocalisations()
      setError(`${tempCities.length} ville(s) ajoutée(s) avec succès !`)
      
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonction pour sauvegarder les délégations temporaires d'une ville existante
  const saveTempDelegationsForCity = async (cityId: number) => {
    const tempDelegations = tempDelegationsForExistingCities[cityId] || []
    if (tempDelegations.length === 0) return

    try {
      setIsLoading(true)

      // Créer toutes les délégations
      for (const tempDelegation of tempDelegations) {
        await axiosInstance.post(`/localisations/delegation/${cityId}`, { 
          name: tempDelegation.name 
        })
      }

      // Supprimer les délégations temporaires et recharger les données
      setTempDelegationsForExistingCities(prev => {
        const newState = { ...prev }
        delete newState[cityId]
        return newState
      })
      
      await fetchLocalisations()
      setError(`${tempDelegations.length} localité(s) ajoutée(s) avec succès !`)
      
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions pour supprimer des éléments temporaires
  const removeTempCountry = (tempId: string) => {
    setTempCountries(prev => prev.filter(c => c.tempId !== tempId))
    if (selectedTempCountryId === tempId) {
      setSelectedTempCountryId(null)
      setSelectedTempCityId(null)
    }
  }

  const removeTempCity = (countryTempId: string, cityTempId: string) => {
    setTempCountries(prev => prev.map(country => 
      country.tempId === countryTempId
        ? { ...country, cities: country.cities.filter(c => c.tempId !== cityTempId) }
        : country
    ))
    if (selectedTempCityId === cityTempId) {
      setSelectedTempCityId(null)
    }
  }

  const removeTempDelegation = (countryTempId: string, cityTempId: string, delegationTempId: string) => {
    setTempCountries(prev => prev.map(country => {
      if (country.tempId !== countryTempId) return country

      const updatedCities = country.cities.map(city => {
        if (city.tempId !== cityTempId) return city
        
        const updatedDelegations = city.delegations.filter(d => d.tempId !== delegationTempId)
        
        // Si c'était la dernière délégation, on va supprimer la ville
        if (updatedDelegations.length === 0) {
          return null // Marquer pour suppression
        }
        
        return { ...city, delegations: updatedDelegations }
      }).filter(city => city !== null) // Supprimer les villes marquées

      // Si plus de villes dans le pays, supprimer le pays aussi
      if (updatedCities.length === 0) {
        return null // Marquer le pays pour suppression
      }

      return { ...country, cities: updatedCities }
    }).filter(country => country !== null)) // Supprimer les pays marqués

    // Réinitialiser les sélections si nécessaire
    const countryStillExists = tempCountries.some(c => c.tempId === countryTempId)
    if (!countryStillExists) {
      setSelectedTempCountryId(null)
      setSelectedTempCityId(null)
    } else {
      const cityStillExists = tempCountries
        .find(c => c.tempId === countryTempId)?.cities
        .some(city => city.tempId === cityTempId)
      if (!cityStillExists) {
        setSelectedTempCityId(null)
      }
    }
  }

  // Fonctions pour supprimer des éléments temporaires des structures existantes
  const removeTempCityFromExistingCountry = (countryId: number, cityTempId: string) => {
    setTempCitiesForExistingCountries(prev => ({
      ...prev,
      [countryId]: (prev[countryId] || []).filter(city => city.tempId !== cityTempId)
    }))
  }

  const removeTempDelegationFromExistingCity = (cityId: number, delegationTempId: string) => {
    setTempDelegationsForExistingCities(prev => ({
      ...prev,
      [cityId]: (prev[cityId] || []).filter(delegation => delegation.tempId !== delegationTempId)
    }))
  }

  const addTempDelegationToTempCityInExistingCountry = (countryId: number, cityTempId: string, delegationName: string) => {
    const validation = validateLocationName(delegationName, 'delegation')
    if (!validation.isValid) {
      setError(validation.message!)
      return
    }

    const newTempDelegation: TempDelegation = {
      tempId: generateTempId(),
      name: delegationName.trim()
    }

    setTempCitiesForExistingCountries(prev => ({
      ...prev,
      [countryId]: (prev[countryId] || []).map(city =>
        city.tempId === cityTempId
          ? { ...city, delegations: [...city.delegations, newTempDelegation] }
          : city
      )
    }))
  }

  const removeTempDelegationFromTempCity = (countryId: number, cityTempId: string, delegationTempId: string) => {
    setTempCitiesForExistingCountries(prev => ({
      ...prev,
      [countryId]: (prev[countryId] || []).map(city =>
        city.tempId === cityTempId
          ? { ...city, delegations: city.delegations.filter(d => d.tempId !== delegationTempId) }
          : city
      )
    }))
  }

  // Vérifier si une structure temporaire est complète (prête à être sauvegardée)
  const isStructureComplete = (tempCountry: TempCountry): boolean => {
    return tempCountry.cities.length > 0 && 
           tempCountry.cities.every(city => city.delegations.length > 0)
  }

  // Fonction pour vérifier s'il y a des pays temporaires incomplets
  const hasIncompleteCountries = () => {
    return tempCountries.some(country => !isStructureComplete(country))
  }

  // Fonction pour obtenir le premier pays incomplet
  const getFirstIncompleteCountry = () => {
    return tempCountries.find(country => !isStructureComplete(country))
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
      setError(`Pays modifié avec succès !`)
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
      setError(`Ville modifiée avec succès !`)
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
      setError(`Localité modifiée avec succès !`)
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Fonctions de suppression avec validation
  const canDeleteCountry = (country: Country) => {
    return country.cities.length === 0
  }

  const canDeleteCity = (city: City) => {
    return city.delegations.length === 0
  }

  const handleDeleteCountry = async (id: number) => {
    const country = countries.find(c => c.id === id)
    if (!country || !canDeleteCountry(country)) {
      setError("Impossible de supprimer un pays qui contient des villes. Supprimez d'abord toutes les villes.")
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.delete(`/localisations/pays/${id}`)
      await fetchLocalisations()
      setError(`Pays "${country.name}" supprimé avec succès !`)
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteCity = async (id: number) => {
    const city = countries
      .flatMap(c => c.cities)
      .find(c => c.id === id)
    
    if (!city || !canDeleteCity(city)) {
      setError("Impossible de supprimer une ville qui contient des localités. Supprimez d'abord toutes les localités.")
      return
    }

    try {
      setIsLoading(true)
      await axiosInstance.delete(`/localisations/ville/${id}`)
      await fetchLocalisations()
      setError(`Ville "${city.name}" supprimée avec succès !`)
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
      
      // Trouver la ville qui contient cette délégation
      const cityWithDelegation = countries
        .flatMap(country => country.cities.map(city => ({ country, city })))
        .find(({ city }) => city.delegations.some(d => d.id === id))

      if (!cityWithDelegation) {
        await axiosInstance.delete(`/localisations/delegation/${id}`)
        await fetchLocalisations()
        return
      }

      const { country, city } = cityWithDelegation

      // Supprimer la délégation
      await axiosInstance.delete(`/localisations/delegation/${id}`)

      // Vérifier si c'était la dernière délégation de la ville
      if (city.delegations.length === 1) { // 1 car on vient de supprimer
        // Supprimer la ville automatiquement
        await axiosInstance.delete(`/localisations/ville/${city.id}`)
        
        // Vérifier si c'était la dernière ville du pays
        if (country.cities.length === 1) { // 1 car on vient de supprimer la ville
          // Supprimer le pays automatiquement
          await axiosInstance.delete(`/localisations/pays/${country.id}`)
          setError(`Localité, ville "${city.name}" et pays "${country.name}" supprimés automatiquement (derniers éléments).`)
        } else {
          setError(`Localité supprimée. Ville "${city.name}" supprimée automatiquement (dernière localité).`)
        }
      }

      await fetchLocalisations()
    } catch (err) {
      const locationError = parseLocationError(err)
      setError(locationError.message)
    } finally {
      setIsLoading(false)
    }
  }

  // Statistiques mises à jour
  const totalCities = countries.reduce((sum, country) => sum + country.cities.length, 0)
  const totalDelegations = countries.reduce((sum, country) => 
    sum + country.cities.reduce((citySum, city) => citySum + city.delegations.length, 0), 0)

  const tempTotalCities = tempCountries.reduce((sum, country) => sum + country.cities.length, 0) +
    Object.values(tempCitiesForExistingCountries).reduce((sum, cities) => sum + cities.length, 0)
  
  const tempTotalDelegations = tempCountries.reduce((sum, country) => 
    sum + country.cities.reduce((citySum, city) => citySum + city.delegations.length, 0), 0) +
    Object.values(tempCitiesForExistingCountries).reduce((sum, cities) => 
      sum + cities.reduce((citySum, city) => citySum + city.delegations.length, 0), 0) +
    Object.values(tempDelegationsForExistingCities).reduce((sum, delegations) => sum + delegations.length, 0)

  // Fonction pour vérifier si on est en cours de saisie (pays sélectionné)
  const isInCountryEditMode = () => {
    return selectedTempCountryId !== null
  }

  // Fonction pour vérifier si on est en cours de saisie de ville (ville sélectionnée)
  const isInCityEditMode = () => {
    return selectedTempCityId !== null
  }

  // Fonction pour réinitialiser complètement le formulaire
  const resetForm = () => {
    // Réinitialiser tous les champs de saisie
    setNewCountryName("")
    setNewCityName("")
    setNewDelegationName("")
    setNewCityForExistingCountry("")
    setNewDelegationForExistingCity("")
    
    // Réinitialiser les sélections temporaires
    setSelectedTempCountryId(null)
    setSelectedTempCityId(null)
    
    // Réinitialiser les modes d'ajout
    setAddingCityToCountryId(null)
    setAddingDelegationToCityId(null)
    
    // Supprimer toutes les données temporaires
    setTempCountries([])
    setTempCitiesForExistingCountries({})
    setTempDelegationsForExistingCities({})
    
    // Effacer les erreurs
    setError(null)
  }

  return (
    <div className="space-y-6">
      {/* Header avec statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#001F5B]">Gestion des localisations</CardTitle>
          <div className="flex gap-4 mt-4">
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Badge variant="secondary">{countries.length} pays</Badge>
                <Badge variant="secondary">{totalCities} villes</Badge>
                <Badge variant="secondary">{totalDelegations} localités</Badge>
              </div>
              {(tempCountries.length > 0 || tempTotalCities > 0 || tempTotalDelegations > 0) && (
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-orange-600 border-orange-300">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente: {tempCountries.length} pays, {tempTotalCities} villes, {tempTotalDelegations} localités
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {error && (
        <StatusAlert type="error" message={error} className="mb-4" />
      )}

      {/* Section d'ajout de nouvelles données */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Ajouter de nouvelles localisations</CardTitle>
          <p className="text-sm text-gray-600">
            Créez d'abord un pays, puis ajoutez-y des villes et enfin des localités. 
            La sauvegarde ne se fera qu'une fois la structure complète.
          </p>
          {hasIncompleteCountries() && (
            <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ Vous devez terminer le pays "{getFirstIncompleteCountry()?.name}" avant d'en créer un nouveau.
                Ajoutez au moins une ville avec une localité à ce pays.
              </p>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Ajout d'un pays */}
          <div className="flex gap-2">
            <Input
              value={newCountryName}
              onChange={e => {
                setNewCountryName(e.target.value)
                if (hasIncompleteCountries()) {
                  setError(`Terminez d'abord le pays "${getFirstIncompleteCountry()?.name}" avant d'en créer un nouveau.`)
                } else {
                  setError(null)
                }
              }}
              placeholder={
                hasIncompleteCountries() 
                  ? "Terminez d'abord le pays en cours..." 
                  : isInCountryEditMode()
                    ? "Terminez d'abord d'ajouter des villes..."
                    : "Nom du pays"
              }
              disabled={isLoading || hasIncompleteCountries() || isInCountryEditMode()}
              onKeyDown={(e) => e.key === 'Enter' && !hasIncompleteCountries() && !isInCountryEditMode() && addTempCountry()}
            />
            <Button 
              onClick={addTempCountry} 
              disabled={isLoading || !newCountryName.trim() || hasIncompleteCountries() || isInCountryEditMode()}
              className="bg-[#001F5B] text-white hover:bg-[#001F5B]/90"
              title={
                hasIncompleteCountries() 
                  ? "Terminez d'abord le pays en cours" 
                  : isInCountryEditMode()
                    ? "Terminez d'abord d'ajouter des villes au pays actuel"
                    : "Ajouter un nouveau pays"
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter pays
            </Button>
          </div>

          {/* Message d'aide contextuel */}
          {!hasIncompleteCountries() && tempCountries.length === 0 && !isInCountryEditMode() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                💡 Commencez par créer un pays. Vous pourrez ensuite y ajouter des villes et des localités.
              </p>
            </div>
          )}

          {hasIncompleteCountries() && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                🔄 Terminez la structure du pays "{getFirstIncompleteCountry()?.name}" :
              </p>
              <ul className="text-xs text-yellow-700 mt-1 ml-4 list-disc">
                <li>Ajoutez au moins une ville</li>
                <li>Ajoutez au moins une localité à chaque ville</li>
                <li>Cliquez sur "Sauvegarder" pour finaliser</li>
              </ul>
            </div>
          )}

          {isInCountryEditMode() && !hasIncompleteCountries() && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                🏙️ Mode ajout de ville au pays "{tempCountries.find(c => c.tempId === selectedTempCountryId)?.name}"
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Le champ pays est verrouillé pendant l'ajout de villes.
              </p>
            </div>
          )}

          {/* Ajout d'une ville (seulement si un pays temporaire est sélectionné) */}
          {selectedTempCountryId && (
            <div className="flex gap-2 ml-4">
              <Input
                value={newCityName}
                onChange={e => {
                  setNewCityName(e.target.value)
                  setError(null)
                }}
                placeholder={isInCityEditMode() ? "Terminez d'abord d'ajouter des localités..." : "Nom de la ville"}
                disabled={isLoading || isInCityEditMode()}
                onKeyDown={(e) => e.key === 'Enter' && !isInCityEditMode() && addTempCity()}
              />
              <Button 
                onClick={addTempCity} 
                disabled={isLoading || !newCityName.trim() || isInCityEditMode()}
                className="bg-blue-600 text-white hover:bg-blue-700"
                title={isInCityEditMode() ? "Terminez d'abord d'ajouter des localités à la ville actuelle" : "Ajouter une ville"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter ville
              </Button>
            </div>
          )}

          {isInCityEditMode() && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg ml-8">
              <p className="text-sm text-green-800">
                🏘️ Mode ajout de localité à la ville "{tempCountries.find(c => c.tempId === selectedTempCountryId)?.cities.find(city => city.tempId === selectedTempCityId)?.name}"
              </p>
              <p className="text-xs text-green-700 mt-1">
                Les champs pays et ville sont verrouillés pendant l'ajout de localités.
              </p>
            </div>
          )}

          {/* Ajout d'une localité (seulement si une ville temporaire est sélectionnée) */}
          {selectedTempCityId && (
            <div className="flex gap-2 ml-8">
              <Input
                value={newDelegationName}
                onChange={e => {
                  setNewDelegationName(e.target.value)
                  setError(null)
                }}
                placeholder="Nom de la localité"
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && addTempDelegation()}
              />
              <Button 
                onClick={addTempDelegation} 
                disabled={isLoading || !newDelegationName.trim()}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter localité
              </Button>
            </div>
          )}

          {/* Bouton pour réinitialiser le formulaire */}
          {(selectedTempCountryId || tempCountries.length > 0 || Object.keys(tempCitiesForExistingCountries).length > 0 || Object.keys(tempDelegationsForExistingCities).length > 0) && (
            <div className="flex justify-center mt-6 pt-4 border-t">
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={isLoading}
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Réinitialiser le formulaire
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Section des structures temporaires */}
      {tempCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-orange-600">
              <Clock className="h-5 w-5 inline mr-2" />
              Structures en cours de création
            </CardTitle>
            <p className="text-sm text-gray-600">
              Ces structures ne seront sauvegardées que lorsqu'elles seront complètes 
              (pays → ville(s) → localité(s)).
            </p>
            {hasIncompleteCountries() && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-xs text-red-700">
                  ⚠️ Vous ne pouvez pas créer de nouveau pays tant que celui-ci n'est pas terminé.
                </p>
              </div>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {tempCountries.map((tempCountry, index) => (
                <Card 
                  key={tempCountry.tempId} 
                  className={`border-l-4 ${
                    isStructureComplete(tempCountry) 
                      ? 'border-l-green-400 bg-green-50' 
                      : index === 0 && !isStructureComplete(tempCountry)
                        ? 'border-l-red-400 bg-red-50'
                        : 'border-l-orange-400 bg-orange-50'
                  }`}
                >
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <CardTitle className="text-[#001F5B] flex-1">
                        {tempCountry.name}
                        {isStructureComplete(tempCountry) ? (
                          <Check className="h-4 w-4 text-green-600 inline ml-2" />
                        ) : (
                          <span className="text-red-600 text-sm ml-2">(Incomplet)</span>
                        )}
                      </CardTitle>
                      <Badge 
                        variant="outline" 
                        className={
                          isStructureComplete(tempCountry) 
                            ? "text-green-600 border-green-300" 
                            : "text-orange-600 border-orange-300"
                        }
                      >
                        {tempCountry.cities.length} ville{tempCountry.cities.length !== 1 ? 's' : ''}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      {isStructureComplete(tempCountry) && (
                        <Button
                          onClick={() => saveCompleteStructure(tempCountry)}
                          disabled={isLoading}
                          className="bg-green-600 text-white hover:bg-green-700"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Sauvegarder
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          removeTempCountry(tempCountry.tempId)
                          setSelectedTempCountryId(null)
                          setSelectedTempCityId(null)
                        }}
                        disabled={isLoading}
                        className={!isStructureComplete(tempCountry) ? "border-red-300 text-red-600" : ""}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSelectedTempCountryId(
                            selectedTempCountryId === tempCountry.tempId ? null : tempCountry.tempId
                          )
                          setSelectedTempCityId(null)
                        }}
                        className={
                          selectedTempCountryId === tempCountry.tempId 
                            ? "bg-blue-100" 
                            : !isStructureComplete(tempCountry)
                              ? "border-red-300 text-red-600"
                              : ""
                        }
                      >
                        {selectedTempCountryId === tempCountry.tempId ? "Masquer" : "Éditer"}
                      </Button>
                    </div>
                  </CardHeader>
                  
                  {/* Affichage spécial pour le pays incomplet */}
                  {!isStructureComplete(tempCountry) && (
                    <div className="px-6 pb-2">
                      <div className="p-2 bg-red-100 border border-red-200 rounded text-sm">
                        <p className="text-red-800 font-medium">
                          🚨 Ce pays doit être terminé avant de pouvoir créer un nouveau pays
                        </p>
                        <p className="text-red-700 text-xs mt-1">
                          Ajoutez au moins une ville avec une localité, puis sauvegardez.
                        </p>
                      </div>
                    </div>
                  )}

                  <CardContent>
                    {/* Liste des villes temporaires */}
                    <div className="space-y-2">
                      {tempCountry.cities.map(tempCity => (
                        <Card key={tempCity.tempId} className="border ml-4 border-l-2 border-l-blue-200">
                          <CardHeader className="flex flex-row items-center justify-between py-2">
                            <div className="flex items-center gap-3 flex-1">
                              <span className="text-[#001F5B] font-medium">
                                {tempCity.name}
                                {tempCity.delegations.length > 0 && (
                                  <Check className="h-3 w-3 text-green-600 inline ml-2" />
                                )}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {tempCity.delegations.length} localité{tempCity.delegations.length !== 1 ? 's' : ''}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeTempCity(tempCountry.tempId, tempCity.tempId)}
                                disabled={isLoading}
                              >
                                <Trash className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTempCountryId(tempCountry.tempId)
                                  setSelectedTempCityId(
                                    selectedTempCityId === tempCity.tempId ? null : tempCity.tempId
                                  )
                                }}
                                className={selectedTempCityId === tempCity.tempId ? "bg-green-100" : ""}
                              >
                                {selectedTempCityId === tempCity.tempId ? "Masquer" : "Éditer"}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="py-2">
                            {/* Liste des localités temporaires */}
                            {tempCity.delegations.length > 0 ? (
                              <ul className="space-y-1">
                                {tempCity.delegations.map(tempDelegation => (
                                  <li key={tempDelegation.tempId} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                                    <span>{tempDelegation.name}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const willDeleteCity = tempCity.delegations.length === 1
                                        const willDeleteCountry = tempCountry.cities.length === 1 && willDeleteCity
                                        
                                        if (willDeleteCountry) {
                                          setError(`Suppression de la localité "${tempDelegation.name}", de la ville "${tempCity.name}" et du pays "${tempCountry.name}" (derniers éléments).`)
                                        } else if (willDeleteCity) {
                                          setError(`Suppression de la localité "${tempDelegation.name}" et de la ville "${tempCity.name}" (dernière localité).`)
                                        }
                                        
                                        removeTempDelegation(tempCountry.tempId, tempCity.tempId, tempDelegation.tempId)
                                      }}
                                      disabled={isLoading}
                                      title={
                                        tempCity.delegations.length === 1
                                          ? "Attention : supprimer cette localité supprimera aussi la ville"
                                          : "Supprimer cette localité"
                                      }
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                                ⚠️ Cette ville doit avoir au moins une localité avant la sauvegarde.
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      {tempCountry.cities.length === 0 && (
                        <div className="ml-4 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                          ⚠️ Ce pays doit avoir au moins une ville avant la sauvegarde.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Section des données persistées avec ajouts possibles */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-[#001F5B]">Localisations enregistrées</h2>
        {countries.map(country => {
          const tempCitiesForThisCountry = tempCitiesForExistingCountries[country.id] || []
          const hasTempCities = tempCitiesForThisCountry.length > 0
          const canSaveTempCities = hasTempCities && tempCitiesForThisCountry.every(city => city.delegations.length > 0)
          
          return (
            <Card key={country.id} className={`border border-l-4 ${hasTempCities ? 'border-l-orange-400' : 'border-l-[#D4AF37]'}`}>
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
                      <CardTitle className="text-[#001F5B] flex-1">
                        {country.name}
                        {hasTempCities && (
                          <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300">
                            <Clock className="h-3 w-3 mr-1" />
                            {tempCitiesForThisCountry.length} ville(s) en attente
                          </Badge>
                        )}
                      </CardTitle>
                      <Badge variant="outline">{country.cities.length} ville{country.cities.length !== 1 ? 's' : ''}</Badge>
                    </>
                  )}
                </div>
                {editingCountry !== country.id && (
                  <div className="flex gap-2">
                    {/* Bouton pour ajouter des villes */}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setAddingCityToCountryId(
                        addingCityToCountryId === country.id ? null : country.id
                      )}
                      disabled={isLoading}
                      title="Ajouter une ville"
                      className={addingCityToCountryId === country.id ? "bg-blue-100" : ""}
                    >
                      <Plus size={16} />
                    </Button>
                    
                    {/* Bouton pour sauvegarder les villes temporaires */}
                    {canSaveTempCities && (
                      <Button
                        onClick={() => saveTempCitiesForCountry(country.id)}
                        disabled={isLoading}
                        className="bg-green-600 text-white hover:bg-green-700"
                        size="icon"
                        title="Sauvegarder les villes en attente"
                      >
                        <Save size={16} />
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => startEditCountry(country.id, country.name)}
                      disabled={isLoading}
                    >
                      <Edit size={16} />
                    </Button>
                    {canDeleteCountry(country) ? (
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
                              Êtes-vous sûr de vouloir supprimer "{country.name}" ?
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
                    ) : (
                      <Button 
                        variant="outline" 
                        size="icon" 
                        disabled
                        title="Impossible de supprimer : ce pays contient des villes"
                      >
                        <X size={16} className="text-gray-400" />
                      </Button>
                    )}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                {/* Interface d'ajout de ville */}
                {addingCityToCountryId === country.id && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-2">
                      <Input
                        value={newCityForExistingCountry}
                        onChange={e => {
                          setNewCityForExistingCountry(e.target.value)
                          setError(null)
                        }}
                        placeholder="Nom de la nouvelle ville"
                        disabled={isLoading}
                        onKeyDown={(e) => e.key === 'Enter' && addTempCityToExistingCountry(country.id)}
                      />
                      <Button
                        onClick={() => addTempCityToExistingCountry(country.id)}
                        disabled={isLoading || !newCityForExistingCountry.trim()}
                        className="bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ajouter
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setAddingCityToCountryId(null)}
                        disabled={isLoading}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}

                {/* Affichage des villes temporaires pour ce pays */}
                {tempCitiesForThisCountry.length > 0 && (
                  <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">
                      Villes en attente de sauvegarde ({tempCitiesForThisCountry.length})
                    </h4>
                    <div className="space-y-2">
                      {tempCitiesForThisCountry.map(tempCity => (
                        <TempCityDisplay
                          key={tempCity.tempId}
                          tempCity={tempCity}
                          onRemove={() => removeTempCityFromExistingCountry(country.id, tempCity.tempId)}
                          onAddDelegation={(delegationName) => addTempDelegationToTempCityInExistingCountry(country.id, tempCity.tempId, delegationName)}
                          onRemoveDelegation={(delegationTempId) => removeTempDelegationFromTempCity(country.id, tempCity.tempId, delegationTempId)}
                          isLoading={isLoading}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Liste des villes persistées */}
                <div className="space-y-4">
                  {country.cities.map(city => {
                    const tempDelegationsForThisCity = tempDelegationsForExistingCities[city.id] || []
                    const hasTempDelegations = tempDelegationsForThisCity.length > 0
                    
                    return (
                      <Card key={city.id} className={`border ml-4 border-l-2 ${hasTempDelegations ? 'border-l-orange-300' : 'border-l-blue-200'}`}>
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
                                <CardTitle className="text-[#001F5B] text-base flex-1">
                                  {city.name}
                                  {hasTempDelegations && (
                                    <Badge variant="outline" className="ml-2 text-orange-600 border-orange-300 text-xs">
                                      <Clock className="h-2 w-2 mr-1" />
                                      {tempDelegationsForThisCity.length} localité(s) en attente
                                    </Badge>
                                  )}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs">{city.delegations.length} localité{city.delegations.length !== 1 ? 's' : ''}</Badge>
                              </>
                            )}
                          </div>
                          {editingCity !== city.id && (
                            <div className="flex gap-2">
                              {/* Bouton pour ajouter des délégations */}
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setAddingDelegationToCityId(
                                  addingDelegationToCityId === city.id ? null : city.id
                                )}
                                disabled={isLoading}
                                title="Ajouter une localité"
                                className={addingDelegationToCityId === city.id ? "bg-green-100" : ""}
                              >
                                <Plus size={16} />
                              </Button>
                              
                              {/* Bouton pour sauvegarder les délégations temporaires */}
                              {hasTempDelegations && (
                                <Button
                                  onClick={() => saveTempDelegationsForCity(city.id)}
                                  disabled={isLoading}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                  size="icon"
                                  title="Sauvegarder les localités en attente"
                                >
                                  <Save size={16} />
                                </Button>
                              )}
                              
                              <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={() => startEditCity(city.id, city.name)}
                                disabled={isLoading}
                              >
                                <Edit size={16} />
                              </Button>
                              {canDeleteCity(city) ? (
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
                                        Êtes-vous sûr de vouloir supprimer "{city.name}" ?
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
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  disabled
                                  title="Impossible de supprimer : cette ville contient des localités"
                                >
                                  <X size={16} className="text-gray-400" />
                                </Button>
                              )}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent>
                          {/* Interface d'ajout de délégation */}
                          {addingDelegationToCityId === city.id && (
                            <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded">
                              <div className="flex gap-2">
                                <Input
                                  value={newDelegationForExistingCity}
                                  onChange={e => {
                                    setNewDelegationForExistingCity(e.target.value)
                                    setError(null)
                                  }}
                                  placeholder="Nom de la nouvelle localité"
                                  disabled={isLoading}
                                  onKeyDown={(e) => e.key === 'Enter' && addTempDelegationToExistingCity(city.id)}
                                />
                                <Button
                                  onClick={() => addTempDelegationToExistingCity(city.id)}
                                  disabled={isLoading || !newDelegationForExistingCity.trim()}
                                  className="bg-green-600 text-white hover:bg-green-700"
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Ajouter
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => setAddingDelegationToCityId(null)}
                                  disabled={isLoading}
                                >
                                  Annuler
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Affichage des délégations temporaires pour cette ville */}
                          {tempDelegationsForThisCity.length > 0 && (
                            <div className="mb-3 p-2 bg-orange-50 border border-orange-200 rounded">
                              <h5 className="text-xs font-medium text-orange-800 mb-2">
                                Localités en attente de sauvegarde ({tempDelegationsForThisCity.length})
                              </h5>
                              <ul className="space-y-1">
                                {tempDelegationsForThisCity.map(tempDelegation => (
                                  <li key={tempDelegation.tempId} className="flex items-center justify-between p-1 bg-white rounded border text-sm">
                                    <span>{tempDelegation.name}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => removeTempDelegationFromExistingCity(city.id, tempDelegation.tempId)}
                                      disabled={isLoading}
                                    >
                                      <Trash className="h-3 w-3" />
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Liste des localités persistées */}
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
                                                Supprimer la localité
                                              </AlertDialogTitle>
                                              <AlertDialogDescription>
                                                Êtes-vous sûr de vouloir supprimer "{delegation.name}" ?
                                                {city.delegations.length === 1 && (
                                                  <>
                                                    <br /><br />
                                                    <span className="text-red-800 text-sm font-medium">
                                                      ⚠️ Attention : Cette localité est la dernière de la ville "{city.name}".
                                                    </span>
                                                    <br />
                                                    <span className="text-red-700 text-xs">
                                                      La ville sera automatiquement supprimée.
                                                      {countries.find(c => c.cities.some(ct => ct.id === city.id))?.cities.length === 1 && 
                                                        " Le pays sera aussi supprimé (dernière ville)."
                                                      }
                                                    </span>
                                                  </>
                                                )}
                                              </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                              <AlertDialogCancel>Annuler</AlertDialogCancel>
                                              <AlertDialogAction 
                                                onClick={() => handleDeleteDelegation(delegation.id)}
                                                className="bg-red-600 hover:bg-red-700"
                                              >
                                                {city.delegations.length === 1 ? "Supprimer (avec cascade)" : "Supprimer"}
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
                            <div className="p-3 rounded-md border bg-yellow-50 border-yellow-200">
                              <p className="text-sm text-yellow-800">
                                ⚠️ Cette ville n'a aucune localité.
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )
        })}
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

// Composant pour afficher une ville temporaire avec ses délégations
function TempCityDisplay({ 
  tempCity, 
  onRemove, 
  onAddDelegation, 
  onRemoveDelegation, 
  isLoading 
}: {
  tempCity: TempCity
  onRemove: () => void
  onAddDelegation: (delegationName: string) => void
  onRemoveDelegation: (delegationTempId: string) => void
  isLoading: boolean
}) {
  const [newDelegationName, setNewDelegationName] = useState("")
  const [isAddingDelegation, setIsAddingDelegation] = useState(false)

  const handleAddDelegation = () => {
    if (!newDelegationName.trim()) return
    onAddDelegation(newDelegationName)
    setNewDelegationName("")
    setIsAddingDelegation(false)
  }

  return (
    <Card className="border border-blue-200">
      <CardHeader className="py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {tempCity.name}
              {tempCity.delegations.length > 0 && (
                <Check className="h-3 w-3 text-green-600 inline ml-1" />
              )}
            </span>
            <Badge variant="outline" className="text-xs">
              {tempCity.delegations.length} localité{tempCity.delegations.length !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingDelegation(!isAddingDelegation)}
              disabled={isLoading}
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRemove}
              disabled={isLoading}
              title="Supprimer cette ville"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2">
        {/* Interface d'ajout de délégation */}
        {isAddingDelegation && (
          <div className="mb-2 p-2 bg-green-50 border border-green-200 rounded">
            <div className="flex gap-1">
              <Input
                value={newDelegationName}
                onChange={e => setNewDelegationName(e.target.value)}
                placeholder="Nom de la localité"
                disabled={isLoading}
                onKeyDown={(e) => e.key === 'Enter' && handleAddDelegation()}
                className="text-sm"
              />
              <Button
                onClick={handleAddDelegation}
                disabled={isLoading || !newDelegationName.trim()}
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsAddingDelegation(false)}
                disabled={isLoading}
                size="sm"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Liste des délégations */}
        {tempCity.delegations.length > 0 ? (
          <ul className="space-y-1">
            {tempCity.delegations.map(delegation => (
              <li key={delegation.tempId} className="flex items-center justify-between p-1 bg-white rounded border text-xs">
                <span>{delegation.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveDelegation(delegation.tempId)}
                  disabled={isLoading}
                  title={
                    tempCity.delegations.length === 1
                      ? "Attention : supprimer cette localité supprimera aussi la ville"
                      : "Supprimer cette localité"
                  }
                  className={tempCity.delegations.length === 1 ? "border-red-300 text-red-600" : ""}
                >
                  <Trash className="h-2 w-2" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
            ⚠️ Cette ville doit avoir au moins une localité avant la sauvegarde.
          </div>
        )}
      </CardContent>
    </Card>
  )
}