"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/ui/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setMessage("")
  setError("")

  try {
    const res = await fetch("http://127.0.0.1:5000/auth/forgot_password/sendmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    if (res.ok) {
      setMessage("Si cet email existe, un lien de réinitialisation a été envoyé. Vérifiez votre boîte de réception.")
    } else {
      setError(data.error || "Erreur lors de la demande.")
    }
  } catch (err) {
    setError("Erreur réseau. Veuillez réessayer.")
  } finally {
    setLoading(false)
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
            <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">Réinitialisation</h1>
            <p className="text-gray-600 text-sm">Recevez un lien pour réinitialiser votre mot de passe</p>
          </div>

          <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-blue-700">Mot de passe oublié</CardTitle>
              <CardDescription>Entrez votre email pour recevoir un lien</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jean.dupont@example.com"
                      required
                      className="pl-10 border-blue-200 focus:border-blue-800"
                    />
                  </div>
                </div>

                {message && <p className="text-sm text-green-600">{message}</p>}
                {error && <p className="text-sm text-red-600">{error}</p>}

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le lien"}
                </Button>
              </form>

              <Separator className="my-6" />

              <div className="mt-2 text-center text-sm text-gray-600">
                Vous vous souvenez de votre mot de passe ?{" "}
                <Link href="/auth/login" className="text-blue-800 hover:underline font-semibold">
                  Se connecter
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
