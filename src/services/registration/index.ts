import { useMutation } from "@tanstack/react-query";
import { POST_LOGIN, POST_REGISTRATION ,POST_VALIDATE_TOKEN} from "./constants";
import { AuthResponse, LoginData, PostToken, queryRegisterUser, RegisterData, RegisterResponse } from "./service";
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

export const usePostLoginUser = () => {
  return useMutation<AuthResponse, Error, LoginData>({
    mutationKey: [POST_LOGIN],
    mutationFn: queryRegisterUser?.loginUser,
  });
}