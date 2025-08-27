"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Save,
  X,
  CheckCircle,
  LogOut,
} from "lucide-react"

interface UserProfile {
  firstName: string
  lastName: string
  email: string
  subscription: string
  createdAt: string
}

interface AcademicProfile {
  bacAverage: string
  bacType: string
  tcfScore: string
  specialty: string
  studyYear: string
  hasAcceptance: boolean
}

interface Specialty {
  id_speciality: number
  speciality_name: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [academicProfile, setAcademicProfile] = useState<AcademicProfile | null>(null)
  const [originalAcademicProfile, setOriginalAcademicProfile] = useState<AcademicProfile | null>(null)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isEditingAcademic, setIsEditingAcademic] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingData, setIsLoadingData] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access_token")

      if (!token) {
        router.push("/auth/login")
        return
      }

      try {
        // Récupérer le profil utilisateur
        const userRes = await fetch("http://127.0.0.1:5000/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (!userRes.ok) throw new Error("Unauthorized")

        const userData = await userRes.json()
        console.log("User data from API:", userData) // Debug log
        
        const userProfile = {
          firstName: userData.first_name,
          lastName: userData.last_name,
          email: userData.email,
          subscription: userData.subscription ? "premium" : "gratuit",
          createdAt: userData.createdAt || userData.created_at,
        }
        
        setUser(userProfile)
        
        // Mettre à jour localStorage avec les nouvelles données utilisateur
        localStorage.setItem("user", JSON.stringify(userData))
        
        // Déclencher l'événement pour mettre à jour la navbar
        window.dispatchEvent(new Event('authStatusChanged'))

        // Récupérer le profil académique
        try {
          const academicRes = await fetch("http://127.0.0.1:5000/users/profile/academic", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          })

          console.log("Academic Profile Response Status:", academicRes.status)

          if (academicRes.ok) {
            const contentType = academicRes.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const academicData = await academicRes.json()
              console.log("Academic data received:", academicData)
              
              const mappedProfile = {
                bacAverage: academicData.bac_average?.toString() || "",
                bacType: academicData.bac_type || "",
                tcfScore: academicData.tcf_score?.toString() || "",
                specialty: academicData.speciality || academicData.specialty || "",
                studyYear: academicData.annee_etude_actuelle || academicData.study_year || "",
                hasAcceptance: Boolean(academicData.accepted || academicData.has_acceptance),
              }
              
              console.log("Mapped profile:", mappedProfile)
              setAcademicProfile(mappedProfile)
            } else {
              console.error("Response is not JSON:", await academicRes.text())
              throw new Error("Response is not JSON")
            }
          } else if (academicRes.status === 404) {
            setAcademicProfile({
              bacAverage: "",
              bacType: "",
              tcfScore: "",
              specialty: "",
              studyYear: "",
              hasAcceptance: false,
            })
          } else {
            const errorText = await academicRes.text()
            console.error("Academic profile error:", academicRes.status, errorText)
            throw new Error(`HTTP ${academicRes.status}: ${errorText}`)
          }
        } catch (academicError) {
          console.error("Error fetching academic profile:", academicError)
          setAcademicProfile({
            bacAverage: "",
            bacType: "",
            tcfScore: "",
            specialty: "",
            studyYear: "",
            hasAcceptance: false,
          })
        }
      } catch (err) {
        console.error("Erreur profil:", err)
        setError("Erreur lors du chargement du profil")
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [router])

  // Fonction de déconnexion
  const handleLogout = () => {
    console.log("Logging out user")
    
    // Supprimer tous les tokens et données utilisateur
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("userProfile")
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('authStatusChanged'))
    
    router.push("/")
  }

  // Fonction pour charger les spécialités
  const fetchSpecialtiesAndUniversities = async () => {
    setIsLoadingData(true)
    setError("")
    try {
      console.log("Fetching specialities from API...")
      
      const specialitiesResponse = await fetch("http://127.0.0.1:5000/specialities/")
      
      console.log("Specialities response status:", specialitiesResponse.status)
      
      if (!specialitiesResponse.ok) {
        throw new Error(`HTTP ${specialitiesResponse.status}: Erreur lors du chargement des spécialités`)
      }
      
      const specialitiesData = await specialitiesResponse.json()
      console.log("Specialities data received:", specialitiesData)
      
      if (Array.isArray(specialitiesData)) {
        setSpecialties(specialitiesData)
        console.log("Specialities set successfully:", specialitiesData.length, "items")
      } else {
        console.error("Specialities data is not an array:", specialitiesData)
        throw new Error("Format de données incorrect pour les spécialités")
      }
      
    } catch (err) {
      console.error("Erreur lors du chargement des spécialités:", err)
      setError("Erreur lors du chargement des spécialités: " + err.message)
      setSpecialties([])
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleStartEditing = async () => {
    setIsEditingAcademic(true)
    if (academicProfile) {
      setOriginalAcademicProfile({ ...academicProfile })
    }
    await fetchSpecialtiesAndUniversities()
  }

  const handleSaveAcademicChanges = async () => {
    if (!academicProfile) return
    setIsSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("access_token")
      
      const payload = {
        bac_average: academicProfile.bacAverage ? parseFloat(academicProfile.bacAverage) : null,
        bac_type: academicProfile.bacType || null,
        tcf_score: academicProfile.tcfScore ? parseInt(academicProfile.tcfScore) : null,
        speciality: academicProfile.specialty || null,
        annee_etude_actuelle: academicProfile.studyYear || null,
        accepted: academicProfile.hasAcceptance,
      }
      
      console.log("Sending academic profile data:", payload)

      const res = await fetch("http://127.0.0.1:5000/users/profile/academic", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      console.log("Response status:", res.status)

      if (!res.ok) {
        const contentType = res.headers.get('content-type')
        if (contentType && contentType.includes('application/json')) {
          const errorData = await res.json()
          throw new Error(errorData.message || `HTTP ${res.status}`)
        } else {
          const errorText = await res.text()
          console.error("Non-JSON error response:", errorText)
          throw new Error(`HTTP ${res.status}: Server returned HTML instead of JSON`)
        }
      }

      // Succès - garder les données actuelles au lieu de recharger
      console.log("Profile saved successfully")
      setIsEditingAcademic(false)
      setOriginalAcademicProfile({ ...academicProfile })
      
    } catch (err) {
      console.error("Erreur sauvegarde académique:", err)
      setError("Erreur lors de la sauvegarde du profil académique: " + err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const cancelAcademicEditing = () => {
    if (originalAcademicProfile) {
      setAcademicProfile({ ...originalAcademicProfile })
    }
    setIsEditingAcademic(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Chargement de votre profil...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-800 mb-4">Accès non autorisé</h1>
          <p className="text-slate-600 mb-6">Veuillez vous connecter pour accéder à votre profil</p>
          <Button onClick={() => router.push("/auth/login")}>Se connecter</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navbar */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo variant="compact" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explorer" className="text-slate-700 hover:text-blue-600 transition-colors">
              Explorer
            </Link>
            <Link href="/simulateur" className="text-slate-700 hover:text-blue-600 transition-colors">
              Simulateur
            </Link>
            <Link href="/partager" className="text-slate-700 hover:text-blue-600 transition-colors">
              Partager
            </Link>
            <Link href="/messagerie" className="text-slate-700 hover:text-blue-600 transition-colors">
              Messagerie
            </Link>
            <Button variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
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

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
          {/* Informations personnelles */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center text-slate-800">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  Informations Personnelles
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Prénom</Label>
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                    {user.firstName}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Nom</Label>
                  <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                    {user.lastName}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-slate-500" />
                  <span className="text-slate-700">{user.email}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Abonnement</Label>
                  <div>
                    {user.subscription === "premium" ? (
                      <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-3 py-1">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700 px-3 py-1">
                        Gratuit
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Membre depuis</Label>
                  <div className="text-slate-600 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Bouton de déconnexion */}
              <div className="pt-4 border-t border-slate-100">
                <Button 
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Se déconnecter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profil académique */}
          <Card className="shadow-lg border-0 bg-white/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-slate-800">
                    <div className="p-2 bg-green-100 rounded-lg mr-3">
                      <GraduationCap className="h-5 w-5 text-green-600" />
                    </div>
                    Profil Académique
                  </CardTitle>
                  <CardDescription className="mt-1 text-slate-500">
                    Vos informations d'études et qualifications
                  </CardDescription>
                </div>
                {!isEditingAcademic && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartEditing}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    disabled={isLoadingData}
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    {isLoadingData ? "Chargement..." : "Modifier"}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {academicProfile ? (
                <>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Moyenne du Bac</Label>
                      {isEditingAcademic ? (
                        <Input
                          type="number"
                          step="0.1"
                          min="0"
                          max="20"
                          value={academicProfile.bacAverage}
                          onChange={(e) =>
                            setAcademicProfile({ ...academicProfile, bacAverage: e.target.value })
                          }
                          className="border-slate-200 focus:border-green-400"
                          placeholder="Ex: 15.2"
                        />
                      ) : (
                        <div className="p-3 bg-green-50/80 rounded-lg border border-green-100 flex items-center">
                          <Target className="w-4 h-4 mr-2 text-green-500" />
                          <span className="font-medium text-green-700">
                            {academicProfile.bacAverage || "Non renseigné"}/20
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Type de Bac</Label>
                      {isEditingAcademic ? (
                        <Select
                          value={academicProfile.bacType}
                          onValueChange={(value) =>
                            setAcademicProfile({ ...academicProfile, bacType: value })
                          }
                        >
                          <SelectTrigger className="border-slate-200 focus:border-green-400">
                            <SelectValue placeholder="Choisir le type de bac" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sciences_experimentales">Sciences Expérimentales</SelectItem>
                            <SelectItem value="mathematiques">Mathématiques</SelectItem>
                            <SelectItem value="technique_mathematique">Technique Mathématique</SelectItem>
                            <SelectItem value="gestion_et_economie">Gestion et Économie</SelectItem>
                            <SelectItem value="lettres_et_philosophie">Lettres et Philosophie</SelectItem>
                            <SelectItem value="langues_etrangeres">Langues Étrangères</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                            <SelectItem value="unknown">Non spécifié</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                          {academicProfile.bacType || "Non renseigné"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Score TCF</Label>
                      {isEditingAcademic ? (
                        <Input
                          type="number"
                          min="100"
                          max="699"
                          value={academicProfile.tcfScore}
                          onChange={(e) =>
                            setAcademicProfile({ ...academicProfile, tcfScore: e.target.value })
                          }
                          className="border-slate-200 focus:border-green-400"
                          placeholder="Ex: 420"
                        />
                      ) : (
                        <div className="p-3 bg-blue-50/80 rounded-lg border border-blue-100 flex items-center">
                          <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                          <span className="font-medium text-blue-700">
                            {academicProfile.tcfScore || "Non renseigné"}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Spécialité</Label>
                      {isEditingAcademic ? (
                        <Select
                          value={academicProfile.specialty}
                          onValueChange={(value) =>
                            setAcademicProfile({ ...academicProfile, specialty: value })
                          }
                          disabled={isLoadingData}
                        >
                          <SelectTrigger className="border-slate-200 focus:border-green-400">
                            <SelectValue placeholder={isLoadingData ? "Chargement..." : "Choisir une spécialité"} />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingData ? (
                              <SelectItem key="loading" value="loading" disabled>
                                Chargement des spécialités...
                              </SelectItem>
                            ) : specialties && specialties.length > 0 ? (
                              specialties.map((specialty) => (
                                <SelectItem 
                                  key={specialty.id_speciality} 
                                  value={specialty.speciality_name}
                                >
                                  {specialty.speciality_name}
                                </SelectItem>
                              ))
                            ) : (
                              <SelectItem key="empty" value="" disabled>
                                Aucune spécialité disponible
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                          {academicProfile.specialty || "Non renseigné"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Niveau d'études</Label>
                      {isEditingAcademic ? (
                        <Select
                          value={academicProfile.studyYear}
                          onValueChange={(value) =>
                            setAcademicProfile({ ...academicProfile, studyYear: value })
                          }
                        >
                          <SelectTrigger className="border-slate-200 focus:border-green-400">
                            <SelectValue placeholder="Choisir le niveau" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="terminale">Terminale</SelectItem>
                            <SelectItem value="l1">L1</SelectItem>
                            <SelectItem value="l2">L2</SelectItem>
                            <SelectItem value="l3">L3</SelectItem>
                            <SelectItem value="m1">M1</SelectItem>
                            <SelectItem value="m2">M2</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                          {academicProfile.studyYear ? academicProfile.studyYear.toUpperCase() : "Non renseigné"}
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-slate-700">Acceptation universitaire</Label>
                      {isEditingAcademic ? (
                        <Select
                          value={academicProfile.hasAcceptance ? "true" : "false"}
                          onValueChange={(value) =>
                            setAcademicProfile({ ...academicProfile, hasAcceptance: value === "true" })
                          }
                        >
                          <SelectTrigger className="border-slate-200 focus:border-green-400">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Oui</SelectItem>
                            <SelectItem value="false">Non</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-3 bg-slate-50/80 rounded-lg border border-slate-100 flex items-center">
                          {academicProfile.hasAcceptance ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                              <span className="text-green-700 font-medium">Oui</span>
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-2 text-slate-400" />
                              <span className="text-slate-600">Non</span>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {isEditingAcademic && (
                    <div className="flex space-x-3 pt-4 border-t border-slate-100">
                      <Button 
                        onClick={handleSaveAcademicChanges} 
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? "Sauvegarde..." : "Sauvegarder"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={cancelAcademicEditing}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Annuler
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <GraduationCap className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 mb-4">Aucun profil académique enregistré</p>
                  <Button 
                    onClick={handleStartEditing} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoadingData}
                  >
                    {isLoadingData ? "Chargement..." : "Créer mon profil académique"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}