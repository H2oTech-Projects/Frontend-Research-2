import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";
import {convertKeysToCamelCase} from "@/utils/stringConversion";

const GET_MSMTPOINT_LIST = BASE_API_URL + "/msmt_points/";
const GET_FIELD_MAP_LIST = BASE_API_URL + "/fields/map/";

export const queryFieldService = {
  getMsmtPointList: async (tableInfo:initialTableDataTypes) => {
    const response = await axiosInstance.get(GET_MSMTPOINT_LIST,{
      params:{
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort_by:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    return convertKeysToCamelCase(toJson(response?.data));
  },

  getFieldMapList :async()=>{
    const response  = await axiosInstance.get(GET_FIELD_MAP_LIST).catch((err) => console.log(err));
    return toJson(response);
}

};