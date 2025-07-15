"use client";
import moment from "moment";
import { toast } from "react-toastify";
import { FC, useCallback, useState, useMemo } from "react";
import classes from "./class-calender.module.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { MyAxiosError } from "@/services/error.type";
import { getAllClassSchedules } from "@/services/dashboard/superAdmin/class-schedule/class-schedule-groupedByDay/clas-schedule-groupedByDay";
import { rescheduleRequest } from "@/services/dashboard/superAdmin/enrollments/getEnrollmentByGroup-id/getEnrollmentByGroup-id";
import { DeleteClassSchedule_Payload_Type } from "@/services/dashboard/superAdmin/enrollments/getEnrollmentByGroup-id/getEnrollmentByGroup-id.types";
import {
  deleteClassSchedule,
  deleteRescheduleRequest,
  cancelClassScheduleForWeek,
} from "@/services/dashboard/superAdmin/enrollments/getEnrollmentByGroup-id/getEnrollmentByGroup-id";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";
import FilterDropdown from "@/components/global/filter-dropdown/filter-dropdown";
import CalenderView from "@/components/ui/superAdmin/class-calendar/calendar-view/calender";
import DeleteCancelledSchedulledClassModal from "@/components/ui/superAdmin/class-calendar/delete-enrollment-modal/delete-enrollment-modal";
import DeleteNormalSlotModal from "@/components/ui/superAdmin/enrollment-details/deleteSlots-modal/deleteSlots-modal";

interface ClassCalendarProps {
  role: string;
}

// Initial modal states to avoid repetition
const INITIAL_CANCELLED_MODAL_STATE = { id: null, open: false };
const INITIAL_NORMAL_SLOT_MODAL_STATE = {
  open: false,
  day: "",
  startTime: "",
  endTime: "",
  ids: [],
  enrollment_id: null,
};

const ClassCalendar: FC<ClassCalendarProps> = ({ role }) => {
  // Use Redux selectors efficiently
  const { token, user, childrens } = useAppSelector((state) => state?.user);
  const { students, teachers } = useAppSelector((state) => state?.usersByGroup);
  const { subject } = useAppSelector((state) => state?.resources);

  const [selectedSubject, setSelectedSubject] = useState<any>("");
  const [selectedTeacher, setSelectedTeacher] = useState<any>("");
  const [selectedStudent, setSelectedStudent] = useState<any>("");

  // Modal states
  const [cancelledSchedulledClassModal, setCancelledSchedulledClassModal] =
    useState(INITIAL_CANCELLED_MODAL_STATE);
  const [normalSlotModal, setNormalSlotModal] = useState(
    INITIAL_NORMAL_SLOT_MODAL_STATE
  );

  // Memoized filter data
  const filteredTeachers = useMemo(
    () => teachers?.users?.map((item) => JSON.stringify(item)) || [],
    [teachers]
  );
  const filteredStudents = useMemo(
    () => students?.users?.map((item) => JSON.stringify(item)) || [],
    [students]
  );
  const filteredSubjects = useMemo(
    () => subject?.map((item) => JSON.stringify(item)) || [],
    [subject]
  );

  // Memoized handlers
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

  const handleCancelledSchedulledSlot = useCallback((item: any) => {
    setCancelledSchedulledClassModal({ ...item });
  }, []);
  const handleNormalSlot = useCallback((item: any) => {
    setNormalSlotModal({ ...item });
  }, []);

  // canccelled and schedulled slot modal close
  const handleCancelledSchedulledClassModalClose = useCallback(() => {
    setCancelledSchedulledClassModal(INITIAL_CANCELLED_MODAL_STATE);
  }, []);

  // normal slot modal close
  const handleNormalSlotModalClose = useCallback(() => {
    setNormalSlotModal(INITIAL_NORMAL_SLOT_MODAL_STATE);
  }, []);

  // Fetch class schedules
  const classSchedulesQueryParams = useMemo(() => {
    if (role === "teacher") {
      return { tutor_id: user?.id };
    } else if (role === "student") {
      return { student_id: user?.id };
    } else if (role === "parent") {
      return { childrens: childrens?.map((i: any) => i.id).join(",") };
    }
    return {};
  }, [role, user?.id]);
  const {
    data: classSchedulesData,
    isLoading: isClassSchedulesLoading,
    refetch: refetchClassSchedulesData,
  } = useQuery({
    queryKey: ["class-schedules-groupedByDay", role, user?.id],
    queryFn: () => getAllClassSchedules(classSchedulesQueryParams, { token }),
  });

  // Fetch reschedule requests
  const rescheduleRequestQueryParams = useMemo(() => {
    if (role === "teacher") {
      return { tutor_ids: [user?.id] };
    } else if (role === "student") {
      return { student_ids: [user?.id] };
    } else if (role === "parent") {
      return { student_ids: childrens?.map((i: any) => i.id) };
    }
    return {};
  }, [role, user?.id]);
  const {
    data: rescheduleRequestData,
    isLoading: isRescheduleRequestLoading,
    refetch: refetchRescheduleRequestData,
  } = useQuery({
    queryKey: ["reschedule-requests", role, user?.id],
    queryFn: () =>
      rescheduleRequest(
        {
          startDate: moment().subtract(6, "months").format("YYYY-MM-DD"),
          endDate: moment().add(6, "months").format("YYYY-MM-DD"),
        },
        { token },
        rescheduleRequestQueryParams
      ),
  });

  // Refactor class schedule data
  const refactorClassSchedule = useMemo(() => {
    if (!classSchedulesData) return [];

    const getNextDateForDay = (
      dayOfWeek: string,
      time: string,
      offsetDays = 0
    ) => {
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const today = new Date();
      const currentDay = today.getDay();
      const targetDay = daysOfWeek.indexOf(dayOfWeek);
      let daysUntilNext = (targetDay + 7 - currentDay) % 7;
      if (daysUntilNext === 0) daysUntilNext = 7;

      const nextDate = new Date(today);
      nextDate.setDate(today.getDate() + daysUntilNext + offsetDays);

      const [hours, minutes, seconds] = time.split(":").map(Number);
      nextDate.setUTCHours(hours, minutes, seconds, 0);

      return new Date(
        nextDate.toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        })
      );
    };

    const result = Object.entries(classSchedulesData).flatMap(([key, items]) =>
      items.map((item) => ({ ...item, day: key }))
    );

    return result?.flatMap((item: any) =>
      Array.from({ length: 5 }, (_, i) => {
        const startDate = getNextDateForDay(
          item.teacherSchedule.day_of_week,
          item.teacherSchedule.start_time,
          (i - 1) * 7
        );
        const endDate = new Date(startDate);
        endDate.setMinutes(
          startDate.getMinutes() + item.teacherSchedule.session_duration
        );

        return {
          type: "normal slot",
          id: item.id,
          status: item.status,
          start: startDate,
          end: endDate,
          title: `${
            item.enrollment?.tutor?.name?.split(" ")[0] || "No Show"
          } X ${
            item.enrollment?.studentsGroups[0]?.user?.name?.split(" ")[0] ||
            "No Show"
          }`,
          slotData: item,
        };
      })
    );
  }, [classSchedulesData, refetchClassSchedulesData]);

  // Refactor reschedule requests data
  const refactorResheduleRequests = useMemo(() => {
    if (!rescheduleRequestData) return [];

    return rescheduleRequestData?.map((item: any) => ({
      type: "extra slot",
      id: item.id,
      start: moment.utc(item.DateTime).local().toDate(),
      end: moment.utc(item.DateTime).local().add(60, "minutes").toDate(),
      status: item.class_status,
      title: `${item.enrollment?.tutor?.name.split(" ")[0] || "No Show"} X ${
        item.enrollment?.students[0]?.name?.split(" ")[0] || "No Show"
      }`,
      slotData: item,
    }));
  }, [rescheduleRequestData, refetchRescheduleRequestData]);

  const allClasses = useMemo(() => {
    return [...refactorClassSchedule, ...refactorResheduleRequests];
  }, [refactorClassSchedule, refactorResheduleRequests]);
  //  filtered classes logic
  const filteredClasses = useMemo(() => {
    return allClasses?.filter((classItem) => {
      const slot = classItem?.slotData;
      if (!slot || !slot.enrollment) return false;
      const hasSubjectMatch = selectedSubject?.id
        ? slot?.enrollment?.subject?.id === selectedSubject?.id
        : true;

      const hasTeacherMatch = selectedTeacher?.id
        ? slot?.enrollment?.tutor?.id === selectedTeacher?.id
        : true;

      const hasStudentMatch = !selectedStudent?.id
        ? true
        : slot?.enrollment?.studentsGroups
        ? slot.enrollment.studentsGroups.some(
            (student: any) => student.student_id === selectedStudent?.id
          )
        : slot?.enrollment?.students
        ? slot.enrollment.students.some(
            (student: any) => student?.id === selectedStudent?.id
          )
        : true;
      return hasSubjectMatch && hasTeacherMatch && hasStudentMatch;
    });
  }, [selectedSubject, selectedStudent, selectedTeacher, allClasses]);

  const handleDeleteCancelledSchedulledClassSlot = useMutation({
    mutationFn: (payload: number) =>
      deleteRescheduleRequest({ id: String(payload) }, { token }),
    onSuccess: (data) => {
      toast.success(
        `${
          data && data.message
            ? data.message
            : "Reschedule request deleted successfully"
        }`
      );
      setCancelledSchedulledClassModal({ id: null, open: false });
      refetchClassSchedulesData();
      refetchRescheduleRequestData();
    },
    onError: (error: MyAxiosError) => {
      if (error?.response) {
        toast.error(
          error.response.data.error ||
            `${error.response.status} ${error.response.statusText}`
        );
      } else {
        toast.error(error.message);
      }
      setCancelledSchedulledClassModal({ id: null, open: false });
    },
  });

  const handlePermanentDeleteClassSchedule = useMutation({
    mutationFn: (payload: DeleteClassSchedule_Payload_Type) =>
      deleteClassSchedule(payload, { token }),
    onSuccess: () => {
      toast.success("Class Schedule Delete Successfully");
      setNormalSlotModal({
        open: false,
        day: "",
        startTime: "",
        endTime: "",
        ids: [],
        enrollment_id: null,
      });
      refetchClassSchedulesData();
      refetchRescheduleRequestData();
    },
    onError: (error) => {
      const axiosError = error as MyAxiosError;
      if (axiosError?.response) {
        toast.error(
          axiosError?.response.data.error ||
            `${axiosError?.response.status} ${axiosError?.response.statusText}`
        );
      } else {
        toast.error(axiosError?.message);
      }
      setNormalSlotModal({
        open: false,
        day: "",
        startTime: "",
        endTime: "",
        ids: [],
        enrollment_id: null,
      });
    },
  });

  const handlePermanentDeleteClassScheduleForWeek_foraddExtraClassSchedule =
    useMutation({
      mutationFn: (payload: any) =>
        cancelClassScheduleForWeek(payload, { token }),
      onSuccess: (data) => {
        if (data && "newRescheduleRequest" in data) {
          toast.success("Extra Slot added successfully.");
        } else {
          toast.success("Class Schedule deleted successfully for the week");
        }
        setNormalSlotModal({
          open: false,
          day: "",
          startTime: "",
          endTime: "",
          ids: [],
          enrollment_id: null,
        });
        refetchClassSchedulesData();
        refetchRescheduleRequestData();
      },
      onError: (error) => {
        const axiosError = error as MyAxiosError;
        if (axiosError?.response) {
          toast.error(
            axiosError?.response.data.error ||
              `${axiosError?.response.status} ${axiosError?.response.statusText}`
          );
        } else {
          toast.error(axiosError?.message);
        }
        setNormalSlotModal({
          open: false,
          day: "",
          startTime: "",
          endTime: "",
          ids: [],
          enrollment_id: null,
        });
      },
    });

  // Merge class schedules and reschedule requests

  return (
    <>
      <main className={classes.container}>
        <div className={classes.section1}>
          <div className={classes.wrapper}>
            {role !== "teacher" && (
              <FilterDropdown
                placeholder="Filter By Teacher"
                data={filteredTeachers}
                handleChange={handleTeacherFilter}
                value={JSON.stringify(selectedTeacher)}
                dropDownObject
                inlineBoxStyles={{ width: "100%" }}
              />
            )}
            {role !== "student" && (
              <FilterDropdown
                placeholder="Filter By Student"
                data={filteredStudents}
                handleChange={handleStudentFilter}
                value={JSON.stringify(selectedStudent)}
                dropDownObject
                inlineBoxStyles={{ width: "100%" }}
              />
            )}
            <FilterDropdown
              placeholder="Filter By Subject"
              data={filteredSubjects}
              handleChange={handleSubjectFilter}
              value={JSON.stringify(selectedSubject)}
              dropDownObject
              inlineBoxStyles={{ width: "100%" }}
            />
          </div>
        </div>
        {isClassSchedulesLoading || isRescheduleRequestLoading ? (
          <LoadingBox />
        ) : !rescheduleRequestData ||
          !classSchedulesData ||
          filteredClasses?.length === 0 ? (
          <ErrorBox />
        ) : (
          <CalenderView
            events={filteredClasses}
            handleCancelledSchedulledSlot={
              role === "superAdmin" ? handleCancelledSchedulledSlot : undefined
            }
            handleNormalSlot={
              role === "superAdmin" ? handleNormalSlot : undefined
            }
          />
        )}
      </main>
      {/* cancelled and schedulled slot modal */}
      {role === "superAdmin" && (
        <DeleteCancelledSchedulledClassModal
          modalOpen={cancelledSchedulledClassModal}
          handleClose={handleCancelledSchedulledClassModalClose}
          subHeading="Are you sure you want to delete this schedule? This action is permanent."
          heading="Are You Sure?"
          handleDeleteSlot={() => {
            if (cancelledSchedulledClassModal?.id === null) return;
            handleDeleteCancelledSchedulledClassSlot?.mutate(
              cancelledSchedulledClassModal?.id
            );
          }}
          loading={handleDeleteCancelledSchedulledClassSlot?.isPending}
        />
      )}
      {/* normal slot modal */}
      {role === "superAdmin" && (
        <DeleteNormalSlotModal
          loading={
            handlePermanentDeleteClassSchedule?.isPending ||
            handlePermanentDeleteClassScheduleForWeek_foraddExtraClassSchedule?.isPending
          }
          modalOpen={normalSlotModal}
          handleClose={handleNormalSlotModalClose}
          heading={`${normalSlotModal?.day}`}
          subHeading={`Are you sure you want to delete slot (${normalSlotModal?.startTime} to ${normalSlotModal?.endTime}).`}
          handleDelete={(payload: any) => {
            handlePermanentDeleteClassSchedule?.mutate(payload);
          }}
          dayDeletion={(day: string) => {
            const time = moment(normalSlotModal?.startTime, "hh:mmA").format(
              "HH:mm:ss"
            );
            const dateTime = day + time;
            const payload = {
              user_id: user?.roleId || null,
              enrollment_id: normalSlotModal?.enrollment_id || null,
              class_status: "CANCELLED",
              class_schedule_id: normalSlotModal?.ids[0],
              dateTime: moment(dateTime, "DD-MMM-YYYY HH:mm:ss")
                .utc()
                .format("YYYY-MM-DDTHH:mm:ss[Z]"),
            };
            handlePermanentDeleteClassScheduleForWeek_foraddExtraClassSchedule?.mutate(
              payload
            );
          }}
          weekDeletion={(day: string) => {
            const time = moment(normalSlotModal?.startTime, "hh:mm A").format(
              "HH:mm:ss"
            );
            const dateTime = `${day} ${time}`;
            const payload = {
              user_id: user?.roleId || null,
              enrollment_id: normalSlotModal?.enrollment_id || null,
              class_status: "CANCELLED",
              class_schedule_id: normalSlotModal?.ids[0],
              dateTime: moment(dateTime).utc().format("YYYY-MM-DDTHH:mm:ss[Z]"),
            };
            handlePermanentDeleteClassScheduleForWeek_foraddExtraClassSchedule?.mutate(
              payload
            );
          }}
        />
      )}
    </>
  );
};

export default ClassCalendar;
