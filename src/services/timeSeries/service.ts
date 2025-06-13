import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";

const WAYS_API = BASE_API_URL + '/ways/options/';
const WAPT_API = BASE_API_URL + '/wa_period_type/options/';
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
  postWays :async (data:any) => {
    console.log(data,"from api call")
      const response = await axiosInstance.post(WAYS_POST +`${data?.way_year}/` + "waps/ " , data?.wap_list ?? [], {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;

}

}

