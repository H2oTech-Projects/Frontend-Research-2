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

  getCustomerParcelListByWAY: async (tableInfo: initialTableDataTypes, wayId: number) => {
    const response = await axiosInstance.get(BASE_API_URL + "/ways/" + wayId + "/customer_parcels/", {
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
  putCustomerParcel: async (formData: any) => {
    const data = convertKeysToSnakeCase(formData.data?.parcels)
    const response = await axiosInstance.put(BASE_API_URL + "/ways/" + formData?.wayId + "/customers/" + formData?.customerId + "/parcels/", data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    const respo = convertKeysToCamelCase(toJson(response.data));
    return respo;
  }

}