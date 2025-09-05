import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryRegionService } from "./services";
import { queryConfig } from "@/utils/reactQueryConfig";
import { DELETE_REGION, GET_REGION_LIST, GET_REGION_MAP, GET_SUB_REGION_LIST, GET_SUB_REGION_MAP, POST_REGION, PUT_REGION } from "./constants";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";

export const useGetRegionList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_REGION_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryRegionService.getRegionList(tableInfo),
    ...queryConfig,

  });
}
export const useGetSubRegionList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_REGION_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryRegionService.getSubRegionList(tableInfo),
    ...queryConfig,

  });
}

export const useGetRegionMap = ()=>{
    return useQuery({
    queryKey: [GET_REGION_MAP],
    queryFn: ()=> queryRegionService.getRegionMap(),
    ...queryConfig,
  });
}
export const useGetSubRegionMap = ()=>{
    return useQuery({
    queryKey: [GET_SUB_REGION_MAP],
    queryFn: ()=> queryRegionService.getSubRegionMap(),
    ...queryConfig,
  });
}

export const useGetRegionById = (id:any):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_REGION_LIST,id],
    queryFn: ()=> queryRegionService.getRegionById(id),
    ...queryConfig, 
    enabled: !!id
  });   
}
export const usePostRegion = ()=>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_REGION],
    mutationFn: queryRegionService.postRegion,
  });
}

export const usePutRegion = ()=>{   
  return useMutation<RegisterResponse, AxiosError<any>, any>({  
    mutationKey: [PUT_REGION],
    mutationFn: queryRegionService.putRegion,
  });
} 

export const useDeleteRegion = ()=>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({  
    mutationKey: [DELETE_REGION],
    mutationFn: queryRegionService.deleteRegion,
  });
}