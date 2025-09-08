import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { toJson } from "@/utils/reactQueryConfig";
import { get } from "jquery";
import { createFormData } from "@/utils/createFormData";

const SUB_REGIONS_API = BASE_API_URL + '/subregions/';
export const querySubregionService = {

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
  getSubRegionMap : async ()=>{
    const response = await axiosInstance.get(SUB_REGIONS_API + "map/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},

  getSubregionById: async (id: any) => {
    const response = await axiosInstance.get(SUB_REGIONS_API + id + '/').catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  postSubregion: async (formData: any) => {
    const response = await axiosInstance.post(SUB_REGIONS_API, createFormData(formData,"subregion_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
    return convertKeysToCamelCase(toJson(response?.data));
  },
  putSubregion :async(formData:any) =>{
    const response = await axiosInstance.put(SUB_REGIONS_API + formData.id + '/', createFormData(formData,"subregion_geometry_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    })
    return convertKeysToCamelCase(toJson(response?.data));
  },

  deleteSubregion: async(id:any)=>{
    const response = await axiosInstance.delete(SUB_REGIONS_API + id + '/');
    return convertKeysToCamelCase(toJson(response?.data));
  }

}