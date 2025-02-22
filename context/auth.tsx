"use client" // Indica que este código deve ser executado no cliente

// Importa a instância de autenticação do Firebase do módulo client
import { auth } from "@/firebase/client"
// Importa os provedores e funções de autenticação do Firebase
import { GoogleAuthProvider, ParsedToken, signInWithPopup, User } from "firebase/auth"
// Importa funções do React para criar contexto, usar contexto, efeitos e estado
import { createContext, useContext, useEffect, useState } from "react"
// Importa as funções para manipulação de tokens
import { removeToken, setToken } from "./actions"

// Define o tipo do contexto de autenticação
type AuthContextType = {
  currentUser: User | null // Usuário atual
  logout: () => Promise<void> // Função para logout
  loginWithGoogle: () => Promise<void> // Função para login com Google
  customClaims: ParsedToken | null // Claims personalizadas do usuário
}

// Cria o contexto de autenticação com valor inicial nulo
const AuthContext = createContext<AuthContextType | null>(null)

// Componente provedor de autenticação
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null) // Estado para o usuário atual
  const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null) // Estado para claims personalizadas

  useEffect(() => {
    // Função para observar mudanças no estado de autenticação
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user ?? null) // Define o usuário atual
      if (user) {
        const tokenResult = await user.getIdTokenResult() // Obtém o resultado do token de ID
        const token = tokenResult.token // Token de autenticação
        const refreshToken = user.refreshToken // Token de atualização
        const claims = tokenResult.claims // Claims do token
        setCustomClaims(claims ?? null) // Define as claims personalizadas
        if (token && refreshToken) {
          await setToken({ token, refreshToken }) // Define os tokens nos cookies
        }
      } else {
        await removeToken() // Remove os tokens dos cookies
      }
    })
    return () => unsubscribe() // Cancela a observação quando o componente é desmontado
  }, [])

  // Função para logout
  const logout = async () => {
    await auth.signOut()
  }

  // Função para login com Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  return (
    // Provedor do contexto de autenticação
    <AuthContext.Provider value={{ currentUser, logout, loginWithGoogle, customClaims }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext)