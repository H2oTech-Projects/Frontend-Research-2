import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { GET_FIELD_MAP_KEY, GET_MSMTPOINT_LIST_KEY } from "./constant";
import { FieldListResponseType } from "@/types/apiResponseType";

export const useGetMsmtPointList = (tableInfo:initialTableDataTypes):UseQueryResult<FieldListResponseType> => {
  return useQuery({
    queryKey: [GET_MSMTPOINT_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryFieldService.getMsmtPointList(tableInfo),
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