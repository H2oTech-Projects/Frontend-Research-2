import { BASE_API_URL } from "@/utils/constant";
import axiosInstance from "../axiosInstance";

const MAP_PREVIEW_URL = BASE_API_URL + '/preview/';

export const queryMapPreview = {
  postMapPreview: async (files: any) => {
    
    const formData = new FormData();
     Array.from(files).forEach((file:any) => {
      formData.append("files", file); // keep the key same to support multiple files on backend
    });
    const response = await axiosInstance.post(MAP_PREVIEW_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
}