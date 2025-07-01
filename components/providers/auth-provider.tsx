"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  username: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const ADMIN_USER = process.env.NEXT_PUBLIC_ADMIN_USER
  const ADMIN_PASS = process.env.NEXT_PUBLIC_ADMIN_PASS
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem("auth-token")
    const userData = localStorage.getItem("user-data")

    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("username | USER: ", username, ADMIN_USER)
    console.log("password | PASS: ", password, ADMIN_PASS)
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const userData = {
        id: "1",
        username: username,
        name: username,
      }

      localStorage.setItem("auth-token", "mock-token")
      localStorage.setItem("user-data", JSON.stringify(userData))
      setUser(userData)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-data")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
