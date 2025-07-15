import { BASE_URL } from "@/services/config";

export const dashboardAnalytics_Api = (options: {
  userId?: number;
  role?: "teacher" | "student" | "parent";
  childrens?: string;
}): string => {
  if (options.userId) {
    console.log(options);
    return `${BASE_URL}/api/analytics/dashboard?userId=${options.userId}&role=${options.role}&childrens=${options.childrens}`;
  } else {
    throw new Error("userId must be provided");
  }
};
