"use client"

import { useEffect, useState } from "react"
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

interface User {
  id_user: number
  first_name: string
  last_name: string
  email: string
  created_at: string
  isbanned: boolean
  subscription: boolean
}

interface Experience {
  id_experience: number
  user_id: number
  first_name: string
  last_name: string
  comment: string
  is_validated: "pending" | "approved" | "rejected"
  created_at?: string
}

interface Stats {
  total_users: number
  active_users: number
  premium_users: number
  total_experiences: number
  pending_experiences: number
  approved_experiences: number
  rejected_experiences: number
  taux_conversion: number
  taux_approbation: number
  banned_users_count: number
  new_users_last_30_days: number
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // 1️⃣ Vérifier que le composant est monté côté client
  useEffect(() => {
    setMounted(true)
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token")
      console.log("Token récupéré:", storedToken) // Debug
      if (storedToken) {
        setToken(storedToken)
      } else {
        setError("Aucun token trouvé. Veuillez vous connecter.")
        setLoading(false)
      }
    }
  }, [])

  // 2️⃣ Charger les données uniquement quand token est dispo
  useEffect(() => {
    if (!token || !mounted) return

    const fetchData = async () => {
      setLoading(true)
      setError(null)
      
      try {
        console.log("Début des appels API...") // Debug
        
        // Appels API séquentiels pour debug
        const usersRes = await fetch("http://127.0.0.1:5000/admin/stats/users", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
        
        console.log("Réponse users:", usersRes.status, usersRes.statusText) // Debug
        
        if (!usersRes.ok) {
          throw new Error(`Erreur users API: ${usersRes.status} ${usersRes.statusText}`)
        }
        
        const usersData = await usersRes.json()
        console.log("Données users:", usersData) // Debug
        setUsers(usersData)

        const statsRes = await fetch("http://127.0.0.1:5000/admin/all_stats", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
        
        console.log("Réponse stats:", statsRes.status, statsRes.statusText) // Debug
        
        if (!statsRes.ok) {
          throw new Error(`Erreur stats API: ${statsRes.status} ${statsRes.statusText}`)
        }
        
        const statsData = await statsRes.json()
        console.log("Données stats:", statsData) // Debug
        setStats(statsData)

        const expRes = await fetch("http://127.0.0.1:5000/experience/summary", {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        })
        
        console.log("Réponse experiences:", expRes.status, expRes.statusText) // Debug
        
        if (!expRes.ok) {
          throw new Error(`Erreur experiences API: ${expRes.status} ${expRes.statusText}`)
        }
        
        const expData = await expRes.json()
        console.log("Données experiences:", expData) // Debug
        setExperiences(expData)
        
      } catch (err) {
        console.error("Erreur lors du chargement:", err)
        setError(err instanceof Error ? err.message : "Erreur inconnue")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [token, mounted])

  // 3️⃣ Actions utilisateurs avec meilleur error handling
const handleUserAction = async (id: number, action: "ban" | "unban") => {
  try {
    const response = await fetch(`http://localhost:5000/admin/users/${id}/${action}`, {
      method: "PATCH", // très important: PATCH car ton backend attend PATCH
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();
    console.log("Réponse serveur:", data);

    if (!response.ok) throw new Error(data.error || "Erreur lors de l’action");

    // Mise à jour immédiate de l’état local
    setUsers((prev) =>
      prev.map((u) =>
        u.id_user === id ? { ...u, isbanned: action === "ban" } : u
      )
    );

  } catch (error) {
    console.error(error);
  }
};



  // 4️⃣ Actions expériences avec meilleur error handling
  const handleExperienceAction = async (id: number, action: "approve" | "reject") => {
    if (!token) {
      setError("Token manquant")
      return
    }

    try {
      console.log(`Action ${action} sur expérience ${id}`) // Debug
      
      const res = await fetch(`http://127.0.0.1:5000/admin/experiences/${id}/${action}`, {
        method: "PATCH",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      })

      console.log(`Réponse ${action}:`, res.status, res.statusText) // Debug

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Erreur ${action}: ${res.status} - ${errorText}`)
      }

      // Mise à jour optimiste
      setExperiences((prev) =>
        prev.map((exp) =>
          exp.id_experience === id
            ? { ...exp, is_validated: action === "approve" ? "approved" : "rejected" }
            : exp
        )
      )
      
      console.log(`Expérience ${id} ${action === "approve" ? "approuvée" : "rejetée"} avec succès`) // Debug
      
    } catch (err) {
      console.error(`Erreur modération:`, err)
      setError(err instanceof Error ? err.message : `Erreur lors de la modération`)
    }
  }

  const exportData = () => {
    if (!users.length) {
      setError("Aucune donnée à exporter")
      return
    }

    try {
      const csvData = "Prénom,Nom,Email,Banni,Premium,Date création\n" +
        users
          .map((user) => `${user.first_name},${user.last_name},${user.email},${user.isbanned},${user.subscription},${user.created_at}`)
          .join("\n")

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `pathwayfr-users-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      console.log("Export CSV réussi") // Debug
    } catch (err) {
      console.error("Erreur export:", err)
      setError("Erreur lors de l'export")
    }
  }

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
      // Redirection vers la page de login
      window.location.href = "/login"
    }
  }

  // 5️⃣ États d'attente et d'erreur
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Initialisation...</p>
      </div>
    )
  }

  const handleDeleteUser = async (id: number) => {
  if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

  try {
    const res = await fetch(`http://127.0.0.1:5000/admin/delete/${id}`, {
    method: "DELETE",
    headers: {
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
});

  const text = await res.text(); // ⚡️ voir la vraie réponse
  console.log("Status:", res.status, "Response:", text);

  let data;
  try {
    data = JSON.parse(text); 
  } catch {
   throw new Error("La réponse n’est pas du JSON");
  }


    if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");

    // Mise à jour locale
    setUsers((prev) => prev.filter((u) => u.id_user !== id));
  } catch (err) {
    console.error(err);
    setError(err instanceof Error ? err.message : "Erreur suppression utilisateur");
  }
};

// Supprimer expérience
const handleDeleteExperience = async (id: number) => {
  if (!confirm("Voulez-vous vraiment supprimer cette expérience ?")) return;

  try {
    const res = await fetch(`http://127.0.0.1:5000/admin/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();
    console.log("Delete experience:", data);

    if (!res.ok) throw new Error(data.error || "Erreur lors de la suppression");

    // Mise à jour locale
    setExperiences((prev) => prev.filter((exp) => exp.id_experience !== id));
  } catch (err) {
    console.error(err);
    setError(err instanceof Error ? err.message : "Erreur suppression expérience");
  }
};


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md border-red-200 bg-red-50">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            <strong>Erreur:</strong> {error}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={() => window.location.reload()}
            >
              Recharger
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Chargement des données...</p>
        </div>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md border-orange-200 bg-orange-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-orange-800">
            Aucun token trouvé. Veuillez vous connecter.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4"
              onClick={() => window.location.href = "/login"}
            >
              Se connecter
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
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
            <Button 
              variant="outline" 
              className="border-blue-700 text-blue-700 bg-transparent hover:bg-blue-50"
              onClick={handleLogout}
            >
              Déconnexion
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Affichage des erreurs en haut */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-4"
                onClick={() => setError(null)}
              >
                Fermer
              </Button>
            </AlertDescription>
          </Alert>
        )}

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
                  <p className="text-3xl font-bold text-blue-800">{stats?.total_users?.toLocaleString() || 0}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +{stats?.new_users_last_30_days || 0} ce mois
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
                  <p className="text-3xl font-bold text-green-600">{stats?.premium_users || 0}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {stats?.taux_conversion?.toFixed(1) || 0}% conversion
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
                  <p className="text-3xl font-bold text-blue-700">{stats?.total_experiences || 0}</p>
                  <p className="text-sm text-blue-600 flex items-center mt-1">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    {stats?.pending_experiences || 0} en attente
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
              Utilisateurs ({users.length})
            </TabsTrigger>
            <TabsTrigger value="experiences" className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-2" />
              Expériences ({experiences.length})
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
                    disabled={!users.length}
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
                        user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((user) => (
                      <div
                        key={user.id_user}
                        className="flex items-center justify-between p-4 border rounded-lg border-gray-200"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-800" />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {user.first_name} {user.last_name}
                            </div>
                            <div className="text-sm text-gray-600">{user.email}</div>
                            <div className="text-xs text-gray-500">
                              Inscrit le {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={
                              user.subscription
                                ? "bg-blue-100 text-blue-700"
                                : "bg-slate-100 text-slate-600"
                            }
                          >
                            {user.subscription ? "Premium" : "Gratuit"}
                          </Badge>
                          <Badge
                            className={
                              user.isbanned
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }
                          >
                            {user.isbanned ? "Banni" : "Actif"}
                          </Badge>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUserAction(user.id_user, user.isbanned ? "unban" : "ban")}
                            className={
                              user.isbanned
                                ? "border-green-200 text-green-700 hover:bg-green-50"
                                : "border-red-200 text-red-700 hover:bg-red-50"
                            }
                          >
                            {user.isbanned ? "Débannir" : "Bannir"}
                          </Button>
                          <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id_user)}
                        >
                          Supprimer
                        </Button>
                        </div>
                      </div>
                    ))}

                  {users.filter(
                    (user) =>
                      user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
                  ).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {searchTerm ? "Aucun utilisateur trouvé" : "Aucun utilisateur"}
                    </div>
                  )}
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
                    <div key={exp.id_experience} className="border rounded-lg p-4 border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="font-semibold text-gray-800">{exp.first_name}{exp.last_name}</div>
                          <div className="text-sm text-gray-600">
                            {exp.comment}
                          </div>
          
                        </div>
                        <Badge
                          variant={
                            exp.is_validated === "approved"
                              ? "default"
                              : exp.is_validated === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {exp.is_validated === "approved" 
                            ? "Approuvé" 
                            : exp.is_validated === "pending" 
                              ? "En attente" 
                              : "Rejeté"
                          }
                        </Badge>
                      </div>

                    

                      {exp.is_validated === "pending" && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleExperienceAction(exp.id_experience, "approve")}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approuver
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleExperienceAction(exp.id_experience, "reject")}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Rejeter
                          </Button>
                        </div>
                      )}
                      <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteExperience(exp.id_experience)}
                    >
                      Supprimer
                    </Button>
                    </div>
                  ))}

                  {experiences.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Aucune expérience à modérer
                    </div>
                  )}
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
                      <span className="font-semibold text-blue-800">{stats?.active_users || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nouveaux utilisateurs (30j)</span>
                      <span className="font-semibold text-green-600">+{stats?.new_users_last_30_days || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux de conversion Premium</span>
                      <span className="font-semibold text-orange-600">{stats?.taux_conversion?.toFixed(1) || 0}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Utilisateurs bannis</span>
                      <span className="font-semibold text-red-600">{stats?.banned_users_count || 0}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-800">Contenu Généré</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expériences approuvées</span>
                      <span className="font-semibold text-green-600">{stats?.approved_experiences || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">En attente de modération</span>
                      <span className="font-semibold text-orange-600">{stats?.pending_experiences || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Expériences rejetées</span>
                      <span className="font-semibold text-red-600">{stats?.rejected_experiences || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Taux d'approbation</span>
                      <span className="font-semibold text-blue-800">{stats?.taux_approbation?.toFixed(1) || 0}%</span>
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
                La plateforme compte {stats?.total_users || 0} utilisateurs avec {stats?.premium_users || 0} abonnés premium. 
                {stats?.pending_experiences || 0} expériences sont en attente de modération sur un total de {stats?.total_experiences || 0}.
              </AlertDescription>
            </Alert>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}