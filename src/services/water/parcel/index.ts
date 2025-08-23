import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { DELETE_FIELD_KEY_BY_FIELD, GET_FIELD_DETAIL_KEY_BY_WAP, GET_FIELD_LIST_KEY, GET_FIELD_LIST_KEY_BY_WAP, GET_FIELD_MAP_KEY, POST_FIELD_KEY_BY_WAP, PUT_FIELD_KEY_BY_WAP } from "./constant";
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

export const useGetParcelListByWAY = (tableInfo:initialTableDataTypes,wapId:number):UseQueryResult<any> => {
    return useQuery({
    queryKey: [GET_FIELD_LIST_KEY_BY_WAP,wapId,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryFieldService.getParcelListByWAY(tableInfo,wapId),
    enabled: !!wapId,
    ...queryConfig
})
}

export const useGetParcelMapByWAY = (wayId:number):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_FIELD_MAP_KEY,wayId],
    queryFn: ()=> queryFieldService.getParcelMapByWAY(wayId),
     enabled: !!wayId,
    ...queryConfig,
})
}

export const useGetFieldDetailByWAP = (wapId:string,fieldId:string):UseQueryResult<any> => {
    return useQuery({
      queryKey:[GET_FIELD_DETAIL_KEY_BY_WAP,fieldId,wapId],
      queryFn:()=>  queryFieldService.getFieldDetailByWAP(fieldId,wapId),
      enabled: !!wapId && !!fieldId,
    ...queryConfig
})
}

export const usePostFieldByWAP = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_FIELD_KEY_BY_WAP],
    mutationFn:queryFieldService.postFieldByWap,
  });
}
export const usePutFieldByWAP = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_FIELD_KEY_BY_WAP],
    mutationFn:queryFieldService.putFieldByWap,
  });
}

export const useDeleteFieldByWAP = () => {
 return useMutation<RegisterResponse, AxiosError<any>, any>({
     mutationKey: [DELETE_FIELD_KEY_BY_FIELD],
     mutationFn:queryFieldService.deleteFieldByWAP,
   });
}

export const useGetSearchParcelMapByWAY = (wayId:number, search: string):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_FIELD_MAP_KEY,wayId, search],
    queryFn: ()=> queryFieldService.getSearchParcelMapByWAY(wayId, search),
     enabled: !!search && search.length >= 3,
    ...queryConfig,
})
}