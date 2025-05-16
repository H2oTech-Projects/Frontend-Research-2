import { useMutation } from "@tanstack/react-query";
import { POST_MAP_PREVIEW } from "./constant";
import { queryMapPreview } from "./service";

export const usePostMapPreview = () => {
  return useMutation({
    mutationKey: [POST_MAP_PREVIEW],
    mutationFn: queryMapPreview.postMapPreview,});
}