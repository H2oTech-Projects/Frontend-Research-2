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
import { GET_SUB_REGION_MAP, } from '@/services/region/constants'
import { useGetSubregionById, usePostSubregion, usePutSubregion } from '@/services/subregion'
import { GET_SUB_REGION_LIST, POST_SUBREGION, PUT_SUBREGION } from '@/services/subregion/constant'
import { useSelector } from 'react-redux'
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers';
const formSchema = z.object({
  subRegionName: z.string().optional(),
  subregionGeometryFile: z.array(z.instanceof(File)).optional(),
  subregionCoordinates: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;
const SubregionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const clientId = useSelector((state: any) => state.auth?.clientId);
  const queryClient = useQueryClient();
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const [shapeType, setShapeType] = useState<string>("shape");
  const { data: subregionDetailData, isLoading: isFieldDetailLoading } = useGetSubregionById(id)
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { mutate: createSubregion, isPending: creatingSubregion } = usePostSubregion();
  const { mutate: updateSubregion, isPending: updatingSubregion } = usePutSubregion();
  const viewMode = location.pathname.includes("view")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      subRegionName: "",
      subregionGeometryFile: undefined,
      subregionCoordinates: "",
    },
  });

  useEffect(() => {
    if (!!form.watch("subregionGeometryFile")) {
      const file = form.watch("subregionGeometryFile");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            form.setValue("subregionCoordinates", JSON.stringify(data?.coordinates));
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            showErrorToast(error?.response?.data?.message || "Failed upload file");
          },
        });
      }
    }
  }, [form.watch("subregionGeometryFile")])


  useEffect(() => {
    if (subregionDetailData && id) {
      form.reset({ ...subregionDetailData?.data[0], });
      form.setValue("subregionCoordinates", JSON.stringify(subregionDetailData?.regionCoordinates));
      setPreviewMapData({ data: subregionDetailData?.regionGeojson, coordinates: subregionDetailData?.regionCoordinates, view_bounds: subregionDetailData?.viewBound ? subregionDetailData?.viewBound : new LatLngBounds([0, 0], [0, 0]) })
    }

  }, [subregionDetailData])

  const onSubmit = (data: FormValues) => {

    const formData = convertKeysToSnakeCase({ ...data, clientId: clientId, id: id })
    if (!id) {
      createSubregion(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_SUB_REGION_MAP] })
          queryClient.invalidateQueries({ queryKey: [GET_SUB_REGION_LIST] });
          queryClient.invalidateQueries({ queryKey: [POST_SUBREGION] });
          toast.success(data?.message);
          navigate("/subregions")
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to create Subregion");
          queryClient.invalidateQueries({ queryKey: [POST_SUBREGION] });
        },
      });
    } else {
      updateSubregion(formData, {
        onSuccess: (data: any) => {
          // Invalidate and refetch
          queryClient.invalidateQueries({ queryKey: [GET_SUB_REGION_MAP] })
          queryClient.invalidateQueries({ queryKey: [GET_SUB_REGION_LIST] });
          queryClient.invalidateQueries({ queryKey: [PUT_SUBREGION] });
          toast.success(data?.message);
          navigate("/subregions");
          form.reset(); // Reset the form after successful submission
        },
        onError: (error) => {
          showErrorToast(error?.response?.data?.message || "Failed to update Subregion");
          queryClient.invalidateQueries({ queryKey: [PUT_SUBREGION] });
        },
      });
    }

  };

  const updateFieldCoordinates = (coordinates: any) => {
    form.setValue("subregionCoordinates", JSON.stringify(coordinates));
  }

  const mode = location.pathname.includes("edit") ? 'edit' : 'add'
  return (
    <FormPageWrapper>
      <FormPageHeader>
        <PageHeader
          pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Subregion`}
          breadcrumbPathList={[{ menuName: "Management", menuPath: "" }, { menuName: "Subregions", menuPath: "/subregions" }]}
        />
        {!viewMode && <Button className='w-24 mt-4' form="subregionForm" disabled={creatingSubregion || updatingSubregion} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
      </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="subregionForm" className=' h-auto '>
            <FormFieldsWrapper>
              <FormInput control={form.control} name='subRegionName' label='Subregion Name' placeholder='Enter subregion Name' type='text' disabled={viewMode} />
              {!viewMode && <BasicSelect
                itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
                label="Choose Geometric File Type"
                Value={shapeType}
                setValue={(newValue) => {
                  // Clear the selected files **before** changing shapeType
                  form.setValue("subregionGeometryFile", undefined);
                  setPreviewMapData(null);
                  setShapeType(newValue);
                }} />}

              {!viewMode && <div className='flex flex-col gap-2 w-full'>
                {shapeType === "geojson" ? <FormFileReader
                  control={form.control}
                  name="subregionGeometryFile"
                  label="Upload GeoJSON file"
                  placeholder='Choose GeoJSON File'
                  multiple={false}
                  accept=".geojson"
                /> : <FormFileReader
                  control={form.control}
                  name="subregionGeometryFile"
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

export default SubregionForm;