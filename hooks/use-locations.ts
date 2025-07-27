import { useState, useEffect } from 'react';
import axiosInstance from '@/components/request/reques';
import { 
  Country, 
  City, 
  Delegation, 
  LocationError,
  parseLocationError, 
  validateLocationName, 
  mapBackendToFrontend 
} from '@/lib/location-utils';

export function useLocations() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  const clearError = () => setError(null);

  // Récupérer toutes les localisations
  const fetchLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get('/localisations/pays');
      const mappedCountries = mapBackendToFrontend(response.data);
      setCountries(mappedCountries);
    } catch (err: any) {
      console.error('Erreur lors du chargement des localisations:', err);
      const locationError = parseLocationError(err);
      setError(locationError);
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter un pays
  const addCountry = async (name: string): Promise<boolean> => {
    const validation = validateLocationName(name, 'country');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'country' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post('/localisations/pays', { name: name.trim() });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout du pays:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'country' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une ville
  const addCity = async (name: string, countryId: number): Promise<boolean> => {
    const validation = validateLocationName(name, 'city');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'city' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`/localisations/ville/${countryId}`, { name: name.trim() });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de la ville:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'city' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Ajouter une délégation
  const addDelegation = async (name: string, cityId: number): Promise<boolean> => {
    const validation = validateLocationName(name, 'delegation');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'delegation' });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.post(`/localisations/delegation/${cityId}`, { name: name.trim() });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de l\'ajout de la délégation:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'delegation' });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier un pays
  const updateCountry = async (id: number, newName: string): Promise<boolean> => {
    const validation = validateLocationName(newName, 'country');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'country', id });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.put(`/localisations/pays/${id}`, newName.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la modification du pays:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'country', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier une ville
  const updateCity = async (id: number, newName: string): Promise<boolean> => {
    const validation = validateLocationName(newName, 'city');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'city', id });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.put(`/localisations/ville/${id}`, newName.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la modification de la ville:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'city', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Modifier une délégation
  const updateDelegation = async (id: number, newName: string): Promise<boolean> => {
    const validation = validateLocationName(newName, 'delegation');
    if (!validation.isValid) {
      setError({ message: validation.message!, type: 'delegation', id });
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.put(`/localisations/delegation/${id}`, newName.trim(), {
        headers: { 'Content-Type': 'text/plain' }
      });
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la modification de la délégation:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'delegation', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer un pays
  const deleteCountry = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/localisations/pays/${id}`);
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression du pays:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'country', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une ville
  const deleteCity = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/localisations/ville/${id}`);
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la ville:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'city', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Supprimer une délégation
  const deleteDelegation = async (id: number): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await axiosInstance.delete(`/localisations/delegation/${id}`);
      await fetchLocations();
      return true;
    } catch (err: any) {
      console.error('Erreur lors de la suppression de la délégation:', err);
      const locationError = parseLocationError(err);
      setError({ ...locationError, type: 'delegation', id });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    fetchLocations();
  }, []);

  return {
    countries,
    isLoading,
    error,
    clearError,
    fetchLocations,
    addCountry,
    addCity,
    addDelegation,
    updateCountry,
    updateCity,
    updateDelegation,
    deleteCountry,
    deleteCity,
    deleteDelegation
  };
}
