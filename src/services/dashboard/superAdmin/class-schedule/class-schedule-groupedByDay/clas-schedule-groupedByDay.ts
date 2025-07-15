import {
  AxiosGet,
  AxiosPost,
  AxiosDelete,
  AxiosPut,
} from "@/utils/helpers/api-methods";
import { BASE_URL, configDataType } from "@/services/config";
import { Class_Schedule_Type } from "./clas-schedule-groupedByDay.types";

// Construct API URL with query parameters
const getAllClassSchedulesApi = (options: {
  student_id?: number | null;
  tutor_id?: number | null;
  childrens?: string | null;
}) => {
  const params = new URLSearchParams();

  if (options?.student_id !== undefined && options.student_id !== null) {
    params.append("student_id", options.student_id.toString());
  }
  if (options?.tutor_id !== undefined && options.tutor_id !== null) {
    params.append("tutor_id", options.tutor_id.toString());
  }
  if (options?.childrens !== undefined && options.childrens !== null) {
    params.append("childrens", options.childrens.toString());
  }

  const queryString = params.toString();
  return `${BASE_URL}/api/class-schedules/grouped-by-day${
    queryString ? `?${queryString}` : ""
  }`;
};

// API function
export const getAllClassSchedules = (
  options: {
    student_id?: number | null;
    tutor_id?: number | null;
    childrens?: string;
  },
  config: configDataType
) => AxiosGet<Class_Schedule_Type>(getAllClassSchedulesApi(options), config);
