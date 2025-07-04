import React from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { FormInput } from '@/components/FormComponent/FormInput';
import { FormTextbox } from '@/components/FormComponent/FormTextbox';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormComboBox } from '@/components/FormComponent/FormRTSelect';
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap';

const ConveyancesSchema = z.object({
  client: z.string().min(1, "Client is required"),
  convey_id: z.string()
    .length(3, "Convey ID must be exactly 3 characters")
    .regex(/^[A-Za-z0-9]+$/, "Convey ID must be alphanumeric"),
  convey_name: z.string().min(1, "Convey name is required"),
  convey_desc: z.string().optional(),
  convey_parent: z.string().optional(),
  convey_seepage_cms: z.coerce.number({
    required_error: "Seepage rate must be a number"
  }).nonnegative("Seepage must be non-negative").optional(),
  conveyCoordinates: z.array(z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  )).min(1, "At least one coordinate is required"),
});

export type ConveyFormType = z.infer<typeof ConveyancesSchema>;

const ConveyancesForm = () => {
  const location = useLocation();
    const { id } = useParams();
  const form = useForm<ConveyFormType>({
    resolver: zodResolver(ConveyancesSchema),
    defaultValues: {
      client: "",
      convey_id: "",
      convey_name: "",
      convey_desc: "",
      convey_parent: "",
      convey_seepage_cms: undefined,
    },
  });

  const onSubmit = (data: ConveyFormType) => {
    console.log("Form Data:", data);
  };
  //const polyline = form.watch("ConveyCoordinates") || [];
  const featureGroupPolygonRef = React.useRef<any>(null);
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "coordinates",
  // });

  return (
    <div className='h-w-full px-4 pt-2'>
  <PageHeader
        pageHeaderTitle={`${!id  ? 'Add' : (location.pathname.includes("editConvey") ? "Edit" : "View")} Convey`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Clients", menuPath: "/clients" }
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>
          <div className='grid grid-cols-2 gap-4 mb-4'>
            <div className='flex flex-col gap-2'>
             <FormInput
              control={form.control}
              name='convey_id'
              label='Convey ID'
              placeholder='Enter Convey ID (e.g., ABC)'
              type='text'
            />
            <FormInput
              control={form.control}
              name='convey_name'
              label='Convey Name'
              placeholder='Enter Convey Name'
              type='text'
            />
            <FormComboBox
              control={form.control}
              name='client'
              label='Client'
              options={
                [
                  { label: "Ram", value: "GPS" },
                  { label: "Hari", value: "Survey" },
                  { label: "Aerial", value: "Aerial" }
                ]
              }
            />
            <FormInput
              control={form.control}
              name='convey_parent'
              label='Parent Convey ID'
              placeholder='Enter Parent Convey ID (if any)'
              type='text'
            />
            <FormInput
              control={form.control}
              name='convey_seepage_cms'
              label='Seepage (cms)'
              placeholder='Enter Seepage in cms'
              type='number'
            />
            <FormTextbox
              control={form.control}
              name='convey_desc'
              label='Convey Description'
              placeholder='Enter Convey Description'
            />
            </div>
             <FormCoordinatesMap
                form = {form}
                name="conveyCoordinates" label="Convey Coordinates"
                type="polyline"
                refLayer={featureGroupPolygonRef}
                layerCounts='multiple'
            />
          </div>
          <Button className='w-24' type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
};

export default ConveyancesForm;
