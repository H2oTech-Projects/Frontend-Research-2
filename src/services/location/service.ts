import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";

const LOCATION_API = BASE_API_URL + '/countries/options/';

export const queryLocations = {
  getCountryList: async () => { 
    const response = await axiosInstance.get(LOCATION_API).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getAdminAreaList: async (id:number | undefined) => { 
    const response = await axiosInstance.get(BASE_API_URL + "/countries/" + id + "/options/admin_areas/").catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getSubAdminAreaList: async (id:number | undefined) => { 
    const response = await axiosInstance.get(BASE_API_URL + "/admin_areas/" + id + "/options/sub_admin_areas/").catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getSubSubAdminAreaList: async (id:number | undefined) => { 
    const response = await axiosInstance.get(BASE_API_URL + "/sub_admin_areas/" + id + "/options/sub_admin_area_level_2s/").catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getSubSubSubAdminAreaList: async (id:number | undefined) => { 
    const response = await axiosInstance.get(BASE_API_URL + "/sub_admin_area_level_2s/" + id + "/options/sub_admin_area_level_3s/").catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
}

