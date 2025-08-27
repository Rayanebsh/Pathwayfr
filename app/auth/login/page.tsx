"use client"

import type React from "react"

import { useState } from "react"
import { useAuthToken } from "@/hooks/useAuthToken"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import Navbar from "@/components/Navbar"
import { Logo } from "@/components/ui/logo"

export default function LoginPage() {
  const router = useRouter()
  const { setTokens } = useAuthToken()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})

    // Validation simple
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = "L'email est requis"
    if (!formData.password) newErrors.password = "Le mot de passe est requis"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la connexion.")
      }

      // Stocke les tokens JWT ET les données utilisateur
      setTokens({ accessToken: data.access_token, refreshToken: data.refresh_token })
      
      // Stocker les données utilisateur
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      // Déclencher l'événement de changement d'auth pour mettre à jour la navbar
      window.dispatchEvent(new Event('authStatusChanged'))

      // Vérifier si l'utilisateur a déjà complété son profil
      const token = data.access_token
      
      try {
        // Utiliser le nouvel endpoint qui vérifie directement dans la BD
        const profileStatusResponse = await fetch("http://127.0.0.1:5000/users/profile/status", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (profileStatusResponse.ok) {
          const statusData = await profileStatusResponse.json()
          console.log("Status du profil:", statusData)
          
          if (statusData.is_complete) {
            console.log("Profil complet, redirection vers explorer")
            // Récupérer les données complètes du profil si nécessaire
            if (statusData.profile_data) {
              localStorage.setItem("userProfile", JSON.stringify(statusData.profile_data))
            }
            setIsLoading(false)
            router.push("/explorer")
          } else {
            console.log("Profil incomplet, champs manquants:", statusData.missing_fields)
            setIsLoading(false)
            router.push("/profile/setup")
          }
        } else {
          console.log("Erreur lors de la vérification du status, redirection vers setup")
          setIsLoading(false)
          router.push("/profile/setup")
        }
      } catch (profileError) {
        console.log("Erreur lors de la vérification du profil, redirection vers setup")
        setIsLoading(false)
        router.push("/profile/setup")
      }

    } catch (err: any) {
      setIsLoading(false)
      setErrors({ global: err.message })
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
    if (errors[e.target.name]) {
      setErrors((prev) => ({
        ...prev,
        [e.target.name]: "",
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Logo variant="compact" />
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[80vh]">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">Connexion à PathwayFR</h1>
          </div>
          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-700">Se connecter</CardTitle>
              <CardDescription>Accédez à votre compte PathwayFR</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Affichage des erreurs globales */}
              {errors.global && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {errors.global}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="jean.dupont@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={`pl-10 border-blue-200 focus:border-blue-800 ${errors.email ? "border-red-500" : ""}`}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">
                    Mot de passe
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      className={`pl-10 pr-10 border-blue-200 focus:border-blue-800 ${errors.password ? "border-red-500" : ""}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-blue-200" />
                    <Label htmlFor="remember" className="text-sm text-gray-600">
                      Se souvenir de moi
                    </Label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-blue-800 hover:underline">
                    Mot de passe oublié ?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Connexion en cours..." : "Se connecter"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="space-y-4">
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 bg-transparent">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continuer avec Google
                </Button>
                <Button variant="outline" className="w-full border-blue-200 hover:bg-blue-50 bg-transparent">
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Continuer avec Facebook
                </Button>
              </div>

              <div className="mt-6 text-center text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-blue-800 hover:underline font-semibold">
                  S'inscrire
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}