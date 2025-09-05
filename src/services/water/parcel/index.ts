import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryParcelService } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { DELETE_FIELD_KEY_BY_FIELD, GET_FIELD_DETAIL_KEY_BY_WAP, GET_FIELD_LIST_KEY, GET_FIELD_LIST_KEY_BY_WAP, GET_FIELD_MAP_KEY, GET_PARCEL_DETAIL_KEY_BY_WAY, GET_PARCEL_MAP_KEY_BY_WAY, GET_REGION_OPTIONS, POST_FIELD_KEY_BY_WAP, POST_PARCEL_KEY_BY_WAY, PUT_FIELD_KEY_BY_WAP, PUT_PARCEL_KEY_BY_WAY } from "./constant";
import { FieldListResponseType } from "@/types/apiResponseType";
import { RegisterResponse } from "../msmtPoint/service";
import { AxiosError } from "axios";

export const useGetFieldList = (tableInfo:initialTableDataTypes):UseQueryResult<FieldListResponseType> => {
  return useQuery({
    queryKey: [GET_FIELD_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryParcelService.getFieldList(tableInfo),
    ...queryConfig,
  });
}

export const useGetFieldMapList = () => {
  return useQuery({
    queryKey: [GET_FIELD_MAP_KEY],
    queryFn: ()=> queryParcelService.getFieldMapList(),
    ...queryConfig,
  });
}

export const useGetParcelListByWAY = (tableInfo:initialTableDataTypes,wapId:number):UseQueryResult<any> => {
    return useQuery({
    queryKey: [GET_FIELD_LIST_KEY_BY_WAP,wapId,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryParcelService.getParcelListByWAY(tableInfo,wapId),
    enabled: !!wapId,
    ...queryConfig
})
}

export const useGetParcelMapByWAY = (wayId:number):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_PARCEL_MAP_KEY_BY_WAY,wayId],
    queryFn: ()=> queryParcelService.getParcelMapByWAY(wayId),
     enabled: !!wayId,
    ...queryConfig,
})
}

export const useGetFieldDetailByWAP = (wapId:string,fieldId:string):UseQueryResult<any> => {
    return useQuery({
      queryKey:[GET_FIELD_DETAIL_KEY_BY_WAP,fieldId,wapId],
      queryFn:()=>  queryParcelService.getFieldDetailByWAP(fieldId,wapId),
      enabled: !!wapId && !!fieldId,
    ...queryConfig
})
}

export const usePostFieldByWAP = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_FIELD_KEY_BY_WAP],
    mutationFn:queryParcelService.postFieldByWap,
  });
}
export const usePutFieldByWAP = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_FIELD_KEY_BY_WAP],
    mutationFn:queryParcelService.putFieldByWap,
  });
}

export const useDeleteFieldByWAP = () => {
 return useMutation<RegisterResponse, AxiosError<any>, any>({
     mutationKey: [DELETE_FIELD_KEY_BY_FIELD],
     mutationFn:queryParcelService.deleteFieldByWAP,
   });
}

export const useGetSearchParcelMapByWAY = (wayId:number, search: string):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_FIELD_MAP_KEY,wayId, search],
    queryFn: ()=> queryParcelService.getSearchParcelMapByWAY(wayId, search),
     enabled: !!search && search.length >= 3,
    ...queryConfig,
})
}

export const useGetParcelDetailByWAY = (wayId:string,parcelId:string):UseQueryResult<any> => {
  return useQuery({
    queryKey:[GET_PARCEL_DETAIL_KEY_BY_WAY,parcelId,wayId],  
    queryFn:()=>  queryParcelService.getParcelDetailByWAY(parcelId,wayId),
    enabled: !!wayId && !!parcelId,
  ...queryConfig
})
}

export const usePostParcelByWAY = () =>{
 return useMutation<RegisterResponse, AxiosError<any>, any>({
  mutationKey: [POST_PARCEL_KEY_BY_WAY],   
  mutationFn:queryParcelService.postParcelByWAY,
});
}

export const usePutParcelByWAY = () =>{
 return useMutation<RegisterResponse, AxiosError<any>, any>({
  mutationKey: [PUT_PARCEL_KEY_BY_WAY],   
  mutationFn:queryParcelService.putParcelByWAY,
});
}

export const useGetRegionOptions = () => {
  return useQuery({
    queryKey: [GET_REGION_OPTIONS],   
    queryFn: queryParcelService.getRegionOptions,
    ...queryConfig,
  });
}