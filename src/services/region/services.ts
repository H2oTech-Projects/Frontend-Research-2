import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { toJson } from "@/utils/reactQueryConfig";
import { get } from "jquery";
import { createFormData } from "@/utils/createFormData";
import { de } from "zod/dist/types/v4/locales";


const REGIONS_API = BASE_API_URL + '/regions/';
const SUB_REGIONS_API = BASE_API_URL + '/subregions/';
export const queryRegionService = {
  getRegionList: async (tableInfo: any) => {
    const response = await axiosInstance.get(REGIONS_API, {
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
  getSubRegionList: async (tableInfo: any) => {
    const response = await axiosInstance.get(SUB_REGIONS_API, {
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
  getRegionMap : async ()=>{
    const response = await axiosInstance.get(REGIONS_API + "map/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},
  getSubRegionMap : async ()=>{
    const response = await axiosInstance.get(SUB_REGIONS_API + "map/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},

  getRegionById: async (id: any) => {
    const response = await axiosInstance.get(REGIONS_API + id + '/').catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  postRegion: async (formData: any) => {
    const response = await axiosInstance.post(REGIONS_API, createFormData(formData,"region_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
    return convertKeysToCamelCase(toJson(response?.data));
  },
  putRegion :async(formData:any) =>{
    const response = await axiosInstance.put(REGIONS_API + formData.id + '/', createFormData(formData,"region_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
    return convertKeysToCamelCase(toJson(response?.data));
  },

  deleteRegion: async(id:any)=>{
    const response = await axiosInstance.delete(REGIONS_API + id + '/');
    return convertKeysToCamelCase(toJson(response?.data));
  }

}