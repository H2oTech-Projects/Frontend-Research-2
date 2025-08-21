import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils/stringConversion";
import { initialTableDataTypes } from "@/types/tableTypes";

export const queryCropsService = {
  getCropsList: async (tableInfo: any) => {
    const response = await axiosInstance.get(BASE_API_URL + "/crops/", {
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

  getCropsFieldListByWAP: async (tableInfo: initialTableDataTypes, wapId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/cropfields/", {
      params: {
        page_no: tableInfo?.page_no,
        page_size: tableInfo?.page_size,
        search: tableInfo?.search,
        sort_by: tableInfo?.sort,
        sort_order: tableInfo?.sort_order
      }
    }).catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },

  getCropFieldMapByWAP: async (wapId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/cropfields/map/",
    ).catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },

  putCropsField: async (formData: any) => {
    const data = convertKeysToSnakeCase(formData.data)
    console.log(formData)
    const response = await axiosInstance.put(BASE_API_URL + "/waps/" + formData?.wapId + "/crops/" + formData?.cropId + "/fields/", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    const respo = convertKeysToCamelCase(toJson(response.data));
    return respo;
  },

  getCropFieldDetailByWAP: async (cropId: string, wapId: string) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/crops/" + cropId + "/fields/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },

}