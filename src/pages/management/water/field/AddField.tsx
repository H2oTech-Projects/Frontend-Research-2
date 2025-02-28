import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import {
  Form,
  FormItem,
  FormLabel,
} from "@/components/ui/form"

import { FormInput } from '@/components/FormComponent/FormInput'
import { useCallback } from 'react'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  fieldID: z.string().min(5, "FieldID must be at least 5 characters"),
  farmedAcres: z.coerce.number(),
  coordinates: z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  ),
//    Coordinates as an array of objects
//    coordinates: z.array(
//     z.object({
//       lat: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
//       lng: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
//     })
//   ),
});

type FormValues = z.infer<typeof formSchema>;

const AddField = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldID: "",
      farmedAcres: Number(''),
      coordinates: [[Number(''), Number('')]],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "coordinates",
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle="Add Field"
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Field", menuPath: "/field" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-[calc(100vh-132px)] flex flex-col gap-4'>
         
          <FormInput control={form.control} name='fieldID' label='FieldID' placeholder='Enter FieldID' type='text' />
          <FormInput control={form.control} name='farmedAcres' label='Farmed Acres' placeholder='Enter Farmed Acres' type='number' />
              <FormItem>
          <FormLabel>Coordinates</FormLabel>
          {fields.map((field, index) => (
            <div key={field.id} className='flex gap-2 items-center my-3'> 
              <FormInput control={form.control} name={`coordinates.${index}.0`} label='Latitude' placeholder='Enter Latitude' type='number' showLabel={false} />
              <FormInput control={form.control} name={`coordinates.${index}.1`} label='Longitude' placeholder='Enter Longitude' type='number' showLabel={false}  />
              {fields.length > 1 && (
                <Button type="button" onClick={() => remove(index)}>Remove</Button>
              )}
              {index === fields.length - 1 && (
                <Button type="button" onClick={()=> append([[Number(''),Number('')]])}>Add</Button>
              )}
            </div>
          ))}
        </FormItem>
          

          {/* Submit Button */}
          <Button className='mt-4 w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default AddField;
