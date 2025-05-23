import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";

import {convertKeysToCamelCase, convertKeysToSnakeCase} from "@/utils/stringConversion";
import { createFormData } from "@/utils/createFormData";

const GET_CLIENT_LIST = BASE_API_URL + "/client/";
export interface RegisterResponse {
  success?: string;
  message: { [key: string]: any };
}
export const queryClientService = {
  getClientList: async (tableInfo:initialTableDataTypes) => {
    const response = await axiosInstance.get(GET_CLIENT_LIST,{
      params:{
              page_no:tableInfo?.page_no,
              page_size:tableInfo?.page_size,
              search:tableInfo?.search,
              sort:tableInfo?.sort,
              sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));

    return convertKeysToCamelCase(toJson(response?.data));
  },
  getClientDetails:async(id:string | undefined | null ) =>{
    const response = await axiosInstance.get(GET_CLIENT_LIST + id + "/").catch((err) => console.log(err));

    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},
  postClient: async (data: any) => {
    const response = await axiosInstance.post<any>(GET_CLIENT_LIST, createFormData(data,"upload_file"), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  putClient: async (data: any) => {
    const response = await axiosInstance.put<any>(GET_CLIENT_LIST + data?.id + "/", convertKeysToSnakeCase(data), {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  deleteClient: async (id: string) => {
    const response = await axiosInstance.delete<RegisterResponse>(GET_CLIENT_LIST + id + "/", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

};