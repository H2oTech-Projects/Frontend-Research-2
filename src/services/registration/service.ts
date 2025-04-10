// src/api/registerUser.ts
import axios from "axios";
import { BASE_API_URL } from "@/utils/constant";

const REGISTER_URL = BASE_API_URL + '/auth/registration/';
const CHECK_TOKEN_URL = BASE_API_URL + '/auth/registration/verify-email/';
export interface RegisterData {
  email: string;
  username: string;
  password1: string;
  password2: string;
  first_name: string;
  last_name: string;
}

export interface PostToken {
  key: string;} 

export interface RegisterResponse {
  detail: string;
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

  postCheckToken : async (data: PostToken) => {
    const response = await axios.post<RegisterResponse>(CHECK_TOKEN_URL, data, { 
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;   
}

}