import { BASE_URL } from "@/services/config";
import { GetAllSessionsWithGroupIds_Params_Type } from "@/types/sessions/getAllSessionsWithGroupIds.types";
import { GetSessions_ExcelData_Api_Options } from "@/types/sessions/getExcelSessionsData.types";
import {
  MonthlySessionDataForTutor_Api_Params_Type,
  MonthlySessionDataForStudent_Api_Params_Type,
  MonthlySessionDataForParent_Api_Params_Type,
} from "@/types/sessions/monthlySessionCount.types";

export const getAllSessionWithGroupIdsApi = (
  options: GetAllSessionsWithGroupIds_Params_Type
) => {
  const params = new URLSearchParams();
  if (options?.pagelimit) params.append("limit", options?.pagelimit);
  if (options?.page) params.append("page", options?.page);
  return `${BASE_URL}/api/sessions/getAllSessionsWithGroupIds?${params.toString()}`;
};

// apis
export const getAllSessionApi = (
  options: GetSessions_ExcelData_Api_Options
) => {
  const params = new URLSearchParams();
  if (options?.pagelimit) params.append("limit", options?.pagelimit.toString());
  if (options?.page) params.append("page", options?.page.toString());
  if (options?.enrollment_id)
    params.append("enrollment_id", options.enrollment_id.toString());
  if (options?.tutor_id) params.append("tutor_id", options.tutor_id.toString());
  if (options?.subject_id)
    params.append("subject_id", options.subject_id.toString());
  if (options?.student_id)
    params.append("student_id", options.student_id.toString());
  if (options?.curriculum_id)
    params.append("curriculum_id", options.curriculum_id.toString());
  if (options?.grade_id) params.append("grade_id", options.grade_id.toString());
  if (options?.board_id) params.append("board_id", options.board_id.toString());
  if (options?.conclusion_type)
    params.append("conclusion_type", options.conclusion_type);
  if (options?.start_time) params.append("start_time", options.start_time);
  if (options?.end_time) params.append("end_time", options.end_time);

  return `${BASE_URL}/api/sessions?${params.toString()}`;
};

export const getSessionsExcelDataApi = (
  options: GetSessions_ExcelData_Api_Options
) => {
  const params = new URLSearchParams();
  if (options?.enrollment_id)
    params.append("enrollment_id", options.enrollment_id.toString());
  if (options?.tutor_id) params.append("tutor_id", options.tutor_id.toString());
  if (options?.subject_id)
    params.append("subject_id", options.subject_id.toString());
  if (options?.student_id)
    params.append("student_id", options.student_id.toString());
  if (options?.curriculum_id)
    params.append("curriculum_id", options.curriculum_id.toString());
  if (options?.grade_id) params.append("grade_id", options.grade_id.toString());
  if (options?.board_id) params.append("board_id", options.board_id.toString());
  if (options?.conclusion_type)
    params.append("conclusion_type", options.conclusion_type);
  if (options?.start_time) params.append("start_time", options.start_time);
  if (options?.end_time) params.append("end_time", options.end_time);

  return `${BASE_URL}/api/sessions/getSessionData?${params.toString()}`;
};
export const createSessionApi = () => `${BASE_URL}/api/sessions`;
export const updateSessionApi = (id: string) =>
  `${BASE_URL}/api/sessions/${id}}`;
export const deleteSessionApi = (id: string) =>
  `${BASE_URL}/api/sessions/${id}}`;
export const recreateSessionApi = (id: string): string =>
  `${BASE_URL}/api/sessions/recreate/${id}`;
export const monthlySessionDataForTutuorApi = (options: {
  tutor_id: string;
  month: string;
}): string => `${BASE_URL}/api/sessions/${options?.tutor_id}/${options?.month}`;
export const monthlySessionCountForTutorApi = (
  options: MonthlySessionDataForTutor_Api_Params_Type
): string => {
  if (options.tutor_id) {
    return `${BASE_URL}/api/sessions/monthly-session-count/${options.tutor_id}`;
  } else {
    throw new Error("Either tutor_id or student_id must be provided");
  }
};
export const monthlySessionCountForStudentApi = (
  options: MonthlySessionDataForStudent_Api_Params_Type
): string => {
  if (options.student_id) {
    return `${BASE_URL}/api/sessions/monthly-session-count-student/${options.student_id}`;
  } else {
    throw new Error("Either tutor_id or student_id must be provided");
  }
};
export const monthlySessionCountForParentApi = (
  options: MonthlySessionDataForParent_Api_Params_Type
): string => {
  if (options.childrens) {
    return `${BASE_URL}/api/sessions/monthly-session-count-student/${options.student_id}?childrens=${options.childrens}`;
  } else {
    throw new Error("Either tutor_id or student_id must be provided");
  }
};

export const sessionSummaryForTutuorApi = (options: {
  tutor_id?: string;
}): string => {
  if (options.tutor_id) {
    return `${BASE_URL}/api/sessions/summary/${options?.tutor_id}`;
  } else {
    throw new Error("tutor_id must be provided");
  }
};
