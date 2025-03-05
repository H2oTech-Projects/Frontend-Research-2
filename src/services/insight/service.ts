import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";

const GET_ACCOUNTS_LIST = BASE_API_URL + "/accounts";
type AccountAccountListType = {
  data:{
        value: string;
        label: string;
      }[]};
export const queryInsightService = {

  getAccountsList: async () => {
    const response: void |AxiosResponse<AccountAccountListType> = await axios.get(GET_ACCOUNTS_LIST).catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountDetails: async (accountName:string) => {
    const response: void |AxiosResponse<any> = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName).catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountAllocationChart: async (accountName:string) => {
    const response: void |AxiosResponse<any> = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/allocation_chart").catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountFarmUnits: async (accountName:string) => {
    const response: void |AxiosResponse<any> = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/farm_units").catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountParcels: async (accountName:string) => {
    const response: void |AxiosResponse<any> = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/parcels").catch((err) => console.log(err));
    return toJson(response?.data);
  },
}