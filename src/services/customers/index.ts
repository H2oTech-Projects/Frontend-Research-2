import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { noCacheQueryConfig, queryConfig } from "@/utils/reactQueryConfig";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";
import { queryCustomerService } from "./service";
import { GET_CUSTOMER_DETAIL_KEY, GET_CUSTOMER_LIST_KEY, POST_CUSTOMER_KEY, PUT_CUSTOMER } from "./constants";

export const useGetCustomers = (tableInfo:initialTableDataTypes):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CUSTOMER_LIST_KEY,tableInfo?.page_no,tableInfo?.page_size,tableInfo?.search,tableInfo?.sort,tableInfo?.sort_order],
    queryFn: ()=> queryCustomerService.getCustomerList(tableInfo),
    ...queryConfig,
  });
}
export const useDeleteCustomer = () => {
  return useMutation<RegisterResponse, AxiosError<any>, { customerId: string}>({
    mutationKey: [GET_CUSTOMER_LIST_KEY],
    mutationFn: queryCustomerService.deleteCustomer,
  });
}

export const usePostCustomer = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_CUSTOMER_KEY],
    mutationFn: queryCustomerService.postCustomer,
  });
}

export const usePutCustomer = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CUSTOMER],
    mutationFn: queryCustomerService.putCustomer,
  });
}

export const useGetCustomerDetail = (customerId:string):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_CUSTOMER_DETAIL_KEY,customerId],
    queryFn: ()=> queryCustomerService.getCustomerDetail(customerId),
    ...noCacheQueryConfig,
    enabled: !!customerId
  });
}