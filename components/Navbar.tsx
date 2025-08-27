"use client"

import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Shield, Settings, LogOut, Menu, X, Crown } from "lucide-react"

// Types
interface User {
  first_name: string
  last_name: string
  email: string
  role: string
  [key: string]: any
}

interface AuthState {
  isLoggedIn: boolean
  user: User | null
  isPremium: boolean
  isAdmin: boolean
}

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
    user: null,
    isPremium: false,
    isAdmin: false
  })
  const [showDropdown, setShowDropdown] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fonction pour mettre à jour l'état d'authentification
  const updateAuthState = useCallback((updates: Partial<AuthState>) => {
    setAuthState(prev => ({ ...prev, ...updates }))
  }, [])

  // Vérification du statut d'authentification
  const checkAuthStatus = useCallback(() => {
    if (typeof window === "undefined") return

    const accessToken = localStorage.getItem("access_token")
    const userData = localStorage.getItem("user")
    
    console.log("Checking auth status:", { accessToken: !!accessToken, userData: !!userData })
    
    if (!accessToken) {
      console.log("No access token found, user not logged in")
      updateAuthState({
        isLoggedIn: false,
        user: null,
        isPremium: false,
        isAdmin: false
      })
      // Nettoyer les tokens synchronisés
      localStorage.removeItem("token")
      setIsLoading(false)
      return
    }

    // Synchroniser les tokens (compatibilité avec admin page)
    localStorage.setItem("token", accessToken)
    
    // Traitement des données utilisateur
    let parsedUser: User | null = null
    let userIsAdmin = false
    
    if (userData) {
      try {
        parsedUser = JSON.parse(userData)
        userIsAdmin = parsedUser?.role === 'admin'
        console.log("User loaded:", parsedUser, "Is Admin:", userIsAdmin)
      } catch (e) {
        console.error("Error parsing user data:", e)
      }
    }

    // Vérification du statut premium
    let isPremium = false
    const profileData = localStorage.getItem("userProfile")
    if (profileData) {
      try {
        const profile = JSON.parse(profileData)
        isPremium = !!profile.hasPremium
      } catch (e) {
        console.error("Error parsing profile data:", e)
      }
    }

    updateAuthState({
      isLoggedIn: true,
      user: parsedUser,
      isPremium,
      isAdmin: userIsAdmin
    })
    
    setIsLoading(false)
  }, [updateAuthState])

  // Vérification du rôle admin via API
  const verifyAdminRole = useCallback(async () => {
    const accessToken = localStorage.getItem("access_token")
    if (!accessToken) return
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify-admin`, {
        method: "GET",
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json"
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        console.log("Admin verification response:", data)
        updateAuthState({ isAdmin: data.role === 'admin' })
      } else {
        console.log("Admin verification failed:", response.status)
        updateAuthState({ isAdmin: false })
      }
    } catch (error) {
      console.error("Error verifying admin role:", error)
      updateAuthState({ isAdmin: false })
    }
  }, [updateAuthState])

  // Effects
  useEffect(() => {
    checkAuthStatus()
    
    // Vérifier le rôle admin via API si connecté
    if (localStorage.getItem("access_token")) {
      verifyAdminRole()
    }
  }, [checkAuthStatus, verifyAdminRole])

  useEffect(() => {
    // Écouter les changements dans localStorage
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user' || e.key === 'userProfile') {
        console.log("Storage changed, rechecking auth status")
        checkAuthStatus()
      }
    }

    // Écouter les événements personnalisés pour les changements locaux
    const handleAuthStatusChange = () => {
      console.log("Auth status change event received")
      checkAuthStatus()
    }

    // Fermer les menus au clic extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('authStatusChanged', handleAuthStatusChange)
    document.addEventListener("mousedown", handleClickOutside)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('authStatusChanged', handleAuthStatusChange)
    }
  }, [checkAuthStatus])

  // Handlers
  const handleLogout = useCallback(() => {
    console.log("Logging out user")
    
    // Supprimer tous les tokens et données utilisateur
    const keysToRemove = ["access_token", "refresh_token", "token", "user", "userProfile"]
    keysToRemove.forEach(key => localStorage.removeItem(key))
    
    updateAuthState({
      isLoggedIn: false,
      user: null,
      isPremium: false,
      isAdmin: false
    })
    
    setShowDropdown(false)
    setShowMobileMenu(false)
    
    // Déclencher un événement pour notifier les autres composants
    window.dispatchEvent(new Event('authStatusChanged'))
    
    router.push("/")
  }, [router, updateAuthState])

  const handleAdminAccess = useCallback(() => {
    console.log("Accessing admin dashboard")
    setShowDropdown(false)
    setShowMobileMenu(false)
    router.push("/admin")
  }, [router])

  // Utility functions
  const navLinkClass = (href: string) =>
    `text-slate-700 hover:text-blue-600 transition-colors font-medium px-3 py-2 rounded-lg ${
      pathname === href ? "bg-blue-100 text-blue-700" : "hover:bg-slate-50"
    }`

  const getDisplayName = () => {
    if (!authState.user) return "Utilisateur"
    
    const firstName = authState.user.first_name?.trim()
    if (firstName) return firstName
    
    if (authState.user.email) {
      return authState.user.email.split('@')[0]
    }
    
    return "Utilisateur"
  }

  const getInitial = () => getDisplayName().charAt(0).toUpperCase()

  // Navigation items
  const navigationItems = [
    { href: "/explorer", label: "Explorer", showAlways: true },
    { href: "/simulateur", label: "Simulateur", requiresAuth: true },
    { href: "/partager", label: "Partager", showAlways: true },
    { href: "/messagerie", label: "Messagerie", requiresPremium: true },
  ]

  const visibleNavItems = navigationItems.filter(item => {
    if (item.showAlways) return true
    if (item.requiresAuth && !authState.isLoggedIn) return false
    if (item.requiresPremium && (!authState.isLoggedIn || !authState.isPremium)) return false
    return true
  })

  // Loading state
  if (isLoading) {
    return (
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Logo />
          <div className="hidden md:flex items-center space-x-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ))}
          </div>
          <div className="md:hidden">
            <div className="animate-pulse bg-gray-200 h-8 w-8 rounded"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-2">
          {visibleNavItems.map(item => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
              {item.requiresPremium && (
                <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />
              )}
            </Link>
          ))}
          
          {/* Admin Access */}
          {authState.isLoggedIn && authState.isAdmin && (
            <Link 
              href="/admin" 
              className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 transition-all shadow-md font-medium ml-4"
            >
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          )}
          
          {/* User Menu or Auth Buttons */}
          {authState.isLoggedIn ? (
            <div className="relative ml-4" ref={dropdownRef}>
              <button
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  authState.isAdmin ? 'bg-gradient-to-r from-red-600 to-red-700' : 
                  authState.isPremium ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-blue-600'
                }`}>
                  {getInitial()}
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium text-sm text-slate-700">
                    {getDisplayName()}
                  </span>
                  <div className="flex items-center space-x-1">
                    {authState.isAdmin && (
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                        Admin
                      </span>
                    )}
                    {authState.isPremium && (
                      <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center">
                        <Crown className="w-2.5 h-2.5 mr-1" />
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                <svg className="ml-1 w-4 h-4 text-slate-500 transition-transform duration-200" 
                     style={{ transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }}
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-lg z-50 py-2">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="font-medium text-slate-900">{getDisplayName()}</p>
                    <p className="text-sm text-slate-500">{authState.user?.email}</p>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Voir profil
                  </Link>
                  
                  {authState.isAdmin && (
                    <>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={handleAdminAccess}
                        className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors font-medium"
                      >
                        <Shield className="w-4 h-4 mr-3" />
                        Dashboard Admin
                      </button>
                    </>
                  )}
                  
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <Link href="/auth/login">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                  Connexion
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all">
                  S'inscrire
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-expanded={showMobileMenu}
            aria-label="Menu mobile"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden border-t bg-white">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {visibleNavItems.map(item => (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`block px-3 py-2 rounded-lg ${navLinkClass(item.href)}`}
                onClick={() => setShowMobileMenu(false)}
              >
                {item.label}
                {item.requiresPremium && (
                  <Crown className="inline w-3 h-3 ml-1 text-yellow-500" />
                )}
              </Link>
            ))}
            
            {authState.isLoggedIn && authState.isAdmin && (
              <Link 
                href="/admin" 
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                <Shield className="w-4 h-4" />
                <span>Admin Dashboard</span>
              </Link>
            )}
            
            <div className="border-t pt-4 mt-4">
              {authState.isLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-3 py-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      authState.isAdmin ? 'bg-gradient-to-r from-red-600 to-red-700' : 
                      authState.isPremium ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' : 'bg-blue-600'
                    }`}>
                      {getInitial()}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{getDisplayName()}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {authState.isAdmin && (
                          <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full font-medium">
                            Admin
                          </span>
                        )}
                        {authState.isPremium && (
                          <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full font-medium flex items-center">
                            <Crown className="w-2.5 h-2.5 mr-1" />
                            Premium
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Link 
                    href="/profile" 
                    className="flex items-center px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <Settings className="w-4 h-4 mr-3" />
                    Voir profil
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/auth/login" onClick={() => setShowMobileMenu(false)}>
                    <Button variant="outline" className="w-full border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all">
                      Connexion
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setShowMobileMenu(false)}>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md transition-all">
                      S'inscrire
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}