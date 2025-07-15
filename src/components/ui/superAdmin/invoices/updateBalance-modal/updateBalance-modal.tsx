import React, { useState, memo, useCallback } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import classes from "./updateBalance-modal.module.css";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: () => void;
  heading: string;
  subHeading?: string;
  handleAdd?: (data: any) => void;
  loading?: boolean;
  isSuccess?: boolean;
  value: string;
}

const UpdateBalanceModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleAdd,
  loading,
  isSuccess,
  value,
}) => {
  const [balance, setBalance] = useState<string>("");

  const handleFormSubmit = useCallback(() => {
    if (!balance) {
      toast.error("Balance is required");
      return;
    }

    const amountPaid = Number(balance);

    if (isNaN(amountPaid) || !isFinite(amountPaid)) {
      toast.error("Please enter a valid number for balance.");
      return;
    }

    const payload = {
      amount_paid: amountPaid,
    };

    handleAdd?.(payload);
  }, [balance, handleAdd]);

  // Handle input change
  const handleBalanceChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setBalance(e.target.value);
    },
    []
  );

  // Reset form state when isSuccess is true
  React.useEffect(() => {
    if (isSuccess) {
      setBalance("");
    } else {
      setBalance(value);
    }
  }, [isSuccess, value]);

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
            <div className={classes.fields}>
              <Typography variant="body2">Balance</Typography>
              <InputField
                inputBoxStyles={styles?.inputStyles}
                placeholder="Enter balance"
                value={balance}
                changeFunc={handleBalanceChange}
              />
            </div>
          </form>
          <Button
            inlineStyling={styles?.buttonStyles}
            text="Confirm"
            clickFn={handleFormSubmit}
            loading={loading}
            disabled={loading}
          />
        </div>
      </Box>
    </Modal>
  );
};

export default memo(UpdateBalanceModal);

const styles = {
  buttonStyles: {
    position: "relative",
    zIndex: 2,
    width: "100%",
    height: "5.5vh",
    minHeight: "40px",
    fill: "#38B6FF",
    filter: "drop-shadow(1px 5px 10px rgba(56, 182, 255, 0.40))",
  },
  inputStyles: {
    width: "100%",
    backgroundColor: "var(--white-color)",
    height: "5.5vh",
    minHeight: "40px",
    boxShadow: "none",
    fill: "var(--white-color)",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
};
