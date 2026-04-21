import { useEffect, useState } from "react"
import type { User } from "./types/types"
import { AuthContext } from "./AuthProvider"
import React from "react"


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = () => {
      const saved = localStorage.getItem("user")
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = (user: User) => {
    setUser(user)
    localStorage.setItem("user", JSON.stringify(user))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user?.token,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
