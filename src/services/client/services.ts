import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import axiosInstance from "@/services/axiosInstance";

const GET_CLIENT_LIST = BASE_API_URL + "/client/";

export const queryClientService = {
  getFieldList: async (tableInfo:initialTableDataTypes) => {
    const response = await axiosInstance.get(GET_CLIENT_LIST,{
      params:{  
                page_no:tableInfo?.page_no,
                page_size:tableInfo?.page_size,
                search:tableInfo?.search,
                sort:tableInfo?.sort,
                sort_order:tableInfo?.sort_order}
      }).catch((err) => console.log(err));
    return toJson(response?.data);
  },


};