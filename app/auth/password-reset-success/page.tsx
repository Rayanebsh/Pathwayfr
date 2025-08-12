"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function PasswordResetSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <Logo className="mx-auto mb-2" />
            <CardTitle className="text-2xl font-bold text-blue-700">Mot de passe modifié</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-base text-gray-700 mb-6">Votre mot de passe a été modifié avec succès.<br />Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
            <Button asChild className="w-full bg-gradient-to-r from-blue-800 to-red-600 hover:from-blue-900 hover:to-red-700">
              <Link href="/auth/login">Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
