import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";

const WAYS_API = BASE_API_URL + '/ways/options/';
const WAPT_API = BASE_API_URL + '/wa_period_types/';
const WAYS_POST = BASE_API_URL + '/ways/'
const userData = JSON.parse(localStorage.getItem("auth") || "null");

export const queryTimeSeries = {
  getWaysList: async () => {
    const response = await axiosInstance.get(WAYS_API).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getWaptList: async () => {
    const response = await axiosInstance.get(WAPT_API).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  postWaptList: async (formValue: any) => {
    const data = {
      client_id: userData?.client_id,
      wa_period_type: formValue?.waptName,
      wa_period_type_name: formValue?.waptName
    }
    const response = await axiosInstance.post(WAPT_API, data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response?.data
  },

  putWapt: async (formValue: any) => {
    const response = await axiosInstance.put(BASE_API_URL + '/wapts/' + formValue?.id + '/', { wa_period_type_name: formValue?.waptName }, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response?.data
  },
  deleteWapt: async (id: any) => {
    const response = await axiosInstance.delete(BASE_API_URL + '/wapts/' + id + '/', {
      headers: {
        "Content-Type": "application/json",
      },
    })
    return response?.data
  },

  putWays: async (data: any) => {
    const response = await axiosInstance.put(WAYS_POST + `${data?.way_year}/` + "waps/ ", data?.wap_list ?? [], {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
  getWaysDetails: async (id: string | undefined | null) => {
    const response = await axiosInstance.get(WAYS_POST + id + "/waps/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
  },

}

