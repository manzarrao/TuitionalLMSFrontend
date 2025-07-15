import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ongoing-class.module.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { toast } from "react-toastify";
import Card from "./components/card/card";
import LoadingBox from "@/components/global/loading-box/loading-box";
import { MyAxiosError } from "@/services/error.type";
import { getOngoingClasses } from "@/services/dashboard/superAdmin/class-schedule/getOngoingClasses";
import ErrorBox from "@/components/global/error-box/error-box";
import { extendClass } from "@/services/dashboard/superAdmin/class-schedule/extend-class";
import ExtendClassModal from "@/components/ui/teacher-admin-ongoingClasses-extendClassModal/extendClassModal/extendClassModal";
import { ExtendClassDuration_Payload_Type } from "@/types/extend-class/extendClassDuration.types";

interface OngoingClassProps {
  inLineStyles?: React.CSSProperties;
}

const OngoingClass: FC<OngoingClassProps> = ({ inLineStyles }) => {
  const { token, user, childrens } = useAppSelector(
    (state: any) => state?.user
  );
  const [extendClassModalOpen, setExtendClassModalOpen] = useState<{
    duration: number | null;
    modalOpen: boolean;
    classItem?: any; // Optional, if you need to pass the class item to the modal
  }>({
    duration: null,
    modalOpen: false,
    classItem: null,
  });

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["getOngoingClasses", user?.roleId, user?.id],
    queryFn: () =>
      getOngoingClasses(
        {
          student_id:
            user?.roleId === 3
              ? String(user?.id || "")
              : user?.roleId === 4
              ? childrens?.map((i: any) => i.id).join(",")
              : "",
          tutor_id: user?.roleId === 5 ? String(user?.id || "") : "",
        },
        {
          token,
        }
      ),
  });

  const handleExtendClass = useMutation({
    mutationFn: (payload: ExtendClassDuration_Payload_Type) =>
      extendClass(payload, {
        token,
      }),
    onSuccess: (data: any) => {
      refetch();
      setExtendClassModalOpen({
        duration: null,
        modalOpen: false,
        classItem: null,
      });
      if (data.message) {
        return toast.success(data.message);
      }
      if (data.error) {
        return toast.error(data.error);
      }

      return toast.success("Class Extended Successfully");
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response?.data?.message
            ? `${axiosError?.response?.data?.message}`
            : axiosError?.response?.data?.error
            ? `${axiosError?.response?.data?.error}`
            : `${axiosError?.response?.status} ${axiosError?.response?.statusText}`
        );
      } else {
        toast.error(axiosError.message);
      }
    },
  });

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

  // Refetch ongoing classes data every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [refetch]);
  return (
    <div className={styles.ongoingClassBox} style={inLineStyles}>
      <p className={styles.heading}>Ongoing Class</p>
      {isLoading ? (
        <LoadingBox
          inlineStyling={{ flex: "0 1 calc(100% - 10px)", minHeight: 0 }}
        />
      ) : data && data?.length > 0 ? (
        <div className={styles.innerBox}>
          {data.map((classItem: any, index: number) => (
            <Card
              role={user?.roleId}
              key={index}
              time={
                classItem?.teacherSchedule?.start_time ||
                classItem?.DateTime ||
                classItem?.createdAt
              }
              duration={
                classItem?.duration ||
                classItem?.teacherSchedule?.session_duration ||
                null
              }
              name={
                classItem?.enrollment?.tutor?.name ||
                classItem?.enrollment_reschedual?.tutor?.name
              }
              students={
                classItem?.enrollment?.studentsGroups ||
                classItem?.enrollment_reschedual?.studentsGroups ||
                []
              }
              subject={
                classItem?.enrollment?.subject?.name ||
                classItem?.enrollment_reschedual?.subject?.name
              }
              profileImageUrl={
                classItem?.enrollment?.tutor?.profileImageUrl ||
                classItem?.enrollment_reschedual?.tutor?.profileImageUrl
              }
              meet_link={classItem?.meetLink}
              rescheduled={
                classItem?.hasOwnProperty("enrollment_reschedual") || false
              }
              handleExtendClass={(duration, modalOpen) =>
                setExtendClassModalOpen({
                  duration,
                  modalOpen,
                  classItem,
                })
              }
            />
          ))}
        </div>
      ) : (
        <ErrorBox
          message="No ongoing classes at the moment..."
          inlineStyling={{
            flex: "0 1 calc(100% - 10px)",
            minHeight: 0,
            fontFamily: "var(--leagueSpartan-bold-700)",
            fontSize: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
            lineHeight: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
          }}
        />
      )}
      <ExtendClassModal
        heading="Extend Class By"
        modalOpen={extendClassModalOpen?.modalOpen}
        duration={extendClassModalOpen?.duration}
        subHeading="Select the duration to extend the class"
        handleAdd={(extendedDuration: number) => {
          handleExtendClass?.mutate({
            class_schedule_id: extendClassModalOpen?.classItem?.id || null,
            duration: extendedDuration || 0,
            isReschedual: extendClassModalOpen?.classItem?.hasOwnProperty(
              "enrollment_reschedual"
            )
              ? true
              : false,
          });
        }}
        handleClose={() =>
          setExtendClassModalOpen({
            duration: null,
            modalOpen: false,
            classItem: null,
          })
        }
        success={handleExtendClass?.isSuccess}
        loading={handleExtendClass?.isPending}
      />
    </div>
  );
};

export default OngoingClass;
