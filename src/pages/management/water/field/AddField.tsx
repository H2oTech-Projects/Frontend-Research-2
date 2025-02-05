import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import dayjs from "dayjs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FormInput } from '@/components/FormComponent/FormInput'
const formSchema = z.object({
  fieldID: z.string().min(5, "FieldID must be at least 5 characters"),
  country: z.string().min(1, "Please select a country"),
  dob: z.date({ required_error: "Date of birth is required" }),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms",
  }),
});

type FormValues = z.infer<typeof formSchema>;


const AddField = () => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fieldID: "",
      country: "",
      dob: undefined,
      acceptTerms: false,
    },
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
      <FormInput control={form.control} name='irrigableAcres' label='Irrigable Acres' placeholder='Enter Irrigable Acres' type='number' />

    

        {/* Accept Terms Checkbox */}
     

        <Button type="submit">Submit</Button>
      </form>
    </Form>
    </div>
  
  )
}

export default AddField
