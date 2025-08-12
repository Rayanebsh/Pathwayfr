"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"
import { Target, Lock, Star, TrendingUp, Users, GraduationCap, MapPin, Sparkles } from "lucide-react"
import Link from "next/link"

// Mock data pour les universités recommandées
const mockRecommendations = [
  {
    id: 1,
    name: "Université Paris-Dauphine",
    specialty: "Économie & Gestion",
    compatibilityScore: 95,
    successRate: 78,
    location: "Paris",
    reasons: ["Profil économique compatible", "Moyenne similaire acceptée", "Spécialité correspondante"],
    logo: "🏛️",
    ranking: 1,
  },
  {
    id: 2,
    name: "Sciences Po Paris",
    specialty: "Sciences Politiques",
    compatibilityScore: 88,
    successRate: 65,
    location: "Paris",
    reasons: ["Excellent dossier académique", "TCF score adapté", "Profil international"],
    logo: "🎓",
    ranking: 2,
  },
  {
    id: 3,
    name: "Sorbonne Université",
    specialty: "Lettres & Sciences Humaines",
    compatibilityScore: 85,
    successRate: 72,
    location: "Paris",
    reasons: ["Spécialité littéraire", "Moyenne bac compatible", "Historique d'acceptation"],
    logo: "📚",
    ranking: 3,
  },
  {
    id: 4,
    name: "Université Lyon 2",
    specialty: "Psychologie",
    compatibilityScore: 82,
    successRate: 69,
    location: "Lyon",
    reasons: ["Profil sciences humaines", "Capacité d'accueil élevée", "Critères d'admission adaptés"],
    logo: "🧠",
    ranking: 4,
  },
  {
    id: 5,
    name: "Université de Bordeaux",
    specialty: "Droit",
    compatibilityScore: 79,
    successRate: 71,
    location: "Bordeaux",
    reasons: ["Formation juridique reconnue", "Taux d'acceptation favorable", "Profil adapté"],
    logo: "⚖️",
    ranking: 5,
  },
  {
    id: 6,
    name: "Université Grenoble Alpes",
    specialty: "Sciences & Technologies",
    compatibilityScore: 76,
    successRate: 74,
    location: "Grenoble",
    reasons: ["Formation scientifique", "Innovation pédagogique", "Environnement recherche"],
    logo: "🔬",
    ranking: 6,
  },
  {
    id: 7,
    name: "Université de Strasbourg",
    specialty: "Relations Internationales",
    compatibilityScore: 73,
    successRate: 67,
    location: "Strasbourg",
    reasons: ["Dimension européenne", "Programmes internationaux", "Profil linguistique"],
    logo: "🌍",
    ranking: 7,
  },
]

export default function SimulateurPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [hasProfile, setHasProfile] = useState(false)

  // Simulation de vérification de connexion
  useEffect(() => {
    // Ici on vérifierait si l'utilisateur est connecté et a un profil complet
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      const profile = localStorage.getItem("userProfile")
      setIsLoggedIn(!!user)
      setHasProfile(!!profile)
    }
    checkAuth()
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Logo variant="compact" />
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="h-12 w-12 text-slate-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                Accès Restreint
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Le simulateur intelligent est réservé aux utilisateurs connectés. Créez votre compte pour découvrir les
                universités qui vous correspondent le mieux.
              </p>
            </div>

            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <Target className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Pourquoi créer un compte ?</strong>
                <br />
                Notre IA analyse votre profil académique pour vous recommander les 7 meilleures universités adaptées à
                vos critères et maximiser vos chances d'acceptation.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Link href="/auth/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 shadow-lg"
                >
                  Créer un compte
                </Button>
              </Link>
              <div className="text-slate-600">
                Déjà inscrit ?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline font-semibold">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Logo variant="compact" />
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <GraduationCap className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                Complétez votre profil
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Pour utiliser le simulateur, nous avons besoin de quelques informations sur votre parcours académique.
              </p>
            </div>

            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <Target className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                Ces informations nous permettent de calculer votre compatibilité avec les universités et de vous
                proposer les meilleures recommandations personnalisées.
              </AlertDescription>
            </Alert>

            <Link href="/profile/setup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 shadow-lg"
              >
                Configurer mon profil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo variant="compact" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explorer" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Explorer
            </Link>
            <Link href="/simulateur" className="text-blue-600 font-semibold">
              Simulateur
            </Link>
            <Link href="/partager" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Partager
            </Link>
            <Link href="/messagerie" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Messagerie
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                Mon Profil
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Recommandations IA personnalisées
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
            Vos Recommandations Personnalisées
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Basé sur votre profil académique, voici les 7 universités qui maximisent vos chances d'acceptation
          </p>
        </div>

        {/* Profil résumé */}
        <Card className="mb-8 border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="text-blue-700">Votre Profil</CardTitle>
            <CardDescription>Informations utilisées pour la simulation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">16.5</div>
                <div className="text-sm text-slate-600">Moyenne Bac</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">Économique</div>
                <div className="text-sm text-slate-600">Bac Type</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">85</div>
                <div className="text-sm text-slate-600">Score TCF</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-700">L3</div>
                <div className="text-sm text-slate-600">Niveau Actuel</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommandations */}
        <div className="space-y-6">
          {mockRecommendations.map((univ, index) => (
            <Card
              key={univ.id}
              className={`border-2 transition-all hover:shadow-xl bg-white/80 backdrop-blur-sm ${
                index === 0
                  ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50"
                  : index < 3
                    ? "border-blue-200 bg-blue-50/30"
                    : "border-slate-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{univ.logo}</div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-bold text-slate-800">{univ.name}</h3>
                        {index === 0 && (
                          <Badge className="bg-yellow-500 text-white">
                            <Star className="w-3 h-3 mr-1" />
                            Meilleur Match
                          </Badge>
                        )}
                        {index < 3 && index > 0 && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            Top 3
                          </Badge>
                        )}
                      </div>
                      <p className="text-slate-600 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {univ.location} • {univ.specialty}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-700">#{univ.ranking}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Score de Compatibilité</span>
                      <span className="font-semibold text-blue-700">{univ.compatibilityScore}%</span>
                    </div>
                    <Progress value={univ.compatibilityScore} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-slate-600">Taux de Réussite</span>
                      <span className="font-semibold text-green-600">{univ.successRate}%</span>
                    </div>
                    <Progress value={univ.successRate} className="h-2" />
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Pourquoi cette université ?</h4>
                  <div className="flex flex-wrap gap-2">
                    {univ.reasons.map((reason, idx) => (
                      <Badge key={idx} variant="outline" className="border-blue-200 text-blue-700">
                        {reason}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-slate-600">
                    <div className="flex items-center">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      Tendance positive
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      Profils similaires acceptés
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
                  >
                    Voir les détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <Card className="mt-8 border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Prêt à postuler ?</h3>
            <p className="text-slate-600 mb-6">
              Partagez votre expérience avec la communauté et aidez d'autres étudiants dans leur choix
            </p>
            <div className="space-x-4">
              <Link href="/partager">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                  Partager mon expérience
                </Button>
              </Link>
              <Button variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                Sauvegarder les résultats
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
