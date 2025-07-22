import { useQuery, useMutation, UseQueryResult, useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { DELETE_WAPTS, GET_WAPT_OPTIONS, GET_WAYS_DETAILS, GET_WAYS_OPTIONS, POST_WAPTS, PUT_WAPTS, PUT_WAYS, GET_MSMTPOINT_FIELDS, RANK_WAPTS } from "./constants";
import { queryTimeSeries } from "./service";
import { RegisterResponse } from "../registration/service";
import { AxiosError } from "axios";

export const useGetWaysOptions = ()=> {
  return useQuery({
    queryKey: [GET_WAYS_OPTIONS],
    queryFn:()=> queryTimeSeries.getWaysList(),
     ...queryConfig  });
}
export const useGetWaptOptions = (id:any)=> {
  return useQuery({
    queryKey: [GET_WAPT_OPTIONS,id],
    queryFn:()=> queryTimeSeries.getWaptList(id),
     enabled: !!id,
     ...queryConfig  });
}

export const usePostWapt = () => {
       return useMutation<RegisterResponse, AxiosError<any>, any>({
        mutationKey: [POST_WAPTS],
        mutationFn: queryTimeSeries.postWaptList});
}
export const usePutWapt = () => {
       return useMutation<RegisterResponse, AxiosError<any>, any>({
        mutationKey: [PUT_WAPTS],
        mutationFn: queryTimeSeries.putWapt});
}
export const usePutRankWapt = () => {
       return useMutation<RegisterResponse, AxiosError<any>, any>({
        mutationKey: [RANK_WAPTS],
        mutationFn: queryTimeSeries.putWaptRank});
}

export const useDeleteWapt = () =>{
  return useMutation<RegisterResponse, AxiosError<any>, any>({
    mutationKey: [DELETE_WAPTS],
    mutationFn:queryTimeSeries.deleteWapt,
  });
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