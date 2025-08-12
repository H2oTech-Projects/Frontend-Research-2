import { initialTableDataTypes } from "@/types/tableTypes";
import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { noCacheQueryConfig, queryConfig } from "@/utils/reactQueryConfig";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";
import { queryCustomerFieldService } from "./services";
import { GET_ALL_CUSTOMER_FIELD, GET_ALL_CUSTOMER_FIELD_MAP, GET_BY_ID_CUSTOMER_FIELD, GET_CUSTOMERS_OPTIONS, GET_FIELD_OPTIONS, POST_CUSTOMER_FIELD, PUT_CUSTOMER_FIELD } from "./constants";

export const useGetCustomerList = () => {
  return useQuery({
    queryKey: [GET_CUSTOMERS_OPTIONS],
    queryFn: () => queryCustomerFieldService.getCustomerOptions(),
    ...queryConfig,
  });
}
export const useGetFieldList = (wayId: number | undefined) => {
  return useQuery({
    queryKey: [GET_FIELD_OPTIONS, wayId],
    queryFn: () => queryCustomerFieldService.getFieldOptions(wayId!),
    enabled: !!wayId,
    ...queryConfig,
  });
}

export const useGetCustomerParcelListByWAY = (tableInfo: initialTableDataTypes, wayId: number): UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_ALL_CUSTOMER_FIELD, wayId, tableInfo?.page_no, tableInfo?.page_size, tableInfo?.search, tableInfo?.sort, tableInfo?.sort_order],
    queryFn: () => queryCustomerFieldService.getCustomerParcelListByWAY(tableInfo, wayId),
    enabled: !!wayId,
    ...queryConfig
  })
}
export const useGetCustomerFieldMapByWAP = (wapId:number):UseQueryResult<any> => {
  return useQuery({
      queryKey: [GET_ALL_CUSTOMER_FIELD_MAP,wapId],
    queryFn: ()=> queryCustomerFieldService.getCustomerFieldMapByWAP(wapId),
     enabled: !!wapId,
    ...queryConfig,
})
}

export const useGetCustomerFieldDetailByWAP = (wapId:string,customerId:any):UseQueryResult<any> => {
    let customerid = typeof(customerId) == 'object'? customerId.id.toString() : customerId
    return useQuery({
      queryKey:[GET_BY_ID_CUSTOMER_FIELD,customerId,wapId],
      queryFn:()=>  queryCustomerFieldService.getCustomerFieldDetailByWAP(customerid,wapId),
      enabled: !!wapId && !!customerId,
      ...queryConfig,
      ...noCacheQueryConfig,
})
}

export const usePostCustomerField = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_CUSTOMER_FIELD],
    mutationFn: queryCustomerFieldService.postCustomerField,
  });
}
export const usePutCustomerParcel = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_CUSTOMER_FIELD],
    mutationFn: queryCustomerFieldService.putCustomerParcel,
  });
}