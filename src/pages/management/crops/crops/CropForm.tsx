import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import { LatLng, LeafletEvent, Layer, FeatureGroup as LeafletFeatureGroup, LatLngBounds } from "leaflet"
import FormCoordinatesMap from '@/components/FormComponent/FormCoordinatesMap'
import { useEffect, useRef, useState } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'
import BasicSelect from '@/components/BasicSelect'
import { cn } from '@/lib/utils'
import { FormFileReader } from '@/components/FormComponent/FormFileReader'
//import MapPreview from '@/components/MapPreview'
import FieldMapPreview from '@/components/FieldMapPreview'
import { usePostMapPreview } from '@/services/mapPreview'
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetWaps } from '@/services/timeSeries'
import { useGetFieldDetailByWAP, usePostFieldByWAP, usePutFieldByWAP } from '@/services/water/field'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { UnitSystemName } from '@/utils'
import { useGetCropById, useGetCropGroupNameDropdown, usePostCrops, usePutCrops } from '@/services/crops'
import { GET_CROPS_LIST, POST_CROPS, PUT_CROPS } from '@/services/crops/constants'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  cropCode: z.string().optional(),
  cropName: z.string().optional(),
  cropDesc: z.string().optional(),
  cropAbbrev: z.string().optional(),
  cropAppDepthM: z.coerce.number(),
  cropGroupId: z.coerce.number()
});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const clientId = JSON.parse(localStorage.getItem("auth") as string)?.client_id
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const {data:CropGroupNameOptions}=useGetCropGroupNameDropdown();
  const { data: fieldDetailData, isLoading: isFieldDetailLoading } = useGetCropById( id!)
  const { mutate: createCrop, isPending: creatingCrop } = usePostCrops();
  const { mutate: updateCrops, isPending: updatingCrop } = usePutCrops();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
  cropCode: "",
  cropName: "",
  cropDesc: "",
  cropAbbrev: "",
  cropAppDepthM: undefined,
  cropGroupId: undefined,
    },
  });



  useEffect(() => {
    if (fieldDetailData) {
      form.reset({...fieldDetailData?.data[0]
      })}
}, [fieldDetailData]);

  const onSubmit = (data: FormValues) => {
    const formData = convertKeysToSnakeCase(data)
    if (!id) {
      createCrop(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CROPS_LIST] })
          queryClient.invalidateQueries({ queryKey: [POST_CROPS] });
          toast.success(data?.message);
          navigate("/crops");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Crop");
          queryClient.invalidateQueries({ queryKey: [POST_CROPS] });
        },
      });
    } else {
      updateCrops({cropId : id,formData : formData}, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_CROPS_LIST] })
          queryClient.invalidateQueries({ queryKey: [PUT_CROPS] });
          toast.success(data?.message);
          navigate("/crops");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [PUT_CROPS] });
        },
      });
    }

  };



  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Crop`}
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Crops", menuPath: "/crops" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>
          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            <FormInput control={form.control} name='cropCode' label='Crop Code' placeholder='Crop Code' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='cropName' label='Crop Name' placeholder='Enter Crop Name' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='cropAbbrev' label={" Crop Abbreviation"} placeholder='Enter Crop Abbreviation' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='cropAppDepthM' label={"Crop App Depth"} placeholder='Crop App Depth' type='number' disabled={location.pathname.includes("view")} />
            <FormComboBox control={form.control} name='cropGroupId' label='Select Crop Group Name' options={CropGroupNameOptions?.data} disabled={location.pathname.includes("view")} />
            <FormTextbox control={form.control} name='cropDesc' label='Crop Description' placeholder='Enter Crop Description' disabled={location.pathname.includes("view")} />
           
          </div>
             {!location.pathname.includes("view") && <Button className='w-24 mt-4' disabled={creatingCrop || updatingCrop} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
}

export default FieldForm;