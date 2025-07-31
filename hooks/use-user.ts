import { useState, useEffect } from 'react'
import axiosInstance from '@/components/request/reques'

interface User {
  id: number
  username: string
  email: string
  pays: string
  telephone: string
  code: string
  role: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const code = localStorage.getItem('code')
        if (!code) {
          setError('Code utilisateur non trouvé')
          setLoading(false)
          return
        }

        const response = await axiosInstance.get(`/statistique/utilisateur/code/${code}`)
        setUser(response.data)
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Utilisateur non trouvé')
        } else if (err.response?.status === 401) {
          setError('Non autorisé - veuillez vous reconnecter')
        } else {
          setError(err.response?.data?.message || 'Erreur lors de la récupération des données utilisateur')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  return { user, loading, error }
}
