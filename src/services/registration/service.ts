// src/api/registerUser.ts
import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "@/services/axiosInstance";

const REGISTER_URL = BASE_API_URL + '/auth/register/';
const CHECK_TOKEN_URL = BASE_API_URL + '/auth/verify-registration/';
const LOGIN_URL = BASE_API_URL + '/auth/login/';
const LOGOUT_URL = BASE_API_URL + '/auth/logout/';
export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface PostToken {
  user_id: string,
  timestamp: string,
  signature: string
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: string;
  message: { [key: string]: any };
}

export type AuthResponse = {
  access: string;
  refresh: string;
  user: {
    pk: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
};

export type LogoutData = {
  refresh_token: string
}

export const queryRegisterUser = {
  postRegisterUser: async (data: RegisterData) => {
    const response = await axios.post<RegisterResponse>(REGISTER_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  verifyUser: async (data: PostToken) => {
    const response = await axios.post<RegisterResponse>(CHECK_TOKEN_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  loginUser: async (data: LoginData) => {
    const response = await axios.post<AuthResponse>(LOGIN_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  logoutUser: async (data: LogoutData) => {
    const response = await axios.post<AuthResponse>(LOGOUT_URL, data, {
      headers: {
        "Content-Type": "application/json",
      }
    });
    return response.data;
  },
  associateClient: async (clientId:any) =>{
    const response = await axiosInstance.put(BASE_API_URL + "/clients/" + clientId + "/associate", {
        headers: {
           "Content-Type": "application/json",
        },
      })
    return response?.data
  }

}