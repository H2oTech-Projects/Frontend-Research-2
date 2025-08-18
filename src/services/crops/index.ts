import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { GET_ALL_CROP_FIELDS_LIST, GET_ALL_CROP_FIELDS_MAP, GET_CROPS_LIST } from "./constants";
import { queryCropsService } from "./services";
import { queryConfig } from "@/utils/reactQueryConfig";

export const useGetCropList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CROPS_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryCropsService.getCropsList(tableInfo),
    ...queryConfig,
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

