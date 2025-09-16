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
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { useGetRegionById, usePostRegion, usePutRegion } from '@/services/region'
import { GET_REGION_LIST, GET_REGION_MAP, POST_REGION, PUT_REGION } from '@/services/region/constants'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
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
  const { id, wapId } = useParams();
  const clientId = JSON.parse(localStorage.getItem("auth") as string)?.client_id
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { data: waps, isLoading: wapsLoading } = useGetWaps();
  const { data: regionDetailData, isLoading: isFieldDetailLoading } = useGetRegionById( id)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { mutate: createRegion, isPending: creatingRegion } = usePostRegion();
  const { mutate: updateRegion, isPending: updatingRegion } = usePutRegion();
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
      setPreviewMapData({ data: regionDetailData?.regionGeojson,coordinates: regionDetailData?.regionCoordinates,   view_bounds: regionDetailData?.viewBound ? regionDetailData?.viewBound : new LatLngBounds([0, 0], [0, 0]) })
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
          showErrorToast(error?.response?.data?.message || "Failed to create region");
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
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [PUT_REGION] });
        },
      });
    }

  };

  const updateFieldCoordinates = (coordinates: any) => {
    form.setValue("regionCoordinates", JSON.stringify(coordinates));
  }

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Region`}
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Region", menuPath: "/regions" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>



          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
        
            <FormInput control={form.control} name='regionId' label='Region ID' placeholder='Enter Region ID' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='regionName' label='Region Name' placeholder='Enter Region Name' type='text' disabled={location.pathname.includes("view")} />
            

            {!location.pathname.includes("view") && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                // Clear the selected files **before** changing shapeType
                form.setValue("regionGeometryFile", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}

            {!location.pathname.includes("view") && <div className='flex flex-col gap-2 w-full'>
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

          </div>
          <FieldMapPreview data={previewMapData} isLoading={mapLoading} updateFieldCoordinates={updateFieldCoordinates} />


          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          {!location.pathname.includes("view") && <Button className='w-24 mt-4' disabled={creatingRegion || updatingRegion} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
}

export default RegionForm;