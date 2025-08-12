import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-blue-700">Confirmez votre inscription</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-blue-200 bg-blue-50 mb-6">
              <AlertDescription className="text-blue-800 text-base">
                Un email de confirmation vous a été envoyé.<br />
                Veuillez vérifier votre boîte mail pour activer votre compte PathwayFR.
              </AlertDescription>
            </Alert>
            <div className="text-center text-sm text-gray-600">
              <Link href="/auth/login" className="text-blue-800 hover:underline font-semibold">
                Se connecter
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
