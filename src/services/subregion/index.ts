import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";
import { querySubregionService } from "./services";
import { DELETE_SUBREGION, GET_SUB_REGION_LIST, GET_SUB_REGION_MAP, POST_SUBREGION, PUT_SUBREGION } from "./constant";

export const useGetSubRegionList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_REGION_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> querySubregionService.getSubRegionList(tableInfo),
    ...queryConfig,

  });
}

export const useGetSubRegionMap = ()=>{
    return useQuery({
    queryKey: [GET_SUB_REGION_MAP],
    queryFn: ()=> querySubregionService.getSubRegionMap(),
    ...queryConfig,
  });
}

export const useGetSubregionById = (id:any):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_REGION_LIST,id],
    queryFn: ()=> querySubregionService.getSubregionById(id),
    ...queryConfig, 
    enabled: !!id
  });   
}
export const usePostSubregion = ()=>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_SUBREGION],
    mutationFn: querySubregionService.postSubregion,
  });
}

export const usePutSubregion = ()=>{   
  return useMutation<RegisterResponse, AxiosError<any>, any>({  
    mutationKey: [PUT_SUBREGION],
    mutationFn: querySubregionService.putSubregion,
  });
} 

export const useDeleteSubregion = ()=>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({  
    mutationKey: [DELETE_SUBREGION],
    mutationFn: querySubregionService.deleteSubregion,
  });
}