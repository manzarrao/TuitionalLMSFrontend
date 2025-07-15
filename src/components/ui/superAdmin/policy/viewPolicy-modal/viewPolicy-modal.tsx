import React, { memo } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import classes from "./viewPolicy-modal.module.css";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: any;
  values?: any;
}

const ViewPolicyModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  values,
}) => {
  return (
    <Modal
      open={modalOpen}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className={classes.mainBox}>
        <div className={classes.section1}>
          <div className={classes.header}>
            {" "}
            {values?.title} <span>{values?.assigned_to}</span>
          </div>
          <span>{values?.category}</span>
        </div>
        <div className={classes.section2}>{values?.policy_content}</div>
      </Box>
    </Modal>
  );
};

export default memo(ViewPolicyModal);
