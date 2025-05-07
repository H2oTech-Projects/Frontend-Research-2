import { QueryClient, useMutation, useQuery, useQueryClient, UseQueryResult } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { initialTableDataTypes } from "@/types/tableTypes";
import { ClientListResponseType } from "@/types/apiResponseType";
import { DELETE_CLIENT_KEY, GET_CLIENT_LIST_KEY, POST_CLIENT_KEY, PUT_CLIENT_KEY } from "./constant";
import { queryClientService, RegisterResponse } from "./services";
import { AxiosError } from "axios";


export const useGetClientList = (tableInfo:initialTableDataTypes):UseQueryResult<ClientListResponseType> => {
  return useQuery({
    queryKey: [GET_CLIENT_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryClientService.getClientList(tableInfo),
    ...queryConfig,
  });
}

export const useGetClientDetails = (id:string | null):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CLIENT_LIST_KEY,id],
    queryFn: ()=> queryClientService.getClientDetails(id),
    enabled: id !== null,
    ...queryConfig,
  });
}

export const usePostClient = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_CLIENT_KEY],
    mutationFn:queryClientService.postClient,
 
  });
}
export const usePutClient = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CLIENT_KEY],
    mutationFn:queryClientService.putClient,
 
  });
}

export const useDeleteClient = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [DELETE_CLIENT_KEY],
    mutationFn:queryClientService.deleteClient,
  });
}
