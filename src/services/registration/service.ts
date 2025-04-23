// src/api/registerUser.ts
import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toast } from "react-toastify";

const REGISTER_URL = BASE_API_URL + '/auth/register/';
const CHECK_TOKEN_URL = BASE_API_URL + '/auth/registration/verify-registration/';
const LOGIN_URL = BASE_API_URL + '/auth/login/';
export interface RegisterData {
  email: string;
  password: string;
  password_confirm: string;
  first_name: string;
  last_name: string;
}

export interface PostToken 
 {
   user_id: string,
   timestamp:string,
   signature: string
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: string;
  msg: string;
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
export const queryRegisterUser = {
  postRegisterUser: async (data: RegisterData) => {
    const response = await axios.post<RegisterResponse>(REGISTER_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response,"test")
    return response.data;
  },

  postCheckToken : async (data: PostToken) => {
    const response = await axios.post<RegisterResponse>(CHECK_TOKEN_URL, data, { 
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;   
},

  loginUser : async (data: LoginData) => {
    const response = await axios.post<AuthResponse>(LOGIN_URL, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  }

}