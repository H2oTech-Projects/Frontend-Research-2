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
  canal_id: z.string()
    .length(3, "Canal ID must be exactly 3 characters")
    .regex(/^[A-Za-z0-9]+$/, "Canal ID must be alphanumeric"),
  canal_name: z.string().min(1, "Canal name is required"),
  canal_desc: z.string().optional(),
  canal_parent: z.string().optional(),
  canal_seepage_cms: z.coerce.number({
    required_error: "Seepage rate must be a number"
  }).nonnegative("Seepage must be non-negative").optional(),
  canalCoordinates: z.array(z.array(
    z.tuple([
      z.coerce.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
      z.coerce.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
    ])
  )).min(1, "At least one coordinate is required"),
});

export type CanalFormType = z.infer<typeof ConveyancesSchema>;

const ConveyancesForm = () => {
  const location = useLocation();
    const { id } = useParams();
  const form = useForm<CanalFormType>({
    resolver: zodResolver(ConveyancesSchema),
    defaultValues: {
      client: "",
      canal_id: "",
      canal_name: "",
      canal_desc: "",
      canal_parent: "",
      canal_seepage_cms: undefined,
    },
  });

  const onSubmit = (data: CanalFormType) => {
    console.log("Form Data:", data);
  };
  //const polyline = form.watch("canalCoordinates") || [];
  const featureGroupPolygonRef = React.useRef<any>(null);
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "coordinates",
  // });

  return (
    <div className='h-w-full px-4 pt-2'>
  <PageHeader
        pageHeaderTitle={`${!id  ? 'Add' : (location.pathname.includes("editCanal") ? "Edit" : "View")} Canal`}
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
              name='canal_id'
              label='Canal ID'
              placeholder='Enter Canal ID (e.g., ABC)'
              type='text'
            />
            <FormInput
              control={form.control}
              name='canal_name'
              label='Canal Name'
              placeholder='Enter Canal Name'
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
              name='canal_parent'
              label='Parent Canal ID'
              placeholder='Enter Parent Canal ID (if any)'
              type='text'
            />
            <FormInput
              control={form.control}
              name='canal_seepage_cms'
              label='Seepage (cms)'
              placeholder='Enter Seepage in cms'
              type='number'
            />
            <FormTextbox
              control={form.control}
              name='canal_desc'
              label='Canal Description'
              placeholder='Enter Canal Description'
            />
            </div>
             <FormCoordinatesMap
                form = {form}
                name="canalCoordinates" label="Canal Coordinates"
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
