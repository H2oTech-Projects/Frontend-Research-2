import { useMutation } from "@tanstack/react-query";
import { POST_REGISTRATION ,POST_VALIDATE_TOKEN} from "./constants";
import { PostToken, queryRegisterUser, RegisterData, RegisterResponse } from "./service";

export const usePostRegisterUser = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationKey: [POST_REGISTRATION],
    mutationFn: queryRegisterUser.postRegisterUser,
  });
}

export const usePostCheckToken = () => {
  return useMutation<RegisterResponse, Error, PostToken>({
    mutationKey: [POST_VALIDATE_TOKEN],
    mutationFn: queryRegisterUser.postCheckToken,
  });
}