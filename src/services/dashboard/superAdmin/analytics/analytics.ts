import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { BASE_URL, configDataType } from "@/services/config";
import {
  Invoices_Counts_Analytics_ApiResponse_Type,
  Invoices_Counts_Analytics_Params_Type,
  getSessionConclusion_Api_Params_Type,
  Sessions_Conclusion_ApiResponse_Type,
  ComparisonResult,
  DashboardAnalytics_Api_Params_Type,
  DashboardAnalytics_ApiResponse_Type,
} from "./analytics.type";
import { dashboardAnalytics_Api } from "@/api/analytics";

//urls
const getSessionsConclusionApi = (
  options: getSessionConclusion_Api_Params_Type
) => {
  const params = [];
  if (options?.tutor_id) params.push(`tutor_id=${options.tutor_id}`);
  if (options?.user_id) params.push(`user_id=${options.user_id}`);
  if (options?.startDate) params.push(`startDate=${options.startDate}`);
  if (options?.endDate) params.push(`endDate=${options.endDate}`);

  const queryString = params.join("&");
  return `${BASE_URL}/api/analytics/sessions/getSessionsConclusion?${queryString}`;
};

const getInvoicesCountsAnalytics_ApiUrl = (
  options: Invoices_Counts_Analytics_Params_Type
) => {
  const params = new URLSearchParams();
  if (options.year) params.append("year", options.year.toString());
  if (options.startDate)
    params.append("startDate", options.startDate.toString());
  if (options?.endDate) params.append("endDate", options.endDate.toString());
  return `${BASE_URL}/api/analytics/invoices/counts?${params.toString()}`;
};

export const getComparisionAnalytics_ApiUrl = () =>
  `${BASE_URL}/api/analytics/getComparisonData`;
///api functions

export const getSessionsConclusion = (
  options: getSessionConclusion_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<Sessions_Conclusion_ApiResponse_Type>(
    getSessionsConclusionApi(options),
    config
  );

export const getInvoicesCountsAnalytics = (
  options: Invoices_Counts_Analytics_Params_Type,
  config: configDataType
) =>
  AxiosGet<Invoices_Counts_Analytics_ApiResponse_Type>(
    getInvoicesCountsAnalytics_ApiUrl(options),
    config
  );
export const getDashboardAnalytics = (
  options: DashboardAnalytics_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<DashboardAnalytics_ApiResponse_Type>(
    dashboardAnalytics_Api(options),
    config
  );
export const getComparisionAnalytics = (config: configDataType) =>
  AxiosGet<ComparisonResult>(getComparisionAnalytics_ApiUrl(), config);
