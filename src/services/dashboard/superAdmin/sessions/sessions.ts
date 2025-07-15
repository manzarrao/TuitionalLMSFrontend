import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { configDataType } from "@/services/config";
import {
  GetAllSessionsWithEnrollmentIds_Api_Response_Type,
  GetAllSessionsWithGroupIds_Payload_Type,
  GetAllSessionsWithGroupIds_Params_Type,
} from "@/types/sessions/getAllSessionsWithGroupIds.types";
import { GetSessions_ExcelData_Api_Options } from "@/types/sessions/getExcelSessionsData.types";
import {
  Create_Session_Payload_Type,
  Create_Session_ApiResponse_Type,
} from "@/types/sessions/createSession.types";
import {
  MonthlySessionCountForTutor_Api_Response_Type,
  MonthlySessionCountForTutor_Api_Params_Type,
} from "@/types/sessions/monthlySessionData.types";
import {
  SessionSummaryForTutor_Api_Response_Type,
  SessionSummaryForTutuor_Api_Params_Type,
} from "@/types/sessions/sessionSummary.types";
import {
  MonthlySessionDataForTutorStudent_Api_Response,
  MonthlySessionDataForTutor_Api_Params_Type,
  MonthlySessionDataForStudent_Api_Params_Type,
  MonthlySessionDataForParent_Api_Params_Type,
} from "@/types/sessions/monthlySessionCount.types";

//api
import {
  getAllSessionApi,
  getAllSessionWithGroupIdsApi,
  getSessionsExcelDataApi,
  createSessionApi,
  updateSessionApi,
  deleteSessionApi,
  recreateSessionApi,
  monthlySessionCountForTutorApi,
  monthlySessionCountForStudentApi,
  monthlySessionDataForTutuorApi,
  sessionSummaryForTutuorApi,
  monthlySessionCountForParentApi,
} from "@/api/sessions.api";

// functions

export const getAllSessions = (
  options: GetSessions_ExcelData_Api_Options,
  config: configDataType
) =>
  AxiosGet<GetAllSessionsWithEnrollmentIds_Api_Response_Type>(
    getAllSessionApi(options),
    config
  );

export const getAllSessionWithGroupIds = (
  config: configDataType,
  options: GetAllSessionsWithGroupIds_Params_Type,
  payload: GetAllSessionsWithGroupIds_Payload_Type
) =>
  AxiosPost<GetAllSessionsWithEnrollmentIds_Api_Response_Type>(
    getAllSessionWithGroupIdsApi(options),
    config,
    payload
  );

export const getSessionsExcelData = (
  options: GetSessions_ExcelData_Api_Options,
  config: configDataType
) =>
  AxiosGet<GetAllSessionsWithEnrollmentIds_Api_Response_Type>(
    getSessionsExcelDataApi(options),
    config
  );

// create session
export const createSession = (
  config: configDataType,
  payload: Create_Session_Payload_Type
) =>
  AxiosPost<Create_Session_ApiResponse_Type>(
    createSessionApi(),
    config,
    payload
  );
// update session
export const updateSession = (
  id: string,
  config: configDataType,
  payload: { conclusion_type?: string; duration?: number }
) => AxiosPut<any>(updateSessionApi(id), config, payload);
// delete session
export const deleteSession = (id: string, config: configDataType) =>
  AxiosDelete<any>(deleteSessionApi(id), config);
// recreate session
export const recreacteSession = (id: string, config: configDataType) =>
  AxiosGet<any>(recreateSessionApi(id), config);

export const monthlySessionDataForTutuor = (
  options: MonthlySessionCountForTutor_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<MonthlySessionCountForTutor_Api_Response_Type>(
    monthlySessionDataForTutuorApi(options),
    config
  );

export const monthlySessionCountForTutor = (
  options: MonthlySessionDataForTutor_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<MonthlySessionDataForTutorStudent_Api_Response>(
    monthlySessionCountForTutorApi(options),
    config
  );

export const monthlySessionCountForStudent = (
  options: MonthlySessionDataForStudent_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<MonthlySessionDataForTutorStudent_Api_Response>(
    monthlySessionCountForStudentApi(options),
    config
  );
export const monthlySessionCountForParent = (
  options: MonthlySessionDataForParent_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<MonthlySessionDataForTutorStudent_Api_Response>(
    monthlySessionCountForParentApi(options),
    config
  );

export const sessionSummaryForTutuor = (
  options: SessionSummaryForTutuor_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<SessionSummaryForTutor_Api_Response_Type>(
    sessionSummaryForTutuorApi(options),
    config
  );
