import { z } from "zod"

export const propertyDataSchema = z.object({
  address1: z.string().min(1, "Address line 1 must contain a value"),
  address2: z.string().optional(),
  city: z.string().min(3, "City must contain at least 3 characters"),
  postcode: z.string().refine((postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i;
    return postcodeRegex.test(postcode);
  }, "Invalid postcode"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  description: z.string().min(10, "Description must contain at least 10 characters"),
  bedrooms: z.coerce.number().int().positive("Bedrooms must be greater than 0"),
  bathrooms: z.coerce.number().int().positive("Bathrooms must be greater than 0"),
  status: z.enum(["draft", "for-sale", "withdrawn", "sold"]),
})