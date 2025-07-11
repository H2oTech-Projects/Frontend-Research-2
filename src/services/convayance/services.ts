import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { get } from "jquery";
import { createFormData } from "@/utils/createFormData";

const CONVEYANCES_API = BASE_API_URL + '/conveyance/';

export const queryConveyanceService = {
  getConveyanceList: async (tableInfo: any) => {
    const response = await axiosInstance.get(CONVEYANCES_API, {
      params: {
        page_no: tableInfo?.page_no,
        page_size: tableInfo?.page_size,
        search: tableInfo?.search,
        sort_by: tableInfo?.sort,
        sort_order: tableInfo?.sort_order
      }
    }).catch((err) => console.log(err));

    return convertKeysToCamelCase(toJson(response?.data));
  },
  getConveyanceDetails: async (id: string | undefined | null) => {
    const response = await axiosInstance.get(CONVEYANCES_API + id + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
  },

  getConveyanceTypes: async () => {
    const response = await axiosInstance.get(BASE_API_URL + "/conveyance_type/detail/").catch((err) => console.log(err));
     const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
  },

  getConveyanceParents: async () => {
    const response = await axiosInstance.get(BASE_API_URL + "/conveyance_parent/detail/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},

  getConveyanceMap : async ()=>{
    const response = await axiosInstance.get(CONVEYANCES_API + "map/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},

  postConveyance: async (data: any) => {
    const response = await axiosInstance.post(CONVEYANCES_API, createFormData(data,"convey_geom"), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return convertKeysToCamelCase(toJson(response));
  },

  putConveyance: async (data: any) => {
    const response = await axiosInstance.put(CONVEYANCES_API + data?.id + "/", createFormData(data,"convey_geom"), {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return convertKeysToCamelCase(toJson(response));
  },

  deleteConveyance: async (id: string) => {
    const response = await axiosInstance.delete(CONVEYANCES_API + id + "/");
    return convertKeysToCamelCase(toJson(response));
  },


}