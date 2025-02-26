export type Property = {
  id: string
  address1: string
  address2?: string
  city: string
  postcode: string
  description: string
  price: number
  bedrooms: number
  bathrooms: number
  status: "for-sale" | "draft" | "withdrawn" | "sold"
  images?: string[]
}