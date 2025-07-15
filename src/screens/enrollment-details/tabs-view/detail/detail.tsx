import React, { memo } from "react";
import classes from "./detail.module.css";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import Flag from "react-world-flags";
import LoadingBox from "@/components/global/loading-box/loading-box";

type DetailProps = {
  data?: any;
  sessionsOfEnrollment?: any;
  sessionByEnrollmentLoading?: boolean;
};

const Detail: React.FC<DetailProps> = ({
  data,
  sessionsOfEnrollment,
  sessionByEnrollmentLoading,
}) => {
  const isEmptyData = !data || Object.keys(data).length === 0;

  return (
    <Container maxWidth={false} className={classes.detailContainer}>
      <Box className={classes.section1}>
        <Box className={classes.header}>
          <p>Students</p>
          <p>View students in your class</p>
        </Box>
        <Box className={classes.body}>
          {data?.studentsData?.map((student: any, index: any) => (
            <Box key={index} className={classes.child}>
              <div>
                <div className={classes.imageBox}>
                  <Image
                    src={
                      student?.profileImageUrl ||
                      "/assets/images/static/demmyPic.png"
                    }
                    alt="profile"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <Typography>{student?.name}</Typography>
              </div>
              <div>
                <div className={classes.imageBox}>
                  <Flag code={student?.country_code || ""} />
                </div>
                <Typography>{student?.country_code || ""}</Typography>
              </div>
            </Box>
          ))}
        </Box>
      </Box>

      <Box className={classes.section2}>
        <Box className={classes.section2Childs}>
          <Typography>Analytics</Typography>
          <Box className={classes.componentsBox}>
            <div className={classes.components}>
              <div>
                <div>
                  <Image
                    src="/assets/images/static/cap.png"
                    alt="cap"
                    width={0}
                    height={0}
                    style={{ width: "1.1vw", height: "1.1vw" }}
                  />
                </div>
                {sessionByEnrollmentLoading ? (
                  <LoadingBox />
                ) : (
                  <Typography>{sessionsOfEnrollment?.data?.length} </Typography>
                )}
              </div>
              <Typography>Classes Taken</Typography>
            </div>
            <div className={classes.components}>
              <div>
                <div>
                  <Image
                    src="/assets/images/static/cap.png"
                    alt="cap"
                    width={0}
                    height={0}
                    style={{ width: "1.1vw", height: "1.1vw" }}
                  />
                </div>
                <Typography>AED {data?.tutor_hourly_rate}</Typography>
              </div>
              <Typography>Teacher Hourly Rate</Typography>
            </div>
            <div className={classes.components}>
              <div>
                <div>
                  <Image
                    src="/assets/images/static/cap.png"
                    alt="cap"
                    width={0}
                    height={0}
                    style={{ width: "1.1vw", height: "1.1vw" }}
                  />
                </div>
                <Typography>AED {data?.hourly_rate}</Typography>
              </div>
              <Typography>Student Hourly Rate</Typography>
            </div>
          </Box>
        </Box>
        <Box className={classes.section2Childs}>
          <Typography>Info</Typography>
          <Box className={classes.componentsBox}>
            <div className={classes.components}>
              <Typography>Grade</Typography>
              <div>
                <Typography>{data?.grade?.name || "No Show"}</Typography>
              </div>
            </div>
            <div className={classes.components}>
              <Typography>Curriculum</Typography>
              <div>
                <Typography>{data?.curriculum?.name || "No Show"}</Typography>
              </div>
            </div>
            <div className={classes.components}>
              <Typography>Board</Typography>
              <div>
                <Typography>{data?.board?.name || "No Show"}</Typography>
              </div>
            </div>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default memo(Detail);
