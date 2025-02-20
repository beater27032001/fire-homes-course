// Importa as instâncias de Firestore e a função getTotalPages do módulo server do Firebase
import { firestore, getTotalPages } from "@/firebase/server"
// Importa o tipo Property
import { Property } from "@/types/property"
// Importa o tipo PropertyStatus
import { PropertyStatus } from "@/types/propertyStatus"
// Indica que este código deve ser executado no servidor
import "server-only"

// Define o tipo para as opções de obtenção de propriedades
type GetPropertiesOptions = {
  filters?: {
    minPrice?: number | null // Filtro para preço mínimo
    maxPrice?: number | null // Filtro para preço máximo
    minBedrooms?: number | null // Filtro para número mínimo de quartos
    status?: PropertyStatus[] | null // Filtro para status da propriedade
  },
  pagination?: {
    pageSize?: number // Tamanho da página para paginação
    page?: number // Número da página para paginação
  }
}

// Função para obter propriedades com base nas opções fornecidas
export const getProperties = async (options?: GetPropertiesOptions) => {
  const page = options?.pagination?.page || 1 // Define o número da página, padrão é 1
  const pageSize = options?.pagination?.pageSize || 10 // Define o tamanho da página, padrão é 10
  const { minPrice, maxPrice, minBedrooms, status } = options?.filters || {} // Extrai os filtros das opções

  // Cria uma consulta para a coleção de propriedades ordenada pela data de atualização
  let propertiesQuery = firestore.collection("properties").orderBy("updated", "desc")

  // Aplica o filtro de preço mínimo, se fornecido
  if (minPrice !== null && minPrice !== undefined) {
    propertiesQuery = propertiesQuery.where("price", ">=", minPrice)
  }

  // Aplica o filtro de preço máximo, se fornecido
  if (maxPrice !== null && maxPrice !== undefined) {
    propertiesQuery = propertiesQuery.where("price", "<=", maxPrice)
  }

  // Aplica o filtro de número mínimo de quartos, se fornecido
  if (minBedrooms !== null && minBedrooms !== undefined) {
    propertiesQuery = propertiesQuery.where("bedrooms", ">=", minBedrooms)
  }

  // Aplica o filtro de status, se fornecido
  if (status) {
    propertiesQuery = propertiesQuery.where("status", "in", status)
  }

  // Obtém o número total de páginas de resultados
  const totalPages = await getTotalPages(propertiesQuery, pageSize)

  // Executa a consulta com limite e offset para paginação
  const propertiesSnapshot = await propertiesQuery.limit(pageSize).offset((page - 1) * pageSize).get()

  // Mapeia os documentos retornados para o tipo Property
  const properties = propertiesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Property))

  // Retorna os dados das propriedades e o número total de páginas
  return { data: properties, totalPages }
}