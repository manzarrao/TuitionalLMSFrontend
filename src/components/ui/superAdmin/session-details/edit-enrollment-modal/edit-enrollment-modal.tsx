import React, { useState, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import classes from "./edit-enrollment-modal.module.css";
import Button from "@/components/global/button/button";
import { toast } from "react-toastify";
import DropDownSimple from "@/components/global/dropDown-simple/dropDown-simple";
import InputField from "@/components/global/input-field/input-field";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  heading: string;
  subHeading?: string;
  handleUpdate?: (data: any) => void;
  loading?: boolean;
  data?: string;
  type: string;
  durationIni?: number;
}

const EditEnrollmentModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleUpdate,
  loading,
  data,
  type,
  durationIni,
}) => {
  const [conclusion_type, setConclusion_type] = useState("");
  const [duration, setDuration] = useState<number>();

  const handleChange = useCallback((value: string) => {
    setConclusion_type(value);
  }, []);

  const handleFormSubmit = () => {
    if (!conclusion_type) {
      toast.error("Please select a conclusion type.");
      return;
    }
    const formData = {
      ...(conclusion_type && { conclusion_type }),
      ...(duration && duration !== durationIni && { duration }),
    };
    handleUpdate?.(formData);
  };

  useEffect(() => {
    setConclusion_type(data ?? "");
  }, [data]);
  useEffect(() => {
    setDuration(durationIni ?? 0);
  }, [durationIni]);

  const formattedHeading = heading.endsWith("s")
    ? heading.slice(0, -1)
    : heading;

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
            <Typography variant="h6">
              {formattedHeading}
              {type}
            </Typography>
          )}
          {subHeading && (
            <Typography variant="subtitle1">{subHeading}</Typography>
          )}
        </div>

        <div className={classes.section2}>
          <form className={classes.contentBox}>
            {type === "conclusion_type" && (
              <div className={classes.fields}>
                <Typography variant="body2">Conclusion Type</Typography>
                <DropDownSimple
                  externalStyles={styles.dropDown}
                  placeholder="Select Conclusion Type"
                  value={conclusion_type}
                  handleChange={handleChange}
                  data={[
                    "No Show",
                    "Conducted",
                    "Cancelled",
                    "Student Absent",
                    "Teacher Absent",
                  ]}
                  aria-label="Conclusion type dropdown"
                />
              </div>
            )}
            {type === "duration" && (
              <div className={classes.fields}>
                <Typography variant="body2">Duration</Typography>
                <InputField
                  placeholder="Change Duration"
                  value={duration?.toString() ?? ""}
                  changeFunc={(e) => setDuration(Number(e.target.value))}
                  aria-label="Change Duration Input"
                />
              </div>
            )}
          </form>
          <Button
            inlineStyling={styles.updateButton}
            text="Update"
            clickFn={handleFormSubmit}
            loading={loading}
            disabled={loading}
            aria-label="Update conclusion type"
          />
        </div>
      </Box>
    </Modal>
  );
};

export default memo(EditEnrollmentModal);

const styles = {
  updateButton: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "10%",
    fill: "#38B6FF",
    filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
  },
  dropDown: {
    width: "100%",
    background: "var(--white-color) !important",
    height: "5.5vh",
    minHeight: "40px",
    boxShadow: "none !important",
    fill: "var(--white-color)",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
};
