import React, { useState, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import classes from "./instantClass-modal.module.css";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";

// Define styles outside of the component
const styles = {
  buttonStyles: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
  },
  inputStyles: {
    width: "100%",
    backgroundColor: "#FFF",
    boxShadow: "none",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
    textField: {
      color: "var(--black-color)",
    },
  },
};

interface InstantClassModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  heading: string;
  subHeading?: string;
  handleAdd?: (data: any) => void;
  loading?: boolean;
  success?: boolean;
}

const InstantClassModal: React.FC<InstantClassModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleAdd,
  loading,
  success,
}) => {
  const [duration, setDuration] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Reset form when success is true
  useEffect(() => {
    if (success) {
      setDuration("");
      setValidationError(null);
    }
  }, [success]);

  // Reset form when modal closes
  useEffect(() => {
    if (!modalOpen) {
      setDuration("");
      setValidationError(null);
    }
  }, [modalOpen]);

  // Handle duration input change
  const handleDurationChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setDuration(value);

      if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
        setValidationError("Please enter a valid positive number");
      } else {
        setValidationError(null);
      }
    },
    []
  );

  // Handle form submission
  const handleFormSubmit = useCallback(() => {
    if (!duration) {
      setValidationError("Duration is required");
      return;
    }

    const durationNum = Number(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      setValidationError("Please enter a valid positive number");
      return;
    }

    handleAdd?.({
      duration: durationNum || null,
    });
  }, [duration, handleAdd]);

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
              {heading.endsWith("s") ? heading.slice(0, -1) : heading}
            </Typography>
          )}
          {subHeading && <Typography variant="body2">{subHeading}</Typography>}
        </div>
        <div className={classes.section2}>
          <form
            className={classes.contentBox}
            onSubmit={(e) => {
              e.preventDefault();
              handleFormSubmit();
            }}
          >
            <InputField
              inputBoxStyles={styles.inputStyles}
              inputStyles={styles.inputStyles.textField}
              placeholder="Enter duration in minutes"
              value={duration}
              changeFunc={handleDurationChange}
            />
          </form>
          <Button
            inlineStyling={styles.buttonStyles}
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

export default memo(InstantClassModal);
