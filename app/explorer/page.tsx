"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Navbar from "@/components/Navbar"

type University = {
  id_university: number
  univ_name: string
  city: string
}

type Speciality = {
  id_speciality: number
  speciality_name: string
}

type Experience = {
  id_experience: number
  application_year: number
  candidature_year: string
  study_year_at_application_time: string
  level_tcf: number
  bac_average: number | null
  comment: string
  is_validated: boolean
  speciality: Speciality
  universities: University[]
  average_each_year: Record<string, number>
  university_accepted_in: string[]
  university_rejected_in: string[]
}

export default function ExplorerPage() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/experience/explorer")
        
        // ✅ AJOUT : Vérifier le status de la réponse
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }
        
        const data = await res.json()
        
        // ✅ AJOUT : Log détaillé pour débugger
        console.log("Données reçues de l'API:", data)
        console.log("Type des données:", typeof data)
        console.log("Est un tableau:", Array.isArray(data))
        
        // Vérifier que data est bien un tableau
        if (Array.isArray(data)) {
          setExperiences(data)
        } else {
          console.error("Les données reçues ne sont pas un tableau:", data)
          setExperiences([])
        }
      } catch (error) {
        console.error("Erreur API:", error)
        setExperiences([])
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])




  if (loading) return <p className="text-center text-gray-500">Chargement...</p>

  // Vérification si experiences est vide ou pas un tableau
  if (!Array.isArray(experiences) || experiences.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">📘 Expériences partagées</h1>
        <p className="text-center text-gray-500">Aucune expérience trouvée.</p>
      </div>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">📘 Expériences partagées</h1>
        {experiences.map((exp) => (
          <Card key={exp.id_experience} className="shadow-lg border">
            <CardHeader className="flex justify-between items-center">
              <CardTitle className="flex justify-between w-full">
                <span>
                  🎓 {exp.speciality?.speciality_name} – Année d'étude : {exp.study_year_at_application_time}
                </span>
                <Badge
                  className={`ml-2 ${exp.is_validated ? "bg-green-500" : "bg-red-500"}`}
                >
                  {exp.is_validated ? "Accepté ✅" : "Refusé ❌"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Année + Bac */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>📅 Année de candidature : {exp.application_year}</span>
                <span>
                  🎯 Niveau TCF : <b className="text-blue-600">{exp.level_tcf}</b>
                </span>
              </div>
              {exp.bac_average && (
                <p className="text-sm text-gray-700">
                  📖 Moyenne Bac : <b>{exp.bac_average}/20</b>
                </p>
              )}
              <Separator />
              {/* Average each year */}
              {exp.average_each_year && Object.keys(exp.average_each_year).length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">📊 Moyennes par année :</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700">
                    {["1AS", "2AS", "3AS", "L1", "L2", "L3", "M1", "M2"].map((year) => {
                      const avg = exp.average_each_year[year]
                      if (avg !== undefined && avg !== null) {
                        return (
                          <li key={year}>
                            {year} : <b>{avg}</b>
                          </li>
                        )
                      }
                      return null
                    })}
                  </ul>
                </div>
              )}
              <Separator />
              {/* Universités ciblées */}
              <div>
                <h3 className="font-semibold mb-2">🏛 Universités ciblées :</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {exp.universities.map((univ) => (
                    <li key={univ.id_university}>
                      {univ.univ_name} <span className="text-gray-500">({univ.city})</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* ✅ AJOUT : Universités acceptées */}
              {exp.university_accepted_in && exp.university_accepted_in.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2 text-green-600">✅ Universités acceptées :</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {exp.university_accepted_in
                        .filter(univ => univ && univ.trim() && univ.trim() !== "") // Filtrer les valeurs vides
                        .map((univ, index) => (
                          <li key={index} className="text-green-700">
                            {univ}
                          </li>
                        ))}
                    </ul>
                  </div>
                </>
              )}
              {/* ❌ AJOUT : Universités refusées */}
              {exp.university_rejected_in && exp.university_rejected_in.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2 text-red-600">❌ Universités refusées :</h3>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {exp.university_rejected_in
                        .filter(univ => univ && univ.trim() && univ.trim() !== "") // Filtrer les valeurs vides
                        .map((univ, index) => (
                          <li key={index} className="text-red-700">
                            {univ}
                          </li>
                        ))}
                    </ul>
                  </div>
                </>
              )}
              <Separator />
              {/* Commentaire */}
              <div>
                <h3 className="font-semibold mb-2">📝 Commentaire :</h3>
                <p className="text-gray-800 text-sm leading-relaxed">
                  {exp.comment}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )
}