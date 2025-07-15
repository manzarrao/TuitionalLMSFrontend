import React, { FC, useCallback, useEffect } from "react";
import classes from "./enrollment.module.css";
import Button from "@/components/global/button/button";
import Card from "./components/card/card";
import { useQuery } from "@tanstack/react-query";
import { getAllEnrollments } from "@/services/dashboard/superAdmin/enrollments/enrollments";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { toast } from "react-toastify";
import { MyAxiosError } from "@/services/error.type";
import { useRouter } from "next/navigation";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";

const Enrollment: FC = () => {
  const router = useRouter();
  const { token, user, childrens } = useAppSelector((state) => state?.user);

  const { data, error, isLoading } = useQuery({
    queryKey: ["enrollments", user?.roleId, user?.id],
    queryFn: () =>
      getAllEnrollments(
        {
          teacher_id: user?.roleId === 5 ? user?.id : null,
          student_id: user?.roleId === 3 ? user?.id : null,
          childrens:
            user?.roleId === 4
              ? childrens?.map((i: any) => i.id).join(",")
              : undefined,
          limit: 10,
        },
        {
          token,
        }
      ),
    enabled: !!user && !!token,
  });

  const handleViewAll = useCallback(() => {
    router.push(`/${user?.roleId === 3 ? "student" : "teacher"}/enrollments`);
  }, [user?.roleId, router]);

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
    <div className={classes.enrollmentBox}>
      <div className={classes.heading}>
        Enrollments
        <Button
          text="View All"
          inlineStyling={{
            borderRadius: "10px",
            height: "max-content",
            maxHeight: "max-content",
            minHeight: "max-content",
            padding: "7.5px 10px",
            fontSize: "clamp(0.75rem, calc(0.5rem + 0.68vw), 1rem)",
          }}
          clickFn={handleViewAll}
        />
      </div>
      {isLoading ? (
        <LoadingBox
          inlineStyling={{ flex: "0 1 calc(100% - 10px)", minHeight: 0 }}
        />
      ) : (
        <div className={classes.innerBox}>
          {data && data?.data?.length > 0 ? (
            data?.data?.map((classItem: any, index: number) => (
              <Card
                key={index}
                role={
                  user?.roleId === 3
                    ? "student"
                    : user?.roleId === 4
                    ? "parent"
                    : "teacher"
                }
                {...(user?.roleId === 5 || user?.roleId === 4
                  ? { students: classItem?.studentsGroups || [] }
                  : {})}
                {...(user?.roleId === 3 || user?.roleId === 4
                  ? { name: classItem?.tutor?.name }
                  : {})}
                subject={classItem?.subject?.name}
                board={classItem?.board?.name}
                curriculum={classItem?.curriculum?.name}
                grade={classItem?.grade?.name}
                rate={classItem?.hourly_rate}
                day={classItem?.createdAt}
                profileImageUrl={classItem?.tutor?.profileImageUrl}
                tutorHourlyRate={classItem.tutor_hourly_rate}
              />
            ))
          ) : (
            <ErrorBox
              inlineStyling={{
                fontFamily: "var(--leagueSpartan-bold-700)",
                fontSize: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
                lineHeight: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Enrollment;
