import React, { FC, memo, useState, useCallback } from "react";
import { DatePicker as RSuiteDatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import moment from "moment";

interface DatePickerProps {
  changeFn?: (value: string | null) => void;
  width?: string;
  height?: string;
  minHeight?: string;
  maxHeight?: string;
  boxShadow?: string;
  background?: string;
  value: string | null;
  placeholder?: string;
  previousDatesDisbaled?: boolean;
}

const DatePicker: FC<DatePickerProps> = ({
  width = "100%",
  height = "50px",
  minHeight = "35px",
  maxHeight = "50px",
  boxShadow = "0px -1px 10px 0px rgba(56, 182, 255, 0.3) inset",
  background = "transparent",
  changeFn,
  value,
  placeholder = "Select date",
  previousDatesDisbaled,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  // Memoize handlers to prevent unnecessary re-renders
  const handleChange = useCallback(
    (date: Date | null) => {
      if (!changeFn) return;

      if (date === null) {
        changeFn(null);
      } else {
        const utcFormattedDate = moment(date)
          .utc()
          .format("YYYY-MM-DDTHH:mm:ss[Z]");

        changeFn(utcFormattedDate);
        setOpen(false);
      }
    },
    [changeFn, setOpen]
  );

  const handleClean = useCallback(() => {
    if (changeFn) {
      changeFn(null);
    }
  }, [changeFn]);

  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  // Function to disable past dates - fixed typing to match RSuite's expected signature
  const shouldDisableDate = useCallback((date?: Date): boolean => {
    if (!date) return false;

    // Get the start of today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Return true if the date is before today (to disable it)
    return date < today;
  }, []);

  const customStyles = `
    .rs-picker-toggle-wrapper {
      border-radius: 10px;
      background: ${background};
      overflow: hidden;
      width: ${width};
      height: ${height};
      min-height: ${minHeight};
      max-height: ${maxHeight};
      box-shadow: ${boxShadow};
      position: relative;
    }

    .rs-picker.rs-picker-focused, 
    .rs-picker:not(.rs-picker-disabled):hover {
      border-color: var(--main-color) !important;
    }

    .rs-input-group {
      border: none;
    }

    .rs-input-group.rs-input-group-inside {
      height: 100%;
      display: flex;
      flex-direction: row-reverse;
      background: transparent;
      align-items: center;
    }

    .rs-input-group.rs-input-group-inside > input {
      background: transparent;
      font-family: var(--leagueSpartan-regular-400);
      font-size: 1.8vh !important;
      color: var(--black-color) !important;
      height: 100% !important;
      padding: 10px 10px 10px 0px !important;
    }

    .rs-input-group-lg.rs-input-group > .rs-input, 
    .rs-input-group-lg.rs-input-group > .rs-input-group-addon {
      height: 100%;
    }

    .rs-input-group-lg > .rs-input {
      padding: 5px 10px;
      border: none;
    }

    .rs-input-group.rs-input-group-lg > .rs-input-group-addon {
      padding: 10px;
      min-width: 0;
    }

    .rs-input-group.rs-input-group-inside > span {
      height: 100%;
      background: transparent;
    }

    .rs-input-group.rs-input-group-inside > span > svg {
      color: var(--main-color);
      font-size: 1.8vh !important;
    }

    .rs-picker-popup {
      z-index: 1400 !important;
      top: 275px !important;
    }

    .rs-stack {
      overflow: hidden;
      height: max-content;
      padding-top: 5px;
    } 

    .rs-stack-item {
      overflow: hidden;
      height: max-content;
    }

    .rs-calendar {
      min-height: max-content !important;
      padding: 0px !important;
      height: fit-content !important;
    }

    .rs-calendar-body {
      padding: 0px 15px !important;
      height: max-content !important;
    }

    .rs-calendar-table-header-cell-content {
      font-size: var(--small-text-size-vh);
    }

    .rs-calendar-table-cell-content {
      font-size: var(--small-text-size-vh);
    }
    
    /* Style for disabled dates */
    .rs-calendar-table-cell-disabled .rs-calendar-table-cell-content {
      color: #ccc !important;
      background: none !important;
      cursor: not-allowed;
    }
  `;

  return (
    <>
      <style>{customStyles}</style>
      <RSuiteDatePicker
        format="dd.MM.yyyy"
        onChange={handleChange}
        open={open}
        onOpen={handleOpen}
        onClean={handleClean}
        onClose={handleClose}
        {...(previousDatesDisbaled ? { shouldDisableDate } : {})}
        value={
          value && value !== "null"
            ? moment(value).utc().local().toDate()
            : null
        }
        placeholder={placeholder}
      />
    </>
  );
};

export default memo(DatePicker);
