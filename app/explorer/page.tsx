"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import Navbar from "@/components/Navbar"

export default function ExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation dynamique */}
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Mini Blog & Actualités
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            Comprendre les Études en France
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Conseils, témoignages et ressources utiles pour préparer ton départ
          </p>
        </div>
        {/* Articles récents */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Articles récents</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-blue-700 text-lg">Comment choisir son université ?</CardTitle>
                <CardDescription className="text-slate-600">Méthodes et critères pour bien s’orienter</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">Découvrez les points clés pour sélectionner l’université qui correspond à votre projet : réputation, spécialités, vie étudiante, localisation…</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-blue-700 text-lg">Le système LMD expliqué</CardTitle>
                <CardDescription className="text-slate-600">Licence, Master, Doctorat : comprendre le parcours</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">Le système LMD structure les études supérieures en France. On vous explique les étapes, les équivalences et les débouchés.</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all">
              <CardHeader>
                <CardTitle className="text-blue-700 text-lg">TCF vs DELF : quoi passer ?</CardTitle>
                <CardDescription className="text-slate-600">Les tests de français pour les étudiants étrangers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">TCF ou DELF ? On compare les deux examens, leurs objectifs, formats et conseils pour réussir.</p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* Témoignages */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-blue-700">Témoignages d’étudiants</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-700 text-lg">Fatou, 21 ans – Licence à Lyon</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">« J’ai choisi Lyon pour son ambiance et la qualité des enseignements. L’intégration a été facilitée par les associations étudiantes ! »</p>
              </CardContent>
            </Card>
            <Card className="border-blue-200 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-blue-700 text-lg">Youssef, 23 ans – Master à Paris</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 text-sm">« Le Master à Paris m’a ouvert beaucoup de portes. Les stages sont nombreux et le réseau d’anciens est très utile pour trouver un emploi. »</p>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* CTA */}
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-4 text-blue-700">Tu veux partager ton expérience ?</h3>
          <Link href="/partager">
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4">
              Partager mon témoignage
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}