import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import { FormInput } from '@/components/FormComponent/FormInput';
import { FormTextbox } from '@/components/FormComponent/FormTextbox';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { FormComboBox } from '@/components/FormComponent/FormRTSelect';
import { FormFileReader } from '@/components/FormComponent/FormFileReader';
import BasicSelect from '@/components/BasicSelect';
import { usePostMapPreview } from '@/services/mapPreview';
import MapPreview from '@/components/MapPreview';
import { POST_MAP_PREVIEW } from '@/services/mapPreview/constant';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import { useGetConveyanceDetails, useGetConveyanceParents, useGetConveyanceTypes, usePostConveyance, usePutConveyance } from '@/services/convayance';
import { useSelector } from 'react-redux';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { GET_CONVEYANCE_LIST, GET_CONVEYANCE_MAP, GET_CONVEYANCE_PARENTS } from '@/services/convayance/constants';
import { showErrorToast } from '@/utils/tools';
import { FormFieldsWrapper, FormMapWrapper, FormPageHeader, FormPageWrapper, FormWrapper } from '@/components/wrappers/formWrappers';

const ConveyancesSchema = z.object({
  // clientId: z.string().optional(),
  conveyId: z.string().optional(),
  conveyName: z.string().min(1, "Convey name is required"),
  conveyDesc: z.string().optional(),
  conveyParentId: z.coerce.number().optional(),
  conveyType: z.coerce.number().optional(),
  conveySeepageCms: z.coerce.number({
    required_error: "Seepage rate must be a number"
  }).nonnegative("Seepage must be non-negative").optional(),
  conveyGeom: z.array(z.instanceof(File)).optional(),
});

export type ConveyFormType = z.infer<typeof ConveyancesSchema>;

const ConveyancesForm = () => {
  const [shapeType, setShapeType] = useState<string>("shape");
  const [previewMapData, setPreviewMapData] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const viewMode = location.pathname.includes("view")
  const { id } = useParams();
  const queryClient = useQueryClient();
  const clientId = useSelector((state: any) => state.auth?.clientId);
  const { mutate: previewMap, isPending: mapLoading } = usePostMapPreview();
  const { data: conveyanceTypeOptions, isLoading: isConveyanceTypesOptionLoading } = useGetConveyanceTypes();
  const { data: conveyanceParentOptions, isLoading: isConveyanceParentLoading } = useGetConveyanceParents();
  const { data: conveyanceData, isLoading } = useGetConveyanceDetails(id);
  const { mutate: createConveyance, isPending: isConveyanceCreating } = usePostConveyance();
  const { mutate: updateConveyance, isPending: isConveyanceUpdating } = usePutConveyance();
  const form = useForm<ConveyFormType>({
    resolver: zodResolver(ConveyancesSchema),
    defaultValues: {
      // clientId: "",
      conveyId: "",
      conveyName: "",
      conveyDesc: "",
      conveyParentId: undefined,
      conveySeepageCms: undefined,
      conveyGeom: undefined,
      conveyType: undefined,
    },
  });

  const onSubmit = (data: ConveyFormType) => {
    const formData = convertKeysToSnakeCase({ ...data, clientId: clientId, id: id || undefined });
    const cleaned = Object.fromEntries(
      Object.entries(formData).filter(([_, value]) => value !== undefined)
    );
    if (id) {
      updateConveyance(formData, {
        onSuccess: (response) => {
          toast.success("Conveyance updated successfully");
          queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] });
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_LIST] });
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_MAP] })
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_PARENTS] })
          form.reset();
          setPreviewMapData(null);
          navigate("/conveyances");
        },
        onError: (error: any) => {
          showErrorToast(error?.response?.data.message);
        }
      });
    }
    else {
      createConveyance(cleaned, {
        onSuccess: (response) => {
          toast.success("Conveyance created successfully");
          queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] });
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_LIST] });
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_MAP] });
          queryClient.invalidateQueries({ queryKey: [GET_CONVEYANCE_PARENTS] })
          form.reset();
          setPreviewMapData(null);
          navigate("/conveyances");
        },
        onError: (error: any) => {
          showErrorToast(error?.response?.data.message);
        }
      });
    }

  };
  //const polyline = form.watch("ConveyCoordinates") || [];
  // const featureGroupPolygonRef = React.useRef<any>(null);
  // const { fields, append, remove } = useFieldArray({
  //   control: form.control,
  //   name: "coordinates",
  // });

  useEffect(() => {
    if (!!form.watch("conveyGeom")) {
      const file = form.watch("conveyGeom");
      if (file?.length !== 0) {
        previewMap(file, {
          onSuccess: (data) => {
            setPreviewMapData(data || null);
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
          },
          onError: (error: any) => {
            queryClient.invalidateQueries({ queryKey: [POST_MAP_PREVIEW] })
            toast.error(error?.response?.data.message?.APIException[0]);
          },
        });
      }
    }
  }, [form.watch("conveyGeom")])

  useEffect(() => {
    if (conveyanceData) {
      form.reset({ ...conveyanceData?.data[0], conveyType: conveyanceData?.data[0]?.conveyTypeId });
      setPreviewMapData({ data: conveyanceData?.conveyGeojson, view_bounds: conveyanceData?.viewBounds });
    }
  }, [conveyanceData]);


  return (
    <FormPageWrapper>
     <FormPageHeader>
       <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Conveyance`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Conveyances", menuPath: "/conveyances" }
        ]}
      />
          {!viewMode && <Button className='w-24 mt-4' form="conveyanceForm"  disabled={isConveyanceCreating || isConveyanceUpdating} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
    </FormPageHeader>
      <FormWrapper>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="conveyanceForm" className='h-auto'>
            <FormFieldsWrapper>
              <FormInput
                control={form.control}
                name='conveyName'
                label='Conveyance Name'
                placeholder='Enter Conveyance Name'
                type='text'
                disabled={viewMode}
              />
              <FormInput
                control={form.control}
                name='conveyId'
                label='Conveyance ID'
                placeholder='Enter Conveyance ID '
                type='text'
                disabled={viewMode}
              />

              <FormComboBox
                control={form.control}
                name='conveyType'
                label='Select Conveyance Type'
                options={
                  conveyanceTypeOptions || []
                }
                disabled={viewMode}
              />
              {/* <FormComboBox
                  control={form.control}
                  name='clientId'
                  label='Select Client'
                  options={
                    [
                      { label: "Ram", value: "GPS" },
                      { label: "Hari", value: "Survey" },
                      { label: "Aerial", value: "Aerial" }
                    ]
                  }
                /> */}
              <FormComboBox
                control={form.control}
                name='conveyParentId'
                label='Select parent conveyance '
                options={
                  conveyanceParentOptions || []
                }
                disabled={viewMode}
              />
              <FormInput
                control={form.control}
                name='conveySeepageCms'
                label='Seepage (cms)'
                placeholder='Enter Seepage in cms'
                type='number'
                disabled={viewMode}
              />
              <FormTextbox
                control={form.control}
                name='conveyDesc'
                label='Convey Description'
                placeholder='Enter Convey Description'
                rows={1}
                disabled={viewMode}
              />

              {!viewMode && <BasicSelect
                itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
                label="Choose Geometric File Type"
                Value={shapeType}
                setValue={(newValue) => {
                  form.setValue("conveyGeom", undefined);
                  setPreviewMapData(null);
                  setShapeType(newValue);
                }} />}
              {!viewMode && <div className='flex flex-col gap-2 w-full'>
                {shapeType === "geojson" ? <FormFileReader
                  control={form.control}
                  name="conveyGeom"
                  label="Upload GeoJSON file"
                  placeholder='Choose GeoJSON File'
                  multiple={false}
                  accept=".geojson"
                /> : <FormFileReader
                  control={form.control}
                  name="conveyGeom"
                  label="Upload Shapefile"
                  placeholder='Choose Shapefile'
                  multiple={true}
                  accept=".prj,.shp,.dbf,.shx,.qmd,.cpg" />}
              </div>}
            </FormFieldsWrapper>
            <FormMapWrapper>
              <MapPreview data={previewMapData} isLoading={mapLoading} />
            </FormMapWrapper>         
        </form>
      </Form>
    </FormWrapper>
    </FormPageWrapper>
  );
};

export default ConveyancesForm;
