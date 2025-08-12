import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { createFormData } from "@/utils/createFormData";

const GET_FIELD_LIST = BASE_API_URL + "/fields/";
const GET_FIELD_MAP_LIST = BASE_API_URL + "/fields/map/";

export const queryFieldService = {
  getFieldList: async (tableInfo:initialTableDataTypes) => {
    const response = await axiosInstance.get(GET_FIELD_LIST,{
      params:{
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort_by:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    return toJson(response?.data);
  },

  getFieldMapList :async()=>{
    const response  = await axiosInstance.get(GET_FIELD_MAP_LIST).catch((err) => console.log(err));
    return toJson(response);
},

getParcelListByWAY : async (tableInfo:initialTableDataTypes,wayId:number) =>{
    const response = await axiosInstance.get(BASE_API_URL + "/ways/" + wayId + "/parcels/",{
      params:{
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort_by:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
},
getParcelMapByWAY : async (wapId:number) =>{
    const response = await axiosInstance.get(BASE_API_URL + "/ways/" + wapId + "/parcels/map/",
    ).catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
},

getFieldDetailByWAP : async (fieldId:string ,wapId:string) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/fields/" + fieldId + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
},
deleteFieldByWAP : async ({ fieldId, wapId }: { fieldId: string; wapId: number }) => {
    const response = await axiosInstance.delete(BASE_API_URL + "/waps/" + wapId + "/fields/" + fieldId + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
},

postFieldByWap : async (formData:any) =>{
  const response = await axiosInstance.post(BASE_API_URL + "/waps/" + formData.wap_id + "/fields/",createFormData(formData,"field_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
  return response?.data
},
putFieldByWap : async (formData:any) =>{
  const response = await axiosInstance.put(BASE_API_URL + "/waps/" + formData.wap_id + "/fields/" + formData?.id + "/",createFormData(formData,"field_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
  return response?.data
}
};