"use client";
import React, { useState, useCallback, useEffect, useMemo } from "react";
import classes from "./sessions.module.css";
import moment from "moment";
import { toast } from "react-toastify";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Box } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import FilterByDate from "@/components/global/filter-by-date/filter-by-date";
import Button from "@/components/global/button/button";
import SessionTable from "@/components/ui/superAdmin/sessions/session-table/session-table";
import AddModal from "@/components/ui/superAdmin/sessions/add-modal/add-modal";
import DeleteModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";

import Card from "@/components/ui/teacher/dashboard-card/dashboard-card";
import { MyAxiosError } from "@/services/error.type";
import {
  getSessionsExcelData,
  getAllSessionWithGroupIds,
  recreacteSession,
  deleteSession,
  createSession,
} from "@/services/dashboard/superAdmin/sessions/sessions";
import { GetAllSessionsWithGroupIds_Payload_Type } from "@/types/sessions/getAllSessionsWithGroupIds.types";
import { Create_Session_Payload_Type } from "@/types/sessions/createSession.types";
import { getSessionsConclusion } from "@/services/dashboard/superAdmin/analytics/analytics";
import { getAllEnrollments } from "@/services/dashboard/superAdmin/enrollments/enrollments";
import { max, setDate } from "date-fns";

const SessionForm: React.FC = () => {
  const { user, token, enrollementIds, childrens } = useAppSelector(
    (state) => state.user
  );
  const { subject, board, grades, curriculum } = useAppSelector(
    (state) => state?.resources
  );
  const { students, teachers } = useAppSelector((state) => state?.usersByGroup);

  // Determine if user is admin, student, or teacher
  const isAdmin = user?.roleId === 1 || user?.roleId === 2;
  const isStudent = user?.roleId === 3;
  const isTeacher = user?.roleId === 5;
  const isParent = user?.roleId === 4;

  //loading state
  const [excelDataLoaidng, setExcelDataLoading] = useState<boolean>(false);

  // date filter states
  const [dateFilter, setDateFilter] = useState<null | string[]>(null);

  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedBoard, setSelectedBoard] = useState<any>(null);
  const [selectedCurriculum, setSelectedCurriculum] = useState<any>(null);
  const [selectedGrade, setSelectedGrade] = useState<any>(null);
  const [selectedConclusionType, setSelectedConclusionType] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  // add session
  const [addModal, setAddModal] = useState<boolean>(false);
  // delete session
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [deleteId, setDeleteId] = useState<string>("");

  // Fetch enrollments if user is student or teacher
  const { data: enrollmentsData, error: enrollmentsError } = useQuery({
    queryKey: ["getAllEnrollments", user?.id, isStudent, isTeacher, isParent],
    queryFn: () =>
      getAllEnrollments(
        {
          limit: 50,
          page: 1,
          student_id: isStudent ? user?.id || null : null,
          teacher_id: isTeacher ? user?.id || null : null,
          childrens: isParent
            ? childrens?.map((i: any) => i.id).join(",")
            : undefined,
        },
        { token }
      ),
    enabled: isStudent || isTeacher || isParent,
  });

  // Fetch session conclusion data for students and teachers
  const { data: sessionsConclusionData, isLoading: sessionsConclusionLoading } =
    useQuery({
      queryKey: ["getSessionsConclusion", dateFilter, user?.id],
      queryFn: () =>
        getSessionsConclusion(
          {
            user_id: isStudent ? user?.id || null : null,
            tutor_id: isTeacher ? user?.id || null : null,
            startDate: dateFilter ? dateFilter[0] : "",
            endDate: dateFilter ? dateFilter[1] : "",
          },
          { token }
        ),
      enabled: Boolean((isStudent || isTeacher) && token && dateFilter),
    });

  // Memoized filtered data
  const filteredTeachers = useMemo(() => {
    if (isStudent && enrollmentsData?.data && teachers?.users) {
      const filterTeacher = teachers?.users?.filter((teacher) =>
        enrollmentsData?.data?.some(
          (enrollment) => enrollment?.tutor?.id === teacher?.id
        )
      );
      return filterTeacher?.map((item) => JSON.stringify(item));
    }
    return teachers?.users?.map((item) => JSON.stringify(item)) || [];
  }, [isStudent, enrollmentsData?.data, teachers?.users]);

  const filteredStudents = useMemo(() => {
    if (isTeacher && enrollmentsData?.data && students?.users) {
      const uniqueStudents = new Set(
        enrollmentsData.data.flatMap((enrollment) =>
          enrollment.studentsGroups
            ?.map((group) =>
              students.users?.find((user) => user.id === group.user?.id)
            )
            .filter(Boolean)
        )
      );
      return [...uniqueStudents].map((item) => JSON.stringify(item));
    }
    return students?.users?.map((item) => JSON.stringify(item)) || [];
  }, [isTeacher, enrollmentsData?.data, students?.users]);

  const filteredSubjects = subject?.map((item) => JSON.stringify(item)) || [];
  const filteredBoards = board?.map((item) => JSON.stringify(item)) || [];
  const filteredGrades = grades?.map((item) => JSON.stringify(item)) || [];
  const filteredCurriculum =
    curriculum?.map((item) => JSON.stringify(item)) || [];

  // filters functions
  const handleConclusionTypeFilter = useCallback(
    (newValue: any) => setSelectedConclusionType(newValue),
    []
  );
  const handleGradeFilter = useCallback(
    (e: any) => setSelectedGrade(JSON.parse(e.target.value)),
    []
  );
  const handleBoardFilter = useCallback(
    (e: any) => setSelectedBoard(JSON.parse(e.target.value)),
    []
  );
  const handleCurriculumFilter = useCallback(
    (e: any) => setSelectedCurriculum(JSON.parse(e.target.value)),
    []
  );
  const handleSubjectFilter = useCallback(
    (e: any) => setSelectedSubject(JSON.parse(e.target.value)),
    []
  );
  const handleTeacherFilter = useCallback(
    (e: any) => setSelectedTeacher(JSON.parse(e.target.value)),
    []
  );
  const handleStudentFilter = useCallback(
    (e: any) => setSelectedStudent(JSON.parse(e.target.value)),
    []
  );
  // pagination functions
  const handleChangePage = useCallback((e: any, newPage: number) => {
    setCurrentPage(newPage);
  }, []);
  const handleChangeRowsPerPage = useCallback((e: any) => {
    setRowsPerPage(e?.target?.value);
  }, []);

  // date filter handler
  const handleCalendar = useCallback((value: any) => {
    if (value === null) {
      setDateFilter(value);
    } else {
      setDateFilter(
        value.map((i: any) => moment(i).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]"))
      );
    }
  }, []);

  // Admin-specific functions
  const handleAddModal = useCallback(() => {
    setAddModal(true);
  }, []);

  const closeAddModal = useCallback(() => {
    setAddModal(false);
  }, []);

  const handleDeleteModalOpen = useCallback((e: any, id: number) => {
    e.stopPropagation();
    setDeleteModal(true);
    setDeleteId(id.toString());
  }, []);

  const handleDeleteModalClose = useCallback((e: any) => {
    setDeleteModal(false);
  }, []);

  const handleExcelData = useCallback(async () => {
    try {
      setExcelDataLoading(true);
      const data = await getSessionsExcelData(
        {
          tutor_id: selectedTeacher ? selectedTeacher?.id : null,
          subject_id: selectedSubject ? selectedSubject?.id : null,
          board_id: selectedBoard ? selectedBoard?.id : null,
          curriculum_id: selectedCurriculum ? selectedCurriculum?.id : null,
          grade_id: selectedGrade ? selectedGrade?.id : null,
          student_id: selectedStudent ? selectedStudent?.id : null,
          conclusion_type: selectedConclusionType || "",
          start_time: dateFilter
            ? moment(dateFilter[0]).startOf("day").format("YYYY-MM-DD 00:00:00")
            : "",
          end_time: dateFilter
            ? moment(dateFilter[1]).endOf("day").format("YYYY-MM-DD 23:59:59")
            : "",
        },
        { token }
      );
      setExcelDataLoading(false);
      if (data) {
        toast.success(`${data?.totalSessions} sessions fetched successfully`);
      }
    } catch (error) {
      console.error("Error fetching Excel data:", error);
      setExcelDataLoading(false);
      toast.error("Error fetching Excel data");
    }
  }, [
    selectedTeacher,
    selectedSubject,
    selectedBoard,
    selectedCurriculum,
    selectedGrade,
    selectedStudent,
    selectedConclusionType,
    dateFilter,
    token,
  ]);

  // API calls
  const handleFetchAllSessions = useMutation({
    mutationFn: (payload: GetAllSessionsWithGroupIds_Payload_Type) =>
      getAllSessionWithGroupIds(
        {
          token,
        },
        {
          page: String(currentPage),
          pagelimit: String(rowsPerPage),
        },
        payload
      ),
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

  const handleCreateSession = useMutation({
    mutationFn: (payload: Create_Session_Payload_Type) =>
      createSession(
        {
          token,
        },
        payload
      ),
    onSuccess: () => {
      toast.success("Session create successfully.");
      setAddModal(false);
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
      fetchSessions();
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
    mutationFn: (payload: string) =>
      deleteSession(payload, {
        token,
      }),
    onSuccess: () => {
      toast.success("Session Deleted Successfully");
      setDeleteModal(false);
      setDeleteId("");
      fetchSessions();
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
      setDeleteId("");
    },
  });

  // Helper function to fetch sessions with current filters
  const fetchSessions = useCallback(() => {
    let payload: GetAllSessionsWithGroupIds_Payload_Type = {
      conclusion_type: selectedConclusionType || "",
      board_id: selectedBoard?.id || null,
      curriculum_id: selectedCurriculum?.id || null,
      grade_id: selectedGrade?.id || null,
      subject_id: selectedSubject?.id || null,
      group_id: null,
    };

    if (isAdmin) {
      payload = {
        ...payload,
        enrollment_id: selectedStudent
          ? [...selectedStudent?.enrollmentIds]
          : null,
        tutor_id: selectedTeacher?.id || null,
        start_time: dateFilter ? moment(dateFilter[0]).toISOString() : "",
        end_time: dateFilter ? moment(dateFilter[1]).toISOString() : "",
      };
    } else if (isStudent) {
      payload = {
        ...payload,
        enrollment_id: [...(enrollementIds || [])],
        tutor_id: selectedTeacher?.id || null,
        start_time: dateFilter ? moment(dateFilter[0]).toISOString() : "",
        end_time: dateFilter ? moment(dateFilter[1]).toISOString() : "",
      };
    } else if (isTeacher) {
      payload = {
        ...payload,
        enrollment_id: selectedStudent?.enrollmentIds || null,
        tutor_id: user?.id || null,
        start_time: dateFilter ? moment(dateFilter[0]).toISOString() : "",
        end_time: dateFilter ? moment(dateFilter[1]).toISOString() : "",
      };
    } else if (isParent) {
      payload = {
        ...payload,
        enrollment_id: [...(enrollementIds || [])],
        tutor_id: null,
        start_time: dateFilter ? moment(dateFilter[0]).toISOString() : "",
        end_time: dateFilter ? moment(dateFilter[1]).toISOString() : "",
      };
    }

    handleFetchAllSessions?.mutate(
      payload as GetAllSessionsWithGroupIds_Payload_Type
    );
  }, [
    selectedConclusionType,
    selectedBoard?.id,
    selectedCurriculum?.id,
    selectedGrade?.id,
    selectedSubject?.id,
    isAdmin,
    isStudent,
    isTeacher,
    isParent,
    selectedStudent,
    selectedTeacher?.id,
    dateFilter,
    enrollementIds,
    user?.id,
    handleFetchAllSessions,
  ]);

  useEffect(() => {
    if (isTeacher || isStudent || isParent) {
      setDateFilter([
        moment().startOf("month").format("YYYY-MM-DD"),
        moment().endOf("month").format("YYYY-MM-DD"),
      ]);
    }
  }, [isTeacher, isStudent, isParent]); // Only depend on user roles

  // Fetch sessions when filters change (separate effect)
  useEffect(() => {
    fetchSessions();
  }, [
    selectedBoard,
    selectedGrade,
    selectedConclusionType,
    selectedCurriculum,
    selectedStudent,
    selectedTeacher,
    selectedSubject,
    currentPage,
    rowsPerPage,
    enrollementIds,
    isAdmin,
    isStudent,
    isTeacher,
    dateFilter,
  ]);

  const sessionTableProps = useMemo(() => {
    const sessionsData = handleFetchAllSessions?.data;
    return {
      currentPage: sessionsData?.currentPage || 1,
      totalSessions: sessionsData?.totalSessions || 0,
      totalPages: sessionsData?.totalPages || 1,
      data: sessionsData?.data || [],
      rowsPerPage: rowsPerPage,
      handleChangePage: handleChangePage,
      handleChangeRowsPerPage: handleChangeRowsPerPage,
      role: isAdmin ? "superAdmin" : "teacher",
      ...(isAdmin && {
        handleDeleteModal: handleDeleteModalOpen,
        handleReload: (e: any, id: number) => {
          e.stopPropagation();
          handleReload?.mutate(String(id));
        },
        handleReloadLoading: handleReload?.isPending,
      }),
    };
  }, [
    handleFetchAllSessions?.data,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    isAdmin,
    handleDeleteModalOpen,
    handleReload?.isPending,
    handleReload?.mutate,
  ]);

  const addModalProps = useMemo(
    () => ({
      heading: "Add Session",
      subHeading: "Fill out the form in order to create the session.",
      modalOpen: addModal,
      handleClose: closeAddModal,
      handleAdd: (payload: Create_Session_Payload_Type) =>
        handleCreateSession?.mutate(payload),
      loading: handleCreateSession?.isPending,
      isSuccess: handleCreateSession?.isSuccess,
    }),
    [
      addModal,
      closeAddModal,
      handleCreateSession?.mutate,
      handleCreateSession?.isPending,
      handleCreateSession?.isSuccess,
    ]
  );

  const deleteModalProps = useMemo(
    () => ({
      modalOpen: deleteModal,
      handleClose: handleDeleteModalClose,
      subHeading:
        "Are you sure you want to delete this session? This action is permanent.",
      heading: "Are You Sure?",
      handleDelete: () => handleDelete?.mutate(deleteId),
      loading: handleDelete?.isPending,
    }),
    [
      deleteModal,
      handleDeleteModalClose,
      handleDelete?.mutate,
      deleteId,
      handleDelete?.isPending,
    ]
  );

  return (
    <>
      <main className={classes.container}>
        {/* Filter Section - Different for each role */}
        {isAdmin && (
          <Box className={classes.section1}>
            <Box className={classes.aside1}>
              <FilterByDate
                changeFn={handleCalendar}
                width="max-content"
                inlineStyling={{ height: "100%" }}
              />
              <div className={classes.tabsButtonBox}>
                <Button
                  text="Add Session"
                  clickFn={handleAddModal}
                  icon={<AddOutlinedIcon />}
                  inlineStyling={styles?.buttonStyles}
                />
                <Button
                  text="Get Data in Excel"
                  clickFn={handleExcelData}
                  loading={excelDataLoaidng}
                  inlineStyling={styles?.buttonStyles}
                />
              </div>
            </Box>
            <Box className={classes.aside2}>
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Type"
                data={[
                  "Conducted",
                  "Cancelled",
                  "Teacher Absent",
                  "Student Absent",
                  "No Show",
                ]}
                handleChange={handleConclusionTypeFilter}
                value={selectedConclusionType}
              />
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Student"
                data={filteredStudents}
                handleChange={handleStudentFilter}
                value={selectedStudent?.name}
                dropDownObject
              />
              <FilterDropdown
                placeholder="Filter Teacher"
                data={filteredTeachers}
                handleChange={handleTeacherFilter}
                value={selectedTeacher?.name}
                inlineBoxStyles={styles.dropDownStyles}
                dropDownObject
              />
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Board"
                data={filteredBoards}
                handleChange={handleBoardFilter}
                value={selectedBoard?.name}
                dropDownObject
              />
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Grade"
                data={filteredGrades}
                handleChange={handleGradeFilter}
                value={selectedGrade?.name}
                dropDownObject
              />
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Curriculum"
                data={filteredCurriculum}
                handleChange={handleCurriculumFilter}
                dropDownObject
                value={selectedCurriculum?.name}
              />
              <FilterDropdown
                inlineBoxStyles={styles?.dropDownStyles}
                placeholder="Filter Subject"
                data={filteredSubjects}
                handleChange={handleSubjectFilter}
                value={selectedSubject?.name}
                dropDownObject
              />
            </Box>
          </Box>
        )}
        {(isStudent || isTeacher) && (
          <>
            <Box className={classes.studentTeacherSection1}>
              <FilterByDate
                changeFn={handleCalendar}
                width="calc(16% - 1.42px)"
                value={dateFilter}
              />
              {isStudent && (
                <FilterDropdown
                  placeholder="Filter Teacher"
                  data={filteredTeachers}
                  handleChange={handleTeacherFilter}
                  value={selectedTeacher?.name}
                  inlineBoxStyles={styles.teacherStudentDropDownStyles}
                  dropDownObject
                />
              )}
              {isTeacher && (
                <FilterDropdown
                  placeholder="Filter Student"
                  data={filteredStudents}
                  handleChange={handleStudentFilter}
                  value={selectedStudent?.name}
                  inlineBoxStyles={styles.teacherStudentDropDownStyles}
                  dropDownObject
                />
              )}
              <FilterDropdown
                placeholder="Filter Type"
                data={[
                  "Conducted",
                  "Cancelled",
                  "Teacher Absent",
                  "Student Absent",
                  "No Show",
                ]}
                handleChange={handleConclusionTypeFilter}
                value={selectedConclusionType}
                inlineBoxStyles={styles.teacherStudentDropDownStyles}
              />
              <FilterDropdown
                placeholder="Filter Board"
                data={filteredBoards}
                handleChange={handleBoardFilter}
                value={selectedBoard?.name}
                inlineBoxStyles={styles.teacherStudentDropDownStyles}
                dropDownObject
              />
              <FilterDropdown
                placeholder="Filter Grade"
                data={filteredGrades}
                handleChange={handleGradeFilter}
                value={selectedGrade?.name}
                inlineBoxStyles={styles.teacherStudentDropDownStyles}
                dropDownObject
              />
              <FilterDropdown
                placeholder="Filter Curriculum"
                data={filteredCurriculum}
                handleChange={handleCurriculumFilter}
                value={selectedCurriculum?.name}
                inlineBoxStyles={styles.teacherStudentDropDownStyles}
                dropDownObject
              />
              <FilterDropdown
                placeholder="Filter Subject"
                data={filteredSubjects}
                handleChange={handleSubjectFilter}
                value={selectedSubject?.name}
                inlineBoxStyles={styles.teacherStudentDropDownStyles}
                dropDownObject
              />
            </Box>
            <Box className={classes.section2}>
              {[
                "Conducted",
                "Cancelled",
                "Teacher Absent",
                "Student Absent",
                "No Show",
              ].map((type) => (
                <Card
                  key={type}
                  text={type}
                  number={
                    sessionsConclusionData?.conclusionCounts?.[
                      type as keyof typeof sessionsConclusionData.conclusionCounts
                    ]
                  }
                  inlineStyling={styles.cardStyles}
                  loading={sessionsConclusionLoading}
                />
              ))}
            </Box>
          </>
        )}

        {/* Table Section - Common for all roles but with different props */}
        {handleFetchAllSessions?.isPending ? (
          <LoadingBox inlineStyling={{ ...styles.loaderErrorBox }} />
        ) : handleFetchAllSessions?.data?.data?.length === 0 ? (
          <ErrorBox
            inlineStyling={{
              ...styles.loaderErrorBox,
            }}
          />
        ) : (
          <SessionTable {...sessionTableProps} />
        )}
      </main>

      {/* Modals - Only for Admin */}
      {isAdmin && (
        <>
          <AddModal {...addModalProps} />
          <DeleteModal {...deleteModalProps} />
        </>
      )}
    </>
  );
};

export default SessionForm;

const styles = {
  dropDownStyles: {
    width: "calc(100% - 10px)",
  },
  buttonStyles: {
    width: "10rem",
    minWidth: "110px",
    height: "100%",
  },
  cardStyles: {
    width: "calc(20% - 10px)",
  },
  teacherStudentDropDownStyles: {
    borderRadius: "none",
    width: "calc(14.2% - 10px)",
  },
  loaderErrorBox: {
    flex: "0 1 calc(100% - 10px)",
    minHeight: "0",
  },
};
