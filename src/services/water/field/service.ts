import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";

const GET_FIELD_LIST = BASE_API_URL + "/fields/";
const GET_FIELD_MAP_LIST = BASE_API_URL + "/fields/map/";

export const queryFieldService = {
  getFieldList: async (tableInfo:initialTableDataTypes) => {
    const response = await axiosInstance.get(GET_FIELD_LIST,{
      params:{
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort_by:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    return toJson(response?.data);
  },

  getFieldMapList :async()=>{
    const response  = await axiosInstance.get(GET_FIELD_MAP_LIST).catch((err) => console.log(err));
    return toJson(response);
}

};