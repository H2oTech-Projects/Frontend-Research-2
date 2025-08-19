import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { toJson } from "@/utils/reactQueryConfig";


const REGIONS_API = BASE_API_URL + '/regions/';
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
  getRegionMap : async ()=>{
    const response = await axiosInstance.get(REGIONS_API + "map/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},
}