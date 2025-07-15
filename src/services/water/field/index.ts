import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { GET_FIELD_LIST_KEY, GET_FIELD_LIST_KEY_BY_WAP, GET_FIELD_MAP_KEY, POST_FIELD_KEY_BY_WAP } from "./constant";
import { FieldListResponseType } from "@/types/apiResponseType";
import { RegisterResponse } from "../msmtPoint/service";
import { AxiosError } from "axios";

export const useGetFieldList = (tableInfo:initialTableDataTypes):UseQueryResult<FieldListResponseType> => {
  return useQuery({
    queryKey: [GET_FIELD_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryFieldService.getFieldList(tableInfo),
    ...queryConfig,
  });
}

export const useGetFieldMapList = () => {
  return useQuery({
    queryKey: [GET_FIELD_MAP_KEY],
    queryFn: ()=> queryFieldService.getFieldMapList(),
    ...queryConfig,
  });
}

export const useGetFieldListByWAP = (tableInfo:initialTableDataTypes,wapId:number):UseQueryResult<any> => {
    return useQuery({
    queryKey: [GET_FIELD_LIST_KEY_BY_WAP,wapId,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryFieldService.getFieldListByWAP(tableInfo,wapId),
    enabled: !!wapId,
    ...queryConfig
})
} 

export const usePostFieldByWAP = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_FIELD_KEY_BY_WAP],
    mutationFn:queryFieldService.postFieldByWap,
  });
}