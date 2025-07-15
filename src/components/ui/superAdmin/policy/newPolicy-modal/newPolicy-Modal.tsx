import React, { useState, memo, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import classes from "./newPolicy-Modal.module.css";
import Button from "@/components/global/button/button";
import DropDownSimple from "@/components/global/dropDown-simple/dropDown-simple";
import InputField from "@/components/global/input-field/input-field";
import { toast } from "react-toastify";

interface BasicModalProps {
  modalOpen: boolean;
  handleClose: any;
  heading: string;
  subHeading?: string;
  handleAdd?: (data: any) => void;
  loading?: boolean | any;
  success?: any;
}

const categories = [
  "Professional Standards",
  "Academic Policies",
  "Safety & Security",
  "Technology",
  "Communication",
  "HR Policies",
  "Student Affairs",
  "Finance",
] as const;

const NewPolicyModal: React.FC<BasicModalProps> = ({
  modalOpen,
  handleClose,
  heading,
  subHeading,
  handleAdd,
  loading,
  success,
}) => {
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [policyTitle, setPolicyTitle] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [policyContent, setPolicyContent] = useState<string>("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }
    if (!policyTitle.trim()) {
      toast.error("Please enter a policy title");
      return;
    }
    if (!selectedCategory) {
      toast.error("Please select a category");
      return;
    }
    if (!policyContent.trim()) {
      toast.error("Please enter policy content");
      return;
    }

    const formData = {
      assigned_to: selectedRole,
      title: policyTitle,
      category: selectedCategory, // No need to JSON.parse here
      content: policyContent,
    };

    // Submit the form
    handleAdd?.(formData);
  };

  useEffect(() => {
    if (success) {
      setSelectedRole("");
      setPolicyTitle("");
      setSelectedCategory("");
      setPolicyContent("");
    }
  }, [success]);

  return (
    <Modal
      open={modalOpen}
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
          <form className={classes.contentBox} onSubmit={handleFormSubmit}>
            <div className={classes.fields}>
              <Typography variant="body2">Select Role</Typography>
              <DropDownSimple
                placeholder="Select Role"
                data={["Teacher", "Student", "Parent"]}
                handleChange={(value: string) => setSelectedRole(value)}
                value={selectedRole}
                externalStyles={styles?.dropDownStyles}
              />
            </div>
            <div className={classes.fields}>
              <Typography variant="body2">Policy Title</Typography>
              <InputField
                value={policyTitle}
                changeFunc={(e: any) => setPolicyTitle(e.target.value)}
                placeholder="Policy Title"
                inputBoxStyles={styles?.inputStyles}
              />
            </div>
            <div className={classes.fields}>
              <Typography variant="body2">Category</Typography>
              <DropDownSimple
                placeholder="Select Category"
                data={categories}
                handleChange={(value: string) => setSelectedCategory(value)}
                value={selectedCategory}
                externalStyles={styles?.dropDownStyles}
              />
            </div>
            <div className={classes.fields}>
              <Typography variant="body2">Policy Content</Typography>
              <textarea
                name="content"
                className={classes?.textBox}
                value={policyContent}
                onChange={(e) => setPolicyContent(e.target.value)}
                placeholder="Enter policy content here..."
              ></textarea>
            </div>
            <Button
              inlineStyling={styles?.buttonStyles}
              text="Create"
              type="submit"
              loading={loading}
              disabled={loading}
            />
          </form>
        </div>
      </Box>
    </Modal>
  );
};

export default memo(NewPolicyModal);

const styles = {
  buttonStyles: {
    position: "relative",
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
  dropDownStyles: {
    width: "100%",
    background: "var(--white-color) !important",
    boxShadow: "none !important",
    filter: "drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.08))",
  },
};
