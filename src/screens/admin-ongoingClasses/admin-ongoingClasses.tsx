"use client";
import React, { FC, useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import classes from "./admin-ongoingClasses.module.css";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import { getOngoingClasses } from "@/services/dashboard/superAdmin/class-schedule/getOngoingClasses";
import { extendClass } from "@/services/dashboard/superAdmin/class-schedule/extend-class";
import Card from "./components/card/card";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ExtendClassModal from "@/components/ui/teacher-admin-ongoingClasses-extendClassModal/extendClassModal/extendClassModal";
import { ExtendClassDuration_Payload_Type } from "@/types/extend-class/extendClassDuration.types";

const AdminOngoingClasses: FC = () => {
  const { token } = useAppSelector((state) => state?.user);
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
    queryKey: ["getOngoingClasses"],
    queryFn: () =>
      getOngoingClasses(
        {},
        {
          token,
        }
      ),
    placeholderData: keepPreviousData,
    staleTime: 60000,
    enabled: !!token,
    refetchOnWindowFocus: false,
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
  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : (
        <div className={classes.ongoingClassBox}>
          {data && data?.length > 0 ? (
            <div className={classes.innerBox}>
              {data?.map((classItem: any, index: number) => {
                // ✅ Correct Destructuring
                const {
                  enrollment_reschedual,
                  enrollment,
                  teacherSchedule,
                  meetLink,
                  DateTime,
                  createdAt,
                  duration,
                } = classItem;

                return (
                  <Card
                    key={index}
                    time={teacherSchedule?.start_time || DateTime || createdAt}
                    duration={
                      duration || teacherSchedule?.session_duration || null
                    }
                    name={
                      enrollment?.tutor?.name ||
                      enrollment_reschedual?.tutor?.name
                    }
                    subject={
                      enrollment?.subject?.name ||
                      enrollment_reschedual?.subject?.name
                    }
                    board={
                      enrollment?.board?.name ||
                      enrollment_reschedual?.board?.name
                    }
                    curriculum={
                      enrollment?.curriculum?.name ||
                      enrollment_reschedual?.curriculum?.name
                    }
                    grade={
                      enrollment?.grade?.name ||
                      enrollment_reschedual?.grade?.name
                    }
                    profileImageUrl={
                      enrollment?.tutor?.profileImageUrl ||
                      enrollment_reschedual?.tutor?.profileImageUrl
                    }
                    meet_link={meetLink}
                    students={
                      enrollment?.studentsGroups ||
                      enrollment_reschedual?.studentsGroups
                    }
                    rescheduled={enrollment_reschedual || false}
                    handleExtendClass={(duration, modalOpen) =>
                      setExtendClassModalOpen({
                        duration,
                        modalOpen,
                        classItem,
                      })
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className={classes.errorBox}>
              <div className={classes.imageBox}>
                <Image
                  src="/assets/svgs/boy.svg"
                  alt="No ongoing class"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <p className={classes.imageText}>
                There are no classes ongoing at the moment...
              </p>
            </div>
          )}
        </div>
      )}
      <ExtendClassModal
        heading="Extend Class By"
        modalOpen={extendClassModalOpen?.modalOpen}
        duration={extendClassModalOpen?.duration}
        subHeading="Select the duration to extend the class"
        handleClose={() =>
          setExtendClassModalOpen({
            duration: null,
            modalOpen: false,
            classItem: null,
          })
        }
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
        success={handleExtendClass?.isSuccess}
        loading={handleExtendClass?.isPending}
      />
    </>
  );
};

export default AdminOngoingClasses;
