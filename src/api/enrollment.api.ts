import { BASE_URL } from "@/services/config";

export const getAllEnrollmentsApi = (options: any) => {
  const params = new URLSearchParams();

  if (options?.name) params.append("name", options?.name);
  if (options?.startDate) params.append("startDate", options?.startDate);
  if (options?.endDate) params.append("endDate", options?.endDate);
  if (options?.limit) params.append("limit", options?.limit);
  if (options?.page) params.append("page", options?.page);
  if (options.subjectId) params.append("subjectId", options.subjectId);
  if (options.curriculumId) params.append("curriculumId", options.curriculumId);
  if (options.boardId) params.append("boardId", options.boardId);
  if (options.gradeId) params.append("gradeId", options.gradeId);
  if (options.teacher_id) params.append("teacher_id", options.teacher_id);
  if (options.student_id) params.append("student_id", options.student_id);
  if (options.childrens) params.append("childrens", options.childrens);

  return `${BASE_URL}/api/enrollment/getAllEnrollment?${params.toString()}`;
};

export const createEnrollmentApi = () => `${BASE_URL}/api/enrollment`;
export const deleteEnrollmentApi = (id: string) =>
  `${BASE_URL}/api/enrollment/${id}`;
export const changeEnrollmentBreakStatusApi = (id: string) =>
  `${BASE_URL}/api/enrollment/${id}/on-break`;
export const enrollmentByGroupIdApi = (id: string) =>
  `${BASE_URL}/api/enrollment/getEnrollmentByIdGrouped/${id}`;
export const editEnrollmentByGroupIdApi = (id: string) =>
  `${BASE_URL}/api/enrollment/${id}`;
