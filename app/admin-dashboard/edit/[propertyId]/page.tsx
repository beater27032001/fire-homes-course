import { Breadcrumbs } from "@/components/ui/breadcrumb"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getPropertyById } from "@/data/properties"
import EditPropertyForm from "./edit-property-form"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function EditProperty({ params }: { params: Promise<any> }) {
  const paramsValue = await params
  const property = await getPropertyById(paramsValue.propertyId)
  console.log(property)
  return (
    <div>
      <Breadcrumbs
        items={[{
          href: "/admin-dashboard",
          label: "Dashboard"
        }, {
          label: "Edit Property"
        }]} />

      <Card className="mt-5">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">New Property</CardTitle>
        </CardHeader>
        <CardContent>
          <EditPropertyForm
            id={property.id}
            address1={property.address1}
            address2={property.address2}
            bathrooms={property.bathrooms}
            bedrooms={property.bedrooms}
            city={property.city}
            description={property.description}
            postcode={property.postcode}
            price={property.price}
            status={property.status} />
        </CardContent>
      </Card>
    </div>
  )
}