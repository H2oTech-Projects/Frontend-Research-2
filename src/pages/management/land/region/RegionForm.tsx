import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { LatLngBounds } from "leaflet"
import { useEffect, useState } from 'react'
import BasicSelect from '@/components/BasicSelect'
import { FormFileReader } from '@/components/FormComponent/FormFileReader'
import FieldMapPreview from '@/components/FieldMapPreview'
import { usePostMapPreview } from '@/services/mapPreview'
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useMediaQuery } from '@uidotdev/usehooks'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { useGetRegionById, usePostRegion, usePutRegion } from '@/services/region'
import { GET_REGION_LIST, GET_REGION_MAP, POST_REGION, PUT_REGION } from '@/services/region/constants'
import { useSelector } from 'react-redux'
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers';

const formSchema = z.object({

  regionId: z.string().optional(),
  regionName: z.string().optional(),
  regionGeometryFile: z.array(z.instanceof(File)).optional(),
  regionCoordinates: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const RegionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const clientId = useSelector((state: any) => state.auth?.clientId);
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { data: regionDetailData, isLoading: isFieldDetailLoading } = useGetRegionById(id)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { mutate: createRegion, isPending: creatingRegion } = usePostRegion();
  const { mutate: updateRegion, isPending: updatingRegion } = usePutRegion();
  const viewMode = location.pathname.includes("view")
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      regionId: "",
      regionName: "",
      regionGeometryFile: undefined,
      regionCoordinates: "",
    },
  });

  useEffect(() => {
    if (!!form.watch("regionGeometryFile")) {
      const file = form.watch("regionGeometryFile");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            form.setValue("regionCoordinates", JSON.stringify(data?.coordinates));
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            showErrorToast(error?.response?.data?.message || "Failed upload file");
          },
        });
      }
    }
  }, [form.watch("regionGeometryFile")])


  useEffect(() => {
    if (regionDetailData && id) {
      form.reset({ ...regionDetailData?.data[0], });
      form.setValue("regionCoordinates", JSON.stringify(regionDetailData?.regionCoordinates));
      setPreviewMapData({ data: regionDetailData?.regionGeojson, coordinates: regionDetailData?.regionCoordinates, view_bounds: regionDetailData?.viewBound ? regionDetailData?.viewBound : new LatLngBounds([0, 0], [0, 0]) })
    }

  }, [regionDetailData])

  const onSubmit = (data: FormValues) => {

    const formData = convertKeysToSnakeCase({ ...data, clientId: clientId, id: id })
    if (!id) {
      createRegion(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_REGION_MAP] })
          queryClient.invalidateQueries({ queryKey: [GET_REGION_LIST] });
          queryClient.invalidateQueries({ queryKey: [POST_REGION] });
          toast.success(data?.message);
          navigate("/regions")
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Region");
          queryClient.invalidateQueries({ queryKey: [POST_REGION] });
        },
      });
    } else {
      updateRegion(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_REGION_MAP] })
          queryClient.invalidateQueries({ queryKey: [GET_REGION_LIST] });
          queryClient.invalidateQueries({ queryKey: [PUT_REGION] });
          toast.success(data?.message);
          navigate("/regions");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to update Region");
          queryClient.invalidateQueries({ queryKey: [PUT_REGION] });
        },
      });
    }

  };

  const updateFieldCoordinates = (coordinates: any) => {
    form.setValue("regionCoordinates", JSON.stringify(coordinates));
  }
  const mode = location.pathname.includes("edit") ? 'edit' : 'add'
  return (
    <FormPageWrapper>
      <FormPageHeader>
        <PageHeader
          pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Region`}
          breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Regions", menuPath: "/regions" }]}
        />
        {!viewMode && <Button className='w-24 mt-4' form="regionForm" disabled={creatingRegion || updatingRegion} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
      </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="regionForm" className=' h-auto '>
            <FormFieldsWrapper>
              <FormInput control={form.control} name='regionId' label='Region ID' placeholder='Enter Region ID' type='text' disabled={viewMode} />
              <FormInput control={form.control} name='regionName' label='Region Name' placeholder='Enter Region Name' type='text' disabled={viewMode} />
              {!viewMode && <BasicSelect
                itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
                label="Choose Geometric File Type"
                Value={shapeType}
                setValue={(newValue) => {
                  // Clear the selected files **before** changing shapeType
                  form.setValue("regionGeometryFile", undefined);
                  setPreviewMapData(null);
                  setShapeType(newValue);
                }} />}
              {!viewMode && <div className='flex flex-col gap-2 w-full'>
                {shapeType === "geojson" ? <FormFileReader
                  control={form.control}
                  name="regionGeometryFile"
                  label="Upload GeoJSON file"
                  placeholder='Choose GeoJSON File'
                  multiple={false}
                  accept=".geojson"
                /> : <FormFileReader
                  control={form.control}
                  name="regionGeometryFile"
                  label="Upload Shapefile"
                  placeholder='Choose Shapefile'
                  multiple={true}
                  accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
              </div>}
            </FormFieldsWrapper>
            <FormMapWrapper>
              <FieldMapPreview data={previewMapData} isLoading={mapLoading} updateFieldCoordinates={updateFieldCoordinates} mode={mode} />
            </FormMapWrapper>
          </form>
        </Form>
      </FormWrapper>
    </FormPageWrapper>
  );
}

export default RegionForm;