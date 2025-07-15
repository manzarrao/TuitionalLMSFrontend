import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { BASE_URL, configDataType } from "@/services/config";
import {
  GenerateUserInvoice_Api_Response,
  GetAllInvoice_Api_Response,
  GetAllInvoices_Options,
  Update_Invoice_Status_Api_Response,
  Generate_New_Invoice_Api_Response,
  Generate_New_Invoice_Api_Payload,
  Generate_Invoice_For_Parent_Api_Payload_Type,
  Generate_Invoice_For_Parent_Api_Response_Type,
} from "./invoices.types";

// URLs
const getAllInvoicesApi = (options: GetAllInvoices_Options): string => {
  const params = new URLSearchParams();
  if (options?.limit !== undefined)
    params.append("limit", options.limit.toString());
  if (options?.page !== undefined)
    params.append("page", options.page.toString());
  if (options?.date) params.append("date", options.date);
  if (options?.due_date) params.append("due_date", options.due_date);
  if (options?.user_id !== undefined)
    params.append("user_id", options.user_id.toString());
  return `${BASE_URL}/api/invoice/?${params.toString()}`;
};
const generateInvoicesApi_ForStudents = (options: { id: number }): string =>
  `${BASE_URL}/api/invoice/${options?.id?.toString()}`;
const generateNewInvoiceApi = (): string => `${BASE_URL}/api/invoices/generate`;
const generateInvoiceForParentApi = (): string =>
  `${BASE_URL}/api/invoice/generateInvoiceForParent`;
const updateInvoiceStatusApi = (id: number | null): string =>
  `${BASE_URL}/api/invoice/${id?.toString()}/status`;
const deleteInvoiceStatusApi = (id: number | null): string =>
  `${BASE_URL}/api/invoices/${id?.toString()}`;

// API Functions
export const getAllInvoices = (
  options: GetAllInvoices_Options,
  config: configDataType
): Promise<GetAllInvoice_Api_Response> =>
  AxiosGet<GetAllInvoice_Api_Response>(getAllInvoicesApi(options), config);

// generate invoices for students
export const generateInvoices = (
  options: { id: number },
  config: configDataType
): Promise<GenerateUserInvoice_Api_Response> =>
  AxiosGet<GenerateUserInvoice_Api_Response>(
    generateInvoicesApi_ForStudents(options),
    config
  );

export const generateNewInvoice = (
  config: configDataType,
  payload: Generate_New_Invoice_Api_Payload
): Promise<Generate_New_Invoice_Api_Response> =>
  AxiosPost<Generate_New_Invoice_Api_Response>(
    generateNewInvoiceApi(),
    config,
    payload
  );
// generate invoice for parent
export const generateInvoiceForParent = (
  config: configDataType,
  payload: Generate_Invoice_For_Parent_Api_Payload_Type
): Promise<Generate_Invoice_For_Parent_Api_Response_Type> =>
  AxiosPost<Generate_Invoice_For_Parent_Api_Response_Type>(
    generateInvoiceForParentApi(),
    config,
    payload
  );

export const updateInvoiceStatus = (
  id: number | null,
  config: configDataType,
  payload: {
    status: "PAID";
    amount_paid: number;
  }
): Promise<Update_Invoice_Status_Api_Response> =>
  AxiosPut<Update_Invoice_Status_Api_Response>(
    updateInvoiceStatusApi(id),
    config,
    payload
  );

export const deleteInvoice = (
  id: number | null,
  config: configDataType
): Promise<{ message: string }> =>
  AxiosDelete<{ message: string }>(deleteInvoiceStatusApi(id), config);
