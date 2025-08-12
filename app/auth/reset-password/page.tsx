"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/ui/logo"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    if (!password || !confirm) {
      setError("Veuillez remplir les deux champs.")
      return
    }
    if (password !== confirm) {
      setError("Les mots de passe ne correspondent pas.")
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`http://127.0.0.1:5000/auth/forgot-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Erreur inconnue.")
      } else {
        setSuccess("Mot de passe modifié avec succès !")
        setTimeout(() => {
          router.push("/auth/password-reset-success")
        }, 1200)
      }
    } catch (err) {
      setError("Erreur réseau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold text-blue-700">Nouveau mot de passe</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmez le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}
              <Button type="submit" className="w-full bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700" disabled={loading}>
                {loading ? "Réinitialisation..." : "Réinitialiser"}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-gray-600">
              <Link href="/auth/login" className="text-blue-800 hover:underline font-semibold">
                Retour à la connexion
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
