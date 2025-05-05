import { QueryClient, useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import { ClientListResponseType } from "@/types/apiResponseType";
import { GET_CLIENT_LIST_KEY, POST_CLIENT_KEY } from "./constant";
import { queryClientService } from "./services";



export const useGetClientList = (tableInfo:initialTableDataTypes):UseQueryResult<ClientListResponseType> => {
  return useQuery({
    queryKey: [GET_CLIENT_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryClientService.getFieldList(tableInfo),
    ...queryConfig,
  });
}

export const usePostClient = () => {
  return useMutation({
    mutationKey: [POST_CLIENT_KEY],
    mutationFn:queryClientService.postClient,
 
  });
}
