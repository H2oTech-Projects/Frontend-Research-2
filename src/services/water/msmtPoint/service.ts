import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";
import {convertKeysToCamelCase} from "@/utils/stringConversion";

const GET_MSMTPOINT_LIST = BASE_API_URL ;
const GET_FIELD_MAP_LIST = BASE_API_URL + "/fields/map/";
const GET_CLIENT_FIELD_MAP_LIST = BASE_API_URL + "/clientfields/";
const PUT_MSMTPOINT_FIELDS = BASE_API_URL + "/msmt_points/";
export interface RegisterResponse {
  success?: string;
  message: { [key: string]: any };
}

export const queryFieldService = {
  // getMsmtPointList: async (tableInfo:initialTableDataTypes, wapId: string | null) => {
  //   const response = await axiosInstance.get(GET_MSMTPOINT_LIST+"/msmt_points/waps/"+wapId+ "/msmt_points/",{
  //     params:{
  //               page_no:tableInfo?.page_no,
  //               page_size:tableInfo?.page_size,
  //               search:tableInfo?.search,
  //               sort_by:tableInfo?.sort,
  //               sort_order:tableInfo?.sort_order}
  //     }).catch((err) => console.log(err));
  //   return convertKeysToCamelCase(toJson(response?.data));
  // },
  getMsmtPointList: async (tableInfo:initialTableDataTypes, wapId: string | null) => {
    const response = await axiosInstance.get(GET_MSMTPOINT_LIST+"/waps/"+wapId+ "/msmt_points/",{
      params:{
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort_by:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },

getApportionMethod : async ()=>{
  const response = await axiosInstance.get(BASE_API_URL + "/apportion_methods/")

      const data = convertKeysToCamelCase(toJson(response));
    return data?.data
},

  getFieldMapList :async()=>{
    const response  = await axiosInstance.get(GET_FIELD_MAP_LIST).catch((err) => console.log(err));
    return toJson(response);
},
getClientFieldMapList :async()=>{
  const response  = await axiosInstance.get(GET_CLIENT_FIELD_MAP_LIST).catch((err) => console.log(err));
  return toJson(response);
},


getMsmtPointFieldsDetail: async (id:any,wapId:any) => {
  const response = await axiosInstance.get<any>(PUT_MSMTPOINT_FIELDS + id + "/waps/"+wapId+"/fields/apportion_config/");
  const data = convertKeysToCamelCase(toJson(response));
  return data?.data
},
putMsmtPointFields: async (data: any) => {
  const formData = data?.fields ? {
    apportion_method_type_id: data?.apportion_method_type_id,
    linkedFields: data?.linkedFields,
    fields: data?.fields
} : {
   apportion_method_type_id: data?.apportion_method_type_id,
    linkedFields: data?.linkedFields,
}
  const response = await axiosInstance.put<any>(PUT_MSMTPOINT_FIELDS + data?.id + "/waps/"+data?.wapId+"/fields/apportion_config/",
    formData
, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
},
};