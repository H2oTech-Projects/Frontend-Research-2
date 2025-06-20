import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";

const WAYS_API = BASE_API_URL + '/ways/options/';
const WAPT_API = BASE_API_URL + '/wa_period_types/';
const WAYS_POST = BASE_API_URL + '/ways/'

export const queryTimeSeries = {
  getWaysList: async () => {
    const response = await axiosInstance.get(WAYS_API).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  getWaptList: async () => {
    const response = await axiosInstance.get(WAPT_API).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },
  putWays: async (data: any) => {
 
    const response = await axiosInstance.put(WAYS_POST + `${data?.way_year}/` + "waps/ ", data?.wap_list ?? [], {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },
    getWaysDetails:async(id:string | undefined | null ) =>{
    const response = await axiosInstance.get(WAYS_POST + id + "/waps/").catch((err) => console.log(err));
    const data = convertKeysToCamelCase(toJson(response));
    return data?.data;
},

}

