import { useQuery, UseQueryResult, useMutation } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService, RegisterResponse  } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { GET_FIELD_MAP_KEY, GET_MSMTPOINT_LIST_KEY, PUT_MSMTPOINT_FIELDS_KEY } from "./constant";
import { MsmtPointListResponseType } from "@/types/apiResponseType";
import { AxiosError } from "axios";

export const useGetMsmtPointList = (tableInfo:initialTableDataTypes, wapId:string | null):UseQueryResult<MsmtPointListResponseType> => {
  return useQuery({
    queryKey: [GET_MSMTPOINT_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order, wapId],
    queryFn: ()=> queryFieldService.getMsmtPointList(tableInfo, wapId),
    enabled: !!wapId,
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

export const useClientGetFieldMapList = () => {
  return useQuery({
    queryKey: [GET_FIELD_MAP_KEY],
    queryFn: ()=> queryFieldService.getClientFieldMapList(),
    ...queryConfig,
  });
}

export const useMsmtPointFields = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_MSMTPOINT_FIELDS_KEY],
    mutationFn:queryFieldService.putMsmtPointFields,

  });
}
