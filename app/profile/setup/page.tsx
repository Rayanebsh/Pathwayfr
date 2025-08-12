"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { GraduationCap, BookOpen, Trophy, Target } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { specialties, bacTypes } from "@/lib/mockData"
import { useMemo } from "react"

export default function ProfileSetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    bacAverage: "",
    bacType: "",
    tcfScore: "",
    specialty: "",
    studyYear: "",
    hasAcceptance: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Récupérer le token (adapter selon ton système d'auth)
    const token = localStorage.getItem("access_token")
    if (!token) return
    fetch("/api/profile/setup", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        if (data.message === "Profil déjà complété") {
          router.push("/home")
        } else {
          router.push("/profile/setup")
        }
      })
      .catch(() => {})
  }, [router])

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    const currentStepErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.bacAverage) currentStepErrors.bacAverage = "La moyenne du bac est requise"
      if (!formData.bacType) currentStepErrors.bacType = "Le type de bac est requis"
      if (!formData.tcfScore) currentStepErrors.tcfScore = "Le score TCF est requis"
    } else if (step === 2) {
      if (!formData.specialty) currentStepErrors.specialty = "La spécialité est requise"
      if (!formData.studyYear) currentStepErrors.studyYear = "L'année d'étude est requise"
    } else if (step === 3) {
      if (!formData.hasAcceptance) currentStepErrors.hasAcceptance = "Cette information est requise"
    }

    if (Object.keys(currentStepErrors).length > 0) {
      setErrors(currentStepErrors)
      return
    }

    setErrors({})
    if (step === totalSteps) {
      handleSubmit()
    } else {
      setStep(step + 1)
    }
  }

  const handleSubmit = async () => {
    console.log("Submit triggered");
    setIsLoading(true);
    setErrors({});
    
    // Validation finale avant envoi
    if (!formData.bacAverage || !formData.bacType || !formData.tcfScore || 
        !formData.specialty || !formData.studyYear || !formData.hasAcceptance) {
      setErrors({ global: "Tous les champs sont requis" });
      setIsLoading(false);
      return;
    }

    console.log("SUBMIT: formData", formData);
  
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setErrors({ global: "Token manquant, connecte-toi !" });
        setIsLoading(false);
        return;
      }

      // Correction de l'URL - suppression de /users/
      const res = await fetch("http://127.0.0.1:5000/users/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bac_average: parseFloat(formData.bacAverage), // Conversion en nombre
          bac_type: formData.bacType.toLowerCase().replace(/\s+/g, '_'), // Format correct pour le backend
          tcf_score: parseInt(formData.tcfScore), // Conversion en entier
          speciality: formData.specialty,
          annee_etude_actuelle: formData.studyYear,
          accepted: formData.hasAcceptance === "oui" ? true : false, // Conversion en boolean
        }),
      });
  
      const data = await res.json();
      console.log("BACKEND RESPONSE:", data);
      console.log("Response status:", res.status);
  
      if (!res.ok) {
        console.error("Backend error:", data);
        setErrors({ global: data.error || `Erreur ${res.status}: ${JSON.stringify(data)}` });
        setIsLoading(false);
        return;
      }
  
      console.log("Profile setup successful!");
      setIsLoading(false);
      router.push("/explorer");
    } catch (err) {
      console.error("Network error:", err);
      setErrors({ global: "Erreur réseau. Vérifiez votre connexion." });
      setIsLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="flex items-center justify-center space-x-2">
            <Logo variant="compact" />
          </Link>
        </div>

        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-800">Configuration du Profil</CardTitle>
            <CardDescription>
              Étape {step} sur {totalSteps} - Ces informations nous aident à personnaliser vos recommandations
            </CardDescription>
            <Progress value={progress} className="mt-4" />
          </CardHeader>
          <CardContent>
            {/* Affichage des erreurs globales */}
            {errors.global && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {errors.global}
                </AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <GraduationCap className="h-16 w-16 text-blue-800 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Informations Académiques</h3>
                  <p className="text-gray-600">Parlez-nous de votre parcours scolaire</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bacAverage" className="text-gray-700">
                      Moyenne du Bac
                    </Label>
                    <Input
                      id="bacAverage"
                      type="number"
                      step="0.1"
                      min="0"
                      max="20"
                      placeholder="16.5"
                      value={formData.bacAverage}
                      onChange={(e) => handleChange("bacAverage", e.target.value)}
                      className={`border-blue-200 focus:border-blue-800 ${errors.bacAverage ? "border-red-500" : ""}`}
                    />
                    {errors.bacAverage && <p className="text-sm text-red-600">{errors.bacAverage}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bacType" className="text-gray-700">
                      Type de Bac
                    </Label>
                    <Select value={formData.bacType} onValueChange={(value) => handleChange("bacType", value)}>
                      <SelectTrigger className={`border-blue-200 ${errors.bacType ? "border-red-500" : ""}`}> 
                        <SelectValue placeholder="Sélectionnez votre type de bac" />
                      </SelectTrigger>
                      <SelectContent>
                        {bacTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.bacType && <p className="text-sm text-red-600">{errors.bacType}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tcfScore" className="text-gray-700">
                      Score TCF (Test de Connaissance du Français)
                    </Label>
                    <Input
                      id="tcfScore"
                      type="number"
                      min="0"
                      max="100"
                      placeholder="85"
                      value={formData.tcfScore}
                      onChange={(e) => handleChange("tcfScore", e.target.value)}
                      className={`border-blue-200 focus:border-blue-800 ${errors.tcfScore ? "border-red-500" : ""}`}
                    />
                    {errors.tcfScore && <p className="text-sm text-red-600">{errors.tcfScore}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <BookOpen className="h-16 w-16 text-blue-800 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Études Actuelles</h3>
                  <p className="text-gray-600">Où en êtes-vous dans votre parcours ?</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-gray-700">
                      Spécialité que vous étudiez
                    </Label>
                    <Select value={formData.specialty} onValueChange={(value) => handleChange("specialty", value)}>
                      <SelectTrigger className={`border-blue-200 ${errors.specialty ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionnez votre spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((spec) => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialty && <p className="text-sm text-red-600">{errors.specialty}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="studyYear" className="text-gray-700">
                      Année d'étude actuelle
                    </Label>
                    <Select value={formData.studyYear} onValueChange={(value) => handleChange("studyYear", value)}>
                      <SelectTrigger className={`border-blue-200 ${errors.studyYear ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionnez votre niveau" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="L1">L1 (Licence 1ère année)</SelectItem>
                        <SelectItem value="L2">L2 (Licence 2ème année)</SelectItem>
                        <SelectItem value="L3">L3 (Licence 3ème année)</SelectItem>
                        <SelectItem value="M1">M1 (Master 1ère année)</SelectItem>
                        <SelectItem value="M2">M2 (Master 2ème année)</SelectItem>
                        <SelectItem value="doctorat">Doctorat</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.studyYear && <p className="text-sm text-red-600">{errors.studyYear}</p>}
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <Trophy className="h-16 w-16 text-blue-800 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Expérience d'Admission</h3>
                  <p className="text-gray-600">Avez-vous déjà été accepté dans une université ?</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-700">Avez-vous déjà eu une acceptation universitaire ?</Label>
                    <Select
                      value={formData.hasAcceptance}
                      onValueChange={(value) => handleChange("hasAcceptance", value)}
                    >
                      <SelectTrigger className={`border-blue-200 ${errors.hasAcceptance ? "border-red-500" : ""}`}>
                        <SelectValue placeholder="Sélectionnez une réponse" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="oui">Oui, j'ai déjà été accepté(e)</SelectItem>
                        <SelectItem value="non">Non, c'est ma première candidature</SelectItem>
                        <SelectItem value="en-cours">J'ai des candidatures en cours</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.hasAcceptance && <p className="text-sm text-red-600">{errors.hasAcceptance}</p>}
                  </div>

                  {formData.hasAcceptance === "oui" && (
                    <Alert className="border-green-200 bg-green-50">
                      <Trophy className="h-4 w-4" />
                      <AlertDescription className="text-green-800">
                        Excellent ! Votre expérience d'acceptation nous aidera à mieux calibrer nos recommandations.
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="border-blue-200 text-blue-800">
                  Précédent
                </Button>
              )}
              <div className="ml-auto">
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700"
                >
                  {isLoading ? "Sauvegarde..." : step === totalSteps ? "Terminer" : "Suivant"}
                </Button>
              </div>
            </div>

            {step === totalSteps && (
              <Alert className="mt-6 border-blue-200 bg-blue-50">
                <Target className="h-4 w-4" />
                <AlertDescription className="text-blue-800">
                  <strong>Presque terminé !</strong>
                  <br />
                  Une fois votre profil configuré, vous aurez accès au simulateur intelligent et à toutes les
                  fonctionnalités premium de PathwayFR.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}