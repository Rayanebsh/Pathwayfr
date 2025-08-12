import { useCallback, useMemo } from "react"

export function useAuthToken() {
  const isBrowser = typeof window !== "undefined"

  const getAccessToken = () => {
    if (!isBrowser) return null
    return localStorage.getItem("access_token")
  }

  const getRefreshToken = () => {
    if (!isBrowser) return null
    return localStorage.getItem("refresh_token")
  }

  const setTokens = useCallback(({ accessToken, refreshToken }: { accessToken: string; refreshToken: string }) => {
    if (!isBrowser) return
    localStorage.setItem("access_token", accessToken)
    localStorage.setItem("refresh_token", refreshToken)
  }, [isBrowser])

  const clearTokens = useCallback(() => {
    if (!isBrowser) return
    localStorage.removeItem("access_token")
    localStorage.removeItem("refresh_token")
  }, [isBrowser])

  const fetchWithAuth = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const accessToken = getAccessToken()
      const refreshToken = getRefreshToken()

      const doFetch = async (token: string) => {
        return fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${token}`,
          },
        })
      }

      let response = await doFetch(accessToken || "")

      if (response.status === 401 && refreshToken) {
        const refreshResp = await fetch("http://127.0.0.1:5000/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })

        if (refreshResp.ok) {
          const { access_token } = await refreshResp.json()
          setTokens({ accessToken: access_token, refreshToken })
          response = await doFetch(access_token)
        } else {
          clearTokens()
          throw new Error("Session expirée. Veuillez vous reconnecter.")
        }
      }

      return response
    },
    [setTokens, clearTokens]
  )

  return useMemo(() => ({
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    setTokens,
    clearTokens,
    fetchWithAuth,
  }), [fetchWithAuth, setTokens, clearTokens])
}
