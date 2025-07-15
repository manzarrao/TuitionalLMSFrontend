import React, { FC, useState, useEffect, useCallback } from "react";
import styles from "./sessions.module.css";
import Button from "@/components/global/button/button";
import Card from "./components/card/card";
import { getAllSessionWithGroupIds } from "@/services/dashboard/superAdmin/sessions/sessions";
import { GetAllSessionsWithGroupIds_Payload_Type } from "@/types/sessions/getAllSessionsWithGroupIds.types";
import { useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import { useRouter } from "next/navigation";

const Sessions: FC = () => {
  const router = useRouter();
  const { enrollementIds, token, user } = useAppSelector(
    (state: any) => state?.user || {}
  );
  const handleGetSsseions = useMutation({
    mutationFn: (payload: GetAllSessionsWithGroupIds_Payload_Type) => {
      console.log("Fetching sessions with payload:", payload);
      return getAllSessionWithGroupIds({ token }, {}, payload);
    },
    onSuccess: (data: any) => {
      if (data.message || data.error) {
        return toast.error(data.message || data.error);
      }
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError.response) {
        toast.error(
          axiosError.response.data.error ||
            `${axiosError.response.status} ${axiosError.response.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

  const handleViewAll = useCallback(() => {
    router.push(
      `/${
        user?.roleId === 3
          ? "student"
          : user?.roleId === 4
          ? "parent"
          : "teacher"
      }/sessions`
    );
  }, [user?.roleId, router]);

  useEffect(() => {
    if (user?.roleId === 3) {
      if (enrollementIds?.length > 0) {
        handleGetSsseions?.mutate({ enrollment_id: [...enrollementIds] });
      }
    } else if (user?.roleId === 5) {
      if (user?.id) {
        handleGetSsseions?.mutate({ tutor_id: user.id });
      }
    } else if (user?.roleId === 4) {
      if (user?.id) {
        handleGetSsseions?.mutate({ enrollment_id: [...enrollementIds] });
      }
    }
  }, [enrollementIds, user?.id, user?.roleId]);

  return (
    <div className={styles.sessionsBox}>
      <div className={styles.heading}>
        Sessions
        <Button
          text="View All"
          inlineStyling={{
            borderRadius: "10px",
            height: "max-content",
            maxHeight: "max-content",
            minHeight: "max-content",
            padding: "7.5px 10px",
            fontSize: "clamp(0.75rem, calc(0.5rem + 0.68vw), 1rem)",
            lineHeight: "clamp(0.75rem, calc(0.5rem + 0.68vw), 1rem)",
          }}
          clickFn={handleViewAll}
        />
      </div>
      {handleGetSsseions?.isPending ? (
        <LoadingBox />
      ) : !handleGetSsseions?.data ||
        handleGetSsseions?.isError ||
        handleGetSsseions?.data?.data?.length === 0 ? (
        <ErrorBox
          inlineStyling={{
            fontFamily: "var(--leagueSpartan-bold-700)",
            fontSize: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
            lineHeight: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
          }}
        />
      ) : (
        <div className={styles.innerBox}>
          {handleGetSsseions?.data?.data?.map(
            (classItem: any, index: number) => (
              <Card
                key={classItem?.id}
                role={
                  user?.roleId === 3
                    ? "student"
                    : user.roleId === 4
                    ? "parent"
                    : "teacher"
                }
                {...(user?.roleId === 5 || user?.roleId === 4
                  ? {
                      expectedStudents:
                        classItem?.ClassSchedule?.enrollment?.studentsGroups ||
                        classItem?.students ||
                        [] ||
                        [],
                    }
                  : {})}
                {...(user?.roleId === 3 || user.roleId === 4
                  ? { tutor: classItem?.tutor }
                  : {})}
                subject={
                  classItem?.ClassSchedule?.enrollment?.subject?.name ||
                  classItem?.sessionEnrollment?.subject?.name ||
                  "No Show"
                }
                time={classItem?.created_at || "No Show"}
                status={classItem?.conclusion_type || "No Show"}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default Sessions;
