// Importa a função cookies do Next.js para manipulação de cookies
import { cookies } from "next/headers";
// Importa os tipos NextRequest e NextResponse do Next.js para manipulação de requisições e respostas
import { NextRequest, NextResponse } from "next/server";
// Importa a função decodeJwt da biblioteca jose para decodificação de tokens JWT
import { decodeJwt } from 'jose'

// Função middleware para manipulação de requisições
export async function middleware(request: NextRequest) {
  console.log("MIDDLEWARE", request.url) // Loga a URL da requisição para debug

  // Se o método da requisição for POST, permite a continuação da requisição
  if (request.method === "POST") {
    return NextResponse.next()
  }

  // Obtém a instância de manipulação de cookies
  const cookieStore = await cookies()
  // Obtém o valor do token de autenticação do cookie
  const token = cookieStore.get("firebaseAuthToken")?.value

  // Se não houver token e a URL da próxima requisição começar com /login, permite a continuação da requisição
  if (!token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.next()
  }

  // Se houver token e a URL da próxima requisição começar com /login, redireciona para a página inicial
  if (token && request.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Se não houver token, redireciona para a página inicial
  if (!token) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Decodifica o token JWT
  const decodedToken = decodeJwt(token)
  // Se o token decodificado não tiver a claim de admin, redireciona para a página inicial
  if (!decodedToken.admin) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Permite a continuação da requisição
  return NextResponse.next()
}

// Configuração do middleware para aplicar apenas na rota /admin-dashboard
export const config = {
  matcher: [
    "/admin-dashboard",
    "/admin-dashboard/:path*",
    "/login"
  ]
}