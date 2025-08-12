"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"
import {
  Users,
  MessageCircle,
  BarChart3,
  Shield,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Download,
  TrendingUp,
} from "lucide-react"

// Mock data pour l'admin
const mockUsers = [
  {
    id: 1,
    name: "Jean Dupont",
    email: "jean@example.com",
    status: "active",
    createdAt: "2024-01-15",
    subscription: "premium",
  },
  {
    id: 2,
    name: "Marie Martin",
    email: "marie@example.com",
    status: "active",
    createdAt: "2024-01-20",
    subscription: "free",
  },
  {
    id: 3,
    name: "Pierre Durand",
    email: "pierre@example.com",
    status: "banned",
    createdAt: "2024-01-10",
    subscription: "free",
  },
  {
    id: 4,
    name: "Sophie Leroy",
    email: "sophie@example.com",
    status: "active",
    createdAt: "2024-01-25",
    subscription: "premium",
  },
]

const mockExperiences = [
  {
    id: 1,
    author: "Jean Dupont",
    university: "Sorbonne",
    specialty: "Économie",
    status: "pending",
    createdAt: "2024-01-28",
    comment: "Excellente expérience à la Sorbonne, très bon encadrement...",
  },
  {
    id: 2,
    author: "Marie Martin",
    university: "Sciences Po",
    specialty: "Sciences Politiques",
    status: "approved",
    createdAt: "2024-01-27",
    comment: "Formation exigeante mais très enrichissante...",
  },
  {
    id: 3,
    author: "Anonyme",
    university: "HEC",
    specialty: "Management",
    status: "rejected",
    createdAt: "2024-01-26",
    comment: "Contenu inapproprié détecté...",
  },
]

export default function AdminPage() {
  const [users, setUsers] = useState(mockUsers)
  const [experiences, setExperiences] = useState(mockExperiences)
  const [searchTerm, setSearchTerm] = useState("")
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 1156,
    premiumUsers: 342,
    totalExperiences: 856,
    pendingExperiences: 23,
    approvedExperiences: 798,
  })

  const handleUserAction = (userId: number, action: string) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status: action === "ban" ? "banned" : "active" } : user)),
    )
  }

  const handleExperienceAction = (expId: number, action: string) => {
    setExperiences((prev) => prev.map((exp) => (exp.id === expId ? { ...exp, status: action } : exp)))
  }

  const exportData = () => {
    // Simulation d'export CSV
    const csvData = users
      .map((user) => `${user.name},${user.email},${user.status},${user.subscription},${user.createdAt}`)
      .join("\n")

    const blob = new Blob([csvData], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "pathwayfr-users.csv"
    a.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation harmonisée */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo variant="compact" />
          </Link>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Shield className="w-3 h-3 mr-1" />
              Administrateur
            </Badge>
            <Button variant="outline" className="border-blue-700 text-blue-700 bg-transparent hover:bg-blue-50">
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-slate-600">Gérez les utilisateurs, modérez les contenus et consultez les statistiques</p>
        </div>

        {/* Statistiques globales */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs Total</p>
                  <p className="text-3xl font-bold text-blue-800">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +12% ce mois
                  </p>
                </div>
                <Users className="h-12 w-12 text-blue-800" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Utilisateurs Premium</p>
                  <p className="text-3xl font-bold text-green-600">{stats.premiumUsers}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +8% ce mois
                  </p>
                </div>
                <Shield className="h-12 w-12 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Expériences Partagées</p>
                  <p className="text-3xl font-bold text-blue-700">{stats.totalExperiences}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {stats.pendingExperiences} en attente
                  </p>
                </div>
                <BarChart3 className="h-12 w-12 text-blue-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="users" className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Expériences
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center">
              <BarChart3 className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          {/* Gestion des utilisateurs */}
          <TabsContent value="users">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-800">Gestion des Utilisateurs</CardTitle>
                    <CardDescription>Gérez les comptes utilisateurs et leurs abonnements</CardDescription>
                  </div>
                  <Button
                    onClick={exportData}
                    variant="outline"
                    className="border-blue-800 text-blue-800 bg-transparent"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Exporter CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher un utilisateur..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {users
                    .filter(
                      (user) =>
                        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg border-gray-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-800" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">{user.name}</div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">Inscrit le {user.createdAt}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={user.subscription === "premium" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}>
                            {user.subscription === "premium" ? "Premium" : "Gratuit"}
                          </Badge>
                          <Badge className={user.status === "active" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600"}>
                            {user.status === "active" ? "Actif" : "Banni"}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id, user.status === "active" ? "ban" : "unban")}
                            className={
                              user.status === "active"
                                ? "border-blue-200 text-blue-700 hover:bg-blue-50"
                                : "border-slate-200 text-slate-600 hover:bg-slate-50"
                            }
                          >
                            {user.status === "active" ? "Bannir" : "Débannir"}
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modération des expériences */}
          <TabsContent value="experiences">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800">Modération des Expériences</CardTitle>
                <CardDescription>Validez ou rejetez les témoignages partagés par les utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="border rounded-lg p-4 border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-800">{exp.author}</div>
                          <div className="text-sm text-gray-600">
                            {exp.university} - {exp.specialty}
                          </div>
                          <div className="text-xs text-gray-500">Publié le {exp.createdAt}</div>
                        </div>
                        <Badge
                          variant={
                            exp.status === "approved"
                              ? "default"
                              : exp.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {exp.status === "approved" ? "Approuvé" : exp.status === "pending" ? "En attente" : "Rejeté"}
                        </Badge>
                      </div>

                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-sm text-gray-700">{exp.comment}</p>
                      </div>

                      {exp.status === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleExperienceAction(exp.id, "approved")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleExperienceAction(exp.id, "rejected")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Détails
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistiques détaillées */}
          <TabsContent value="stats">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Activité Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Utilisateurs actifs</span>
                      <span className="font-semibold text-blue-800">{stats.activeUsers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nouveaux utilisateurs (30j)</span>
                      <span className="font-semibold text-green-600">+156</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux de conversion Premium</span>
                      <span className="font-semibold text-orange-600">27.4%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Utilisateurs bannis</span>
                      <span className="font-semibold text-red-600">12</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-600">Contenu Généré</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expériences approuvées</span>
                      <span className="font-semibold text-green-600">{stats.approvedExperiences}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En attente de modération</span>
                      <span className="font-semibold text-orange-600">{stats.pendingExperiences}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expériences rejetées</span>
                      <span className="font-semibold text-red-600">35</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux d'approbation</span>
                      <span className="font-semibold text-blue-800">93.2%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Alert className="mt-6 border-blue-200 bg-blue-50">
              <BarChart3 className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Rapport mensuel :</strong>
                <br />
                La plateforme connaît une croissance constante avec +12% d'utilisateurs ce mois. Le taux d'engagement
                est excellent avec 93.2% d'expériences approuvées et une communauté active qui contribue régulièrement
                au contenu.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
