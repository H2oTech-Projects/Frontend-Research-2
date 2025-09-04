import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { GET_ALL_CROP_FIELDS_LIST, GET_ALL_CROP_FIELDS_MAP, GET_BY_ID_CROP_FIELD, GET_CROPS_LIST, POST_CROPS, PUT_CROPS, PUT_CROPS_FIELD } from "./constants";
import { queryCropsService } from "./services";
import { noCacheQueryConfig, queryConfig } from "@/utils/reactQueryConfig";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";

export const useGetCropList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CROPS_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryCropsService.getCropsList(tableInfo),
    ...queryConfig,
  });
}

export const useGetCropById = (cropId:string):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CROPS_LIST,cropId],
    queryFn: ()=> queryCropsService.getCropById(cropId),
    enabled: !!cropId,
    ...queryConfig,
  });
}

export const useGetCropGroupNameDropdown = ():UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CROPS_LIST,"cropGroupNameDropdown"], 
    queryFn: ()=> queryCropsService.getCropGroupNameDropdown(),
    ...noCacheQueryConfig,
  });
}

export const usePostCrops = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_CROPS],
    mutationFn: queryCropsService.postCrops,
  });
}

export const usePutCrops = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CROPS],
    mutationFn: queryCropsService.putCrops,
  });
}

export const useDeleteCrops = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CROPS],
    mutationFn: queryCropsService.deleteCrops,
  });
}

export const useGetCropsFieldListByWAP = (tableInfo: initialTableDataTypes, wapId: number): UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_ALL_CROP_FIELDS_LIST, wapId, tableInfo?.page_no, tableInfo?.page_size, tableInfo?.search, tableInfo?.sort, tableInfo?.sort_order],
    queryFn: () => queryCropsService.getCropsFieldListByWAP(tableInfo, wapId),
    enabled: !!wapId,
    ...queryConfig
  })
}

export const useGetCropFieldMapByWAP = (wapId:number):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_ALL_CROP_FIELDS_MAP,wapId],
    queryFn: ()=> queryCropsService.getCropFieldMapByWAP(wapId),
     enabled: !!wapId,
    ...queryConfig,
})
}

export const usePutCropField = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CROPS_FIELD],
    mutationFn: queryCropsService.putCropsField,
  });
}

export const useGetCropFieldDetailByWAP = (wapId:string,cropId:any):UseQueryResult<any> => {
    let cropid = typeof(cropId) == 'object'? cropId.id.toString() : cropId
    return useQuery({
      queryKey:[GET_BY_ID_CROP_FIELD,cropId,wapId],
      queryFn:()=>  queryCropsService.getCropFieldDetailByWAP(cropid,wapId),
      enabled: !!wapId && !!cropId,
      ...queryConfig,
      ...noCacheQueryConfig,
})
}