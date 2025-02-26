"use server" // Indica que este código deve ser executado no servidor

// Importa a instância de autenticação e Firestore do Firebase do módulo server
import { auth, firestore } from "@/firebase/server"
// Importa o esquema de validação de dados da propriedade
import { propertyDataSchema } from "@/validation/propertySchema"
// Importa a biblioteca de validação de dados zod
import { z } from "zod"

// Função para criar uma nova propriedade
export const createProperty = async (data: {
  address1: string // Endereço linha 1
  address2?: string // Endereço linha 2 (opcional)
  city: string // Cidade
  postcode: string // Código postal
  description: string // Descrição
  price: number // Preço
  bedrooms: number // Número de quartos
  bathrooms: number // Número de banheiros
  status: "for-sale" | "draft" | "withdrawn" | "sold" // Status da propriedade
}, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken) // Verifica o token de autenticação

  // Se o token verificado não tiver a claim de admin, retorna erro de autorização
  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "Unauthorized"
    }
  }

  // Valida os dados da propriedade usando o esquema de validação
  const validation = propertyDataSchema.safeParse(data)

  // Se a validação falhar, retorna o erro de validação
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    }
  }

  // Adiciona a nova propriedade ao Firestore
  const property = await firestore.collection("properties").add({
    ...data,
    created: new Date(), // Data de criação
    updated: new Date(), // Data de atualização
  })

  // Retorna o ID da propriedade criada
  return {
    propertyId: property.id,
  }
}

// Função para salvar imagens da propriedade
export const savePropertyImages = async ({ propertyId, images }: {
  propertyId: string // ID da propriedade
  images: string[] // Lista de URLs das imagens
}, authToken: string) => {
  const verifiedToken = await auth.verifyIdToken(authToken) // Verifica o token de autenticação

  // Se o token verificado não tiver a claim de admin, retorna erro de autorização
  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "Unauthorized"
    }
  }

  // Define o esquema de validação para as imagens da propriedade
  const schema = z.object({
    propertyId: z.string(), // ID da propriedade deve ser uma string
    images: z.array(z.string()) // Imagens devem ser um array de strings
  })

  // Valida os dados usando o esquema de validação
  const validation = schema.safeParse({ propertyId, images })

  // Se a validação falhar, retorna o erro de validação
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    }
  }

  // Atualiza a propriedade no Firestore com as novas imagens
  await firestore.collection("properties").doc(propertyId).update({
    images
  })
}