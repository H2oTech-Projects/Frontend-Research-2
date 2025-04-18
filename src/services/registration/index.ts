import { useMutation } from "@tanstack/react-query";
import { POST_REGISTRATION ,POST_VALIDATE_TOKEN} from "./constants";
import { PostToken, queryRegisterUser, RegisterData, RegisterResponse } from "./service";
import { AxiosError } from 'axios';

type ErrorResponse = {
  success: string;
  msg: string;
}

export const usePostRegisterUser = () => {
  return useMutation<RegisterResponse, AxiosError<ErrorResponse>, RegisterData>({
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