"use client"

import React, { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/Navbar"

import { Share2, MessageCircle, CheckCircle, XCircle, Sparkles } from "lucide-react"

// Composant MultiSelect corrigé avec gestion du z-index, exclusions et ouverture conditionnelle
const SimpleMultiSelect = ({ options, selected, onSelectionChange, placeholder, className = "", excludedIds = [], maxSelection = null, openUpward = false }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [shouldOpenUpward, setShouldOpenUpward] = useState(openUpward)
  const containerRef = useRef(null)

  const handleToggle = (optionId) => {
    const newSelected = selected.includes(optionId)
      ? selected.filter(id => id !== optionId)
      : [...selected, optionId]
    
    // Vérifier la limite de sélection
    if (maxSelection && newSelected.length > maxSelection) {
      return; // Ne pas permettre plus que la limite
    }
    
    onSelectionChange(newSelected)
  }

  // Filtrer les options exclues
  const filteredOptions = options.filter(option => !excludedIds.includes(option.id_university || option.id_speciality || option.id || option.value))
  const selectedOptions = filteredOptions.filter(option => selected.includes(option.id_university || option.id_speciality || option.id || option.value))

  // Vérifier l'espace disponible et déterminer la direction d'ouverture
  const checkSpaceAndSetDirection = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      const dropdownHeight = 240 // hauteur approximative du dropdown (max-h-60 = 240px)
      
      // Ouvrir vers le haut si pas assez d'espace en bas ET qu'il y a plus d'espace en haut
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setShouldOpenUpward(true)
      } else {
        setShouldOpenUpward(false)
      }
    }
  }

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.multiselect-container')) {
        setIsOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [isOpen])

  const handleContainerClick = () => {
    if (!isOpen) {
      checkSpaceAndSetDirection()
    }
    setIsOpen(!isOpen)
  }

  return (
    <div className="relative multiselect-container" ref={containerRef}>
      <div
        className={`border rounded-md p-2 min-h-[40px] cursor-pointer bg-white hover:border-blue-400 transition-colors ${className}`}
        onClick={handleContainerClick}
      >
        {selectedOptions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map(option => {
              const key = `selected-${option.id_university || option.id_speciality || option.id || option.value}`
              return (
                <span key={key} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {option.univ_name || option.speciality_name || option.name || option.label}
                </span>
              )
            })}
          </div>
        ) : (
          <span className="text-gray-500">{placeholder}</span>
        )}
        {maxSelection && (
          <div className="text-xs text-gray-500 mt-1">
            {selected.length}/{maxSelection} sélectionné{selected.length > 1 ? 's' : ''}
          </div>
        )}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {isOpen && (
        <div className={`absolute z-[9999] w-full bg-white border border-gray-300 rounded-md max-h-60 overflow-y-auto shadow-2xl ${
          shouldOpenUpward ? 'bottom-full mb-1' : 'top-full mt-1'
        }`}>
          {filteredOptions.length === 0 ? (
            <div className="p-3 text-gray-500 text-center">Aucune option disponible</div>
          ) : (
            filteredOptions.map(option => {
              const key = `option-${option.id_university || option.id_speciality || option.id || option.value}`
              const isSelected = selected.includes(option.id_university || option.id_speciality || option.id || option.value)
              const canSelect = !maxSelection || selected.length < maxSelection || isSelected
              return (
                <div
                  key={key}
                  className={`p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                    isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  } ${!canSelect ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (canSelect) {
                      handleToggle(option.id_university || option.id_speciality || option.id || option.value)
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">
                      {option.univ_name || option.speciality_name || option.name || option.label}
                    </span>
                    {isSelected && <span className="text-blue-600 font-bold">✓</span>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default function PartagerPage() {
  const [universities, setUniversities] = useState([]);
  const [specialities, setSpecialities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    studyYearWhenApplied: "",
    candidature_year: "", 
    tcf: "", 
    // Moyennes lycée
    moyenne1AS: "",
    moyenne2AS: "",
    moyenne3AS: "",
    redoubler1AS: false,
    moyenne1ASRedouble: "",
    redoubler2AS: false,
    moyenne2ASRedouble: "",
    redoubler3AS: false,
    moyenne3ASRedouble: "",
    has1AS: true,
    has2AS: true,
    has3AS: false,
    redoubler1AS: false,
    redoubler2AS: false,
    redoubler3AS: false,
    // Bac
    moyenneBac: "",
    bacType: "",
    // Moyennes universitaires
    hasL1: false,
    averageL1: "",
    redoublerL1: false,
    averageL1Redouble: "",
    hasL2: false,
    averageL2: "",
    redoublerL2: false,
    averageL2Redouble: "",
    hasL3: false,
    averageL3: "",
    redoublerL3: false,
    averageL3Redouble: "",
    hasM1: false,
    averageM1: "",
    redoublerM1: false,
    averageM1Redouble: "",
    hasM2: false,
    averageM2: "",
    redoublerM2: false,
    averageM2Redouble: "",
    applicationYear: "",
    targetUniversities: [],
    targetSpecialties: [],
    acceptedUniversities: [],
    rejectedUniversities: [],
    comment: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Récupération des universités
        const universitiesResponse = await fetch("http://127.0.0.1:5000/universities/");
        if (!universitiesResponse.ok) {
          throw new Error("Erreur lors du chargement des universités");
        }
        const universitiesData = await universitiesResponse.json();
        setUniversities(universitiesData);

        // Récupération des spécialités
        const specialitiesResponse = await fetch("http://127.0.0.1:5000/specialities/");
        if (!specialitiesResponse.ok) {
          throw new Error("Erreur lors du chargement des spécialités");
        }
        const specialitiesData = await specialitiesResponse.json();
        setSpecialities(specialitiesData);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fonction pour déterminer les années de candidature possibles selon le niveau actuel
  const getAvailableCandidatureYears = () => {
    const studyYear = formData.studyYearWhenApplied
    const availableYears = []

    if (studyYear === "terminale") {
      availableYears.push({ value: 1, label: "L1" })
    } else if (studyYear === "L1") {
      availableYears.push({ value: 1, label: "L1" }, { value: 2, label: "L2" })
    } else if (studyYear === "L2") {
      availableYears.push({ value: 1, label: "L1" }, { value: 2, label: "L2" }, { value: 3, label: "L3" })
    } else if (studyYear === "L3") {
      availableYears.push({ value: 2, label: "L2" }, { value: 3, label: "L3" }, { value: 4, label: "M1" })
    } else if (studyYear === "M1") {
      availableYears.push({ value: 3, label: "L3" }, { value: 4, label: "M1" }, { value: 5, label: "M2" })
    } else if (studyYear === "M2") {
      availableYears.push({ value: 4, label: "M1" }, { value: 5, label: "M2" })
    }

    return availableYears
  }

  // Fonction pour déterminer quelles moyennes afficher
  const getAvailableGrades = () => {
    const studyYear = formData.studyYearWhenApplied
    const candidatureYear = formData.candidature_year
    const grades = []

    // Les moyennes du lycée apparaissent SEULEMENT si on postule en L1
    const shouldShowLycee = candidatureYear === "1"
    
    if (shouldShowLycee) {
      grades.push("lycee")
    }

    if (studyYear === "L1") {
      grades.push("L1")
    } else if (studyYear === "L2") {
      grades.push("L1", "L2")
    } else if (studyYear === "L3") {
      grades.push("L1", "L2", "L3")
    } else if (studyYear === "M1") {
      grades.push("L1", "L2", "L3", "M1")
    } else if (studyYear === "M2") {
      grades.push("L1", "L2", "L3", "M1", "M2")
    }

    return grades
  }

  // Fonction pour déterminer le nombre max d'universités selon l'année de candidature
  const getMaxUniversities = () => {
    return formData.candidature_year === "1" ? 3 : 7
  }

  // Fonction principale de soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Vérifications de base
      if (!formData.targetSpecialties.length) {
        throw new Error("Veuillez sélectionner au moins une spécialité");
      }
      if (!formData.targetUniversities.length) {
        throw new Error("Veuillez sélectionner au moins une université");
      }
      if (!formData.candidature_year) {
        throw new Error("Veuillez sélectionner une année de candidature");
      }

      // Fonction utilitaire pour construire la valeur d'une année
      const buildYearValue = (average, hasRedouble, redoubleAverage) => {
        if (hasRedouble) {
          return [
            average !== "" ? average : null,
            redoubleAverage !== "" ? redoubleAverage : null
          ];
        }
        return average !== "" ? average : null;
      };

      // Préparation des données pour l'API
      const averageEachYearPayload = {
        "1AS": buildYearValue(formData.moyenne1AS, formData.redoubler1AS, formData.moyenne1ASRedouble),
        "2AS": buildYearValue(formData.moyenne2AS, formData.redoubler2AS, formData.moyenne2ASRedouble),
        "3AS": buildYearValue(formData.moyenne3AS, formData.redoubler3AS, formData.moyenne3ASRedouble),
        "L1": buildYearValue(formData.averageL1, formData.redoublerL1, formData.averageL1Redouble),
        "L2": buildYearValue(formData.averageL2, formData.redoublerL2, formData.averageL2Redouble),
        "L3": buildYearValue(formData.averageL3, formData.redoublerL3, formData.averageL3Redouble),
        "M1": buildYearValue(formData.averageM1, formData.redoublerM1, formData.averageM1Redouble),
        "M2": buildYearValue(formData.averageM2, formData.redoublerM2, formData.averageM2Redouble)
      };

      const payload = {
        user_id: null,
        bac_type: formData.bacType || null,
        bac_average: formData.moyenneBac || null,
        comment: formData.comment || "",
        application_year: formData.applicationYear || null,
        study_year_at_application_time: formData.studyYearWhenApplied || "",
        level_tcf: formData.tcf || null,
        candidature_year: formData.candidature_year || null,
        speciality_id: formData.targetSpecialties[0],
        university_ids: formData.targetUniversities,
        is_validated: true,
        university_accepted_in: formData.acceptedUniversities,
        university_rejected_in: formData.rejectedUniversities,
        ...averageEachYearPayload
      };

      console.log("Payload envoyé:", payload); 

      // Envoi des données au backend
      const response = await fetch("http://127.0.0.1:5000/experience/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Erreur HTTP: ${response.status}`);
      }

      // Succès
      setSubmitted(true);
      console.log("Expérience créée avec succès:", data);
      
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
      }

      // Logique d'exclusion mutuelle entre acceptées et refusées
      if (name === "acceptedUniversities") {
        newData.rejectedUniversities = newData.rejectedUniversities.filter(id => !value.includes(id))
      } else if (name === "rejectedUniversities") {
        newData.acceptedUniversities = newData.acceptedUniversities.filter(id => !value.includes(id))
      }

      return newData
    })
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Chargement des données...</p>
          </div>
        </div>
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          <div className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                Merci pour votre partage !
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Votre expérience a été ajoutée avec succès. Elle aidera d'autres étudiants dans leur choix d'orientation universitaire.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  const availableGrades = getAvailableGrades()

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Contribuez à la communauté
            </div>
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
              Partagez Votre Expérience
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              Aidez la communauté en partageant votre parcours d'admission universitaire.
            </p>
          </div>

          {/* Affichage des erreurs */}
          {error && (
            <Alert className="max-w-4xl mx-auto mb-6 border-red-200 bg-red-50">
              <XCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Informations générales */}
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <Share2 className="mr-2 h-5 w-5" />
                    Informations Générales
                  </CardTitle>
                  <CardDescription>Parlez-nous de votre situation au moment de la candidature</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="studyYearWhenApplied">Année d'étude au moment de la candidature *</Label>
                      <Select
                        value={formData.studyYearWhenApplied}
                        onValueChange={(value) => handleChange("studyYearWhenApplied", value)}
                      >
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez votre niveau" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="terminale">Terminale</SelectItem>
                          <SelectItem value="L1">L1</SelectItem>
                          <SelectItem value="L2">L2</SelectItem>
                          <SelectItem value="L3">L3</SelectItem>
                          <SelectItem value="M1">M1</SelectItem>
                          <SelectItem value="M2">M2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="applicationYear">Année de candidature *</Label>
                      <Select
                        value={formData.applicationYear}
                        onValueChange={(value) => handleChange("applicationYear", value)}
                      >
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Année" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2022">2022</SelectItem>
                          <SelectItem value="2021">2021</SelectItem>
                          <SelectItem value="2020">2020</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Année de candidature visée *</Label>
                      <Select
                        value={formData.candidature_year}
                        onValueChange={(value) => handleChange("candidature_year", value)}
                      >
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Sélectionnez l'année visée" />
                        </SelectTrigger>
                        <SelectContent>
                          {getAvailableCandidatureYears().map((year) => (
                            <SelectItem key={year.value} value={year.value.toString()}>
                              {year.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-slate-500">
                        Années d'étude pour lesquelles vous pouvez candidater selon votre niveau actuel
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tcf">Score TCF (optionnel)</Label>
                      <Input
                        id="tcf"
                        type="number"
                        min="0"
                        max="699"
                        placeholder="Ex: 550"
                        value={formData.tcf}
                        onChange={(e) => handleChange("tcf", e.target.value)}
                        className="border-blue-200 focus:border-blue-600"
                      />
                      <p className="text-xs text-slate-500">
                        Score TCF si requis pour votre candidature (entre 0 et 699)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section des moyennes */}
              {formData.studyYearWhenApplied && (
                <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-blue-700">Moyennes Scolaires</CardTitle>
                    <CardDescription>
                      Renseignez vos moyennes selon votre parcours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      
                      {/* Moyennes du lycée - Affichage conditionnel */}
                      {availableGrades.includes("lycee") && (
                        <>
                          {["1AS", "2AS", "3AS"].map((level) => {
                            const hasKey = `has${level}`;
                            const averageKey = `moyenne${level}`;
                            const redoubleKey = `redoubler${level}`;
                            const averageRedoKey = `moyenne${level}Redouble`;

                            return (
                              <div
                                key={level}
                                className="space-y-3 p-4 bg-amber-100 rounded-lg border border-amber-200"
                              >
                                {/* Checkbox "j'ai fait" */}
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={hasKey}
                                    checked={formData[hasKey]}
                                    onChange={(e) => handleChange(hasKey, e.target.checked)}
                                    className="rounded border-amber-200"
                                  />
                                  <Label htmlFor={hasKey} className="font-medium">
                                    J'ai fait {level}
                                  </Label>
                                </div>

                                {/* Champ moyenne */}
                                {formData[hasKey] && (
                                  <div className="ml-6 space-y-2">
                                    <Label htmlFor={averageKey}>Moyenne {level}</Label>
                                    <Input
                                      id={averageKey}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      max="20"
                                      placeholder="15.85"
                                      value={formData[averageKey]}
                                      onChange={(e) => handleChange(averageKey, e.target.value)}
                                      className="border-amber-200"
                                    />

                                    {/* Checkbox "J'ai redoublé" */}
                                    <div className="flex items-center space-x-2 mt-2">
                                      <input
                                        type="checkbox"
                                        id={redoubleKey}
                                        checked={formData[redoubleKey]}
                                        onChange={(e) => handleChange(redoubleKey, e.target.checked)}
                                        className="rounded border-amber-200"
                                      />
                                      <Label htmlFor={redoubleKey} className="font-medium">
                                        J'ai redoublé
                                      </Label>
                                    </div>

                                    {/* Champ moyenne redoublement */}
                                    {formData[redoubleKey] && (
                                      <div className="mt-2 space-y-1">
                                        <Label htmlFor={averageRedoKey}>
                                          Moyenne redoublement {level}
                                        </Label>
                                        <Input
                                          id={averageRedoKey}
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          max="20"
                                          placeholder="14.25"
                                          value={formData[averageRedoKey]}
                                          onChange={(e) => handleChange(averageRedoKey, e.target.value)}
                                          className="border-amber-200"
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Informations Bac */}
                          {formData.studyYearWhenApplied !== "terminale" && (
                            <div className="space-y-4 p-4 bg-green-50 rounded-lg border border-green-200">
                              <h4 className="font-semibold text-green-800 mb-3">Informations du Baccalauréat</h4>
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="moyenneBac">Moyenne du Bac *</Label>
                                  <Input
                                    id="moyenneBac"
                                    type="number"
                                    step="0.01"
                                    min="10"
                                    max="20"
                                    placeholder="16.85"
                                    value={formData.moyenneBac}
                                    onChange={(e) => handleChange("moyenneBac", e.target.value)}
                                    className="border-green-200"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="bacType">Type de Bac</Label>
                                  <Select
                                    value={formData.bacType}
                                    onValueChange={(value) => handleChange("bacType", value)}
                                  >
                                    <SelectTrigger className="border-green-200">
                                      <SelectValue placeholder="Sélectionnez votre type de bac" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="sciences_experimentales">Sciences Expérimentales</SelectItem>
                                      <SelectItem value="mathematiques">Mathématiques</SelectItem>
                                      <SelectItem value="techniques_mathematiques">Techniques Mathématiques</SelectItem>
                                      <SelectItem value="gestion_economie">Gestion et Économie</SelectItem>
                                      <SelectItem value="lettres_philosophie">Lettres et Philosophie</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {/* Moyennes universitaires L1-M2 */}
                      {["L1", "L2", "L3", "M1", "M2"].map((level) => {
                        if (!availableGrades.includes(level)) return null
                        
                        const hasKey = `has${level}`
                        const averageKey = `average${level}`
                        const redoublerKey = `redoubler${level}`
                        const averageRedoubleKey = `average${level}Redouble`

                        return (
                          <div key={level} className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id={hasKey}
                                checked={formData[hasKey]}
                                onChange={(e) => handleChange(hasKey, e.target.checked)}
                                className="rounded border-blue-200"
                              />
                              <Label htmlFor={hasKey} className="font-medium">
                                J'ai fait une {level}
                              </Label>
                            </div>
                            {formData[hasKey] && (
                              <div className="ml-6 space-y-3">
                                <div className="grid md:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={averageKey}>Moyenne {level}</Label>
                                    <Input
                                      id={averageKey}
                                      type="number"
                                      step="0.01"
                                      min="0"
                                      max="20"
                                      placeholder="15.75"
                                      value={formData[averageKey]}
                                      onChange={(e) => handleChange(averageKey, e.target.value)}
                                      className="border-blue-200"
                                    />
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    id={redoublerKey}
                                    checked={formData[redoublerKey]}
                                    onChange={(e) => handleChange(redoublerKey, e.target.checked)}
                                    className="rounded border-blue-200"
                                  />
                                  <Label htmlFor={redoublerKey} className="text-sm">
                                    J'ai redoublé la {level}
                                  </Label>
                                </div>
                                {formData[redoublerKey] && (
                                  <div className="ml-6">
                                    <div className="space-y-2">
                                      <Label htmlFor={averageRedoubleKey}>Moyenne {level} (redoublement)</Label>
                                      <Input
                                        id={averageRedoubleKey}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        max="20"
                                        placeholder="16.25"
                                        value={formData[averageRedoubleKey]}
                                        onChange={(e) => handleChange(averageRedoubleKey, e.target.value)}
                                        className="border-blue-200"
                                      />
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Candidatures */}
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700">Détails des Candidatures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Universités visées *</Label>
                      <SimpleMultiSelect
                        options={universities}
                        selected={formData.targetUniversities}
                        onSelectionChange={(selected) => handleChange("targetUniversities", selected)}
                        placeholder="Sélectionnez les universités..."
                        className="border-blue-200"
                        maxSelection={getMaxUniversities()}
                      />
                      <p className="text-xs text-slate-500">
                        {formData.candidature_year === "1" ? "Maximum 3 universités pour L1" : "Maximum 7 universités pour L2 et plus"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Spécialités visées *</Label>
                      <SimpleMultiSelect
                        options={specialities}
                        selected={formData.targetSpecialties}
                        onSelectionChange={(selected) => handleChange("targetSpecialties", selected)}
                        placeholder="Sélectionnez les spécialités..."
                        className="border-blue-200"
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Universités acceptées/refusées */}
                  <div className="grid md:grid-cols-2 gap-6 relative">
                    <div className="space-y-2 relative">
                      <Label className="flex items-center text-green-700">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Universités qui vous ont accepté
                      </Label>
                      <div className="relative z-50">
                        <SimpleMultiSelect
                          options={universities.filter((univ) => formData.targetUniversities.includes(univ.id_university))}
                          selected={formData.acceptedUniversities}
                          onSelectionChange={(selected) => handleChange("acceptedUniversities", selected)}
                          placeholder="Sélectionnez..."
                          className="border-green-200"
                          excludedIds={formData.rejectedUniversities}
                          openUpward={true}
                        />
                      </div>
                    </div>
                    <div className="space-y-2 relative">
                      <Label className="flex items-center text-red-700">
                        <XCircle className="mr-2 h-4 w-4" />
                        Universités qui vous ont refusé
                      </Label>
                      <div className="relative z-50">
                        <SimpleMultiSelect
                          options={universities.filter((univ) => formData.targetUniversities.includes(univ.id_university))}
                          selected={formData.rejectedUniversities}
                          onSelectionChange={(selected) => handleChange("rejectedUniversities", selected)}
                          placeholder="Sélectionnez..."
                          className="border-red-200"
                          excludedIds={formData.acceptedUniversities}
                          openUpward={true}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Témoignage */}
              <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
                <CardHeader>
                  <CardTitle className="text-blue-700 flex items-center">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    Votre Témoignage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="comment">Commentaire libre</Label>
                    <Textarea
                      id="comment"
                      placeholder="Partagez votre expérience, vos conseils..."
                      value={formData.comment}
                      onChange={(e) => handleChange("comment", e.target.value)}
                      className="border-blue-200 min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Bouton de soumission */}
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12 py-4 shadow-lg"
                >
                  {isSubmitting ? "Envoi en cours..." : "Partager mon expérience"}
                </Button>
                <p className="text-sm text-slate-600 mt-4">
                  En partageant votre expérience, vous acceptez que ces informations soient utilisées pour améliorer nos services.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}