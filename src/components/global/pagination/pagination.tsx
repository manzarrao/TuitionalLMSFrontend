import React, { memo, CSSProperties } from "react";
import Pagination from "@mui/material/Pagination";
import styles from "./pagination.module.css";

interface PaginationComponentProps {
  page: number;
  rowsPerPage: number;
  totalEntries: number;
  dropDownValues: string[] | number[];
  onPageChange: (event: React.ChangeEvent<unknown>, newPage: number) => void;
  totalPages?: number;
  rowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  inlineStyles?: CSSProperties;
}

function PaginationComponent({
  totalPages,
  page,
  rowsPerPage,
  totalEntries,
  dropDownValues,
  onPageChange,
  rowsPerPageChange,
  inlineStyles,
}: PaginationComponentProps) {
  return (
    <div className={styles.pagination} style={inlineStyles}>
      <div>
        {`Showing ${(page - 1) * rowsPerPage + 1} to ${Math.min(
          page * rowsPerPage,
          totalEntries
        )} of `}
        &nbsp;
        <span className={styles.entries}>{totalEntries}</span>
        &nbsp;entries.
      </div>

      <Pagination
        count={
          (totalPages && totalPages) || Math.ceil(totalEntries / rowsPerPage)
        }
        page={page}
        onChange={onPageChange}
        shape="rounded"
        sx={{
          ".css-10w330c-MuiButtonBase-root-MuiPaginationItem-root:hover": {
            backgroundColor: "#transparent",
          },
          ".css-10w330c-MuiButtonBase-root-MuiPaginationItem-root.Mui-selected":
            {
              color: "#fff",
              backgroundColor: "var(--main-color)",
              border: "1px solid var(--main-color)",
            },
          ".css-10w330c-MuiButtonBase-root-MuiPaginationItem-root.Mui-disabled":
            {
              color: "var(--text-color)",
            },
        }}
      />
      <div className={styles.dropDownBox}>
        Show{" "}
        <select
          value={rowsPerPage}
          onChange={rowsPerPageChange}
          className={styles.dropdown}
        >
          {dropDownValues?.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default memo(PaginationComponent);
