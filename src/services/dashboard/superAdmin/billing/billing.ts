import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { BASE_URL, configDataType } from "@/services/config";
import {
  Get_All_Billing_ApiResponse_Type,
  Create_New_Billing_Payload_Type,
  Billing_Api_FilterOptions,
} from "./billing.types";

//urls
const getAllBillingApi = (options: any) => {
  const params = new URLSearchParams();
  // Convert numeric values to strings
  if (options.limit) params.append("limit", options.limit.toString());
  if (options.page) params.append("page", options.page.toString());
  if (options?.user_id) params.append("user_id", options.user_id.toString());
  return `${BASE_URL}/api/billing/getAllBillings?${params.toString()}`;
};
const createNewBillingApi = () => `${BASE_URL}/api/billing/add`;

///api function
export const getAllBilling = (
  options: Billing_Api_FilterOptions,
  config: configDataType
) =>
  AxiosGet<Get_All_Billing_ApiResponse_Type>(getAllBillingApi(options), config);

export const createNewBilling = (
  config: configDataType,
  payload: Create_New_Billing_Payload_Type
) => AxiosPost<any>(createNewBillingApi(), config, payload);
