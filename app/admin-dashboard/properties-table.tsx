import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getProperties } from "@/data/properties"

export default async function PropertiesTable() {
  const { data } = await getProperties()
  console.log({ data })

  return (
    <>
      {!data && <h1 className="text-center text-zinc-400 py-20 text-3xl">You have no properties</h1>}
      {!!data && (
        <Table className="mt-5 ">
          <TableHeader>
            <TableRow>
              <TableHead>
                Address
              </TableHead>
              <TableHead>
                Listin Price
              </TableHead>
              <TableHead>
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map(property => {
              const address = [property.address1, property.address2, property.city, property.postcode].filter((addressLine) => !!addressLine).join(", ")
              return (
                <TableRow key={property.id}>
                  <TableCell>{address}</TableCell>
                  <TableCell>{property.price}</TableCell>
                  <TableCell>{property.status}</TableCell>
                  <TableCell>View/edit</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
    </>
  )
}