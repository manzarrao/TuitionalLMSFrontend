import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import styles from "./add-modal.module.css";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";
import { toast } from "react-toastify";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  heading: string;
  subHeading?: string;
  activeTab: string;
  handleAdd: any;
  loading: boolean;
}

const AddModal: React.FC<BasicModalProps> = ({
  loading,
  modalOpen,
  handleClose,
  heading,
  subHeading,
  activeTab,
  handleAdd,
}) => {
  console.log("ad modal");
  const mainDivStyles = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      border: "none",
      backgroundColor: "#FFF",
      height: "6.5vh",
    }),
    []
  );

  const buttonStyles = useMemo<React.CSSProperties>(
    () => ({
      width: "100%",
      height: "5.3vh",
      fill: "#38B6FF",
      filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
    }),
    []
  );
  const [newResource, setNewResource] = useState<string>("");

  // Clear input when success becomes true
  useEffect(() => {
    if (loading) {
      setNewResource("");
    }
  }, [loading]);

  // Input change handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewResource(e.target.value);
  };

  // Submit handler with validation
  const handleSubmit = useCallback(() => {
    if (!newResource) {
      toast.error(`Please enter a ${activeTab.slice(0, -1).toLowerCase()}.`);
    } else {
      handleAdd(newResource.trim());
    }
  }, [newResource]);

  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={styles.mainBox}>
        <div className={styles.headingBox}>
          <Typography>{heading}</Typography>
          {subHeading && <Typography>{subHeading}</Typography>}
        </div>
        <div className={styles.section2}>
          <div className={styles.contentBox}>
            <div className={styles.mainContent}>
              <div className={styles.fields}>
                <label>{activeTab}</label>
                <InputField
                  inputBoxStyles={mainDivStyles}
                  placeholder={`Enter ${activeTab}`}
                  changeFunc={handleInputChange}
                  value={newResource}
                />
              </div>
            </div>
          </div>
          <Button
            loading={loading}
            inlineStyling={buttonStyles}
            text="Add"
            clickFn={handleSubmit}
          />
        </div>
      </Box>
    </Modal>
  );
};

// Extracted styles for better readability

export default memo(AddModal);
