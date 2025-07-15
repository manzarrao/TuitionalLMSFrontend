import React, { useState, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import classes from "./update-modal.module.css";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";
import { toast } from "react-toastify";

interface BasicModalProps {
  modalOpen?: boolean;
  handleClose: any;
  heading: string;
  subHeading?: string;
  handleUpdate?: (data: any) => void;
  loading?: boolean | any;
  success?: any;
  selectedPageData?: any;
}

const UpdateModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleUpdate,
  loading,
  success,
  selectedPageData,
}) => {
  const [roleName, setRoleName] = useState<string>("");

  const handleFormSubmit = () => {
    // Validation
    if (!roleName.trim()) {
      toast.error("Role name is required");
      return;
    }

    // Submit the form
    handleUpdate?.({ name: roleName.trim() });
  };

  // Handle successful update
  useEffect(() => {
    if (success) {
      setRoleName("");
    }
    if (selectedPageData) {
      setRoleName(selectedPageData.name);
    }
  }, [success, selectedPageData]);

  return (
    <Modal
      open={modalOpen || false}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.mainBox}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            borderBottom: "1px solid #e2e2e2",
          }}
        >
          <div className={classes.headingBox}>
            {heading && (
              <p>{heading.endsWith("s") ? heading.slice(0, -1) : heading}</p>
            )}
            {subHeading && <p>{subHeading}</p>}
          </div>
        </div>
        <div className={classes.section2}>
          <form className={classes.contentBox}>
            <div className={classes.fields}>
              <Typography variant="body2">Role Name</Typography>
              <InputField
                inputBoxStyles={styles.inputStyles}
                placeholder="Enter role name"
                value={roleName}
                changeFunc={(e) => setRoleName(e.target.value)}
              />
            </div>
          </form>
          <Button
            inlineStyling={styles?.buttonStyles}
            text="Update"
            clickFn={handleFormSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default memo(UpdateModal);

const styles = {
  buttonStyles: {
    position: "relative" as const,
    zIndex: 2,
    width: "100%",
    filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
  },
  inputStyles: {
    width: "100%",
    backgroundColor: "var(--white-color)",
    boxShadow: "none",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
  fileContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  hiddenFileInput: {
    display: "none",
  },
  fileLabel: {
    width: "max-content",
    padding: "5px 10px",
    backgroundColor: "var(--main-color)",
    color: "white",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "1.8vh",
    border: "none",
    transition: "background-color 0.3s ease",
  },
  removeButton: {
    backgroundColor: "#ff4444",
    color: "white",
    border: "none",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    cursor: "pointer",
    fontSize: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background-color 0.3s ease",
  },
};
