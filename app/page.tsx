import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { BarChart3, Users, Target, Crown, Sparkles } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Plateforme d'orientation universitaire française
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-700 to-blue-800 bg-clip-text text-transparent leading-tight">
            Votre Avenir Universitaire
            <br />
            <span className="text-blue-600">Commence Ici</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            Découvrez les meilleures universités françaises adaptées à votre profil. Explorez les données, simulez vos
            chances et partagez votre expérience avec notre communauté d'étudiants.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/simulateur">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
              >
                <Target className="mr-2 h-5 w-5" />
                Simuler mes chances
              </Button>
            </Link>
            <Link href="/explorer">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white text-lg px-8 py-4 bg-white/80 backdrop-blur-sm"
              >
                <BarChart3 className="mr-2 h-5 w-5" />
                Explorer les données
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">Pourquoi choisir PathwayFR ?</h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Une plateforme complète pour vous accompagner dans votre parcours universitaire
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700 text-xl">Données Précises</CardTitle>
              <CardDescription className="text-slate-600">
                Accédez aux statistiques d'admission les plus récentes et fiables de toutes les universités françaises
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <CardTitle className="text-indigo-700 text-xl">Simulation Intelligente</CardTitle>
              <CardDescription className="text-slate-600">
                Notre IA analyse votre profil pour vous recommander les meilleures universités selon vos critères
              </CardDescription>
            </CardHeader>
          </Card>
          <Card className="border-blue-200 hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700 text-xl">Communauté Active</CardTitle>
              <CardDescription className="text-slate-600">
                Partagez et découvrez les expériences d'autres étudiants dans notre messagerie communautaire
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">PathwayFR en chiffres</h2>
            <p className="text-blue-100 text-lg">La confiance de milliers d'étudiants</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100">Étudiants accompagnés</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Universités partenaires</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2,500+</div>
              <div className="text-blue-100">Témoignages partagés</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-slate-800">Choisissez votre formule</h2>
          <p className="text-xl text-slate-600">Des options adaptées à tous les besoins</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="border-slate-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-slate-800">Gratuit</CardTitle>
                <div className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm">Découverte</div>
              </div>
              <CardDescription>Pour commencer votre recherche</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-6 text-slate-800">0€</div>
              <ul className="space-y-3 text-slate-600 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Accès limité aux graphiques
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Simulateur basique
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  Pas de messagerie
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-slate-300 rounded-full mr-3"></div>
                  Support limité
                </li>
              </ul>
              <Button className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200" variant="outline">
                Commencer gratuitement
              </Button>
            </CardContent>
          </Card>
          <Card className="border-blue-600 relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
            <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-blue-700 text-white px-4 py-1 text-sm font-medium">
              Recommandé
            </div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-blue-700 flex items-center">
                  <Crown className="mr-2 h-6 w-6" />
                  Premium
                </CardTitle>
                <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Complet</div>
              </div>
              <CardDescription>Pour maximiser vos chances</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-blue-700">
                29€<span className="text-lg text-slate-600">/mois</span>
              </div>
              <div className="text-sm text-slate-500 mb-6">Annulable à tout moment</div>
              <ul className="space-y-3 text-slate-600 mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Accès complet aux statistiques
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Simulateur avancé avec IA
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Messagerie communautaire
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Support prioritaire
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  Analyses personnalisées
                </li>
              </ul>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                Passer à Premium
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Prêt à découvrir votre université idéale ?</h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'étudiants qui ont trouvé leur voie grâce à PathwayFR
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4">
                Créer mon compte gratuitement
              </Button>
            </Link>
            <Link href="/explorer">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 text-slate-300 hover:bg-slate-700 hover:text-white text-lg px-8 py-4 bg-transparent"
              >
                Découvrir la plateforme
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Logo className="mb-4" />
              <p className="text-slate-400 mb-4">Votre partenaire pour réussir vos études universitaires en France.</p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Plateforme</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="/explorer" className="hover:text-white transition-colors">
                    Explorer
                  </Link>
                </li>
                <li>
                  <Link href="/simulateur" className="hover:text-white transition-colors">
                    Simulateur
                  </Link>
                </li>
                <li>
                  <Link href="/partager" className="hover:text-white transition-colors">
                    Partager
                  </Link>
                </li>
                <li>
                  <Link href="/messagerie" className="hover:text-white transition-colors">
                    Messagerie
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Centre d'aide
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Conditions d'utilisation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Politique de confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
            <p>&copy; 2024 PathwayFR. Tous droits réservés.</p>
            <p className="mt-2">Votre réussite universitaire, notre mission.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
