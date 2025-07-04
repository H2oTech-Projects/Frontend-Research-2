import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";
import { toJson } from "@/utils/reactQueryConfig";
import { convertKeysToCamelCase } from "@/utils/stringConversion";
import { get } from "jquery";

const CONVEYANCES_API = BASE_API_URL + '/conveyance/';

export const queryConveyanceService = {
    getConveyanceList: async (tableInfo: any) => {
        const response = await axiosInstance.get(CONVEYANCES_API, {
            params: {
                page_no: tableInfo?.page_no,
                page_size: tableInfo?.page_size,
                search: tableInfo?.search,
                sort_by: tableInfo?.sort,
                sort_order: tableInfo?.sort_order
            }
        }).catch((err) => console.log(err));

        return convertKeysToCamelCase(toJson(response?.data));
    },
    getConveyanceDetails: async (id: string | undefined | null) => {
        const response = await axiosInstance.get(CONVEYANCES_API + id + "/").catch((err) => console.log(err));
        const data = convertKeysToCamelCase(toJson(response));
        return data?.data;
    },

    postConveyance: async (data: any) => {
        const response = await axiosInstance.post(CONVEYANCES_API, data, {
            headers: {
                  "Content-Type": "multipart/form-data",
            },
        });
        return convertKeysToCamelCase(toJson(response));
    },

    putConveyance: async (data: any) => {
        const response = await axiosInstance.put(CONVEYANCES_API + data?.id + "/", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return convertKeysToCamelCase(toJson(response));
    },

    deleteConveyance: async (id: string) => {
        const response = await axiosInstance.delete(CONVEYANCES_API + id + "/");
        return convertKeysToCamelCase(toJson(response));
    },


}