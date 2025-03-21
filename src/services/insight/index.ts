import { useQuery, useMutation, UseQueryResult, useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryInsightService } from "./service";
import { GET_ACCOUNT_ALLOCATION_CHART_KEY, GET_ACCOUNT_DETAILS_KEY, GET_ACCOUNT_FARM_UNITS_KEY, GET_ACCOUNT_PARCELS_KEY, GET_ACCOUNTS_LIST_KEY, GET_PARCEL_LIST_KEY } from "./constant";
import { AccountAllocationChartResponseType, AccountDetailResponseType, AccountFarmUnitDataResponseType, AccountsListType, ParcelDataListResponseType } from "@/types/apiResponseType";

export const useGetParcelList = ()=> {
  return useQuery({
    queryKey: [GET_PARCEL_LIST_KEY],
    queryFn: queryInsightService.getParcelList,
     ...queryConfig  });
}
export const useGetAccountsList=():UseQueryResult<AccountsListType>=> {
  return useQuery({
    queryKey: [GET_ACCOUNTS_LIST_KEY],
    queryFn: queryInsightService.getAccountsList,
     ...queryConfig  });
}
export const useGetAccountDetails = (accountName:string | null):UseQueryResult<AccountDetailResponseType> => {
  return useQuery({
    queryKey: [GET_ACCOUNT_DETAILS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountDetails(accountName),
    enabled: !!accountName,
     ...queryConfig  });
}
export const useGetAccountAllocationChart = (accountName:string | null):UseQueryResult<AccountAllocationChartResponseType> => {

  return useQuery({
    queryKey: [GET_ACCOUNT_ALLOCATION_CHART_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountAllocationChart(accountName),
    enabled: accountName !== null,
     ...queryConfig  });
}
export const useGetAccountFarmUnits = (accountName:string | null):UseQueryResult<AccountFarmUnitDataResponseType> => {

  return useQuery({
    queryKey: [GET_ACCOUNT_FARM_UNITS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountFarmUnits(accountName),
    enabled: accountName !== null,
     ...queryConfig  });
}
export const useGetAccountParcels = (accountName:string | null):UseQueryResult<ParcelDataListResponseType> => {

  return useQuery({
    queryKey: [GET_ACCOUNT_PARCELS_KEY,accountName],
    queryFn:()=> queryInsightService.getAccountParcels(accountName),
    enabled: accountName !== null,
     ...queryConfig  });
}

export const useGetAllAccountData = (accountName: string | null) => {
  const queries = useQueries({
    queries: [
      {
        queryKey: [GET_ACCOUNT_DETAILS_KEY, accountName],
        queryFn: () => queryInsightService.getAccountDetails(accountName),
        ...queryConfig,
      },
      {
        queryKey: [GET_ACCOUNT_ALLOCATION_CHART_KEY, accountName],
        queryFn: () => queryInsightService.getAccountAllocationChart(accountName),
        ...queryConfig,
      },
      {
        queryKey: [GET_ACCOUNT_FARM_UNITS_KEY, accountName],
        queryFn: () => queryInsightService.getAccountFarmUnits(accountName),
        ...queryConfig,
      },
      {
        queryKey: [GET_ACCOUNT_PARCELS_KEY, accountName],
        queryFn: () => queryInsightService.getAccountParcels(accountName),
        ...queryConfig,
      },
    ],
  });

  const isLoading = queries.some((query) => query.isLoading);
  const isError = queries.some((query) => query.isError);
  const error = queries.find((query) => query.error)?.error;
  const data = {
    accountDetail: queries[0].data?.data,
    allocationChart: queries[1].data?.data,
    accountFarmUnits: queries[2].data?.data,
    accountParcels: queries[3].data?.data,
  };

  return { data, isLoading, isError, error };
};