import { useQuery, UseQueryResult, useMutation } from "@tanstack/react-query";
import { noCacheQueryConfig, queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService, RegisterResponse  } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { GET_APPORTION_METHOD_TYPE, GET_CLIENT_FIELD_MAP_KEY, GET_MESMT_POINT_FIELD_DETAIL, GET_MSMTPOINT_LIST_KEY, PUT_MSMTPOINT_FIELDS_KEY, GET_CLIENT_MSMT_POINTS, GET_CLIENT_MSMT_POINTS_MAP, POST_MSMTPOINT_LIST, PUT_MSMTPOINT, GET_MSMTPOINT_DETAIL_KEY } from "./constant";
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

// export const useGetFieldMapList = () => {
//   return useQuery({
//     queryKey: [GET_FIELD_MAP_KEY],
//     queryFn: ()=> queryFieldService.getFieldMapList(),
//     ...queryConfig,
//   });
// }

export const useClientGetFieldMapList = () => {
  return useQuery({
    queryKey: [GET_CLIENT_FIELD_MAP_KEY],
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

export const useGetApportionMethodType = () =>{
    return useQuery({
        queryKey: [GET_APPORTION_METHOD_TYPE],
          queryFn: ()=>queryFieldService.getApportionMethod(),
         ...queryConfig,

})
}

export const useGetMsmtPointFieldDetail = (id:any,wapId:any) => {
    return useQuery({
     queryKey:[GET_MESMT_POINT_FIELD_DETAIL,id,wapId],
      queryFn: ()=> queryFieldService.getMsmtPointFieldsDetail(id,wapId),
      enabled:!!wapId && !!id,
      ...queryConfig
})

}

export const useGetClientMsmtPoints = (tableInfo:initialTableDataTypes) => {
  return useQuery({
   queryKey:[GET_CLIENT_MSMT_POINTS, tableInfo],
    queryFn: ()=> queryFieldService.getClientMsmtPointList(tableInfo),
    ...queryConfig,
    ...noCacheQueryConfig,
})
}

export const useGetClientMsmtPoinMap = ():UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_CLIENT_MSMT_POINTS_MAP],
    queryFn: ()=> queryFieldService.getMsmtPointMap(),
    ...queryConfig,
})
}

export const usePostmsmtPoint = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_MSMTPOINT_LIST],
    mutationFn:queryFieldService.postMsmtPoint,
  });
}

export const useDeletemsmtPoint = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: ['DELETE_MSMTPOINT'],
    mutationFn:queryFieldService.deleteMsmtPoint,
  });
}

export const usePutmsmtPoint = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_MSMTPOINT],
    mutationFn:queryFieldService.putMsmtPoint,
  });
}

export const useGetMsmtPointById = (id:string):UseQueryResult<any> => {
  return useQuery({
    queryKey:[GET_MSMTPOINT_DETAIL_KEY, id],
    queryFn:()=>  queryFieldService.getMsmtPointById(id),
    enabled: !!id,
  ...queryConfig
})
}
