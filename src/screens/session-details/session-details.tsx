import { useCallback, useState, useEffect, useMemo } from "react";
import moment from "moment";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import classes from "./session-details.module.css";
import { Container, Box, Typography } from "@mui/material";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import LoginIcon from "@mui/icons-material/Login";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { MinutesToHours } from "@/utils/helpers/convert-minutes-to-hours";
import {
  getConclusionTypeStyles,
  getTagTypeStyles,
} from "@/utils/helpers/sessionType-styles";
import { MyAxiosError } from "@/services/error.type";
import { getSessionDetailsById } from "@/services/dashboard/superAdmin/session-details/session-details";
import { SessionById_Response_Type } from "@/services/dashboard/superAdmin/session-details/session-details.type";
import {
  updateSession,
  recreacteSession,
  deleteSession,
} from "@/services/dashboard/superAdmin/sessions/sessions";
import { getAllTransactions } from "@/services/dashboard/superAdmin/transactions/transactions";
import Button from "@/components/global/button/button";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import DeleteModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";
import EditSessionModal from "@/components/ui/superAdmin/session-details/edit-enrollment-modal/edit-enrollment-modal";

const SessionDetailForm: React.FC = () => {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const token = useAppSelector((state) => state?.user?.token);
  const [editSessionModalType, setEditSessionModalType] = useState<string>("");
  // delete session
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [editModal, setEditModal] = useState<boolean>(false);

  const findById = useCallback((id: number, arr: any) => {
    return arr?.find((item: any) => item.student_id === id) || null;
  }, []);

  const trimFileName = useCallback((url: string | null) => {
    const regex = /file-\d+-\d+-(.+)$/;
    const match = url?.match(regex);

    return match ? match[1] : null;
  }, []);

  // edit modal function
  const handleEditModalOpen = useCallback((type: string) => {
    setEditSessionModalType(type);
    setEditModal(true);
  }, []);
  const handleEditModalClose = useCallback(() => {
    setEditModal(false);
  }, []);
  // delete modal function
  const handleDeleteModalOpen = useCallback(() => {
    setDeleteModal(true);
  }, []);
  const handleDeleteModalClose = useCallback(() => {
    setDeleteModal(false);
  }, []);

  // API calls
  const {
    data: transactionData,
    error: transactionError,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useQuery({
    queryKey: ["getAllTransactions", token],
    queryFn: () => getAllTransactions({ session_id: String(id) }, { token }),
    enabled: !!token,
  });
  console.log("transactionData", transactionData);
  const { data, error, isLoading, refetch } =
    useQuery<SessionById_Response_Type>({
      queryKey: ["sessionsById"],
      queryFn: () => getSessionDetailsById(id, { token }),
    });

  const handleUpdate = useMutation({
    mutationFn: (payload: { conclusion_type?: string; duration?: number }) =>
      updateSession(
        id,
        {
          token,
        },
        payload
      ),
    onSuccess: () => {
      toast.success("Session Update Successfully");
      setEditModal(false);
      refetch();
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

  const handleReload = useMutation({
    mutationFn: (id: string) =>
      recreacteSession(id, {
        token,
      }),
    onSuccess: () => {
      toast.success("Session Reload Successfully");
      refetch();
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

  const handleDelete = useMutation({
    mutationFn: (id: string) =>
      deleteSession(id, {
        token,
      }),
    onSuccess: () => {
      toast.success("Session Deleted Successfully");
      setDeleteModal(false);
      router.push("/superAdmin/sessions");
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
      setDeleteModal(false);
    },
  });

  // Error handling
  useEffect(() => {
    if (error || transactionError) {
      const axiosError = (error || transactionError) as MyAxiosError;
      if (axiosError.response) {
        toast.error(axiosError.response.data.error);
      } else {
        toast.error(axiosError.message);
      }
    }
  }, [error, transactionError]);

  return (
    <>
      <Container maxWidth={false} className={classes.container}>
        {isLoading ? (
          <LoadingBox />
        ) : data && data?.length > 0 ? (
          <>
            {/* <Box className={classes.header}>
              <div></div>

             
            </Box> */}
            <Box className={classes.row1}>
              <Box className={classes.sections}>
                <Typography alignItems={"center"} display={"flex"}>
                  Enrollment Details
                  <span
                    style={getTagTypeStyles(data[0]?.session?.tag || "")}
                    className={classes.tagBox}
                  >
                    {data[0]?.session?.tag}
                  </span>
                </Typography>
                <Box className={classes.section1Child}>
                  <div className={classes.section1Components}>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.imageBox}>
                        <Image
                          src={
                            data[0]?.session?.tutor?.profileImageUrl ||
                            "/assets/images/demmyPic.png"
                          }
                          alt="image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div>
                        <p>Teacher</p>
                        <p>
                          {data[0]?.session?.tutor?.name
                            .trim()
                            .split(" ")
                            .slice(0, 3)
                            .join(" ")}
                        </p>
                      </div>
                    </div>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.logoBox}>
                        <AccessTimeOutlinedIcon />
                      </div>
                      <div>
                        <p>Teacher Duration</p>
                        <p>
                          {MinutesToHours(data[0]?.session?.tutor_class_time)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={classes.section1Components}>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.logoBox}>
                        <SubjectOutlinedIcon />
                      </div>
                      <div>
                        <p>Subject</p>
                        <p>{data[0]?.session?.subject?.name}</p>
                      </div>
                    </div>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.logoBox}>
                        <CalendarMonthOutlinedIcon />
                      </div>
                      <div>
                        <p>Date</p>
                        <p>
                          {moment
                            .utc(data[0]?.session?.created_at)
                            .local()
                            .format("Do-MMM-YYYY")}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={classes.section1Components}>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.logoBox}>
                        <SubjectOutlinedIcon />
                      </div>
                      <div>
                        <p>Status</p>
                        <div
                          className={classes.status}
                          style={getConclusionTypeStyles(
                            data[0]?.session?.conclusion_type
                          )}
                        >
                          {data[0]?.session?.conclusion_type || "No Show"}
                        </div>
                      </div>
                    </div>
                    <div className={classes.section1ComponentsChild}>
                      <div className={classes.logoBox}>
                        <CalendarMonthOutlinedIcon />
                      </div>
                      <div>
                        <p>Class Duration</p>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <p>{data[0]?.session?.duration} mins</p>
                          <div className={classes.addModal}>
                            <EditOutlinedIcon
                              onClick={() => handleEditModalOpen("duration")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Box>
              </Box>
              <Box className={classes.sections}>
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <Typography className={classes.subHeading}>Notes</Typography>
                  <div className={classes.actions}>
                    {handleReload?.isPending ? (
                      <LoadingBox
                        loaderStyling={{
                          height: "3.5vh !important",
                          width: "3.5vh !important",
                        }}
                      />
                    ) : (
                      <>
                        <Typography>Reload</Typography>
                        <div
                          className={classes.addModal}
                          onClick={() => handleReload?.mutate(id)}
                        >
                          <CachedIcon />
                        </div>
                        <Typography>Edit</Typography>
                        <div className={classes.addModal}>
                          <EditOutlinedIcon
                            onClick={() =>
                              handleEditModalOpen("conclusion_type")
                            }
                          />
                        </div>
                        <Typography>Delete</Typography>
                        <div
                          className={classes.addModal}
                          onClick={handleDeleteModalOpen}
                        >
                          <DeleteOutlinedIcon />
                        </div>
                      </>
                    )}
                  </div>
                </Box>
                <Box className={classes.section2Child}>
                  {data[0]?.session?.Notes?.length === 0 ? (
                    <ErrorBox />
                  ) : (
                    data[0]?.session?.Notes?.map((item: any) => (
                      <Box className={classes.notesBox}>
                        <DescriptionOutlinedIcon />
                        <Typography>
                          {trimFileName(item?.file || "")}
                        </Typography>
                        <Button
                          icon={<CloudDownloadOutlinedIcon />}
                          text="Download Notes"
                          inlineStyling={styles?.buttonStyle}
                        />
                      </Box>
                    ))
                  )}
                </Box>
              </Box>
            </Box>
            <Box className={classes.row2}>
              <Box className={classes.sectionsSplit}>
                <Box className={classes.sections}>
                  <Typography>Transaction Details</Typography>
                  <Box className={classes.transactionsBox}>
                    {transactionData && transactionData?.data?.length > 0 ? (
                      transactionData?.data
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt || 0).getTime() -
                            new Date(a.createdAt || 0).getTime()
                        )
                        ?.map((item) => {
                          const isStudent =
                            item?.user_id ===
                            item?.enrollment?.studentsGroups?.[0]?.user?.id;
                          return (
                            <Box className={classes.transactions}>
                              <div className={classes.userProfile}>
                                <span className={classes.imageBox}>
                                  <Image
                                    src={
                                      item?.transactions?.profileImageUrl ||
                                      "/assets/images/static/demmyPic.png"
                                    }
                                    alt={item?.transactions?.name || "User"}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                </span>
                                <span className={classes.profileContainer}>
                                  {item?.transactions?.name
                                    ? item?.transactions?.name
                                        .trim()
                                        ?.split(" ")
                                        .slice(0, 2)
                                        .join(" ")
                                    : "No Show"}

                                  {item?.session_id && (
                                    <span
                                      className={classes.role}
                                      style={{
                                        backgroundColor: isStudent
                                          ? "#E0F7FA"
                                          : "#FFF3E0",
                                        color: isStudent
                                          ? "#00796B"
                                          : "#E65100",
                                      }}
                                    >
                                      {isStudent ? "Student" : "Teacher"}
                                    </span>
                                  )}
                                </span>
                              </div>
                              <div className={classes.transactionDetails}>
                                <span className={classes.cost}>
                                  {item?.cost ?? "0"}{" "}
                                </span>
                                <span
                                  style={{
                                    background:
                                      item?.type === "Debit"
                                        ? "#F84F31"
                                        : "#23C552",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    color: "var(--white-color)",
                                    width: "max-content",
                                    textAlign: "center",
                                  }}
                                >
                                  {item?.type || "No Show"}
                                </span>
                                <span className={classes.cost}>
                                  {new Date(
                                    item.createdAt || ""
                                  ).toLocaleString()}
                                </span>
                              </div>
                            </Box>
                          );
                        })
                    ) : (
                      <ErrorBox />
                    )}
                  </Box>
                </Box>
                <Box className={classes.sections}>
                  <Typography>Student Details</Typography>
                  <Box className={classes.section3Child}>
                    {data[0]?.session?.groupSessionTime?.length === 0 ? (
                      <ErrorBox />
                    ) : (
                      data[0]?.session?.groupSessionTime?.map((item: any) => (
                        <Box key={item.id} className={classes.child}>
                          <div>
                            <div className={classes.childImageBox}>
                              <Image
                                src={
                                  findById(item?.student_id, data[0]?.students)
                                    ?.user?.profileImageUrl ||
                                  "/assets/images/demmyPic.png"
                                }
                                alt="profile"
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                            </div>
                            <div>
                              <Typography variant="h6">Student</Typography>
                              <Typography variant="body2">
                                {findById(item?.student_id, data[0]?.students)
                                  ?.user?.name || item?.display_name + "*"}
                              </Typography>
                            </div>
                          </div>
                          <div>
                            <div className={classes.childLogoBox}>
                              <AccessTimeOutlinedIcon />
                            </div>
                            <div>
                              <Typography variant="body1">
                                Student Duration
                              </Typography>
                              <Typography variant="body1">
                                {MinutesToHours(item?.class_duration_time)}
                              </Typography>
                            </div>
                          </div>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
              <Box className={classes.sections}>
                <Typography>Attendance</Typography>
                <Box className={classes.section4Child}>
                  <Box className={classes.section4ChildHead}>
                    <Typography>Name</Typography>
                    <Typography>In</Typography>
                    <Typography>Out</Typography>
                  </Box>
                  <Box className={classes.section4ChildBody}>
                    {data[0]?.confrences?.length === 0 ? (
                      <ErrorBox />
                    ) : (
                      data[0]?.confrences?.map((item: any) => (
                        <Box
                          key={item.id}
                          className={classes.attendanceBodyChild}
                        >
                          <div>
                            <div>
                              <div className={classes.childImageBox}>
                                <Image
                                  src={
                                    item?.user_id == data[0]?.session?.tutor?.id
                                      ? data[0]?.session?.tutor
                                          ?.profileImageUrl ||
                                        "/assets/images/demmyPic.png"
                                      : findById(
                                          item?.user_id,
                                          data[0]?.students
                                        )?.user?.profileImageUrl ||
                                        "/assets/images/demmyPic.png"
                                  }
                                  alt="profile"
                                  fill
                                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                              </div>
                              <div>
                                <Typography>
                                  {item?.user_id == data[0]?.session?.tutor?.id
                                    ? data[0]?.session?.tutor?.name
                                        ?.split(" ")
                                        .slice(0, 2)
                                        .join(" ")
                                    : findById(item?.user_id, data[0]?.students)
                                        ?.user?.name?.split(" ")
                                        .slice(0, 2)
                                        .join(" ") ||
                                      item?.display_name
                                        ?.split(" ")
                                        .slice(0, 2)
                                        .join(" ")}
                                </Typography>
                                {item?.user_id == data[0]?.session?.tutor?.id
                                  ? "Tutor"
                                  : "Student"}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <LoginIcon />
                              <div>
                                {item?.startTime
                                  ? moment
                                      .unix(item?.startTime)
                                      .local()
                                      .format("hh:mm A")
                                  : "No Show"}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div>
                              <LogoutIcon />
                              <div>
                                {item?.endTime
                                  ? moment
                                      .unix(item?.endTime)
                                      .local()
                                      .format("hh:mm A")
                                  : "No Show"}
                              </div>
                            </div>
                          </div>
                        </Box>
                      ))
                    )}
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <ErrorBox />
        )}
      </Container>
      <EditSessionModal
        modalOpen={editModal}
        handleClose={handleEditModalClose}
        heading={"Edit Session"}
        subHeading="Fill out the form in order to edit the session conclusion type."
        handleUpdate={(payload) => handleUpdate?.mutate(payload)}
        data={(data && data[0]?.session?.conclusion_type) || ""}
        loading={handleUpdate?.isPending}
        type={editSessionModalType}
        durationIni={(data && data[0]?.session?.duration) || 0}
      />
      <DeleteModal
        modalOpen={deleteModal}
        handleClose={handleDeleteModalClose}
        subHeading="Are you sure you want to delete this session? This action is permanent."
        heading="Are You Sure?"
        handleDelete={() => {
          handleDelete?.mutate(id);
        }}
        loading={handleDelete?.isPending}
      />
    </>
  );
};

export default SessionDetailForm;

const styles = {
  buttonStyle: {
    backgroundColor: "var(--main-color)",
    cursor: "pointer",
    color: "var(--white-color)",
    border: "none",
    padding: "8px 10px",
    borderRadius: "5px",
  },
};
