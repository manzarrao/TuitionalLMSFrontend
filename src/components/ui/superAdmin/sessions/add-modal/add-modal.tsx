import React, { useState, memo, useMemo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";
import classes from "./add-modal.module.css";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";
import DropDown from "@/components/global/dropDown-objects/dropDown-objects";
import DropDownSimple from "@/components/global/dropDown-simple/dropDown-simple";
import DatePicker from "@/components/global/date-picker/date-picker";
import { getAllEnrollments } from "@/services/dashboard/superAdmin/enrollments/enrollments";
import generateTimeSlots from "@/const/dashboard/time-slots";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  heading: string;
  subHeading?: string;
  handleAdd?: (data: any) => void;
  loading?: boolean;
  isSuccess?: boolean;
}

// Define the initial state for the form
interface FormState {
  enrollment: null | any;
  date: string | null;
  time: string;
  duration: string;
  conclusionType: string;
}

const initialState: FormState = {
  enrollment: null,
  date: null,
  time: "",
  duration: "",
  conclusionType: "",
};

const AddModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleAdd,
  loading,
  isSuccess,
}) => {
  const { token } = useAppSelector((state) => state?.user);
  const [formState, setFormState] = useState<FormState>(initialState);
  const [name, setName] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["getAllEnrollments", name?.length >= 3 && name],
    queryFn: () =>
      getAllEnrollments(
        {
          limit: 100,
          page: 1,
          ...(name.length >= 3 && { name: name }),
        },
        {
          token,
        }
      ),
    enabled: !!token,
  });

  // Memoize enrollment data to avoid recalculating on every render
  const stringifyEnrollmentData = useMemo(() => {
    return data?.data?.map((item: any) => JSON.stringify(item));
  }, [data]);

  // Memoize time slots to avoid recalculating on every render
  const timeSlots = useMemo(() => generateTimeSlots(15, "12hr"), []);

  // Memoize the handleFormSubmit function
  const handleFormSubmit = useCallback(() => {
    const { enrollment, date, time, duration, conclusionType } = formState;

    const validationError = !enrollment?.id
      ? "Enrollment is required"
      : !conclusionType
      ? "Conclusion Type is required"
      : !date
      ? "Date is required"
      : !duration
      ? "Duration is required"
      : null;

    if (validationError) {
      toast.error(validationError);
      return;
    }

    const dateTimeString = `${moment.utc(date).format("YYYY-MM-DD")} ${time}`;
    const classTime = moment(dateTimeString, "YYYY-MM-DD hh:mm A")
      .utc()
      .format("YYYY-MM-DDTHH:mm:ss[Z]");

    const payload = {
      tutor_class_time: Number(duration),
      conclusion_type: conclusionType,
      tutor_scaled_class_time: Number(duration),
      duration: Number(duration),
      enrollment_id: enrollment?.id,
      created_at: classTime,
    };

    handleAdd?.(payload);
  }, [formState, handleAdd]);

  const handleOnInputChange = useCallback((e: React.ChangeEvent<any>) => {
    setName(e?.target?.value);
  }, []);

  const handleEnrollmentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedEnrollment: any = JSON.parse(e.target.value);
      setFormState((prev) => ({ ...prev, enrollment: selectedEnrollment }));
    },
    []
  );

  const handleDateChange = useCallback((value: string | null | undefined) => {
    setFormState((prev) => ({
      ...prev,
      date: value
        ? moment(value)
            .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
            .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : null,
    }));
  }, []);

  const handleTimeChange = useCallback((value: any) => {
    setFormState((prev) => ({ ...prev, time: value }));
  }, []);

  const handleDurationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormState((prev) => ({ ...prev, duration: e.target.value }));
    },
    []
  );

  const handleConclusionTypeChange = useCallback((value: any) => {
    setFormState((prev) => ({ ...prev, conclusionType: value }));
  }, []);

  // Reset all states when isSuccess is true
  useEffect(() => {
    if (isSuccess) {
      setFormState(initialState);
    }
  }, [isSuccess]);

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.mainBox}>
        <div className={classes.headingBox}>
          {heading && (
            <p>{heading.endsWith("s") ? heading.slice(0, -1) : heading}</p>
          )}
          {subHeading && <p>{subHeading}</p>}
        </div>
        <div className={classes.section2}>
          <form className={classes.contentBox}>
            <div className={classes.fields} style={{ width: "100%" }}>
              <Typography variant="body2">Enrollment</Typography>
              <DropDown
                placeholder="Select Enrollment"
                data={stringifyEnrollmentData || []}
                handleChange={handleEnrollmentChange}
                handleOnInputChange={handleOnInputChange}
                value={
                  formState.enrollment
                    ? JSON.stringify(formState.enrollment)
                    : ""
                }
                inlineDropDownStyles={styles?.dropDownStyles}
                loading={isLoading}
              />
            </div>
            <div className={classes.otherFields}>
              <div className={classes.fields}>
                <Typography variant="body2">Date</Typography>
                <DatePicker
                  width="100%"
                  height="5.5vh"
                  minHeight="40px"
                  value={formState.date}
                  changeFn={handleDateChange}
                  background="#fff"
                  boxShadow="0px 1px 4px rgba(0, 0, 0, 0.08)"
                />
              </div>
              <div className={classes.fields}>
                <Typography variant="body2">Time</Typography>
                <DropDownSimple
                  placeholder="Select Time"
                  data={timeSlots || []}
                  handleChange={handleTimeChange}
                  value={formState.time}
                  externalStyles={styles?.dropDownStyles}
                />
              </div>
              <div className={classes.fields}>
                <Typography variant="body2">Session Duration</Typography>
                <InputField
                  inputBoxStyles={styles?.inputStyles}
                  placeholder="Enter session duration minutes"
                  value={formState.duration}
                  changeFunc={handleDurationChange}
                />
              </div>
              <div className={classes.fields}>
                <Typography variant="body2">Conclusion Type</Typography>
                <DropDownSimple
                  placeholder="Select Session Type"
                  data={[
                    "Conducted",
                    "Cancelled",
                    "Teacher Absent",
                    "Student Absent",
                    "No Show",
                  ]}
                  handleChange={handleConclusionTypeChange}
                  value={formState.conclusionType}
                  externalStyles={styles?.dropDownStyles}
                />
              </div>
            </div>
          </form>
          <Button
            inlineStyling={styles?.buttonStyles}
            text="Add"
            clickFn={handleFormSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default memo(AddModal);

const styles = {
  buttonStyles: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    maxHeight: "50px",
    height: "5.5vh",
    minHeight: "35px",
    fill: "#38B6FF",
    filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
  },
  inputStyles: {
    width: "100%",
    backgroundColor: "var(--white-color)",
    maxHeight: "50px",
    height: "5.5vh",
    minHeight: "35px",
    boxShadow: "none",
    fill: "var(--white-color)",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
  dropDownStyles: {
    width: "100%",
    background: "var(--white-color) !important",
    boxShadow: "none !important",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
};
