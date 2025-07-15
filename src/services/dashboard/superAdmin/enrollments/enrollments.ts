import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { configDataType } from "@/services/config";
import {
  GetAllEnrollment_Api_Params_Type,
  GetAllEnrollment_Api_Response_Type,
  Create_Enrollment_Payload_Type,
  Create_Enrollment_Api_Response_Type,
  ChangeEnrollmentBrekStatus_Api_Response_Type,
  GetEnrollmentByGroupId_Api_Response_Type,
} from "@/types/enrollment/getAllEnrollments.types";
import {
  getAllEnrollmentsApi,
  createEnrollmentApi,
  deleteEnrollmentApi,
  changeEnrollmentBreakStatusApi,
  enrollmentByGroupIdApi,
  editEnrollmentByGroupIdApi,
} from "@/api/enrollment.api";

///api function
export const getAllEnrollments = (
  options: GetAllEnrollment_Api_Params_Type,
  config: configDataType
) =>
  AxiosGet<GetAllEnrollment_Api_Response_Type>(
    getAllEnrollmentsApi(options),
    config
  );

export const addEnrollment = (
  data: Create_Enrollment_Payload_Type,
  config: configDataType
) =>
  AxiosPost<Create_Enrollment_Api_Response_Type>(
    createEnrollmentApi(),
    config,
    data
  );

export const deleteEnrollment = (
  payload: { id: string },
  config: configDataType
) => AxiosDelete<any>(deleteEnrollmentApi(payload?.id), config);

export const changeBreakStatus = (
  id: string,
  payload: { on_break: boolean },
  config: configDataType
) =>
  AxiosPut<ChangeEnrollmentBrekStatus_Api_Response_Type>(
    changeEnrollmentBreakStatusApi(id),
    config,
    payload
  );

export const getEnrollmentByGroupId = (id: string, config: configDataType) =>
  AxiosGet<GetEnrollmentByGroupId_Api_Response_Type>(
    enrollmentByGroupIdApi(id),
    config
  );
export const editEnrollmentByGroupId = (
  id: string,
  payload: any,
  config: configDataType
) => AxiosPut<any>(editEnrollmentByGroupIdApi(id), config, payload);
