import { useQuery, useMutation, UseQueryResult, useQueries } from "@tanstack/react-query";
import { queryConfig } from "@/utils/reactQueryConfig";
import { queryLocations } from "./service";
import { GET_ADMIN_AREA_LIST_KEY, GET_COUNTRY_LIST_KEY, GET_SUB_ADMIN_AREA_LIST_KEY, GET_SUB_SUB_ADMIN_AREA_LIST_KEY, GET_SUB_SUB_SUB_ADMIN_AREA_LIST_KEY } from "./constant";

export const useGetLocationList = ()=> {
  return useQuery({
    queryKey: [GET_COUNTRY_LIST_KEY],
    queryFn:()=> queryLocations.getCountryList(),
     ...queryConfig  });
}

export const useGetAdminAreaList = (id:number | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_ADMIN_AREA_LIST_KEY, id],
    queryFn:()=> queryLocations.getAdminAreaList(id),
    enabled: !!id,
     ...queryConfig  });
}

export const useGetSubAdminAreaList = (id:number | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_ADMIN_AREA_LIST_KEY, id],
    queryFn:()=> queryLocations.getSubAdminAreaList(id),
    enabled: !!id,
     ...queryConfig  });
}

export const useGetSubSubAdminAreaList = (id:number | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_SUB_ADMIN_AREA_LIST_KEY, id],
    queryFn:()=> queryLocations.getSubSubAdminAreaList(id),
    enabled: !!id,
     ...queryConfig  });
}

export const useGetSubSubSubAdminAreaList = (id:number | undefined):UseQueryResult<any> => {
  return useQuery({
    queryKey: [GET_SUB_SUB_SUB_ADMIN_AREA_LIST_KEY, id],
    queryFn:()=> queryLocations.getSubSubSubAdminAreaList(id),
    enabled: !!id,
     ...queryConfig  });
}