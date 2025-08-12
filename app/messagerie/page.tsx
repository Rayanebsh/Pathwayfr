"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Logo } from "@/components/ui/logo"
import { MessageCircle, Send, Search, Users, Crown, Lock, Plus, Filter, Sparkles } from "lucide-react"

// Mock data pour les conversations
const mockConversations = [
  {
    id: 1,
    title: "Admission Sciences Po 2024",
    participants: ["Jean Dupont", "Marie Martin", "Pierre Durand"],
    lastMessage: "Merci pour vos conseils, très utile !",
    lastMessageTime: "Il y a 2h",
    unreadCount: 3,
    category: "admission",
  },
  {
    id: 2,
    title: "Groupe Économie Sorbonne",
    participants: ["Sophie Leroy", "Antoine Moreau", "Camille Dubois"],
    lastMessage: "Quelqu'un a des infos sur les prérequis ?",
    lastMessageTime: "Il y a 5h",
    unreadCount: 0,
    category: "etudes",
  },
  {
    id: 3,
    title: "Entraide Master HEC",
    participants: ["Lucas Bernard", "Emma Rousseau"],
    lastMessage: "Je peux partager mon dossier de candidature",
    lastMessageTime: "Hier",
    unreadCount: 1,
    category: "entraide",
  },
]

const mockMessages = [
  {
    id: 1,
    author: "Jean Dupont",
    content:
      "Salut tout le monde ! J'ai une question sur les critères d'admission à Sciences Po. Est-ce que quelqu'un a des retours d'expérience ?",
    timestamp: "14:30",
    isOwn: false,
  },
  {
    id: 2,
    author: "Marie Martin",
    content:
      "Salut Jean ! J'ai été acceptée l'année dernière. Les notes sont importantes mais ils regardent aussi beaucoup le projet professionnel et les activités extra-scolaires.",
    timestamp: "14:35",
    isOwn: false,
  },
  {
    id: 3,
    author: "Vous",
    content: "Merci Marie ! Est-ce que tu peux nous en dire plus sur l'entretien de motivation ?",
    timestamp: "14:40",
    isOwn: true,
  },
  {
    id: 4,
    author: "Pierre Durand",
    content:
      "L'entretien dure environ 20 minutes. Ils posent des questions sur ton parcours, tes motivations et l'actualité. Il faut bien se préparer !",
    timestamp: "14:45",
    isOwn: false,
  },
]

export default function MessageriePage() {
  const [selectedConversation, setSelectedConversation] = useState(1)
  const [newMessage, setNewMessage] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isPremium, setIsPremium] = useState(false)

  // Vérifier si l'utilisateur est premium
  useEffect(() => {
    // Simulation - en réalité on vérifierait l'abonnement
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    setIsPremium(user.subscription === "premium")
  }, [])

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Ici on enverrait le message
      console.log("Envoi du message:", newMessage)
      setNewMessage("")
    }
  }

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/">
              <Logo variant="compact" />
            </Link>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="/explorer" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Explorer
              </Link>
              <Link href="/simulateur" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Simulateur
              </Link>
              <Link href="/partager" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
                Partager
              </Link>
              <Link href="/messagerie" className="text-blue-600 font-semibold">
                Messagerie
              </Link>
              <Button variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                Mon Profil
              </Button>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="h-12 w-12 text-slate-600" />
              </div>
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
                Messagerie Premium
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                La messagerie communautaire est réservée aux membres Premium. Échangez avec d'autres étudiants et
                partagez vos expériences.
              </p>
            </div>

            <Alert className="mb-8 border-blue-200 bg-blue-50">
              <Crown className="h-4 w-4" />
              <AlertDescription className="text-blue-800">
                <strong>Avec Premium, vous pouvez :</strong>
                <br />• Participer aux discussions communautaires
                <br />• Créer des groupes d'entraide
                <br />• Recevoir des conseils personnalisés
                <br />• Accéder aux retours d'expérience exclusifs
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-4 shadow-lg"
              >
                <Crown className="mr-2 h-5 w-5" />
                Passer à Premium - 29€/mois
              </Button>
              <div className="text-slate-600">
                <Link href="/" className="text-blue-600 hover:underline font-semibold">
                  Retour à l'accueil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Logo variant="compact" />
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/explorer" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Explorer
            </Link>
            <Link href="/simulateur" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Simulateur
            </Link>
            <Link href="/partager" className="text-slate-700 hover:text-blue-600 transition-colors font-medium">
              Partager
            </Link>
            <Link href="/messagerie" className="text-blue-600 font-semibold">
              Messagerie
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-blue-600 text-blue-600 bg-transparent">
                Mon Profil
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Communauté Premium
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent">
            Messagerie Communautaire
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg">
            Échangez avec d'autres étudiants, partagez vos expériences et recevez des conseils personnalisés
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
          {/* Liste des conversations */}
          <Card className="border-blue-200 lg:col-span-1 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-700 flex items-center">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Conversations
                </CardTitle>
                <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <CardDescription>Échangez avec la communauté PathwayFR</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-blue-200"
                  />
                </div>
              </div>

              <div className="max-h-[500px] overflow-y-auto">
                {mockConversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv.id)}
                    className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition-colors ${
                      selectedConversation === conv.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-slate-800 text-sm">{conv.title}</h4>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-blue-600 text-white text-xs">{conv.unreadCount}</Badge>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mb-2 line-clamp-2">{conv.lastMessage}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Users className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{conv.participants.length}</span>
                      </div>
                      <span className="text-xs text-slate-500">{conv.lastMessageTime}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Zone de conversation */}
          <Card className="border-blue-200 lg:col-span-2 flex flex-col bg-white/80 backdrop-blur-sm shadow-lg">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-700">
                    {mockConversations.find((c) => c.id === selectedConversation)?.title}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {mockConversations.find((c) => c.id === selectedConversation)?.participants.join(", ")}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" className="border-blue-200 bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {mockMessages.map((message) => (
                  <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] ${message.isOwn ? "order-2" : "order-1"}`}>
                      {!message.isOwn && (
                        <div className="flex items-center space-x-2 mb-2">
                          <Avatar className="w-7 h-7">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-700">
                              {message.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-semibold text-slate-700">{message.author}</span>
                          <span className="text-xs text-slate-500">{message.timestamp}</span>
                        </div>
                      )}
                      <div
                        className={`p-4 rounded-xl ${
                          message.isOwn
                            ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.isOwn && <p className="text-xs text-blue-100 mt-2 text-right">{message.timestamp}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="border-t bg-slate-50 p-4">
                <div className="flex space-x-3">
                  <Textarea
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 min-h-[60px] border-blue-200 focus:border-blue-600 resize-none bg-white"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 self-end px-6"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Appuyez sur Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
