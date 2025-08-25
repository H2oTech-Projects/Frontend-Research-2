import { BASE_API_URL } from "@/utils/constant";
import { toJson } from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";
import { convertKeysToCamelCase } from "@/utils/stringConversion";

export const queryCustomerService = {
  getCustomerList: async (tableInfo: initialTableDataTypes) => {
    const response = await axiosInstance.get(BASE_API_URL + "/customers/", {
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

  getCustomerDetail: async (customerId: string) => {
    const response = await axiosInstance.get(BASE_API_URL + "/customers/" + customerId + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },


  deleteCustomer: async ({ customerId }: { customerId: string }) => {
    const response = await axiosInstance.delete(BASE_API_URL + "/customers/" + customerId + "/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return toJson(data?.data);
  },

  postCustomer: async (formData: any) => {
    const response = await axiosInstance.post(BASE_API_URL + "/customers/", formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response?.data
  },

  putCustomer: async (formData: any) => {

    const response = await axiosInstance.put((BASE_API_URL + "/customers/" + formData?.customer_id + "/"), formData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response?.data
  }
};