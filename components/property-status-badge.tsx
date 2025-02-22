import { PropertyStatus } from "@/types/propertyStatus";
import { Badge } from "./ui/badge";

const statusLabel = {
  "for-sale": "For Sale",
  withdrawn: "Withdrawn",
  sold: "Sold",
  draft: "Draft"
}

const variant: { [key: string]: "primary" | "destructive" | "success" | "secondary" } = {
  "for-sale": "primary",
  withdrawn: "destructive",
  sold: "success",
  draft: "secondary"
}

export default function PropertyStatusBadge({ status }: { status: PropertyStatus }) {
  const label = statusLabel[status]

  return (
    <Badge variant={variant[status]}>
      {label}
    </Badge>
  )
}