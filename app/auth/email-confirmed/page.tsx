"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function EmailConfirmedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold text-green-600">Vérification réussie !</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base text-gray-700 mb-6">Votre adresse email a bien été vérifiée.<br />Vous pouvez maintenant accéder à votre compte.</p>
            <Button asChild className="w-full bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700">
              <Link href="/auth/login">Aller à la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
