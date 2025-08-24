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
import { GET_FIELD_DETAIL_KEY_BY_WAP, GET_FIELD_LIST_KEY_BY_WAP, GET_FIELD_MAP_KEY, POST_FIELD_KEY_BY_WAP, PUT_FIELD_KEY_BY_WAP } from '@/services/water/field/constant'
import { showErrorToast } from '@/utils/tools'
import { UnitSystemName } from '@/utils'

// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  wapId: z.string().nullable().optional(),
  fieldId: z.string().optional(),
  fieldName: z.string().min(5, "Field Name must be at least 5 characters"),
  fieldDesc: z.string().optional(),
  fieldIrrigArea: z.coerce.number(),
  fieldLegalArea: z.coerce.number(),
  fieldActBool: z.string().optional(),
  fieldGeometryFile: z.array(z.instanceof(File)).optional(),
  fieldCoordinates: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const FieldForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, wapId } = useParams();
  const clientId = JSON.parse(localStorage.getItem("auth") as string)?.client_id
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { data: waps, isLoading: wapsLoading } = useGetWaps();
  const { data: fieldDetailData, isLoading: isFieldDetailLoading } = useGetFieldDetailByWAP(wapId!, id!)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { mutate: createFieldByWap, isPending: creatingField } = usePostFieldByWAP();
  const { mutate: updateFieldByWap, isPending: updatingField } = usePutFieldByWAP();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wapId: undefined,
      fieldId: "",
      fieldName: "",
      fieldIrrigArea: undefined,
      fieldLegalArea: undefined,
      fieldActBool: "True",
      fieldDesc: "",
      fieldGeometryFile: undefined,
      fieldCoordinates: "",
    },
  });

  useEffect(() => {
    if (!!form.watch("fieldGeometryFile")) {
      const file = form.watch("fieldGeometryFile");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            form.setValue("fieldCoordinates", JSON.stringify(data?.coordinates));
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            showErrorToast(error?.response?.data?.message || "Failed upload file");
          },
        });
      }
    }
  }, [form.watch("fieldGeometryFile")])

  useEffect(() => {
    if (!id && waps?.data) {
      form.setValue("wapId", waps?.data[0].value)
    }
    else {
      form.setValue("wapId", wapId)
    }

  }, [waps])

  useEffect(() => {
    if (fieldDetailData && id) {
      form.reset({ ...fieldDetailData?.data[0], fieldActBool: fieldDetailData?.data[0]?.fieldActBool ? "True" : "False", fieldIrrigArea: fieldDetailData?.data[0]?.fieldIrrigHa, fieldLegalArea: fieldDetailData?.data[0]?.fieldLegalHa });
      form.setValue("wapId", wapId);
      form.setValue("fieldCoordinates", JSON.stringify(fieldDetailData?.fieldCoordinates));
      setPreviewMapData({ data: fieldDetailData?.fieldGeojson,coordinates: fieldDetailData?.fieldCoordinates,   view_bounds: fieldDetailData?.viewBounds ? fieldDetailData?.viewBounds : new LatLngBounds([0, 0], [0, 0]) })
    }

  }, [fieldDetailData])

  const onSubmit = (data: FormValues) => {
    const formData = convertKeysToSnakeCase({ ...data, clientId: clientId, id: id })
    if (!id) {
      createFieldByWap(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_LIST_KEY_BY_WAP] })
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_DETAIL_KEY_BY_WAP] });
          queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_MAP_KEY] });
          toast.success(data?.message);
          navigate("/fields", {
            state: {
              wapId: formData?.wap_id
            }
          });
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
        },
      });
    } else {
      updateFieldByWap(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_LIST_KEY_BY_WAP] })
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_DETAIL_KEY_BY_WAP] });
          queryClient.invalidateQueries({ queryKey: [PUT_FIELD_KEY_BY_WAP] });
          queryClient.invalidateQueries({ queryKey: [GET_FIELD_MAP_KEY] });
          toast.success(data?.message);
          navigate("/fields", {
            state: {
              wapId: formData?.wap_id
            }
          });
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [POST_FIELD_KEY_BY_WAP] });
        },
      });
    }

  };

  const updateFieldCoordinates = (coordinates: any) => {
    form.setValue("fieldCoordinates", JSON.stringify(coordinates));
  }

  return (
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Field`}
        breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Field", menuPath: "/field" }]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>



          <div className={cn('grid gap-4 auto-rows-auto', isDesktopDevice ? 'grid-cols-3' : 'grid-cols-1')}>
            <FormComboBox control={form.control} name='wapId' label='Water Accounting Period' options={waps?.data} disabled={id ? true : false} />
            <FormInput control={form.control} name='fieldId' label='Field ID' placeholder='Enter Field ID' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='fieldName' label='Field Name' placeholder='Enter Field Name' type='text' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='fieldIrrigArea' label={'Irrigable Area' + " " + `(${(UnitSystemName())})`} placeholder='Enter Irrigable  Area' type='number' disabled={location.pathname.includes("view")} />
            <FormInput control={form.control} name='fieldLegalArea' label={'Stand By Area' + " " + `(${(UnitSystemName())})`} placeholder='Enter Stand By  Area' type='number' disabled={location.pathname.includes("view")} />
            {/* <FormInput control={form.control} name= 'fieldLegalArea ' label='Legal Area' placeholder='Enter Stand By  Area' type='number' /> */}
            <FormTextbox control={form.control} name='fieldDesc' label='Field Description' placeholder='Enter Field Description' disabled={location.pathname.includes("view")} />
            <FormRadioGroup control={form.control} name='fieldActBool' label='Active status' options={[{ label: "Yes", value: "True" }, { label: "No", value: "False" }]} disabled={location.pathname.includes("view")} />

            {!location.pathname.includes("view") && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                // Clear the selected files **before** changing shapeType
                form.setValue("fieldGeometryFile", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}

            {!location.pathname.includes("view") && <div className='flex flex-col gap-2 w-full'>
              {shapeType === "geojson" ? <FormFileReader
                control={form.control}
                name="fieldGeometryFile"
                label="Upload GeoJSON file"
                placeholder='Choose GeoJSON File'
                multiple={false}
                accept=".geojson"
              /> : <FormFileReader
                control={form.control}
                name="fieldGeometryFile"
                label="Upload Shapefile"
                placeholder='Choose Shapefile'
                multiple={true}
                accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
            </div>}

          </div>
          <FieldMapPreview data={previewMapData} isLoading={mapLoading} updateFieldCoordinates={updateFieldCoordinates} />


          {/* <FormCoordinatesMap control={form.control} name="markers" label="Point Coordinates" onCreated={onMarkerCreated} onEdited={onMarkerEdited} onDeleted={onMarkerDeleted} type="marker" refLayer={featureGroupMarkerRef}/> */}
          {!location.pathname.includes("view") && <Button className='w-24 mt-4' disabled={creatingField || updatingField} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
}

export default FieldForm;