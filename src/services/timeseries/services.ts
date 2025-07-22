import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";

import {convertKeysToCamelCase, convertKeysToSnakeCase, snakeCase} from "@/utils/stringConversion";
import { createFormData } from "@/utils/createFormData";
const GET_PERIOD_TYPE_LIST = BASE_API_URL + "/wa_period_type";
const GET_WAPT_LIST = BASE_API_URL + "/wa_period_type/";
const GET_WAY_LIST = BASE_API_URL + "/ways"

export interface RegisterResponse {
  success?: string;
  message: { [key: string]: any };
}

export const queryWAPTService = {
  postWAPT: async (data: any) => {
    const response = await axiosInstance.post<any>(GET_WAPT_LIST, data, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  putWAPT: async (data: any) => {
    const response = await axiosInstance.put<any>(GET_WAPT_LIST + data?.id + "/", data, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getPeriodTypes: async () => {
    const response = await axiosInstance.get(GET_PERIOD_TYPE_LIST +'/').catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getPeriodType: async (id: any) => {
    const response = await axiosInstance.get(GET_PERIOD_TYPE_LIST+'/'+ id +'/').catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getWAYs: async () => {
    const response = await axiosInstance.get(GET_WAY_LIST+'/').catch((err) => console.log(err));
    return toJson(response?.data);
  },
  postWAY: async (data: any) => {
    const response = await axiosInstance.post<any>(GET_WAY_LIST+'/', data, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  putWAY: async (data: any) => {
    const response = await axiosInstance.put<any>(GET_WAY_LIST +"/" + data?.id + "/", data, {
      headers: {
         "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getWAY: async (id: any) => {
    const response = await axiosInstance.get(GET_WAY_LIST+'/'+ id +'/').catch((err) => console.log(err));
    return toJson(response?.data);
  },
};