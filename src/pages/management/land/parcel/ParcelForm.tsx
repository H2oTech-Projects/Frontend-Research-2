import PageHeader from '@/components/PageHeader'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form
} from "@/components/ui/form"
import { FormInput } from '@/components/FormComponent/FormInput'
import { FormComboBox } from '@/components/FormComponent/FormRTSelect'
import {  LatLngBounds } from "leaflet"
import { useEffect, useState } from 'react'
import { FormTextbox } from '@/components/FormComponent/FormTextbox'
import { FormRadioGroup } from '@/components/FormComponent/FormRadio'
import BasicSelect from '@/components/BasicSelect'
import { FormFileReader } from '@/components/FormComponent/FormFileReader'
import FieldMapPreview from '@/components/FieldMapPreview'
import { usePostMapPreview } from '@/services/mapPreview'
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { useGetWaysOptions } from '@/services/timeSeries'
import { convertKeysToSnakeCase } from '@/utils/stringConversion'
import { showErrorToast } from '@/utils/tools'
import { UnitSystemName } from '@/utils'
import { useGetParcelDetailByWAY, useGetRegionOptions, usePostParcelByWAY, usePutParcelByWAY } from '@/services/water/parcel'
import { GET_PARCEL_DETAIL_KEY_BY_WAY, GET_PARCEL_LIST_KEY_BY_WAY, GET_PARCEL_MAP_KEY_BY_WAY, POST_PARCEL_KEY_BY_WAY, PUT_PARCEL_KEY_BY_WAY } from '@/services/water/parcel/constant'
import { useSelector } from 'react-redux'
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers';
// ✅ Updated Schema: Coordinates as an array of [lat, lng]
const formSchema = z.object({
  wayId: z.coerce.number().optional(),
  parcelId: z.string().optional(),
  parcelName: z.string().min(5, "Field Name must be at least 5 characters"),
  parcelDesc: z.string().optional(),
  parcelCmnt: z.string().optional(),
  parcelWayComnt: z.string().optional(),
  parcelIrrigArea: z.coerce.number(),
  parcelLegalArea: z.coerce.number(),
  parcelActBool: z.string().optional(),
  parcelGeometryFile: z.array(z.instanceof(File)).optional(),
  parcelCoordinates: z.string().optional(),
  regionId: z.coerce.number().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const ParcelForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, wayId } = useParams();
  const clientId = useSelector((state: any) => state.auth?.clientId);
  const queryClient = useQueryClient();
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { data: ways, isLoading: waysLoading } = useGetWaysOptions();
  const { data: regions, isLoading: regionsLoading } = useGetRegionOptions();
  const { data: parcelDetailData, isLoading: isFieldDetailLoading } = useGetParcelDetailByWAY(wayId!, id!)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { mutate: createParcelByWay, isPending: creatingField } = usePostParcelByWAY();
  const { mutate: updateParcelByWay, isPending: updatingField } = usePutParcelByWAY();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wayId: undefined,
      parcelId: "",
      parcelName: "",
      parcelIrrigArea: undefined,
      parcelLegalArea: undefined,
      parcelActBool: "True",
      parcelDesc: "",
      parcelCmnt: "",
      parcelWayComnt: "",
      parcelGeometryFile: undefined,
      parcelCoordinates: "",
      regionId: undefined,
    },
  });

  useEffect(() => {
    if (!!form.watch("parcelGeometryFile")) {
      const file = form.watch("parcelGeometryFile");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            form.setValue("parcelCoordinates", JSON.stringify(data?.coordinates));
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            showErrorToast(error?.response?.data?.message || "Failed upload file");
          },
        });
      }
    }
  }, [form.watch("parcelGeometryFile")])

  useEffect(() => {
    if (!id && ways?.data) {
      form.setValue("wayId", ways?.data[0].value)
    }
    else {
      form.setValue("wayId", Number(wayId));
    }

  }, [ways])

  useEffect(() => {
    if (parcelDetailData && id) {
      form.reset({ ...parcelDetailData?.data[0], parcelActBool: parcelDetailData?.data[0]?.parcelActBool ? "True" : "False", parcelIrrigArea: parcelDetailData?.data[0]?.parcelIrrigHa, parcelLegalArea: parcelDetailData?.data[0]?.parcelLegalHa });
      form.setValue("wayId", Number(wayId));
      form.setValue("parcelCoordinates", JSON.stringify(parcelDetailData?.parcelCoordinates));
      setPreviewMapData({ data: parcelDetailData?.parcelGeojson, coordinates: parcelDetailData?.parcelCoordinates, view_bounds: parcelDetailData?.viewBounds ? parcelDetailData?.viewBounds : new LatLngBounds([0, 0], [0, 0]) })
    }

  }, [parcelDetailData])

  const onSubmit = (data: FormValues) => {
    const formData = convertKeysToSnakeCase({ ...data, clientId: clientId, id: id })
    if (!id) {
      createParcelByWay(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_PARCEL_LIST_KEY_BY_WAY] })
          queryClient.invalidateQueries({ queryKey: [GET_PARCEL_MAP_KEY_BY_WAY] });
          queryClient.invalidateQueries({ queryKey: [POST_PARCEL_KEY_BY_WAY] });
          // queryClient.invalidateQueries({ queryKey: [GET_parcel_MAP_KEY] });
          toast.success(data?.message);
          navigate("/parcels", {
            state: {
              wayId: formData?.way_id
            }
          });
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [POST_PARCEL_KEY_BY_WAY] });
        },
      });
    } else {
      updateParcelByWay(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_PARCEL_LIST_KEY_BY_WAY] })
          queryClient.invalidateQueries({ queryKey: [GET_PARCEL_MAP_KEY_BY_WAY] });
          queryClient.invalidateQueries({ queryKey: [PUT_PARCEL_KEY_BY_WAY] });
          queryClient.invalidateQueries({ queryKey: [GET_PARCEL_DETAIL_KEY_BY_WAY] });
          toast.success(data?.message);
          navigate("/parcels", {
            state: {
              wayId: formData?.way_id
            }
          });
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create field");
          queryClient.invalidateQueries({ queryKey: [PUT_PARCEL_KEY_BY_WAY] });
        },
      });
    }

  };

  const updateFieldCoordinates = (coordinates: any) => {
    form.setValue("parcelCoordinates", JSON.stringify(coordinates));
  }

  const viewMode = location.pathname.includes("view")

  return (
    <FormPageWrapper>
      <FormPageHeader>
        <PageHeader
          pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Parcel`}
          breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Parcels", menuPath: "/parcels" }]}
        />
        {!viewMode && <Button className='w-24 mt-4' form={"parcelForm"} disabled={creatingField || updatingField} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
      </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id={"parcelForm"} className=' h-auto'>
            <FormFieldsWrapper>
              <FormComboBox control={form.control} name='wayId' label='Water Accounting Year' options={ways?.data} disabled={id ? true : false} />
              <FormInput control={form.control} name='parcelId' label='Parcel ID' placeholder='Enter Parcel ID' type='text' disabled={viewMode} />
              <FormInput control={form.control} name='parcelName' label='Parcel Name' placeholder='Enter Parcel Name' type='text' disabled={viewMode} />
              <FormInput control={form.control} name='parcelIrrigArea' label={'Irrigable Area' + " " + `(${(UnitSystemName())})`} placeholder='Enter Irrigable  Area' type='number' disabled={viewMode} />
              <FormInput control={form.control} name='parcelLegalArea' label={'Stand By Area' + " " + `(${(UnitSystemName())})`} placeholder='Enter Stand By  Area' type='number' disabled={viewMode} />
              <FormComboBox control={form.control} name='regionId' label='Select Region' options={regions?.data} disabled={viewMode} />
              {/* <FormInput control={form.control} name= 'parcelLegalArea ' label='Legal Area' placeholder='Enter Stand By  Area' type='number' /> */}
              <FormTextbox control={form.control} name='parcelDesc' label='Parcel Description' placeholder='Enter Parcel Description' disabled={viewMode} />
              <FormTextbox control={form.control} name='parcelDesc' label='Parcel Comment' placeholder='Enter Parcel comment' disabled={viewMode} />
              <FormTextbox control={form.control} name='parcelWayComnt' label='Parcel Way Comment' placeholder='Enter comment' disabled={viewMode} />
              <FormRadioGroup control={form.control} name='parcelActBool' label='Active status' options={[{ label: "Yes", value: "True" }, { label: "No", value: "False" }]} disabled={viewMode} />

              {!viewMode && <BasicSelect
                itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
                label="Choose Geometric File Type"
                Value={shapeType}
                setValue={(newValue) => {
                  // Clear the selected files **before** changing shapeType
                  form.setValue("parcelGeometryFile", undefined);
                  setPreviewMapData(null);
                  setShapeType(newValue);
                }} />}

              {!viewMode && <div className='flex flex-col gap-2 w-full'>
                {shapeType === "geojson" ? <FormFileReader
                  control={form.control}
                  name="parcelGeometryFile"
                  label="Upload GeoJSON file"
                  placeholder='Choose GeoJSON File'
                  multiple={false}
                  accept=".geojson"
                /> : <FormFileReader
                  control={form.control}
                  name="parcelGeometryFile"
                  label="Upload Shapefile"
                  placeholder='Choose Shapefile'
                  multiple={true}
                  accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
              </div>}
            </FormFieldsWrapper>
            <FormMapWrapper>
              <FieldMapPreview data={previewMapData} isLoading={mapLoading} updateFieldCoordinates={updateFieldCoordinates} />
            </FormMapWrapper>

          </form>
        </Form>
      </FormWrapper>

    </FormPageWrapper>
  );
}

export default ParcelForm;