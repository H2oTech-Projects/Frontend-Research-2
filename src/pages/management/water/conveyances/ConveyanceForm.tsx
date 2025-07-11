import React, { useEffect, useState } from 'react';
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
import { set } from 'date-fns';
import { useSelector } from 'react-redux';
import { convertKeysToSnakeCase } from '@/utils/stringConversion';
import { GET_CONVEYANCE_LIST, GET_CONVEYANCE_MAP, GET_CONVEYANCE_PARENTS } from '@/services/convayance/constants';
import { showErrorToast } from '@/utils/tools';

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
    console.log(cleaned, "Form Data");
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
    <div className='h-w-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} Conveyance`}
        breadcrumbPathList={[
          { menuName: "Management", menuPath: "" },
          { menuName: "Conveyance", menuPath: "/conveyances" }
        ]}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-4 dark:bg-slate-900 dark:text-white'>
          <div className='grid grid-cols-2 gap-4 mb-4'>

            <FormInput
              control={form.control}
              name='conveyName'
              label='Convey Name'
              placeholder='Enter Convey Name'
              type='text'
              disabled={location.pathname.includes("view")}
            />
            <FormInput
              control={form.control}
              name='conveyId'
              label='Convey ID'
              placeholder='Enter Convey ID (e.g., ABC)'
              type='text'
              disabled={location.pathname.includes("view")}
            />

            <FormComboBox
              control={form.control}
              name='conveyType'
              label='Select Convey Type'
              options={
                conveyanceTypeOptions || []
              }
              disabled={location.pathname.includes("view")}
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
              disabled={location.pathname.includes("view")}
            />
            <FormInput
              control={form.control}
              name='conveySeepageCms'
              label='Seepage (cms)'
              placeholder='Enter Seepage in cms'
              type='number'
              disabled={location.pathname.includes("view")}
            />
            <FormTextbox
              control={form.control}
              name='conveyDesc'
              label='Convey Description'
              placeholder='Enter Convey Description'
              rows={1}
              disabled={location.pathname.includes("view")}
            />




            {!location.pathname.includes("view") && <BasicSelect
              itemList={[{ label: "Shapefile", value: "shape" }, { label: "GeoJSON", value: "geojson" }]}
              label="Choose Geometric File Type"
              Value={shapeType}
              setValue={(newValue) => {
                form.setValue("conveyGeom", undefined);
                setPreviewMapData(null);
                setShapeType(newValue);
              }} />}
            {!location.pathname.includes("view") && <div className='flex flex-col gap-2 w-full'>
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
          </div>
          <MapPreview data={previewMapData} isLoading={mapLoading} />


          {!location.pathname.includes("view") && <Button className='w-24 mt-4' disabled={isConveyanceCreating || isConveyanceUpdating} type="submit">{location.pathname.includes("edit") ? "Update" : "Add"}</Button>}
        </form>
      </Form>
    </div>
  );
};

export default ConveyancesForm;
