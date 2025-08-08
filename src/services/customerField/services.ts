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
  getCustomerFieldMapByWAP: async (wapId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/customers_field/map/",
    ).catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },
  getCustomerFieldDetailByWAP: async (customerId: string, wapId: string) => {
    const response = await axiosInstance.get(BASE_API_URL + "/waps/" + wapId + "/customers/" + customerId + "/fields/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },

  postCustomerField: async (formData: any) => {
    const data = convertKeysToSnakeCase(removeKeysFromObject(formData, ["wapId", "customerIds"]))
    const response = await axiosInstance.post(BASE_API_URL + "/waps/" + formData?.wapId + "/field_customers/", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  },
  putCustomerField: async (formData: any) => {
    const data = convertKeysToSnakeCase(formData.data?.customers)
    const response = await axiosInstance.put(BASE_API_URL + "/waps/" + formData?.wapId + "/customers/" + formData?.customerId + "/fields/", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    const respo = convertKeysToCamelCase(toJson(response.data));
    return respo;
  }

}