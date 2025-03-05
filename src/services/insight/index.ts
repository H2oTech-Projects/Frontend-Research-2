import { useQuery, useMutation } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryInsightService } from "./service";
import { GET_ACCOUNT_ALLOCATION_CHART_KEY, GET_ACCOUNT_DETAILS_KEY, GET_ACCOUNT_FARM_UNITS_KEY, GET_ACCOUNT_PARCELS_KEY, GET_ACCOUNTS_LIST_KEY } from "./constant";

export const useGetAccountsList = () => {
  return useQuery({
    queryKey: [GET_ACCOUNTS_LIST_KEY],
    queryFn: queryInsightService.getAccountsList,
     ...queryConfig  });
}
export const useGetAccountDetails = (accountName:string) => {
  return useQuery({
    queryKey: [GET_ACCOUNT_DETAILS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountDetails(accountName),
     ...queryConfig  });
}
export const useGetAccountAllocationChart = (accountName:string) => {
  return useQuery({
    queryKey: [GET_ACCOUNT_ALLOCATION_CHART_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountDetails(accountName),
     ...queryConfig  });
}
export const useGetAccountFarmUnits = (accountName:string) => {
  return useQuery({
    queryKey: [GET_ACCOUNT_FARM_UNITS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountFarmUnits(accountName),
     ...queryConfig  });
}
export const useGetAccountParcels = (accountName:string) => {
  return useQuery({
    queryKey: [GET_ACCOUNT_PARCELS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountParcels(accountName),
     ...queryConfig  });
}