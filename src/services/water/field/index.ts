import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryFieldService } from "./service";
import { initialTableDataTypes } from "@/types/tableTypes";
import { GET_FIELD_LIST_KEY, GET_FIELD_MAP_KEY } from "./constant";

export const useGetFieldList = (tableInfo:initialTableDataTypes) => {
  return useQuery({
    queryKey: [GET_FIELD_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryFieldService.getFieldList(tableInfo),
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