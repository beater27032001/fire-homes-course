"use client"
import PropertyForm from "@/components/property-form"
import { useAuth } from "@/context/auth"
import { propertyDataSchema } from "@/validation/propertySchema"
import { PlusCircleIcon } from "lucide-react"
import { z } from "zod"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { createProperty } from "./actions"

export default function NewPropertyForm() {
  const auth = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken() // Obtém o token de autenticação

    if (!token) return // Se não houver token, retorna

    const response = await createProperty(data, token) // Salva a nova propriedade

    if (!!response.error) {
      toast({
        title: "Error!",
        description: response.message,
        variant: 'destructive'
      })

      return
    }

    toast({
      title: "Success!",
      description: "Property created",
      variant: 'success'
    })

    router.push("/admin-dashboard")

    console.log({ response })
  }

  return (
    <div>
      <PropertyForm handleSubmit={handleSubmit} submitButtonLabel={<>
        <PlusCircleIcon /> Create Property
      </>} />
    </div>
  )
}