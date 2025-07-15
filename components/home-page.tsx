"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Heart, Crown } from "lucide-react"

export default function HomePage() {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/login")
  }

  const handleRegister = () => {
    router.push("/register")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-myibc-blue">Bienvenue sur MyIBC</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Plateforme de gestion des camps bibliques internationaux de la CMCI
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={handleLogin}
              size="lg"
              className="bg-myibc-gold hover:bg-myibc-gold/90 text-white font-semibold px-8 py-3 text-lg w-full sm:w-auto"
            >
              Se connecter
            </Button>
            <Button
              onClick={handleRegister}
              variant="outline"
              size="lg"
              className="border-myibc-blue text-myibc-blue hover:bg-myibc-blue hover:text-white font-semibold px-8 py-3 text-lg w-full sm:w-auto bg-transparent"
            >
              S'enregistrer
            </Button>
          </div>

          {/* Camps Information */}
          <Card className="mt-12">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl text-myibc-blue">Nos Camps Bibliques</CardTitle>
              <CardDescription className="text-lg">
                Découvrez nos différents programmes adaptés à chaque tranche d'âge
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-myibc-gold/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-myibc-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-myibc-blue">Camp des Agneaux</h3>
                  <p className="text-gray-600">Programme spécialement conçu pour les plus jeunes participants</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-myibc-gold/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-myibc-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-myibc-blue">Camp des Jeunes</h3>
                  <p className="text-gray-600">Activités et enseignements adaptés aux adolescents et jeunes adultes</p>
                </div>

                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 bg-myibc-gold/10 rounded-full flex items-center justify-center">
                    <Crown className="w-6 h-6 text-myibc-gold" />
                  </div>
                  <h3 className="text-xl font-semibold text-myibc-blue">Camp des Leaders</h3>
                  <p className="text-gray-600">Formation et perfectionnement pour les responsables et encadrants</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">© 2025 CMCI - Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}
