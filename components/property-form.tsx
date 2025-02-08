"use client"

import { useForm } from "react-hook-form"
import { propertyDataSchema } from "@/validation/propertySchema"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

type Props = {
  handleSubmit: (data: z.infer<typeof propertyDataSchema>) => void
}

export default function PropertyForm({ handleSubmit }: Props) {
  const form = useForm<z.infer<typeof propertyDataSchema>>({
    resolver: zodResolver(propertyDataSchema),
    defaultValues: {
      address1: '',
      address2: '',
      city: '',
      postcode: '',
      price: 0,
      description: '',
      bedrooms: 0,
      bathrooms: 0,
      status: 'draft'
    }
  })
  return <Form {...form}>
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      <div className="grid grid-cols-2">
        <fieldset>
          <FormField control={form.control} name="status" render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      Draft
                    </SelectItem>
                    <SelectItem value="for-sale">
                      For Sale
                    </SelectItem>
                    <SelectItem value="withdrawn">
                      Withdrawn
                    </SelectItem>
                    <SelectItem value="sold">
                      Sold
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </fieldset>
      </div>
    </form>
  </Form>
}