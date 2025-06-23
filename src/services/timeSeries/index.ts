import { useQuery, useMutation, UseQueryResult, useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { GET_WAPT_OPTIONS, GET_WAYS_DETAILS, GET_WAYS_OPTIONS, PUT_WAYS, GET_MSMTPOINT_FIELDS } from "./constants";
import { queryTimeSeries } from "./service";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";

export const useGetWaysOptions = ()=> {
  return useQuery({
    queryKey: [GET_WAYS_OPTIONS],
    queryFn:()=> queryTimeSeries.getWaysList(),
     ...queryConfig  });
}
export const useGetWaptOptions = ()=> {
  return useQuery({
    queryKey: [GET_WAPT_OPTIONS],
    queryFn:()=> queryTimeSeries.getWaptList(),
     ...queryConfig  });
}

export const usePutWays = () => {
      return useMutation<RegisterResponse, AxiosError<any>, any>({
        mutationKey: [PUT_WAYS],
        mutationFn: queryTimeSeries.putWays});
}

export const useGetWaysDetails = (id:string | null | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_WAYS_DETAILS,id],
    queryFn: ()=> queryTimeSeries.getWaysDetails(id),
    enabled: !!id,
    ...queryConfig,
  });
}

export const useGetWaps = ():UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_WAYS_DETAILS],
    queryFn: ()=> queryTimeSeries.getWaps(),
    ...queryConfig,
  });
}

export const useGetMsmtPointFields = (msmtPointId:string | null, wayId:string | null):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_MSMTPOINT_FIELDS],
    queryFn: ()=> queryTimeSeries.getMsmtPoinFields(msmtPointId, wayId),
    enabled: !!msmtPointId && !!wayId,
    ...queryConfig,
  });
}