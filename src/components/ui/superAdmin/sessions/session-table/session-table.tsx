import { memo, useMemo, useState, useCallback } from "react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import classes from "./session-table.module.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PaginationComponent from "@/components/global/pagination/pagination";
import LoadingBox from "@/components/global/loading-box/loading-box";
import { MinutesToHours } from "@/utils/helpers/convert-minutes-to-hours";
import {
  getConclusionTypeStyles,
  getTagTypeStyles,
} from "@/utils/helpers/sessionType-styles";

// Move type definitions outside component
interface Column {
  id: number;
  name: string;
  width: string;
}

interface ColumnWidths {
  teacher: Column[];
  superAdmin: Column[];
}

interface SessionTablesProps {
  data: any[];
  currentPage: number;
  totalPages: number;
  totalSessions: number;
  rowsPerPage: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  role?: string;
  handleDeleteModal?: any;
  handleReload?: any;
  handleReloadLoading?: boolean;
  inlineStyling?: any;
}

// Extracted StudentDisplay component
interface StudentDisplayProps {
  item: any;
  classes: any;
}

// Define these constants outside the component to prevent recreation on each render
const columnWidths: ColumnWidths = {
  superAdmin: [
    { id: 0, name: "Tutor Profile", width: "18%" },
    { id: 1, name: "Student Profile", width: "20%" },
    { id: 2, name: "Subjects", width: "18%" },
    { id: 3, name: "Date Added", width: "10%" },
    { id: 4, name: "Teacher Duration", width: "10%" },
    { id: 5, name: "Type", width: "12%" },
    { id: 6, name: "Actions", width: "7%" },
    { id: 7, name: "", width: "5%" },
  ],
  teacher: [
    { id: 0, name: "Tutor Profile", width: "20%" },
    { id: 1, name: "Student Profile", width: "25%" },
    { id: 2, name: "Subjects", width: "15%" },
    { id: 3, name: "Date Added", width: "15%" },
    { id: 4, name: "Teacher Duration", width: "10%" },
    { id: 5, name: "Type", width: "15%" },
  ],
};

// Define constant styles
const TABLE_STYLES = {
  display: "block",
  flex: "0 1 calc(100% - 10px)",
  minHeight: "0",
  background: "transparent",
  position: "relative",
  border: "none",
  userSelect: "none",
  overflowY: "auto",
  overflowX: "hidden",
  padding: "5px 10px",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-track": {
    background: "transparent",
    display: "none",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#9c9c9c",
    borderRadius: "6px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#555",
    cursor: "pointer",
  },
};

const TABLE_BODY_STYLES = {
  display: "block !important",
  borderRadius: "10px",
  border: "1px solid #d4d4d4",
  position: "relative",
};

const TUTOR_CELL_STYLES = {
  display: "flex",
  gap: "10px",
  alignItems: "center",
};

const EXTRA_CLASS_STYLES = {
  padding: "5px 10px",
  backgroundColor: "var(--main-color)",
  fontSize: "var(--small-text-size-vh)",
  borderRadius: "5px",
};

const ICON_STYLES = {
  width: "var(--medium-text-size-vh)",
  height: "var(--medium-text-size-vh)",
};

// Default image paths
const DEFAULT_PROFILE_IMAGE = "/assets/images/demmyPic.png";

// Separate component for rendering student display
const StudentDisplay = memo(({ item, classes }: StudentDisplayProps) => {
  // Extract data with nullish coalescing for safety
  const studentsGroups = item?.ClassSchedule?.enrollment?.studentsGroups ?? [];
  const students = item?.students ?? [];
  const isScheduledClass = !!item?.ClassSchedule;

  // Determine which student array to use
  const studentsArray = isScheduledClass ? studentsGroups : students;

  // If no students, return early
  if (!studentsArray.length) {
    return <span>No Show</span>;
  }

  // Get first student data
  const firstStudent = studentsArray[0];
  const firstStudentName =
    firstStudent?.user?.name?.trim().split(" ").slice(0, 2).join(" ") ||
    "No Show";
  const firstStudentImage =
    firstStudent?.user?.profileImageUrl || DEFAULT_PROFILE_IMAGE;

  // Get second student if available
  const hasSecondStudent = studentsArray.length > 1;
  const secondStudent = hasSecondStudent ? studentsArray[1] : null;
  const secondStudentImage =
    secondStudent?.user?.profileImageUrl || DEFAULT_PROFILE_IMAGE;
  const secondStudentName = secondStudent?.user?.name || "No Show";

  return (
    <div className={classes.studentsBox}>
      <div className={classes.imagesBox}>
        <span className={classes.imageBox}>
          <Image
            src={firstStudentImage}
            alt={firstStudentName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </span>

        {hasSecondStudent && (
          <span className={classes.imageBox}>
            <Image
              src={secondStudentImage}
              alt={secondStudentName}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </span>
        )}
      </div>

      <p>{firstStudentName}</p>

      {studentsArray.length > 2 && <p>+{studentsArray.length - 2} more</p>}
    </div>
  );
});

// Set display name for debugging
StudentDisplay.displayName = "StudentDisplay";

function SessionTable({
  data,
  currentPage,
  totalPages,
  totalSessions,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDeleteModal,
  handleReload,
  handleReloadLoading,
  role = "teacher", // Provide default to avoid undefined
  inlineStyling,
}: SessionTablesProps) {
  const [refreshId, setRefreshId] = useState<number | null>(null);
  const router = useRouter();

  // Memoize the head data based on role
  const headData = useMemo(
    () =>
      columnWidths[role as "teacher" | "superAdmin"] || columnWidths.teacher,
    [role]
  );

  // Memoize route handling function
  const handleRoute = useCallback(
    (id: number, event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) {
        window.open(`/${role}/session-details/${id}`, "_blank");
      } else {
        router.push(`/${role}/session-details/${id}`);
      }
    },
    [router, role]
  );

  // Memoize handlers
  const handleReloadClick = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setRefreshId(id);
      handleReload?.(e, id);
    },
    [handleReload]
  );

  const handleDeleteClick = useCallback(
    (e: React.MouseEvent, id: number) => {
      e.stopPropagation();
      setRefreshId(id);
      handleDeleteModal?.(e, id);
    },
    [handleDeleteModal]
  );

  return (
    <div className={classes.tableBox} style={inlineStyling}>
      {/* Table Header */}
      <div className={classes.tableHead}>
        {headData.map((item) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: item.width }}
          >
            {item.name}
          </div>
        ))}
      </div>

      {/* Table Body */}
      <Table sx={TABLE_STYLES}>
        <TableBody sx={TABLE_BODY_STYLES} className={classes.tableBody}>
          {data?.map((item: any) => {
            return (
              <TableRow
                key={item?.id}
                onClick={
                  role === "superAdmin"
                    ? (event) => handleRoute(item?.id, event)
                    : undefined
                }
              >
                {/* Tutor Profile Cell */}
                <TableCell
                  align="left"
                  width={headData[0].width}
                  sx={TUTOR_CELL_STYLES}
                >
                  <span className={classes.imageBox}>
                    <Image
                      src={
                        item?.tutor?.profileImageUrl || DEFAULT_PROFILE_IMAGE
                      }
                      alt={item?.tutor?.name ?? "Tutor"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </span>
                  <p style={{ marginLeft: "5px", width: "85%" }}>
                    {item?.tutor?.name
                      ?.trim()
                      .split(" ")
                      ?.slice(0, 2)
                      ?.join(" ") || "No Show"}
                    <br />

                    <span style={getTagTypeStyles(item?.tag)}>{item?.tag}</span>
                  </p>
                </TableCell>

                {/* Student Profile Cell - Using the separate component */}
                <TableCell align="left" width={headData[1].width}>
                  <StudentDisplay item={item} classes={classes} />
                </TableCell>

                {/* Subject Cell */}
                <TableCell align="left" width={headData[2].width}>
                  {item?.ClassSchedule?.enrollment?.subject?.name ||
                    item?.sessionEnrollment?.subject?.name ||
                    "No Show"}
                </TableCell>

                {/* Date Added Cell */}
                <TableCell align="left" width={headData[3].width}>
                  {moment(item?.created_at).format("DD-MMM-YYYY") || "No Show"}
                </TableCell>

                {/* Teacher Duration Cell */}
                <TableCell align="left" width={headData[4].width}>
                  {item?.conclusion_type === "No Show"
                    ? "No Show"
                    : MinutesToHours(item?.tutor_class_time) || "No Show"}
                </TableCell>

                {/* Type Cell */}
                <TableCell align="left" width={headData[5].width}>
                  <span style={getConclusionTypeStyles(item?.conclusion_type)}>
                    {item?.conclusion_type || "No Show"}
                  </span>
                </TableCell>

                {/* Actions Cell - Only for superAdmin */}
                {role === "superAdmin" && (
                  <TableCell align="left" width={headData[6].width}>
                    <span className={classes.iconsContainer}>
                      {handleReloadLoading && refreshId === item?.id ? (
                        <LoadingBox
                          loaderStyling={{
                            width: "3vh !important",
                            height: "3vh !important",
                          }}
                        />
                      ) : (
                        <span
                          className={classes.iconBox}
                          onClick={(e) => handleReloadClick(e, item?.id)}
                        >
                          <Image
                            src="/assets/svgs/reload.svg"
                            alt="reload"
                            width={0}
                            height={0}
                            style={ICON_STYLES}
                          />
                        </span>
                      )}
                      <span
                        className={classes.iconBox}
                        onClick={(e) => handleDeleteClick(e, item?.id)}
                      >
                        <Image
                          src="/assets/svgs/delete.svg"
                          alt="delete"
                          width={0}
                          height={0}
                          style={ICON_STYLES}
                        />
                      </span>
                    </span>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Pagination */}
      <PaginationComponent
        totalPages={totalPages}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        totalEntries={totalSessions || 0}
        onPageChange={handleChangePage}
        rowsPerPageChange={handleChangeRowsPerPage}
        dropDownValues={[50, 75, 100]}
      />
    </div>
  );
}

export default memo(SessionTable);
//
