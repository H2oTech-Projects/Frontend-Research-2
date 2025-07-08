import { initialTableDataTypes } from "@/types/tableTypes";
import { DELETE_CONVEYANCE, GET_CONVEYANCE_LIST, GET_CONVEYANCE_MAP, GET_CONVEYANCE_PARENTS, GET_CONVEYANCE_TYPES, POST_CONVEYANCE, PUT_CONVEYANCE } from "./constants";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConveyanceService } from "./services";
import { queryConfig } from "@/utils/reactQueryConfig";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";

export const useGetConveyanceList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CONVEYANCE_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryConveyanceService.getConveyanceList(tableInfo),
    ...queryConfig,

  });
}

export const useGetConveyanceDetails = (id:string | null | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CONVEYANCE_LIST, id],
    queryFn: ()=> queryConveyanceService.getConveyanceDetails(id),
    enabled: !!id,
    ...queryConfig,
  });
}
export const useGetConveyanceMap = ()=>{
    return useQuery({
    queryKey: [GET_CONVEYANCE_MAP],
    queryFn: ()=> queryConveyanceService.getConveyanceMap(),
    ...queryConfig, 
  });
}
export const useGetConveyanceTypes = () => {
  return useQuery({
    queryKey: [GET_CONVEYANCE_TYPES],
    queryFn: ()=> queryConveyanceService.getConveyanceTypes(),
    ...queryConfig,
  });
}

export const useGetConveyanceParents = () => {
  return useQuery({
    queryKey: [GET_CONVEYANCE_PARENTS],
    queryFn: ()=> queryConveyanceService.getConveyanceParents(),
    ...queryConfig,
  });
}

export const usePostConveyance = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_CONVEYANCE],
    mutationFn:queryConveyanceService.postConveyance,

  });
}
export const usePutConveyance = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CONVEYANCE],
    mutationFn:queryConveyanceService.putConveyance,

  });
}

export const useDeleteConveyance = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [DELETE_CONVEYANCE],
    mutationFn:queryConveyanceService.deleteConveyance,
  });
}