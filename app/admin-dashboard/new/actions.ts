"use server" // Indica que este código deve ser executado no servidor

// Importa a instância de autenticação e Firestore do Firebase do módulo server
import { auth, firestore } from "@/firebase/server"
// Importa o esquema de validação de dados da propriedade
import { propertyDataSchema } from "@/validation/propertySchema"

// Função para salvar uma nova propriedade
export const saveNewProperty = async (data: {
  address1: string // Endereço linha 1
  address2?: string // Endereço linha 2 (opcional)
  city: string // Cidade
  postcode: string // Código postal
  description: string // Descrição
  price: number // Preço
  bedrooms: number // Número de quartos
  bathrooms: number // Número de banheiros
  status: "for-sale" | "draft" | "withdrawn" | "sold" // Status da propriedade
  token: string // Token de autenticação
}) => {
  const { token, ...propertyData } = data // Extrai o token e os dados da propriedade
  const verifiedToken = await auth.verifyIdToken(token) // Verifica o token de autenticação

  // Se o token verificado não tiver a claim de admin, retorna erro de autorização
  if (!verifiedToken.admin) {
    return {
      error: true,
      message: "Unauthorized"
    }
  }

  // Valida os dados da propriedade usando o esquema de validação
  const validation = propertyDataSchema.safeParse(propertyData)

  // Se a validação falhar, retorna o erro de validação
  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0]?.message ?? "An error occurred",
    }
  }

  // Adiciona a nova propriedade ao Firestore
  const property = await firestore.collection("properties").add({
    ...propertyData,
    created: new Date(), // Data de criação
    updated: new Date(), // Data de atualização
  })

  // Retorna o ID da propriedade criada
  return {
    propertyId: property.id,
  }
}