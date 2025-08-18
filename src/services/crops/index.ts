import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { GET_CROPS_LIST } from "./constants";
import { queryCropsService } from "./services";
import { queryConfig } from "@/utils/reactQueryConfig";

export const useGetCropList = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CROPS_LIST,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryCropsService.getCropsList(tableInfo),
    ...queryConfig,
  });
}