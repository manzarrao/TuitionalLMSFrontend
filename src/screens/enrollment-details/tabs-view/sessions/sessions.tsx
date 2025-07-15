"use client";
import React, { memo, useId } from "react";
import { Container, Box } from "@mui/material";
import Image from "next/image";
import moment from "moment";
import { toast } from "react-toastify";
import classes from "./sessions.module.css";
import { MyAxiosError } from "@/services/error.type";
import { MinutesToHours } from "@/utils/helpers/convert-minutes-to-hours";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";

type DetailProps = {
  data?: any;
  sessionsOfEnrollment?: any;
  sessionByEnrollmentLoading?: boolean;
  error?: any;
};

const Sessions: React.FC<DetailProps> = ({
  sessionsOfEnrollment,
  sessionByEnrollmentLoading,
  error,
}) => {
  const id = useId();
  if (error) {
    const axiosError = error as MyAxiosError;
    if (axiosError.response) {
      toast.error(axiosError.response.data.error);
    } else {
      toast.error(axiosError.message);
    }
  }
  console.log(sessionsOfEnrollment);
  return (
    <Container maxWidth={false} className={classes.sessionsContainer}>
      {sessionByEnrollmentLoading ? (
        <LoadingBox />
      ) : sessionsOfEnrollment && sessionsOfEnrollment?.data?.length > 0 ? (
        sessionsOfEnrollment?.data?.map((item: any, index: number) => (
          <Box key={index + id} className={classes.sessionsBox}>
            <Box className={classes.child1}>
              <p
                style={{
                  width: "max-content",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  color:
                    item?.session.conclusion_type === "Conducted"
                      ? "#286320"
                      : item?.session.conclusion_type === "Teacher Absent"
                      ? "#2F3282"
                      : item?.session.conclusion_type === "Student Absent"
                      ? "#2F3282"
                      : "#653838",
                  backgroundColor:
                    item?.session.conclusion_type === "Conducted"
                      ? "#A0FFC0"
                      : item?.session.conclusion_type === "Teacher Absent"
                      ? "#DBDCFF"
                      : item?.session.conclusion_type === "Student Absent"
                      ? "#DBDCFF"
                      : "#FFACAC",
                }}
              >
                {item?.session?.conclusion_type || "No Show"}
              </p>
              <p>
                {item?.expectedStudents?.length === 1
                  ? "One-on-One Session"
                  : "Grouped Session"}
              </p>
              <div>
                <div>
                  <Image
                    src={
                      item?.expectedStudents[0]?.profileImageUrl ||
                      "/assets/images/static/demmyPic.png"
                    }
                    alt="Student"
                    fill
                    objectFit="contain"
                  />
                </div>
                <p>{item?.expectedStudents[0]?.name || "No Name available"}</p>
              </div>
            </Box>
            <Box className={classes.child2}>
              {moment.utc(item?.createdAt).local().format("D MMMM YYYY")}
            </Box>
            <Box className={classes.child3}>
              <div>
                <p>Teacher Duration</p>
                <p>
                  {item?.session?.tutor_scaled_class_time
                    ? MinutesToHours(item?.session?.tutor_scaled_class_time)
                    : "No Show"}
                </p>
              </div>
              <div>
                <p>Student Duration</p>
                <p>
                  {item?.session?.groupSessionTime[0]
                    ?.class_scaled_duration_time
                    ? MinutesToHours(
                        item?.session?.groupSessionTime[0]
                          ?.class_scaled_duration_time
                      )
                    : "No Show"}
                </p>
              </div>
              <div>
                <p>Session Duration</p>
                <p>
                  {item?.session?.duration
                    ? MinutesToHours(item?.session?.duration)
                    : "No Show"}
                </p>
              </div>
            </Box>
          </Box>
        ))
      ) : (
        <ErrorBox />
      )}
    </Container>
  );
};

export default memo(Sessions);
