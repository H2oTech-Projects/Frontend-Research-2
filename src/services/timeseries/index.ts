import { useMutation, useQuery, UseQueryResult } from "@tanstack/react-query";
import { noCacheQueryConfig, queryConfig } from "@/utils/reactQueryConfig";
import { POST_WAPT_KEY, PUT_WAPT_KEY, GET_WAPT_LIST_KEY, GET_WAPT_KEY } from "./constant";
import { RegisterResponse, queryWAPTService } from "./services";
import { AxiosError } from "axios";
import { PeriodTypesResponseType } from "@/types/apiResponseType";

export const usePostWAPT = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [POST_WAPT_KEY],
    mutationFn:queryWAPTService.postWAPT,

  });
}
export const usePutWAPT = () => {
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [PUT_WAPT_KEY],
    mutationFn: queryWAPTService.putWAPT,
  });
}

export const useGetPeriodType = (id: any):UseQueryResult<PeriodTypesResponseType> => {
  return useQuery({
    queryKey: [GET_WAPT_KEY],
    queryFn:()=> queryWAPTService.getPeriodType(id),
     ...queryConfig  });
}

export const useGetPeriodTypes = ():UseQueryResult<PeriodTypesResponseType> => {
  return useQuery({
    queryKey: [GET_WAPT_LIST_KEY],
    queryFn:()=> queryWAPTService.getPeriodTypes(),
     ...queryConfig  });
}

