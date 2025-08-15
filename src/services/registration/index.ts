import { useMutation } from "@tanstack/react-query";
import { POST_LOGIN, POST_LOGOUT, POST_REGISTRATION ,POST_VALIDATE_TOKEN, PUT_ASSOCIATECLIENT} from "./constants";
import { AuthResponse, LoginData, LogoutData, PostToken, queryRegisterUser, RegisterData, RegisterResponse } from "./service";
import { AxiosError } from 'axios';

type ErrorResponse = {
  success: string;
  message: string;
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
    mutationFn: queryRegisterUser.verifyUser,
  });
}

export const usePostLoginUser = () => {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, LoginData>({
    mutationKey: [POST_LOGIN],
    mutationFn: queryRegisterUser?.loginUser,
  });
}

export const usePostLogoutUser = () => {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, LogoutData>({
    mutationKey: [POST_LOGOUT],
    mutationFn: queryRegisterUser?.logoutUser,
  });
}

export const usePostAssociateUserClient = () => {
  return useMutation<AuthResponse, AxiosError<ErrorResponse>, LogoutData>({
    mutationKey: [PUT_ASSOCIATECLIENT],
    mutationFn: queryRegisterUser?.associateClient,
  });
}
