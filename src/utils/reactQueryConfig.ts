export const queryConfig = {
  refetchOnWindowFocus: false,
  staleTime: Infinity,
  keepPreviousData: true,
  retry:false
};
export const toJson = (res: any) => {
  if (typeof res === "object") {
    return JSON.parse(JSON.stringify(res));
  }
  return JSON.parse(JSON.stringify({}));
};

export const noCacheQueryConfig = {
  refetchOnWindowFocus: false,  
  staleTime: 0,
  cacheTime: 0,
  keepPreviousData: false
};