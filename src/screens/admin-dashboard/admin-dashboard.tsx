"use client";
import React, { FC, useEffect, useMemo } from "react";
import classes from "./admin-dashboard.module.css";
import AdminDashboardStatsCard from "@/components/ui/superAdmin/admin-dashboard/dashboard-statsCard/dashboard-statsCard";
import SessionsChart from "@/components/ui/superAdmin/admin-dashboard/session-chart/session-chart";
import EnrollmentTrendsChart from "@/components/ui/superAdmin/admin-dashboard/enrollmentTrends-card/enrollmentTrends-card";
import AttendanceChart from "@/components/ui/superAdmin/admin-dashboard/attendance-chart/attendance-chart";
import UserEngagementChart from "@/components/ui/superAdmin/admin-dashboard/userEngagement-chart/userEngagement-chart";
import StudentDistributionChart from "@/components/ui/superAdmin/admin-dashboard/studentDistribution/studentDistribution";
import GradeDistributionChart from "@/components/ui/superAdmin/admin-dashboard/gradeDistribution-chart/gradeDistribution-chart";
import SessionsHourChart from "@/components/ui/superAdmin/admin-dashboard/sessionHour-chart/sessionHour-chart";
import GeographicDistributionChart from "@/components/ui/superAdmin/admin-dashboard/geographicDistribution/geographicDistribution";
import TodaysSessionsTable from "@/components/ui/superAdmin/admin-dashboard/todaySessions-table/todaySessions-table";
import TutorPerformance from "@/components/ui/superAdmin/admin-dashboard/tutorPerformance/tutorPerformance";
import {
  Users,
  BookOpen,
  Activity,
  UserPlus,
  TrendingDown,
  BarChart2,
} from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { useQuery } from "@tanstack/react-query";
import { getComparisionAnalytics } from "@/services/dashboard/superAdmin/analytics/analytics";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";

const AdminDashboard: FC = () => {
  const { token } = useAppSelector((state) => state?.user);

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getComparisionAnalytics"],
    queryFn: () => getComparisionAnalytics({ token }),
    enabled: !!token,
  });

  const statsData = useMemo(
    () => [
      {
        title: "Active Students",
        value: data?.result.activeStudents.today,
        icon: Users,
        description: "Daily active users",
        trend: {
          value: data?.result.activeStudents.percentageChange,
          isPositive:
            Number(data?.result?.activeStudents?.percentageChange) > 0,
          label: "vs. yesterday",
        },
        compact: true,
      },
      {
        title: "New Enrollments",
        value: data?.result.enrollments.currentMonth,
        icon: UserPlus,
        description: "This month",
        trend: {
          value: data?.result.enrollments.percentageChange,
          isPositive: Number(data?.result.enrollments.percentageChange) > 0,
          label: "vs. last month",
        },
        // variant: "green",
        compact: true,
      },
      {
        title: "Student Retention",
        value: data?.result.studentRetention.retentionRateCurrentMonth + "%",
        icon: Activity,
        description: "30-day retention rate",
        trend: {
          value: data?.result.studentRetention.percentageDifference,
          isPositive:
            Number(data?.result.studentRetention.percentageDifference) > 0,
          label: "vs. last month",
        },
        // variant: "blue",
        compact: true,
      },
      {
        title: "Churn Rate",
        value: data?.result.churnRate.churnRateCurrentMonth + "%",
        icon: TrendingDown,
        description: "Monthly churn",
        trend: {
          value: data?.result.churnRate.percentageDifference,
          isPositive: Number(data?.result.churnRate.percentageDifference) > 0,
          label: "vs. last month",
        },
        // variant: "amber",
        compact: true,
      },
      {
        title: "Avg. Sessions",
        value: Number(data?.result.sessionAvg.currentMonthAverage).toFixed(2),
        icon: BarChart2,
        description: "Per student / month",
        trend: {
          value: Number(data?.result.sessionAvg.percentageDifference).toFixed(
            2
          ),
          isPositive: Number(data?.result.sessionAvg.percentageDifference) > 0,
          label: "vs. last month",
        },
        compact: true,
      },
      {
        title: "Active Teachers",
        value: data?.result.activeTeachers.today,
        icon: BookOpen,
        description: "Currently online",
        trend: {
          value: data?.result.activeTeachers.percentageChange,
          isPositive: Number(data?.result.activeTeachers.percentageChange) > 0,
          label: "vs. yesterday",
        },
        // variant: "purple",
        compact: true,
      },
    ],
    [data]
  );

  useEffect(() => {
    if (error) {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(axiosError.response.data.error);
      } else {
        toast.error(axiosError.message);
      }
    }
  }, [error]);

  return (
    <div className={classes.container}>
      <div className={classes.gridContainer1}>
        {statsData?.map((item: any, indx: number) => (
          <AdminDashboardStatsCard
            key={indx}
            title={item?.title}
            value={item?.value}
            icon={item?.icon}
            description={item?.description}
            trend={item?.trend}
            compact={item?.compact}
            variant={item?.variant}
            loading={isLoading}
          />
        ))}
      </div>
      <div className={classes.gridContainer2}>
        <SessionsChart />
        <EnrollmentTrendsChart />
        <AttendanceChart />
      </div>
      <div className={classes.gridContainer2}>
        <UserEngagementChart />
        <StudentDistributionChart />
        <GradeDistributionChart />
      </div>
      <div className={classes.gridContainer4}>
        <SessionsHourChart />
        <GeographicDistributionChart />
      </div>
      <div className={classes.gridContainer2}>
        <StudentDistributionChart />
        <AttendanceChart lable="Session Completion" />
      </div>
      <div className={classes.gridContainer6}>
        <TodaysSessionsTable />
        <TutorPerformance />
      </div>
    </div>
  );
};

export default AdminDashboard;
