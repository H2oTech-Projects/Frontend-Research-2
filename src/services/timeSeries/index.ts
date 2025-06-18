import { useQuery, useMutation, UseQueryResult, useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { GET_WAPT_OPTIONS, GET_WAYS_OPTIONS, POST_WAYS } from "./constants";
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
        mutationKey: [POST_WAYS],
        mutationFn: queryTimeSeries.putWays});
}