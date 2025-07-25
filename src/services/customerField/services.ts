import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase, convertKeysToSnakeCase } from "@/utils/stringConversion";
import { removeKeysFromObject } from "@/utils";
import { initialTableDataTypes } from "@/types/tableTypes";

export const queryCustomerFieldService = {

  getCustomerOptions: async () => {
    const response = await axiosInstance.get(BASE_API_URL + "/customers/options/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
  },

  getFieldOptions: async (wayId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wayId + "/fields/options/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
  },

  getCustomerFieldListByWAP: async (tableInfo: initialTableDataTypes, wapId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/field_customers/", {
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

  getCustomerFieldDetailByWAP : async (customerFieldId:string ,wapId:string) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/field_customers/" + customerFieldId + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
},

  postCustomerField: async (formData: any) => {
    const data = convertKeysToSnakeCase(removeKeysFromObject(formData, ["wapId", "customerIds"]))
    console.log(data)
    const response = await axiosInstance.post(BASE_API_URL + "/waps/" + formData?.wapId + "/field_customers/", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  }

}