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
  const [hasBac, setHasBac] = useState<boolean | null>(null)
  const [hasTcf, setHasTcf] = useState<boolean | null>(null)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.push("/auth/login")
      return
    }

    // Vérifier si le profil est déjà complété avec le nouvel endpoint
    const checkProfileStatus = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/users/profile/status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (res.ok) {
          const statusData = await res.json()
          console.log("Status du profil dans setup:", statusData)
          
          if (statusData.is_complete) {
            console.log("Profil déjà complet, redirection vers explorer")
            if (statusData.profile_data) {
              localStorage.setItem("userProfile", JSON.stringify(statusData.profile_data))
            }
            router.push("/explorer")
          } else {
            console.log("Profil incomplet, champs manquants:", statusData.missing_fields)
          }
        }
        // Si pas de profil ou profil incomplet, rester sur cette page
      } catch (error) {
        // En cas d'erreur, rester sur la page de setup
        console.log("Erreur lors de la vérification du status:", error)
      }
    }

    checkProfileStatus()
  }, [router])

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleNext = () => {
    const currentStepErrors: Record<string, string> = {}

    if (step === 1) {
      if (hasBac === null) {
        currentStepErrors.hasBac = "Veuillez indiquer si vous avez passé le bac"
      }
      
      if (hasBac === true) {
        if (!formData.bacAverage) currentStepErrors.bacAverage = "La moyenne du bac est requise"
        if (!formData.bacType) currentStepErrors.bacType = "Le type de bac est requis"
      }
      
      if (hasTcf === null) {
        currentStepErrors.hasTcf = "Veuillez indiquer si vous avez passé le TCF"
      }
      
      if (hasTcf === true && !formData.tcfScore) {
        currentStepErrors.tcfScore = "Le score TCF est requis"
      }
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
    if (hasBac === null || hasTcf === null || !formData.specialty || !formData.studyYear || !formData.hasAcceptance) {
      setErrors({ global: "Tous les champs obligatoires doivent être remplis" });
      setIsLoading(false);
      return;
    }

    if (hasBac === true && (!formData.bacAverage || !formData.bacType)) {
      setErrors({ global: "Si vous avez passé le bac, la moyenne et le type sont requis" });
      setIsLoading(false);
      return;
    }

    if (hasTcf === true && !formData.tcfScore) {
      setErrors({ global: "Si vous avez passé le TCF, le score est requis" });
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

      const submitData: any = {
        speciality: formData.specialty,
        annee_etude_actuelle: formData.studyYear,
        accepted: formData.hasAcceptance === "oui",
      }

      // Ajouter les données du bac seulement si l'utilisateur a passé le bac
      if (hasBac === true) {
        submitData.bac_average = parseFloat(formData.bacAverage)
        submitData.bac_type = formData.bacType.toLowerCase().replace(/\s+/g, '_')
      }

      // Ajouter le score TCF seulement si l'utilisateur a passé le TCF
      if (hasTcf === true) {
        submitData.tcf_score = parseInt(formData.tcfScore)
      }

      const res = await fetch("http://127.0.0.1:5000/users/profile/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
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

      // Sauvegarder le profil dans localStorage
      const profileData = {
        bacAverage: hasBac ? formData.bacAverage : null,
        bacType: hasBac ? formData.bacType : null,
        tcfScore: hasTcf ? formData.tcfScore : null,
        specialty: formData.specialty,
        studyYear: formData.studyYear,
        hasAcceptance: formData.hasAcceptance,
        bac_average: hasBac ? parseFloat(formData.bacAverage) : null,
        annee_etude_actuelle: formData.studyYear,
        accepted: formData.hasAcceptance === "oui",
        hasBac,
        hasTcf,
      }
      localStorage.setItem("userProfile", JSON.stringify(profileData))

      // Déclencher l'événement de changement d'auth pour mettre à jour la navbar
      window.dispatchEvent(new Event('authStatusChanged'))
  
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

  const handleBacChoice = (choice: boolean) => {
    setHasBac(choice)
    if (!choice) {
      // Reset bac-related fields if user doesn't have bac
      setFormData(prev => ({
        ...prev,
        bacAverage: "",
        bacType: "",
      }))
    }
    if (errors.hasBac) {
      setErrors(prev => ({ ...prev, hasBac: "" }))
    }
  }

  const handleTcfChoice = (choice: boolean) => {
    setHasTcf(choice)
    if (!choice) {
      // Reset TCF score if user doesn't have TCF
      setFormData(prev => ({
        ...prev,
        tcfScore: "",
      }))
    }
    if (errors.hasTcf) {
      setErrors(prev => ({ ...prev, hasTcf: "" }))
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

                <div className="space-y-6">
                  {/* Question Bac */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Avez-vous passé le baccalauréat ?</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={hasBac === true ? "default" : "outline"}
                        onClick={() => handleBacChoice(true)}
                        className={`flex-1 ${hasBac === true ? "bg-blue-800 hover:bg-blue-900" : "border-blue-200 hover:bg-blue-50"}`}
                      >
                        Oui, j'ai passé le bac
                      </Button>
                      <Button
                        type="button"
                        variant={hasBac === false ? "default" : "outline"}
                        onClick={() => handleBacChoice(false)}
                        className={`flex-1 ${hasBac === false ? "bg-blue-800 hover:bg-blue-900" : "border-blue-200 hover:bg-blue-50"}`}
                      >
                        Non, je n'ai pas le bac
                      </Button>
                    </div>
                    {errors.hasBac && <p className="text-sm text-red-600">{errors.hasBac}</p>}
                  </div>

                  {/* Champs Bac (conditionnels) */}
                  {hasBac === true && (
                    <div className="space-y-4 border-l-4 border-blue-200 pl-4">
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
                    </div>
                  )}

                  {/* Question TCF */}
                  <div className="space-y-3">
                    <Label className="text-gray-700 font-medium">Avez-vous passé le TCF (Test de Connaissance du Français) ?</Label>
                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant={hasTcf === true ? "default" : "outline"}
                        onClick={() => handleTcfChoice(true)}
                        className={`flex-1 ${hasTcf === true ? "bg-blue-800 hover:bg-blue-900" : "border-blue-200 hover:bg-blue-50"}`}
                      >
                        Oui, j'ai passé le TCF
                      </Button>
                      <Button
                        type="button"
                        variant={hasTcf === false ? "default" : "outline"}
                        onClick={() => handleTcfChoice(false)}
                        className={`flex-1 ${hasTcf === false ? "bg-blue-800 hover:bg-blue-900" : "border-blue-200 hover:bg-blue-50"}`}
                      >
                        Non, je n'ai pas le TCF
                      </Button>
                    </div>
                    {errors.hasTcf && <p className="text-sm text-red-600">{errors.hasTcf}</p>}
                  </div>

                  {/* Champ TCF (conditionnel) */}
                  {hasTcf === true && (
                    <div className="border-l-4 border-blue-200 pl-4">
                      <div className="space-y-2">
                        <Label htmlFor="tcfScore" className="text-gray-700">
                          Score TCF
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
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <BookOpen className="h-16 w-16 text-blue-800 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800">Études Actuelles ou Souhaitées</h3>
                  <p className="text-gray-600">Où en êtes-vous dans votre parcours ?</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="specialty" className="text-gray-700">
                      Quelle spécialité étudiez-vous ou aimeriez-vous étudier ?
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
                        <SelectItem value="terminale">Terminale</SelectItem>
                        <SelectItem value="L1">L1 (Licence 1ère année)</SelectItem>
                        <SelectItem value="L2">L2 (Licence 2ème année)</SelectItem>
                        <SelectItem value="L3">L3 (Licence 3ème année)</SelectItem>
                        <SelectItem value="M1">M1 (Master 1ère année)</SelectItem>
                        <SelectItem value="M2">M2 (Master 2ème année)</SelectItem>
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
                        <SelectItem value="oui">Oui, j'ai déjà eu une acceptation</SelectItem>
                        <SelectItem value="non">Non, je n'ai jamais eu une acceptation</SelectItem>
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