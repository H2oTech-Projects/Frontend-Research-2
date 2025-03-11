import axios, { AxiosResponse } from "axios";
import { BASE_API_URL } from "@/utils/constant";
import { toJson} from "@/utils/reactQueryConfig";

const GET_ACCOUNTS_LIST = BASE_API_URL + "/accounts";
const GET_PARCEL_LIST = BASE_API_URL + "/parcel_list";

export const queryInsightService = {

  getAccountsList: async () => {
    const response = await axios.get(GET_ACCOUNTS_LIST).catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getParcelList: async () => {
    const response = await axios.get(GET_PARCEL_LIST).catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountDetails: async (accountName:string | null) => {
    if (accountName === null) {
      return toJson({});  }
    const response = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName).catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountAllocationChart: async (accountName:string | null) => {
   if (accountName === null) {
      return toJson({});  }
    const response = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/allocation_chart").catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountFarmUnits: async (accountName:string | null) => {
   if (accountName === null) {
      return toJson({});  }
    const response = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/farm_units").catch((err) => console.log(err));
    return toJson(response?.data);
  },
  getAccountParcels: async (accountName:string | null) => {
   if (accountName === null) {
      return toJson({});  }
    const response: void |AxiosResponse<any> = await axios.get(GET_ACCOUNTS_LIST + "/" + accountName + "/parcels").catch((err) => console.log(err));
    return toJson(response?.data);
  },
}