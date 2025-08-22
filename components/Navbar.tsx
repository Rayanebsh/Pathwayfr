"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  type User = {
    firstName?: string
    lastName?: string
    email?: string
    [key: string]: any
  }
  const [user, setUser] = useState<User | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const checkAuthStatus = () => {
      if (typeof window !== "undefined") {
        // Vérifier le token d'accès plutôt que les données utilisateur
        const accessToken = localStorage.getItem("access_token")
        const userData = localStorage.getItem("user")
        
        if (accessToken && userData) {
          setIsLoggedIn(true)
          setUser(JSON.parse(userData))
          
          // Vérifie le statut premium dans le profil
          const profileData = localStorage.getItem("userProfile")
          if (profileData) {
            const profile = JSON.parse(profileData)
            setIsPremium(!!profile.hasPremium)
          } else {
            setIsPremium(false)
          }
        } else {
          setIsLoggedIn(false)
          setUser(null)
          setIsPremium(false)
        }
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    // Écouter les changements dans localStorage
    const handleStorageChange = () => {
      checkAuthStatus()
    }

    window.addEventListener('storage', handleStorageChange)
    // Écouter aussi les événements personnalisés pour les changements locaux
    window.addEventListener('authStatusChanged', handleStorageChange)

    // Fermer le dropdown au clic extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStatusChanged', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    // Supprimer tous les tokens et données utilisateur
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
    localStorage.removeItem("user")
    localStorage.removeItem("userProfile")
    
    setIsLoggedIn(false)
    setUser(null)
    setIsPremium(false)
    setShowDropdown(false)
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('authStatusChanged'))
    
    router.push("/")
  }

  // Fonction utilitaire pour le style actif
  const navLinkClass = (href: string) =>
    `text-slate-700 hover:text-blue-600 transition-colors font-medium px-2 py-1 rounded ${pathname === href ? "bg-blue-100 text-blue-700" : ""}`

  // Afficher un loading pendant la vérification de l'auth
  if (isLoading) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/explorer" className={navLinkClass("/explorer")}>Explorer</Link>
          {isLoggedIn && (
            <Link href="/simulateur" className={navLinkClass("/simulateur")}>Simulateur</Link>
          )}
          <Link href="/partager" className={navLinkClass("/partager")}>Partager</Link>
          {isLoggedIn && isPremium && (
            <Link href="/messagerie" className={navLinkClass("/messagerie")}>Messagerie</Link>
          )}
          {isLoggedIn ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-blue-100 transition-colors"
                onClick={() => setShowDropdown((v) => !v)}
              >
                {user?.firstName && (
                  <span className="font-semibold text-blue-700">Bienvenue, {user.firstName}</span>
                )}
                {/* Avatar possible ici */}
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="rounded-full bg-blue-200">
                  <circle cx="16" cy="16" r="16" fill="#3B82F6" />
                  <text x="50%" y="55%" textAnchor="middle" fill="white" fontSize="16" fontFamily="Arial" dy=".3em">
                    {user?.firstName ? user.firstName[0].toUpperCase() : "U"}
                  </text>
                </svg>
                <svg className="ml-1 w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-blue-100 rounded shadow-lg z-50 animate-fade-in">
                  <Link href="/profile" className="block px-4 py-2 text-slate-700 hover:bg-blue-50 transition-colors">
                    Voir profil
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50 transition-colors"
                  >
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent transition-all">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all">
                  S'inscrire
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}