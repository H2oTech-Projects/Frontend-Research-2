import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"

import {
  Form,
} from "@/components/ui/form"

import { FormInput } from '@/components/FormComponent/FormInput'
const formSchema = z.object({
  fieldID: z.string().min(5, "FieldID must be at least 5 characters"),
  farmedAcres: z.coerce.number(),
  coordinates: z.array(
    z.object({
      lat: z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      lng: z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;


const AddField = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldID: "",
      farmedAcres: undefined,
      coordinates: [],
    },
  });
    const {
    fields,
    append,
    prepend,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "coordinates"
  });
 const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className='h-w-full px-4 pt-2'>
       <PageHeader
                pageHeaderTitle="Add Field"
                breadcrumbPathList={[{ menuName: "Management", menuPath: "" },{menuName:"Field",menuPath:"/field"}]}
            />
   
       <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-[calc(100vh-132px)]'>
        {/* Name Input */}
      <FormInput control={form.control} name='fieldID' label='FieldID' placeholder='Enter FieldID' type='text' />
      <FormInput control={form.control} name='farmedAcres' label='Farmed Acres' placeholder='Enter Farmed Acres' type='number' />
      {
        fields.map((field, index) => (
          <div key={field.id} className='flex gap-2'>
              Test
            <FormInput control={form.control} name={`coordinates[${index}].lat`} label='Latitude' placeholder='Enter Latitude' type='number' />
            <FormInput control={form.control} name={`coordinates[${index}].lng`} label='Longitude' placeholder='Enter Longitude' type='number' />
            <Button onClick={() => remove(index)}>Remove</Button>
          </div>
        ))    }  
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  
  )
}

export default AddField
