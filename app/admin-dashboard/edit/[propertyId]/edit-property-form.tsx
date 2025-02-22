"use client"

import PropertyForm from "@/components/property-form"
import { Property } from "@/types/property"
import { propertyDataSchema } from "@/validation/propertySchema"
import { SaveIcon } from "lucide-react"
import { z } from "zod"

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
  const handleSubmit = async (data: z.infer<typeof propertyDataSchema>) => {

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