import { AxiosGet, AxiosPost, AxiosDelete } from "@/utils/helpers/api-methods";
import { BASE_URL, configDataType } from "@/services/config";
import { SessionById_Response_Type } from "./session-details.type";

//urls
const getSessionByIdApi = (id: string) => `${BASE_URL}/api/sessions/${id}`;

///api function
export const getSessionDetailsById = (id: string, config: configDataType) =>
  AxiosGet<SessionById_Response_Type>(getSessionByIdApi(id), config);
