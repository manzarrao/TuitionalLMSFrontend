"use client";
import React, { memo } from "react";
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import moment from "moment";

interface FilterProps {
  changeFn?: (value: any) => void;
  inlineStyling?: React.CSSProperties;
  value?: string[] | any;
  width?: string;
  flex?: number;
}

const FilterByDate: React.FC<FilterProps> = memo(
  ({ changeFn, width, value, inlineStyling }) => {
    const [open, setOpen] = React.useState<boolean>(false);

    const handleChange = (value: any) => {
      if (value === null || value.length !== 2 || value[1] === null) {
        changeFn?.(value);
      } else {
        const utcFormattedDates = value?.map((date: Date) =>
          moment.utc(date).format("YYYY-MM-DDTHH:mm:ss[Z]")
        );

        changeFn?.(utcFormattedDates);
      }
    };

    return (
      <>
        <style>
          {`
    .rs-picker-toggle-wrapper {
      border-radius: 10px;
      background: transparent;
      overflow: hidden;
      width: ${width ? width : "100%"};
      height: 5.5vh;
      max-height: 50px;
      min-height: 35px;
      box-shadow: 0px -1px 10px 0px rgba(56, 182, 255, 0.3) inset;
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
      font-size: var(--text-size) !important;
    }

    .rs-picker-popup.rs-picker-popup-daterange {
      z-index: 1400;
    }

    .rs-btn-close{
      display:flex;
      justify-content:center;
      align-items:center;
    }
    .rs-btn-close > svg {
      font-size:2vh;
    }
  `}
        </style>

        <DateRangePicker
          format="dd.MM.yyyy"
          showHeader={false}
          size="lg"
          placeholder="Filter By Date"
          open={open}
          onOpen={() => setOpen(true)}
          onClose={() => {
            setOpen(false);
          }}
          onChange={handleChange}
          style={{ color: "#000", fontSize: "18px", ...inlineStyling }}
          {...(value && value.length === 2
            ? {
                value: [
                  moment.utc(value[0]).local().toDate(),
                  moment.utc(value[1]).local().toDate(),
                ],
              }
            : {})}
        />
      </>
    );
  }
);

// Add display name for debugging
FilterByDate.displayName = "FilterByDate";

export default FilterByDate;
