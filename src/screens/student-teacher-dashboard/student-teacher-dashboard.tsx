"use client";
import React, {
  FC,
  useMemo,
  useEffect,
  useState,
  CSSProperties,
  useCallback,
} from "react";
import classes from "./student-teacher-dashboard.module.css";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks/hooks";
import { toast } from "react-toastify";
import Card from "@/components/ui/teacher/dashboard-card/dashboard-card";
import Enrollment from "./components/enrollment/enrollment";
import OngoingClass from "./components/ongoing-class/ongoing-class";
import Sessions from "./components/sessions/sessions";
import GoogleAuthModal from "@/components/global/google-auth/google-auth";
import SessionHistory from "@/components/ui/teacher/earnings/session-history/session-history";
import {
  monthlySessionCountForTutor,
  monthlySessionCountForStudent,
  monthlySessionCountForParent,
} from "@/services/dashboard/superAdmin/sessions/sessions";
import { useQuery } from "@tanstack/react-query";
import { MyAxiosError } from "@/services/error.type";
import { useMediaQuery } from "react-responsive";
import { fetchRoles } from "@/lib/store/slices/role-slice";
import { fetchResources } from "@/lib/store/slices/resources-slice";
import { fetchUsersByGroup } from "@/lib/store/slices/usersByGroup-slice";
import { getDashboardAnalytics } from "@/services/dashboard/superAdmin/analytics/analytics";
import { monthlySessionCountForParentApi } from "@/api/sessions.api";

const Dashboard: FC = () => {
  const dispatch = useAppDispatch();
  const isLarge = useMediaQuery({ query: "(max-width: 1000px)" });
  const styles = useMemo(() => {
    return {
      cardStyles: {
        flexDirection: isLarge ? "row" : undefined,
        alingItems: isLarge ? "center" : undefined,
        justifyContent: isLarge ? "space-between" : undefined,
        flex: 1,
        padding: "20px",
      } as CSSProperties,
      bottomBoxStyles: {
        width: isLarge ? "50%" : undefined,
      } as CSSProperties,
    };
  }, [isLarge]);
  const { token, user, enrollementIds, childrens } = useAppSelector(
    (state) => state?.user
  );

  const {
    data: sessionCountForTutorStudentData,
    error: sessionCountForTutorStudentError,
    isLoading: sessionCountForTutorStudentLoading,
  } = useQuery({
    queryKey: ["getSessionCountData", user?.id],
    queryFn: () => {
      if (user?.roleId === 5) {
        return monthlySessionCountForTutor(
          { tutor_id: String(user?.id) },
          {
            token,
          }
        );
      } else if (user?.roleId === 3) {
        return monthlySessionCountForStudent(
          { student_id: String(user?.id) },
          {
            token,
          }
        );
      } else if (user?.roleId === 4) {
        return monthlySessionCountForParent(
          {
            student_id: String(user?.id),
            childrens: childrens?.map((i: any) => i.id).join(","),
          },
          {
            token,
          }
        );
      }
    },
    enabled: !!user?.id && !!token && user?.roleId != null,
  });

  const {
    data: dashboardAnalyticsData,
    error: dashboardAnalyticsError,
    isLoading: dashboardAnalyticsLoading,
  } = useQuery({
    queryKey: ["getDashboardAnalytics", user?.id],
    queryFn: () => {
      if (user?.roleId === 5) {
        return getDashboardAnalytics(
          { userId: Number(user?.id), role: "teacher" },
          {
            token,
          }
        );
      } else if (user?.roleId === 3) {
        return getDashboardAnalytics(
          { userId: Number(user?.id), role: "student" },
          {
            token,
          }
        );
      } else if (user?.roleId === 4) {
        return getDashboardAnalytics(
          {
            userId: Number(user?.id),
            role: "parent",
            childrens: childrens?.map((i: any) => i.id).join(","),
          },
          {
            token,
          }
        );
      }
    },
    enabled: !!user?.id && !!token && user?.roleId != null,
  });

  useEffect(() => {
    if (sessionCountForTutorStudentError) {
      const axiosError = sessionCountForTutorStudentError as MyAxiosError;
      toast.error(axiosError.response?.data?.error || axiosError.message);
    }
  }, [sessionCountForTutorStudentError]);

  const sessionCountData = useMemo(() => {
    if (
      !sessionCountForTutorStudentData?.data ||
      !Array.isArray(sessionCountForTutorStudentData?.data) ||
      (sessionCountForTutorStudentData?.data as any[])?.length === 0
    )
      return [];

    return sessionCountForTutorStudentData?.data?.map((item) => ({
      ...item,
      highlight: true,
    }));
  }, [sessionCountForTutorStudentData?.data]);

  // Memoize the fetch data function to use in useEffect
  const fetchUserData = useCallback(
    (authToken: string) => {
      // Using Promise.all to parallelize the requests
      return Promise.all([
        dispatch(fetchRoles({ token: authToken })),
        dispatch(fetchResources({ token: authToken })),
        dispatch(fetchUsersByGroup({ token: authToken })),
      ]);
    },
    [dispatch]
  );

  // Fetch user data when token is available
  useEffect(() => {
    if (token) {
      fetchUserData(token).catch((err) => {
        toast.error("Failed to load user data");
      });
    }
  }, [token, fetchUserData]);

  return (
    <>
      {user?.isSync === true || user?.roleId === 4 ? (
        <div className={classes.container}>
          <div className={classes.sections}>
            <div className={classes.componentsBox}>
              <Card
                inlineStyling={styles.cardStyles}
                bottomBoxInlineStyling={styles.bottomBoxStyles}
                text={
                  user.roleId === 5 ? "Total Students" : "Subjects Enrolled"
                }
                number={
                  user.roleId === 5
                    ? dashboardAnalyticsData?.enrollmentsCount
                    : dashboardAnalyticsData?.enrollmentsCount
                }
                loading={dashboardAnalyticsLoading}
              />
              <Card
                inlineStyling={styles.cardStyles}
                bottomBoxInlineStyling={styles.bottomBoxStyles}
                text={
                  user.roleId === 5
                    ? "Upcoming Scheduled Classes"
                    : "Classes Attended"
                }
                number={
                  user.roleId === 5
                    ? dashboardAnalyticsData?.totalUpcomingClasses
                    : dashboardAnalyticsData?.totalClassAttended
                }
                loading={dashboardAnalyticsLoading}
              />
              <Card
                inlineStyling={styles.cardStyles}
                bottomBoxInlineStyling={styles.bottomBoxStyles}
                text={
                  user.roleId === 5 ? "Total Hours Taught" : "Upcoming Classes"
                }
                number={
                  user.roleId === 5
                    ? dashboardAnalyticsData?.totalClassTime
                    : dashboardAnalyticsData?.totalUpcomingClasses
                }
                loading={dashboardAnalyticsLoading}
              />
            </div>
            <OngoingClass
              inLineStyles={{
                height: isLarge ? "250px" : undefined,
              }}
            />
            <SessionHistory
              data={sessionCountData || []}
              loading={sessionCountForTutorStudentLoading}
              inLineStyles={{
                padding: "20px",
                width: "100%",
                maxHeight: isLarge ? "300px" : undefined,
                height: isLarge ? "300px" : 0,
                flex: isLarge ? undefined : "0 1 calc(100% - 10px)",
                minHeight: isLarge ? undefined : 0,
              }}
            />
          </div>
          <div className={classes.sections}>
            <Enrollment />
            <Sessions />
          </div>
        </div>
      ) : (
        <GoogleAuthModal user={user} token={token} />
      )}
    </>
  );
};

export default Dashboard;
