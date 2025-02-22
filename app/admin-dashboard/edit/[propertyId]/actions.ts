"use server" // Indica que este código deve ser executado no servidor

import { auth, firestore } from "@/firebase/server"
import { Property } from "@/types/property"
import { propertyDataSchema } from "@/validation/propertySchema"

export const updateProperty = async (data: Property, authToken: string) => {
  const { id, ...propertyData } = data // Extrai o token e os dados da propriedade
  const verifiedToken = await auth.verifyIdToken(authToken) // Verifica o token de autenticação

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

  // Atualiza a propriedade no Firestore
  await firestore.collection("properties").doc(id).update({
    ...propertyData,
    updated: new Date(), // Data de atualização
  })

}