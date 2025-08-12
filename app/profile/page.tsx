"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"
import {
  User,
  Mail,
  GraduationCap,
  Trophy,
  Settings,
  Crown,
  Calendar,
  BookOpen,
  Target,
  BarChart3,
  Sparkles,
  Edit3,
} from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  subscription: string
  createdAt: string
  bacAverage?: string
  bacType?: string
  tcfScore?: string
  specialty?: string
  studyYear?: string
  hasAcceptance?: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    // Récupérer les données utilisateur depuis localStorage
    const userData = localStorage.getItem("user")
    const profileData = localStorage.getItem("userProfile")

    if (userData) {
      setUser(JSON.parse(userData))
    }
    if (profileData) {
      setProfile(JSON.parse(profileData))
    }
  }, [])

  const mockStats = {
    simulationsUsed: 15,
    experiencesShared: 3,
    messagesExchanged: 47,
    profileViews: 23,
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Logo variant="compact" />
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">Veuillez vous connecter</h1>
            <p className="text-slate-600 mb-8">Vous devez être connecté pour accéder à votre profil.</p>
            <Link href="/auth/login">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700">Se connecter</Button>
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
            <Link href="/simulateur" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Simulateur
            </Link>
            <Link href="/partager" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Partager
            </Link>
            <Link href="/messagerie" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Messagerie
            </Link>
            <Button variant="outline" className="border-blue-600 text-blue-600 bg-blue-50">
              Mon Profil
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Votre espace personnel
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
            Mon Profil
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Gérez vos informations personnelles et suivez votre progression sur PathwayFR
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Profil Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations personnelles */}
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-blue-700 flex items-center">
                    <User className="mr-2 h-5 w-5" />
                    Informations Personnelles
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="border-blue-200 text-blue-700"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    {isEditing ? "Annuler" : "Modifier"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={user.firstName}
                        onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                        className="border-blue-200"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-md text-slate-700">{user.firstName}</div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={user.lastName}
                        onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                        className="border-blue-200"
                      />
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-md text-slate-700">{user.lastName}</div>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="p-3 bg-slate-50 rounded-md text-slate-700 flex items-center">
                    <Mail className="w-4 h-4 mr-2 text-slate-500" />
                    {user.email}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Abonnement</Label>
                    <div className="flex items-center">
                      {user.subscription === "premium" ? (
                        <Badge className="bg-gradient-to-r from-blue-600 to-blue-700">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary">Gratuit</Badge>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <Label>Membre depuis</Label>
                    <div className="flex items-center text-slate-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-4">
                    <Button
                      onClick={() => {
                        // Sauvegarder les modifications
                        localStorage.setItem("user", JSON.stringify(user))
                        setIsEditing(false)
                      }}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 mr-2"
                    >
                      Sauvegarder
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profil Académique */}
            {profile && (
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <GraduationCap className="mr-2 h-5 w-5" />
                    Profil Académique
                  </CardTitle>
                  <CardDescription>Vos informations d'études utilisées pour les recommandations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Moyenne Bac</span>
                        <span className="font-semibold text-blue-700">{profile.bacAverage}/20</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Type de Bac</span>
                        <span className="font-semibold text-slate-700">{profile.bacType}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Score TCF</span>
                        <span className="font-semibold text-indigo-700">{profile.tcfScore}/100</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Spécialité</span>
                        <span className="font-semibold text-slate-700">{profile.specialty}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Niveau Actuel</span>
                        <span className="font-semibold text-slate-700">{profile.studyYear}</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                        <span className="text-slate-600">Acceptation</span>
                        <Badge variant={profile.hasAcceptance ? "default" : "secondary"}>
                          {profile.hasAcceptance ? "Oui" : "Première fois"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link href="/profile/setup">
                      <Button variant="outline" className="border-blue-200 text-blue-700 bg-transparent">
                        <Settings className="w-4 h-4 mr-2" />
                        Modifier le profil académique
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Statistiques & Actions */}
          <div className="space-y-6">
            {/* Statistiques */}
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Mes Statistiques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 mr-2 text-blue-600" />
                    <span className="text-sm text-slate-600">Simulations utilisées</span>
                  </div>
                  <span className="font-semibold text-blue-700">{mockStats.simulationsUsed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-green-600" />
                    <span className="text-sm text-slate-600">Expériences partagées</span>
                  </div>
                  <span className="font-semibold text-green-700">{mockStats.experiencesShared}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-indigo-600" />
                    <span className="text-sm text-slate-600">Messages échangés</span>
                  </div>
                  <span className="font-semibold text-indigo-700">{mockStats.messagesExchanged}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Trophy className="w-4 h-4 mr-2 text-orange-600" />
                    <span className="text-sm text-slate-600">Vues profil</span>
                  </div>
                  <span className="font-semibold text-orange-700">{mockStats.profileViews}</span>
                </div>
              </CardContent>
            </Card>

            {/* Actions rapides */}
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
              <CardHeader>
                <CardTitle className="text-blue-700">Actions Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/simulateur">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 justify-start">
                    <Target className="w-4 h-4 mr-2" />
                    Nouvelle Simulation
                  </Button>
                </Link>
                <Link href="/partager">
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 justify-start bg-transparent"
                  >
                    <BookOpen className="w-4 h-4 mr-2" />
                    Partager une Expérience
                  </Button>
                </Link>
                <Link href="/explorer">
                  <Button
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 justify-start bg-transparent"
                  >
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Explorer les Données
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Upgrade Premium */}
            {user.subscription !== "premium" && (
              <Card className="border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-orange-700 flex items-center">
                    <Crown className="mr-2 h-5 w-5" />
                    Passez à Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Alert className="border-orange-200 bg-orange-50 mb-4">
                    <Crown className="h-4 w-4" />
                    <AlertDescription className="text-orange-800">
                      Débloquez toutes les fonctionnalités : messagerie, analyses avancées, et recommandations IA
                      personnalisées !
                    </AlertDescription>
                  </Alert>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade - 29€/mois
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
