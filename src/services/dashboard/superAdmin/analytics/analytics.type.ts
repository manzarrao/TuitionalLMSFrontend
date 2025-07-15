export type getSessionConclusion_Api_Params_Type = {
  startDate?: string;
  endDate?: string;
  user_id?: number | null;
  tutor_id?: number | null;
};

export type Sessions_Conclusion_ApiResponse_Type = {
  conclusionCounts: {
    Conducted: number;
    Cancelled: number;
    "Teacher Absent": number;
    "Student Absent": number;
    "No Show": number;
  };
};

export type Invoices_Counts_Analytics_Params_Type = {
  startDate?: string;
  endDate?: string;
  year: number;
};

export type Invoices_Counts_Analytics_ApiResponse_Type = {
  pending: 0;
  overdue: 0;
  paid: 0;
  result: [
    {
      month: "January";
      total_paid: 1000;
    },
    {
      month: "February";
      total_paid: 1500;
    }
  ];
};

export interface StudentRetentionData {
  retentionRateCurrentMonth: string;
  retentionRatePreviousMonth: string;
  percentageDifference: string;
}

export interface ActiveUsersData {
  today: number;
  yesterday: number;
  percentageChange: string;
}

export interface EnrollmentsData {
  currentMonth: number;
  previousMonth: number;
  percentageChange: string;
}

export interface SessionAvgData {
  currentMonthAverage: number;
  previousMonthAverage: number;
  percentageDifference: string;
}

export interface ChurnRateData {
  churnRateCurrentMonth: string;
  churnRatePreviousMonth: string;
  percentageDifference: string;
}

export interface ComparisonData {
  studentRetention: StudentRetentionData;
  activeStudents: ActiveUsersData;
  activeTeachers: ActiveUsersData;
  enrollments: EnrollmentsData;
  sessionAvg: SessionAvgData;
  churnRate: ChurnRateData;
}

export interface ComparisonResult {
  result: ComparisonData;
  message: string;
  status: string;
}

export type DashboardAnalytics_Api_Params_Type = {
  userId?: number;
  role?: "teacher" | "student" | "parent";
  childrens?: string;
};

export type DashboardAnalytics_ApiResponse_Type = {
  enrollmentsCount: number;
  totalClassTime: number;
  totalUpcomingClasses: number;
  totalClassAttended?: number;
};
