"use client"

import { useRef, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import Image from "next/image"
import axiosInstance from "@/components/request/reques"

// Types for the API response
interface Pays {
  id: number;
  name: string;
}

interface Ville {
  id: number;
  name: string;
}

interface Delegation {
  id: number;
  name: string;
}

interface Camp {
  type: string;
  prix: number;
  trancheAge?: string;
  description?: string;
  id: number;
}

interface InscriptionData {
  id: number;
  nomComplet: string;
  sexe: string;
  telephone: string;
  dateNaissance: string;
  pays: Pays;
  ville: Ville;
  delegation: Delegation;
  code: string;
  badge: boolean;
  camp: Camp;
}

interface CampInfo {
  id: number
  lieu: string
  date: string // LocalDate will be received as string from the API
}

export default function BadgePage() {
  const badgeRef = useRef<HTMLDivElement>(null)
  const [image, setImage] = useState<string | null>(null)
  const [participantData, setParticipantData] = useState({
    name: "Jean-Baptiste MBALLA",
    country: "Cameroun",
    city: "Douala",
    locality: "Akwa Nord",
    campType: "Formation Jeunesse",
    code: "00001"
  })
  const [campInfo, setCampInfo] = useState<CampInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const searchParams = useSearchParams()
  const inscriptionId = searchParams?.get('id')

  useEffect(() => {
    if (inscriptionId) {
      const fetchParticipantData = async () => {
        try {
          setLoading(true)
          setError(null)
          
          const response = await axiosInstance.get<InscriptionData>(`/inscription/${inscriptionId}`)
          const data = response.data
          
          // Extraction des informations pertinentes pour le badge
          setParticipantData({
            name: data.nomComplet || "Nom non défini",
            country: data.pays?.name || "Pays non défini",
            city: data.ville?.name || "Ville non définie",
            locality: data.delegation?.name || "Localité non définie",
            campType: data.camp?.type || "Type de camp non défini",
            code: data.code || "Code non défini"
          })
          
        } catch (error) {
          console.error("Erreur lors du chargement des données du participant:", error)
          setError("Impossible de charger les données du participant")
          // Garder les données par défaut en cas d'erreur
        } finally {
          setLoading(false)
        }
      }
      
      fetchParticipantData()
    }

    // Charger les informations du camp
    const fetchCampInfo = async () => {
      try {
        const response = await axiosInstance.get<CampInfo>("/info")
        if (response.data) {
          setCampInfo(response.data)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des informations du camp:", error)
        // Si pas d'info, on garde les valeurs par défaut
      }
    }
    
    fetchCampInfo()
  }, [inscriptionId])

  // Fonction pour formater la date en français
  const formatCampDate = (dateString: string | null) => {
    if (!dateString) return "2025"
    
    try {
      const date = new Date(dateString)
      const options: Intl.DateTimeFormatOptions = {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
      return date.toLocaleDateString('fr-FR', options)
    } catch {
      return "2025"
    }
  }

  // Fonction pour obtenir juste l'année
  const getCampYear = (dateString: string | null) => {
    if (!dateString) return "2025"
    
    try {
      const date = new Date(dateString)
      return date.getFullYear().toString()
    } catch {
      return "2025"
    }
  }

  // Fonction pour obtenir le nom du camp
  const getCampTitle = () => {
    if (!campInfo) return 'Camp Douala 2025'
    
    const lieu = campInfo.lieu || 'Douala'
    const year = getCampYear(campInfo.date)
    return `Camp ${lieu}`
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadPDF = async () => {
    if (!badgeRef.current) return

    const canvas = await html2canvas(badgeRef.current)
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [canvas.width, canvas.height],
    })

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height)
    pdf.save("badge.pdf")
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données du participant...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 space-y-6">
      
      {/* Badge */}
      <div
        ref={badgeRef}
        className="relative w-[600px] h-[350px] bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Effets de décoration en arrière-plan */}
        <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] bg-white/5 rounded-full"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-[80px] h-[80px] bg-white/3 rounded-full"></div>
        
        {/* Header avec titre */}
        <div className="bg-blue-900/60 text-center py-[10px] px-5 border-b-2 border-white/20">
          <h1 className="text-base font-bold tracking-wider text-white uppercase" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {getCampTitle()}
          </h1>
          {campInfo?.date && (
            <div className="text-[10px] text-white/90 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}>
              {formatCampDate(campInfo.date)}
            </div>
          )}
        </div>

        {/* Logo CMCI en haut à droite */}
        <div className="absolute top-[90px] right-5 w-[60px] h-[60px] rounded-full bg-white flex items-center justify-center shadow-lg z-10">
          <Image
            src="/CMCI.png"
            alt="CMCI Logo"
            width={50}
            height={50}
            className="object-contain"
          />
        </div>

        {/* Section principale avec layout horizontal */}
        <div className="flex items-center h-[calc(100%-60px)] px-5 py-[15px]">
          
          {/* Section gauche - Photo/Silhouette */}
          <div className="flex flex-col items-center w-[130px] mr-[30px] justify-center">
            <div className="w-20 h-[100px] bg-white/90 rounded-[10px] flex items-center justify-center shadow-lg border-2 border-white relative overflow-hidden">
              {image ? (
                <img src={image} alt="Participant" className="object-cover w-full h-full rounded-[8px]" />
              ) : (
                // Silhouette créée avec des divs
                <>
                  {/* Corps de la silhouette */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[50px] h-20 bg-gray-800 rounded-t-[25px]"></div>
                  {/* Tête de la silhouette */}
                  <div className="absolute top-[15px] left-1/2 transform -translate-x-1/2 w-[25px] h-[25px] bg-gray-800 rounded-full"></div>
                </>
              )}
            </div>
          </div>

          {/* Section droite - Informations */}
          <div className="flex-1 flex flex-col justify-center">
            
            {/* Nom du participant */}
            <div className="mb-[15px] pb-2 border-b-2 border-white/30">
              <h2 className="text-xl font-bold text-white text-left" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                {participantData.name}
              </h2>
              <div className="text-[11px] font-mono text-white/90 mt-1">
                Code: {participantData.code}
              </div>
            </div>

            {/* Informations organisées en grille */}
            <div className="grid grid-cols-2 gap-[15px]">
              
              {/* Colonne gauche */}
              <div>
                <div className="mb-2 border-b border-white/20 pb-1">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 mb-[2px]">Pays</div>
                  <div className="text-[13px] font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {participantData.country}
                  </div>
                </div>
                
                <div className="mb-2 border-b border-white/20 pb-1">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 mb-[2px]">Ville</div>
                  <div className="text-[13px] font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {participantData.city}
                  </div>
                </div>
              </div>

              {/* Colonne droite */}
              <div>
                <div className="mb-2 border-b border-white/20 pb-1">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 mb-[2px]">Localité</div>
                  <div className="text-[13px] font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {participantData.locality}
                  </div>
                </div>
                
                <div className="mb-2 border-b border-white/20 pb-1">
                  <div className="text-[10px] uppercase tracking-wider text-white/80 mb-[2px]">Type de camp</div>
                  <div className="text-[13px] font-bold text-white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                    {participantData.campType}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 bg-blue-900/60 text-center py-2">
          <p className="text-[9px] text-white/80">
            Communauté Missionnaire Chrétienne Internationale
          </p>
        </div>
      </div>

      {/* Boutons de contrôle */}
      <div className="flex flex-col items-center space-y-4">
        <label className="relative cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="font-medium">Charger une photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </label>

        <button
          onClick={downloadPDF}
          className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 text-white px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 font-medium"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Télécharger Badge - {participantData.name}</span>
        </button>
      </div>
    </div>
  )
}