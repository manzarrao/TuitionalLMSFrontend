"use client";
import classes from "./enrollments.module.css";
// modules & libraries
import { useState, useCallback, FC, useMemo } from "react";
import moment from "moment";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { toast } from "react-toastify";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
// services
import { MyAxiosError } from "@/services/error.type";
import {
  getAllEnrollments,
  addEnrollment,
  deleteEnrollment,
  changeBreakStatus,
  editEnrollmentByGroupId,
} from "@/services/dashboard/superAdmin/enrollments/enrollments";
import { classScheduleInstant } from "@/services/dashboard/superAdmin/class-schedule/class-schedule-scheduleInstan";
import { Create_Enrollment_Payload_Type } from "@/types/enrollment/getAllEnrollments.types";
// components
import EnrollmentTable from "@/components/ui/superAdmin/enrollment/enrollment-table/enrollment-table";
import AddModal from "@/components/ui/superAdmin/enrollment/add-modal/add-Modal";
import InstantClassModal from "@/components/ui/superAdmin/enrollment/instantClass-modal/instantClass-modal";
import DeleteModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";
import ManualClassModal from "@/components/ui/superAdmin/enrollment/delete-modal/delete-modal";
import EditEnrollmentModal from "@/components/ui/superAdmin/enrollment/edit-enrollment-modal/edit-enrollment-modal";
import Button from "@/components/global/button/button";
import FilterByDate from "@/components/global/filter-by-date/filter-by-date";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
//types
import {
  ModalState,
  FilterState,
  EnrollmentItem,
} from "./enrollment-form-types";

// Constants
const dropDownStyles = {
  width: "100%",
};

const initialModalState: ModalState = {
  add: false,
  edit: false,
  delete: false,
  manualClass: { open: false, enrollment_id: null, duration: null },
  instantClass: { open: false, enrollment_id: null },
};

const initialFilterState: FilterState = {
  currentPage: 1,
  rowsPerPage: 50,
  dateFilter: "",
  selectedTeacher: "",
  selectedStudent: "",
};

const EnrollmentForm: FC = () => {
  const queryClient = useQueryClient();
  const { token, user, childrens } = useAppSelector((state) => state?.user);
  const { subject, curriculum, board, grades } = useAppSelector(
    (state) => state.resources
  );
  const { students, teachers } = useAppSelector((state) => state?.usersByGroup);
  // State management
  const [modals, setModals] = useState<ModalState>(initialModalState);
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [deleteId, setDeleteId] = useState<string>("");
  const [editEnrollmentObj, setEditEnrollmentObj] =
    useState<EnrollmentItem | null>(null);

  // Memoized data
  const filteredTeachers = useMemo(
    () => teachers?.users?.map((item) => JSON.stringify(item)) || [],
    [teachers?.users]
  );

  const filteredStudents = useMemo(
    () => students?.users?.map((item) => JSON.stringify(item)) || [],
    [students?.users]
  );

  // Helper function to update filters
  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
        ...(key !== "currentPage" ? { currentPage: 1 } : {}),
      }));
    },
    []
  );

  // Modal toggle helper
  const toggleModal = useCallback(
    <K extends keyof ModalState>(
      modalName: K,
      value: ModalState[K],
      additionalData: Partial<ModalState> = {}
    ) => {
      setModals((prev) => ({
        ...prev,
        [modalName]:
          typeof value === "object" && value !== null ? { ...value } : value,
        ...additionalData,
      }));
    },
    []
  );

  // Event handlers
  const handleChangePage = useCallback(
    (e: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
      updateFilter("currentPage", newPage);
    },
    [updateFilter]
  );

  const handleChangeRowsPerPage = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      updateFilter("rowsPerPage", parseInt(e?.target?.value, 10));
    },
    [updateFilter]
  );

  const handleCalendar = useCallback(
    (value: [string, string] | null) => {
      updateFilter("dateFilter", value === null ? "" : value);
    },
    [updateFilter]
  );

  const handleTeacherFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateFilter("selectedTeacher", e.target.value);
    },
    [updateFilter]
  );

  const handleStudentFilter = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      updateFilter("selectedStudent", e.target.value);
    },
    [updateFilter]
  );

  // Modal handlers
  const handeAddModalClose = useCallback(
    () => toggleModal("add", false),
    [toggleModal]
  );
  const handleAddModalOpen = useCallback(
    () => toggleModal("add", true),
    [toggleModal]
  );

  const handleDeleteModalClose = useCallback(() => {
    toggleModal("delete", false);
    setDeleteId("");
  }, [toggleModal]);

  const handleDeleteModalOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, id: number | string) => {
      e.stopPropagation();
      toggleModal("delete", true);
      setDeleteId(id.toString());
    },
    [toggleModal]
  );

  const handleEditModalOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, item: EnrollmentItem) => {
      e.stopPropagation();
      toggleModal("edit", true);
      setEditEnrollmentObj(item);
    },
    [toggleModal]
  );

  const handleInstantClassModalOpen = useCallback(
    (e: React.MouseEvent<HTMLElement>, item: EnrollmentItem) => {
      e.stopPropagation();
      toggleModal("instantClass", {
        open: true,
        enrollment_id: Number(item?.id),
      });
    },
    [toggleModal]
  );

  const handeInstantClassModalClose = useCallback(() => {
    toggleModal("instantClass", { open: false, enrollment_id: null });
  }, [toggleModal]);

  const handeManualClassModalClose = useCallback(() => {
    toggleModal("instantClass", { open: false, enrollment_id: null });
    toggleModal("manualClass", {
      open: false,
      enrollment_id: null,
      duration: null,
    });
  }, [toggleModal]);

  // Common mutation options
  const createMutationOptions = useCallback(
    (
      successMessage: string,
      onSuccessAction: (() => void) | null,
      closeModal: keyof ModalState | null
    ) => ({
      onSuccess: (data: any) => {
        // Handle error messages
        if (
          successMessage === "Enrollment Deleted Successfully" ||
          successMessage === "Enrollment Added Successfully"
        ) {
          if (
            filters?.dateFilter ||
            filters?.selectedStudent ||
            filters?.selectedTeacher
          ) {
            setFilters({ ...initialFilterState });
          }
        }

        if (data?.message) {
          toast.success(data?.message);
        }
        if (data?.error) {
          toast.error(data.error);
        }

        // Handle normal success
        if (closeModal) toggleModal(closeModal, false);
        {
          successMessage && toast.success(successMessage);
        }
        queryClient.invalidateQueries({ queryKey: ["getAllEnrollments"] });

        // Handle conflict found
        if (data?.conflictFound === true) {
          toggleModal("instantClass", { open: false, enrollment_id: null });
        }

        // Run success callback if provided
        if (onSuccessAction) onSuccessAction();
      },
      onError: (error: unknown) => {
        const axiosError = error as MyAxiosError;
        toast.error(
          axiosError.response
            ? axiosError.response.data.error ||
                `${axiosError.response.status} ${axiosError.response.statusText}`
            : axiosError.message
        );
        if (closeModal) toggleModal(closeModal, false);
      },
    }),
    [queryClient, toggleModal, filters]
  );

  // Mutations
  const handleInstanClass = useMutation({
    mutationFn: async (payload: {
      duration: number | null;
      enrollment_id: number | null;
      isBypass?: boolean;
    }) => {
      const response = await classScheduleInstant({ token }, payload);

      if (
        response?.conflictFound &&
        response?.data === null &&
        response?.conflictingSchedule
      ) {
        // Update manual class modal state
        toast.error("Class is already booked for now.");
        toggleModal("manualClass", {
          open: true,
          enrollment_id: payload.enrollment_id,
          duration: payload.duration,
          name: response?.conflictingSchedule?.enrollment?.name,
          startTime:
            response?.conflictingSchedule?.duration !== null
              ? moment
                  .utc(response?.conflictingSchedule?.createdAt)
                  .local()
                  .format("h:mm a")
              : moment
                  .utc(
                    response?.conflictingSchedule?.teacherSchedule?.start_time,
                    "HH:mm:ss"
                  )
                  .local()
                  .format("h:mm a"),
          endTime:
            response?.conflictingSchedule?.duration !== null
              ? moment
                  .utc(response?.conflictingSchedule?.createdAt)
                  .add(response?.conflictingSchedule?.duration, "minutes")
                  .local()
                  .format("h:mm a")
              : moment
                  .utc(response?.conflictingSchedule?.createdAt)
                  .add(
                    response?.conflictingSchedule?.teacherSchedule
                      ?.session_duration,
                    "minutes"
                  )
                  .local()
                  .format("h:mm a"),
        });
      } else if (
        payload?.isBypass &&
        response?.data &&
        response?.conflictFound === true
      ) {
        toggleModal("instantClass", { open: false, enrollment_id: null });
        toggleModal("manualClass", {
          open: false,
          enrollment_id: null,
          duration: null,
        });
        toast.success("Instant class created successfully.");
      } else {
        toast.success("Instant class created successfully.");
        toggleModal("instantClass", { open: false, enrollment_id: null });
      }

      return response;
    },
  });

  const handleAdd = useMutation({
    mutationFn: (payload: Create_Enrollment_Payload_Type) =>
      addEnrollment(payload, { token }),
    ...createMutationOptions("Enrollment Added Successfully", null, "add"),
  });

  const handleEditEnrollment = useMutation({
    mutationFn: (payload: any) =>
      editEnrollmentByGroupId(String(editEnrollmentObj?.id), payload, {
        token,
      }),
    ...createMutationOptions("Enrollment Edited Successfully", null, "edit"),
  });

  const handleDelete = useMutation({
    mutationFn: (payload: { id: string }) =>
      deleteEnrollment(payload, { token }),
    ...createMutationOptions(
      "Enrollment Deleted Successfully",
      () => setDeleteId(""),
      "delete"
    ),
  });

  const handleBreakStatus = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { on_break: boolean };
    }) => changeBreakStatus(id, payload, { token }),
    ...createMutationOptions("", null, null),
  });

  const handleSwitchCallback = useCallback(
    (
      e: React.MouseEvent<HTMLElement> | React.ChangeEvent<HTMLInputElement>,
      id: number | string,
      payload: { on_break: boolean }
    ) => {
      e.stopPropagation();
      handleBreakStatus.mutate({ id: String(id), payload });
    },
    [handleBreakStatus]
  );

  // Memoized component props

  const instantClassProps = useMemo(
    () => ({
      modalOpen: modals.instantClass?.open,
      handleClose: handeInstantClassModalClose,
      heading: "Instant Class Override",
      subHeading: "Enter Class Duration in Minutes",
      handleAdd: (payload: { duration: number }) => {
        handleInstanClass?.mutate({
          ...payload,
          enrollment_id: modals.instantClass?.enrollment_id || null,
        });
      },
      loading: handleInstanClass?.isPending,
    }),
    [
      modals.instantClass?.open,
      modals.instantClass?.enrollment_id,
      handeInstantClassModalClose,
      handleInstanClass,
    ]
  );

  const manualClassModalProps = useMemo(() => {
    const name = modals.manualClass?.name?.split("-")[0]?.trim() || "";
    const startTime = modals.manualClass?.startTime || "";
    const endTime = modals.manualClass?.endTime || "";

    return {
      modalOpen: modals.manualClass?.open,
      handleClose: handeManualClassModalClose,
      heading: "Are you sure you want to start a manual class?",
      subHeading: `Class is already booked for this enrollment "${name}" at ${startTime} to ${endTime}!`,
      buttonText: "Start Class",
      handleDelete: () =>
        handleInstanClass.mutate({
          duration: modals?.manualClass?.duration || null,
          enrollment_id: modals?.manualClass?.enrollment_id || null,
          isBypass: true,
        }),
      loading: handleInstanClass.isPending,
    };
  }, [
    modals.manualClass?.open,
    modals.manualClass?.duration,
    modals.manualClass?.enrollment_id,
    handeManualClassModalClose,
    handleInstanClass,
  ]);

  const addModalProps = useMemo(
    () => ({
      modalOpen: modals.add,
      handleClose: handeAddModalClose,
      heading: "Add Enrollment",
      subHeading: "Fill out the form in order to create the enrollment",
      subject: subject || [],
      curriculum: curriculum || [],
      board: board || [],
      grades: grades || [],
      students: students?.users || [],
      teachers: teachers?.users || [],
      handleAdd: (payload: Create_Enrollment_Payload_Type) =>
        handleAdd.mutate(payload),
      loading: handleAdd?.isPending,
      success: handleAdd?.isSuccess,
    }),
    [
      modals.add,
      handeAddModalClose,
      subject,
      curriculum,
      board,
      grades,
      students?.users,
      teachers?.users,
      handleAdd,
    ]
  );

  const editModalProps = useMemo(
    () => ({
      data: editEnrollmentObj || {},
      subject: subject || [],
      curriculum: curriculum || [],
      board: board || [],
      grades: grades || [],
      students: students?.users || [],
      teachers: teachers?.users || [],
      loading: handleEditEnrollment?.isPending,
      heading: "Edit Enrollment",
      subHeading: "Fill out the form in order to edit the enrollment details.",
      modalOpen: modals.edit,
      handleClose: () => toggleModal("edit", false),
      handleEdit: (payload: any) => handleEditEnrollment?.mutate(payload),
    }),
    [
      editEnrollmentObj,
      subject,
      curriculum,
      board,
      grades,
      students?.users,
      teachers?.users,
      handleEditEnrollment?.isPending,
      modals.edit,
      toggleModal,
      handleEditEnrollment,
    ]
  );

  const deleteModalProps = useMemo(
    () => ({
      modalOpen: modals.delete,
      handleClose: handleDeleteModalClose,
      subHeading:
        "Are you sure you want to delete this enrollment? This action is permanent.",
      heading: "Are You Sure?",
      handleDelete: () => handleDelete.mutate({ id: deleteId }),
      loading: handleDelete?.isPending,
    }),
    [modals.delete, handleDeleteModalClose, deleteId, handleDelete?.isPending]
  );

  // Query parameters
  const queryParams = useMemo(
    () => ({
      limit: filters.rowsPerPage,
      page: filters.currentPage,
      startDate: Array.isArray(filters.dateFilter)
        ? filters.dateFilter[0] || ""
        : "",
      endDate: Array.isArray(filters.dateFilter)
        ? filters.dateFilter[1] || ""
        : "",
      subjectId: "",
      curriculumId: "",
      boardId: "",
      gradeId: "",
      childrens:
        user?.roleId === 4
          ? childrens?.map((i: any) => i.id).join(",") || ""
          : "",
      teacher_id:
        user?.roleId === 5
          ? user?.id
          : filters.selectedTeacher
          ? JSON.parse(filters.selectedTeacher)?.id
          : "",
      student_id:
        user?.roleId === 3
          ? user?.id
          : filters.selectedStudent
          ? JSON.parse(filters.selectedStudent)?.id
          : "",
    }),
    [
      filters.rowsPerPage,
      filters.currentPage,
      filters.dateFilter,
      filters.selectedTeacher,
      filters.selectedStudent,
      user?.roleId,
      user?.id,
    ]
  );

  // Data fetching
  const { data, error, isLoading } = useQuery({
    queryKey: [
      "getAllEnrollments",
      filters.currentPage,
      filters.rowsPerPage,
      filters.dateFilter,
      filters.selectedTeacher,
      filters.selectedStudent,
      user?.roleId,
      handleDelete?.isSuccess,
    ],
    queryFn: () => getAllEnrollments(queryParams, { token }),
  });

  // Table props
  const tableProps = useMemo(
    () => ({
      data: data?.data || [],
      currentPage: data?.currentPage || 1,
      totalCount: data?.totalCount || data?.data?.length || 1,
      totalPages: data?.totalPages || 1,
      rowsPerPage: filters.rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      breakLoading: handleBreakStatus?.isPending,
      handleDeleteModal: handleDeleteModalOpen,
      handleEditModal: handleEditModalOpen,
      handleInstantClassModal: handleInstantClassModalOpen,
      handleSwitch: handleSwitchCallback,
    }),
    [
      data,
      filters.rowsPerPage,
      handleChangePage,
      handleChangeRowsPerPage,
      handleBreakStatus?.isPending,
      handleDeleteModalOpen,
      handleEditModalOpen,
      handleInstantClassModalOpen,
      handleSwitchCallback,
    ]
  );

  // Handle API error
  if (error) {
    const axiosError = error as MyAxiosError;
    toast.error(axiosError.response?.data.error || axiosError.message);
  }

  return (
    <>
      <main className={classes.container}>
        <div className={classes.section1}>
          <div className={classes.wrapper}>
            <FilterByDate
              changeFn={handleCalendar}
              width={dropDownStyles?.width}
            />
            {user?.roleId !== 3 && (
              <FilterDropdown
                placeholder="Filter Student"
                data={filteredStudents}
                handleChange={handleStudentFilter}
                value={filters.selectedStudent}
                dropDownObject
                inlineBoxStyles={dropDownStyles}
              />
            )}
            {user?.roleId !== 5 && (
              <FilterDropdown
                placeholder="Filter Teacher"
                data={filteredTeachers}
                handleChange={handleTeacherFilter}
                value={filters.selectedTeacher}
                dropDownObject
                inlineBoxStyles={dropDownStyles}
              />
            )}
          </div>
          {user?.roleId !== 5 && user?.roleId !== 3 && user?.roleId !== 4 && (
            <Button
              text="Add New Enrollment"
              icon={<AddOutlinedIcon />}
              clickFn={handleAddModalOpen}
              inlineStyling={{ width: "max-content" }}
            />
          )}
        </div>

        {isLoading ? (
          <LoadingBox
            inlineStyling={{ flex: "0 1 calc(100% - 10px)", minHeight: "0" }}
          />
        ) : !data?.data?.length ? (
          <ErrorBox
            inlineStyling={{ flex: "0 1 calc(100% - 10px)", minHeight: "0" }}
          />
        ) : (
          <EnrollmentTable {...tableProps} />
        )}
      </main>
      <AddModal {...addModalProps} />
      <InstantClassModal {...instantClassProps} />
      <ManualClassModal {...manualClassModalProps} />
      <EditEnrollmentModal {...editModalProps} />
      <DeleteModal {...deleteModalProps} />
    </>
  );
};

export default EnrollmentForm;
