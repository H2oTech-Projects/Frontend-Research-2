import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import FormPointMap from './FormPointMap'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { useGetMsmtPointById, usePostmsmtPoint, usePutmsmtPoint } from '@/services/water/msmtPoint'
import { GET_CLIENT_MSMT_POINTS_MAP, GET_MSMTPOINT_DETAIL_KEY, GET_MSMTPOINT_LIST_KEY, POST_MSMTPOINT_LIST, PUT_MSMTPOINT } from '@/services/water/msmtPoint/constant'
import { useGetConveyanceParents } from '@/services/convayance'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import { useEffect } from 'react'
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  msmtPointId: z.string().optional(),
  msmtPointName: z.string().optional(),
  conveyId: z.coerce.number().optional(),
  // gateBrand: z.string().optional(),
  lat: z.coerce
    .number({
      required_error: "Latitude is required",
      invalid_type_error: "Latitude must be a number",
    })
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),

  lon: z.coerce
    .number({
      required_error: "Longitude is required",
      invalid_type_error: "Longitude must be a number",
    })
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

type FormValues = z.infer<typeof formSchema>;
const MsmtPoint = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { id } = useParams();
  const { data: conveyanceParentOptions, isLoading: isConveyanceParentLoading } = useGetConveyanceParents();
  const { data: msmtPointData, isLoading } = useGetMsmtPointById(id!);
  const { mutate: createMsmtPoint } = usePostmsmtPoint();
  const { mutate: updateMsmtPoint } = usePutmsmtPoint();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      msmtPointId: "",
      msmtPointName: "",
      conveyId: undefined,
      lat: 0,
      lon: 0,
      // gateBrand: "True",
    },
  });



  const onSubmit = (data: FormValues) => {
    const formData = convertKeysToSnakeCase({ ...data, id: id })
    if (!id) {
      createMsmtPoint(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_MSMTPOINT_LIST_KEY] })
          queryClient.invalidateQueries({ queryKey: [GET_CLIENT_MSMT_POINTS_MAP] });
          queryClient.invalidateQueries({ queryKey: [POST_MSMTPOINT_LIST] });
          toast.success(data?.message);
          navigate("/measurementPoints");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Measurement point");
          queryClient.invalidateQueries({ queryKey: [POST_MSMTPOINT_LIST] });
        },
      });
    } else {
      updateMsmtPoint(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_MSMTPOINT_LIST_KEY] })
          queryClient.invalidateQueries({ queryKey: [GET_MSMTPOINT_DETAIL_KEY] })
          queryClient.invalidateQueries({ queryKey: [GET_CLIENT_MSMT_POINTS_MAP] });
          queryClient.invalidateQueries({ queryKey: [PUT_MSMTPOINT] });
          toast.success(data?.message);
          navigate("/measurementPoints");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to update Measurement point");
          queryClient.invalidateQueries({ queryKey: [PUT_MSMTPOINT] });
        },
      });
    }
  };

  useEffect(() => {
    if (msmtPointData && id) {
      form.reset({ ...msmtPointData?.data[0] });
    }
  }, [msmtPointData]);

  const viewMode = location.pathname.includes("view")

  return (
    <FormPageWrapper>
      <FormPageHeader>
        <PageHeader
          pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Measurement Point`}
          breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Measurement-Points", menuPath: "/measurementPoints" }]}
        />
        {!viewMode && <Button className='w-24 mt-4' form="msmtPointForm" type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
      </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="msmtPointForm" className=' h-auto'>
            <FormFieldsWrapper>
              <FormInput control={form.control} name='msmtPointId' label='Measurement Point ID' placeholder='Enter Measurement Point ID' type='text' disabled={viewMode} />
              <FormInput control={form.control} name='msmtPointName' label='Measurement Point Name' placeholder='Enter Measurement Point Name' type='text' disabled={viewMode} />
              <FormComboBox control={form.control} label='Select conveyance ' name='conveyId' options={conveyanceParentOptions || []} disabled={location.pathname.includes("view")} />
              <FormInput control={form.control} name='lat' label='Latitude' placeholder='Enter latitude' type='number' disabled={viewMode} />
              <FormInput control={form.control} name='lon' label='Longitude' placeholder='Enter Longitude' type='number' disabled={viewMode} />
            </FormFieldsWrapper>
            <FormMapWrapper>
              <FormPointMap
                latitude={form.watch("lat")}
                longitude={form.watch("lon")}
                onPointChange={(lat, lng) => {
                  !viewMode && form.setValue("lat", lat);
                  !viewMode && form.setValue("lon", lng);
                }}
              />
            </FormMapWrapper>


          </form>
        </Form>
      </FormWrapper>

    </FormPageWrapper>
  );
}

export default MsmtPoint;