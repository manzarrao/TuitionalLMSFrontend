import React, { useState, memo, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import classes from "./update-modal.module.css";
import Button from "@/components/global/button/button";
import InputField from "@/components/global/input-field/input-field";
import { toast } from "react-toastify";

interface BasicModalProps {
  modalOpen: boolean;
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
  const [pageName, setPageName] = useState<string>("");
  const [pageRoute, setPageRoute] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [icon, setIcon] = useState<File | string | null>(null);
  const [iconFileName, setIconFileName] = useState<string>("");

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIcon(file);
      setIconFileName(file.name);
    } else {
      // Handle cancel - keep existing icon if no new file selected
      if (typeof icon === "string") {
        // Keep existing icon URL/path
        setIconFileName("");
      } else if (!icon) {
        setIcon(null);
        setIconFileName("");
      }
    }
  };

  const handleRemoveFile = () => {
    setIcon(null);
    setIconFileName("");

    // Reset file input
    const fileInput = document.getElementById(
      "icon-file-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFormSubmit = () => {
    // Validation
    if (!pageName.trim()) {
      toast.error("Page name is required");
      return;
    }
    if (!pageRoute.trim()) {
      toast.error("Page route is required");
      return;
    }
    if (!category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!icon) {
      toast.error("Icon is required");
      return;
    }

    const formData = {
      name: pageName.trim(),
      route: pageRoute.trim(),
      category: category.trim(),
      icon: icon,
    };

    // Submit the form
    handleUpdate?.(formData);
  };

  // Populate form with existing data when modal opens
  useEffect(() => {
    if (modalOpen && selectedPageData) {
      setPageName(selectedPageData.name || "");
      setPageRoute(selectedPageData.route || "");
      setCategory(selectedPageData.category || "");
      setIcon(selectedPageData.icon || null);
      setIconFileName("");
    }
  }, [modalOpen, selectedPageData]);

  // Handle successful update
  useEffect(() => {
    if (success) {
      setPageName("");
      setPageRoute("");
      setCategory("");
      setIcon(null);
      setIconFileName("");

      // Reset file input
      const fileInput = document.getElementById(
        "icon-file-upload"
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
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
          <form className={classes.contentBox}>
            <div className={classes.fields}>
              <Typography variant="body2">Page Name</Typography>
              <InputField
                inputBoxStyles={styles.inputStyles}
                placeholder="Enter page name"
                value={pageName}
                changeFunc={(e) => setPageName(e.target.value)}
              />
            </div>

            <div className={classes.fields}>
              <Typography variant="body2">Page Route</Typography>
              <InputField
                inputBoxStyles={styles.inputStyles}
                placeholder="Enter page route"
                value={pageRoute}
                changeFunc={(e) => setPageRoute(e.target.value)}
              />
            </div>

            <div className={classes.fields}>
              <Typography variant="body2">Category</Typography>
              <InputField
                inputBoxStyles={styles.inputStyles}
                placeholder="Enter category"
                value={category}
                changeFunc={(e) => setCategory(e.target.value)}
              />
            </div>

            <div className={classes.fields}>
              <Typography variant="body2">Icon</Typography>
              <div style={styles.fileContainer}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleIconChange}
                  style={styles.hiddenFileInput}
                  id="icon-file-upload"
                />
                <label htmlFor="icon-file-upload" style={styles.fileLabel}>
                  {iconFileName
                    ? iconFileName
                    : icon
                    ? typeof icon === "string"
                      ? "Update file"
                      : "File selected"
                    : "Choose file"}
                </label>
                {(iconFileName || icon) && (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    style={styles.removeButton}
                  >
                    ✕
                  </button>
                )}
              </div>
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
