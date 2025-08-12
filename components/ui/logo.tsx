interface LogoProps {
  className?: string
  variant?: "default" | "compact" | "text-only"
}

export function Logo({ className = "", variant = "default" }: LogoProps) {
  if (variant === "text-only") {
    return (
      <span
        className={`font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent ${className}`}
      >
        PathwayFR
      </span>
    )
  }

  if (variant === "compact") {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-8 h-8 relative">
          <svg viewBox="0 0 32 32" className="w-full h-full">
            {/* Carte de France stylisée */}
            <path
              d="M8 12c2-2 4-1 6 0s4 2 6 1 3-2 5-1 2 3 1 5-2 4-1 6-1 4-3 5-4 1-6 0-4-2-6-1-3 2-5 1-2-3-1-5 2-4 1-6 1-4 3-5z"
              fill="url(#franceGradient)"
              className="drop-shadow-sm"
            />
            {/* Flèche vers étoile */}
            <path
              d="M20 16l3-3M23 13l1-1M24 12l0.5-0.5"
              stroke="url(#arrowGradient)"
              strokeWidth="1.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Étoile */}
            <path
              d="M26 8l1 2 2-1-1 2 1 2-2-1-1 2-1-2-2 1 1-2-1-2 2 1z"
              fill="url(#starGradient)"
              className="drop-shadow-sm"
            />
            <defs>
              <linearGradient id="franceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#60A5FA" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
              <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FCD34D" />
                <stop offset="100%" stopColor="#F59E0B" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          PathwayFR
        </span>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 relative">
        <svg viewBox="0 0 40 40" className="w-full h-full">
          {/* Carte de France stylisée */}
          <path
            d="M10 15c3-3 6-1.5 9 0s6 3 9 1.5 4.5-3 7.5-1.5 3 4.5 1.5 7.5-3 6-1.5 9-1.5 6-4.5 7.5-6 1.5-9 0-6-3-9-1.5-4.5 3-7.5 1.5-3-4.5-1.5-7.5 3-6 1.5-9 1.5-6 4.5-7.5z"
            fill="url(#franceGradientLarge)"
            className="drop-shadow-md"
          />
          {/* Flèche vers étoile */}
          <path
            d="M25 20l4-4M29 16l1.5-1.5M30.5 14.5l1-1"
            stroke="url(#arrowGradientLarge)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            className="drop-shadow-sm"
          />
          {/* Étoile */}
          <path
            d="M33 10l1.5 3 3-1.5-1.5 3 1.5 3-3-1.5-1.5 3-1.5-3-3 1.5 1.5-3-1.5-3 3 1.5z"
            fill="url(#starGradientLarge)"
            className="drop-shadow-md"
          />
          <defs>
            <linearGradient id="franceGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="50%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#1E40AF" />
            </linearGradient>
            <linearGradient id="arrowGradientLarge" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <linearGradient id="starGradientLarge" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 bg-clip-text text-transparent">
        PathwayFR
      </span>
    </div>
  )
}
