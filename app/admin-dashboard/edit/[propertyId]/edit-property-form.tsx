"use client"

import PropertyForm from "@/components/property-form"
import { auth } from "@/firebase/client"
import { Property } from "@/types/property"
import { propertyDataSchema } from "@/validation/propertySchema"
import { SaveIcon } from "lucide-react"
import { z } from "zod"
import { updateProperty } from "./actions"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type Props = Property

export default function EditPropertyForm({
  id,
  address1,
  bathrooms,
  bedrooms,
  city,
  description,
  postcode,
  price,
  status,
  address2
}: Props) {
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {
    const token = await auth?.currentUser?.getIdToken() // Obtém o token de autenticação

    if (!token) return // Se não houver token, retorna

    await updateProperty({ ...data, id }, token) // Atualiza a propriedade
    toast({
      title: "Success!",
      description: "Property updated",
      variant: 'success'
    })
    router.push("/admin-dashboard") // Redireciona para a página de administração
  }

  return (
    <div>
      <PropertyForm
        handleSubmit={handleSubmit}
        submitButtonLabel={<><SaveIcon /> Save Property</>}
        defaultValues={{
          address1,
          bathrooms,
          bedrooms,
          city,
          description,
          postcode,
          price,
          status,
          address2
        }} />
    </div>
  )
}