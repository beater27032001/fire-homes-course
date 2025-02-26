"use client"
import PropertyForm from "@/components/property-form"
import { useAuth } from "@/context/auth"
import { propertySchema } from "@/validation/propertySchema"
import { PlusCircleIcon } from "lucide-react"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createProperty, savePropertyImages } from "./actions"
import { ref, uploadBytesResumable, UploadTask } from "firebase/storage"
import { storage } from "@/firebase/client"

export default function NewPropertyForm() {
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (data: z.infer<typeof propertySchema>) => {
    const token = await auth?.currentUser?.getIdToken() // Obtém o token de autenticação

    if (!token) return // Se não houver token, retorna

    const { images, ...rest } = data // Separa as imagens do resto dos dados

    const response = await createProperty(rest, token) // Salva a nova propriedade

    if (!!response.error || !response.propertyId) { // Se houver erro ou não houver ID da propriedade
      toast({
        title: "Error!",
        description: response.message,
        variant: 'destructive'
      })

      return
    }

    const uploadTask: UploadTask[] = []
    const paths: string[] = []
    images.forEach((image, index) => {
      if (image.file) {
        const path = `properties/${response.propertyId}/${Date.now()}-${index}-${image.file.name}` // Define o caminho para a imagem
        paths.push(path)
        const storageRef = ref(storage, path) // Cria uma referência de armazenamento
        uploadTask.push(uploadBytesResumable(storageRef, image.file)) // Adiciona a tarefa de upload
      }
    })

    await Promise.all(uploadTask) // Aguarda todas as tarefas de upload
    await savePropertyImages({ propertyId: response.propertyId, images: paths }, token) // Salva os caminhos das imagens

    toast({
      title: "Success!",
      description: "Property created",
      variant: 'success'
    })

    router.push("/admin-dashboard") // Redireciona para o dashboard
  }

  return (
    <div>
      <PropertyForm handleSubmit={handleSubmit} submitButtonLabel={<>
        <PlusCircleIcon /> Create Property
      </>} />
    </div>
  )
}