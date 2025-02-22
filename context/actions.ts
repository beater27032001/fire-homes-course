"use server" // Indica que este código deve ser executado no servidor

// Importa a instância de autenticação do Firebase do módulo server
import { auth } from "@/firebase/server"
// Importa a função cookies do Next.js para manipulação de cookies
import { cookies } from "next/headers"

// Função para remover tokens de autenticação dos cookies
export const removeToken = async () => {
  const cookieStore = await cookies() // Obtém a instância de manipulação de cookies
  cookieStore.delete("firebaseAuthToken") // Remove o token de autenticação do cookie
  cookieStore.delete("firebaseAuthRefreshToken") // Remove o token de atualização do cookie
}

// Função para definir tokens de autenticação nos cookies
export const setToken = async ({ token, refreshToken }: { token: string, refreshToken: string }) => {
  try {
    const verifiedToken = await auth.verifyIdToken(token) // Verifica o token de autenticação
    if (!verifiedToken) return // Se o token não for verificado, retorna

    const userRecord = await auth.getUser(verifiedToken.uid) // Obtém o registro do usuário com base no UID do token verificado

    // Se o email do usuário for igual ao email do administrador e o usuário não tiver a claim de admin
    if (process.env.ADMIN_EMAIL === userRecord.email && !userRecord.customClaims?.admin) {
      auth.setCustomUserClaims(verifiedToken.uid, { admin: true }) // Define a claim de admin para o usuário
    }

    const cookieStore = await cookies() // Obtém a instância de manipulação de cookies
    // Define o token de autenticação no cookie com opções de segurança
    cookieStore.set("firebaseAuthToken", token, {
      httpOnly: true, // O cookie só pode ser acessado pelo servidor
      secure: process.env.NODE_ENV === "production", // O cookie só será enviado em conexões seguras (HTTPS) em produção
    })
    // Define o token de atualização no cookie com opções de segurança
    cookieStore.set("firebaseAuthRefreshToken", refreshToken, {
      httpOnly: true, // O cookie só pode ser acessado pelo servidor
      secure: process.env.NODE_ENV === "production", // O cookie só será enviado em conexões seguras (HTTPS) em produção
    })
  } catch (e) {
    console.log(e) // Loga qualquer erro que ocorrer
  }
}