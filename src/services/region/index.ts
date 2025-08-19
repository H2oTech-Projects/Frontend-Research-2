import { initialTableDataTypes } from "@/types/tableTypes";
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryRegionService } from "./services";
import { queryConfig } from "@/utils/reactQueryConfig";
import { GET_REGION_LIST, GET_REGION_MAP } from "./constants";

export const useGetRegionList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_REGION_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryRegionService.getRegionList(tableInfo),
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