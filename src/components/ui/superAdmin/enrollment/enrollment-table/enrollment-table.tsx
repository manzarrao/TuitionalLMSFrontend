import { useState, useEffect, useMemo, CSSProperties } from "react";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/components/global/pagination/pagination";
import classes from "./enrollment.module.css";
import moment from "moment";
import BasicSwitches from "@/components/global/toggle-button/toggle-button";
import { useAppSelector } from "@/lib/store/hooks/hooks";
import { ROLE_IDS, ROLE_NAMES } from "@/const/dashboard/role_ids_names";

interface Column {
  id: number;
  name: string;
  width: string;
}

interface ColumnWidths {
  [key: string]: Column[];
}

const columnWidths: ColumnWidths = {
  teacher: [
    { id: 1, name: "Tutor Profile", width: "20%" },
    { id: 2, name: "Student Profile", width: "20%" },
    { id: 3, name: "Subjects", width: "15%" },
    { id: 4, name: "Curriculum", width: "15%" },
    { id: 5, name: "Date", width: "15%" },
    { id: 6, name: "Session Rate", width: "10%" },
    { id: 7, name: "Break", width: "10%" },
  ],
  superAdmin: [
    { id: 1, name: "Tutor Profile", width: "16%" },
    { id: 2, name: "Student Profile", width: "18%" },
    { id: 3, name: "Subjects", width: "13%" },
    { id: 4, name: "Curriculum", width: "13%" },
    { id: 5, name: "Date", width: "10%" },
    { id: 6, name: "Session Rate", width: "10%" },
    { id: 7, name: "Break", width: "10%" },
    { id: 8, name: "Actions", width: "10%" },
  ],
  // Admin columns - similar to superAdmin but can be customized
  admin: [
    { id: 1, name: "Tutor Profile", width: "16%" },
    { id: 2, name: "Student Profile", width: "18%" },
    { id: 3, name: "Subjects", width: "13%" },
    { id: 4, name: "Curriculum", width: "13%" },
    { id: 5, name: "Date", width: "10%" },
    { id: 6, name: "Session Rate", width: "10%" },
    { id: 7, name: "Break", width: "10%" },
    { id: 8, name: "Actions", width: "10%" },
  ],
  // Student columns - focused on relevant information for students
  student: [
    { id: 1, name: "Tutor Profile", width: "20%" },
    { id: 2, name: "Student Profile", width: "20%" },
    { id: 3, name: "Subjects", width: "15%" },
    { id: 4, name: "Curriculum", width: "15%" },
    { id: 5, name: "Date", width: "15%" },
    { id: 6, name: "Session Rate", width: "10%" },
    { id: 7, name: "Break", width: "10%" },
  ],
};

interface EnrollmentTablesProps {
  data: any;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  rowsPerPage?: number;
  handleDeleteModal?: any;
  handleEditModal?: any;
  handleInstantClassModal?: any;
  handleSwitch?: any;
  breakLoading?: boolean;
  inlineStyling?: CSSProperties;
}

export default function EnrollmentTable({
  data,
  currentPage,
  totalPages,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  handleDeleteModal,
  handleEditModal,
  handleInstantClassModal,
  breakLoading,
  handleSwitch,
  inlineStyling,
}: EnrollmentTablesProps) {
  const { roleId } = useAppSelector((state) => state?.user?.user!);

  const roleName = useMemo(() => ROLE_NAMES[roleId], [roleId]);

  const headData = useMemo(
    () => columnWidths[roleName] || columnWidths.student,
    [roleName]
  );

  const router = useRouter();
  const [breakId, setBreakId] = useState();

  // Check if user can edit the enrollment
  const canEdit = useMemo(
    () => roleId === ROLE_IDS.SUPER_ADMIN || roleId === ROLE_IDS.ADMIN,
    [roleId]
  );

  // Check if user can toggle break status
  const canToggleBreak = useMemo(
    () => roleId === ROLE_IDS.SUPER_ADMIN || roleId === ROLE_IDS.ADMIN,
    [roleId]
  );

  // Check if row is clickable to navigate to details
  const isRowClickable = useMemo(
    () => roleId === ROLE_IDS.SUPER_ADMIN || roleId === ROLE_IDS.ADMIN,
    [roleId]
  );

  const handleRoute = (id: number, event: React.MouseEvent) => {
    if (!isRowClickable) return;

    const targetPath = `/${roleName}/enrollment-details/${id}`;

    if (event.ctrlKey || event.metaKey) {
      window.open(targetPath, "_blank");
    } else {
      router.push(targetPath);
    }
  };

  // Get the appropriate rate based on role
  const getRate = (item: any) => {
    if (roleId === ROLE_IDS.TEACHER) {
      return item.tutor_hourly_rate ?? "No Show";
    }
    return item.hourly_rate ?? "No Show";
  };

  return (
    <div className={classes.tableBox} style={inlineStyling}>
      <div className={classes.tableHead}>
        {headData?.map((item: Column) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: item.width }}
          >
            {item.name}
          </div>
        ))}
      </div>

      <Table
        sx={{
          display: "block !important",
          flex: "0 1 calc(100% - 10px)",
          minHeight: "0",
          background: "transparent !important",
          position: "relative !important",
          border: "none !important",
          userSelect: "none !important",
          overflowY: "auto !important",
          overflowX: "hidden !important",
          padding: "5px 10px !important",
          "&::-webkit-scrollbar": {
            width: "5px !important",
            margin: "12px !important",
            position: "relative !important",
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
        }}
      >
        <TableBody
          sx={{
            display: "block !important",
            borderRadius: "10px",
            border: "1px solid #d4d4d4",
            position: "relative",
          }}
          className={classes.tableBody}
        >
          {data?.map((item: any, indx: number) => {
            const {
              createdAt,
              id,
              tutor,
              studentsGroups,
              subject,
              curriculum,
              on_break,
            } = item;

            return (
              <TableRow
                key={indx}
                onClick={
                  isRowClickable ? (event) => handleRoute(id, event) : undefined
                }
                sx={{ cursor: isRowClickable ? "pointer" : "default" }}
              >
                {/* Tutor Profile - shown for all roles */}
                <TableCell align="left" width={headData[0].width}>
                  <span className={classes.imageBox}>
                    <Image
                      src={
                        tutor?.profileImageUrl || "/assets/images/demmyPic.png"
                      }
                      alt={tutor?.name ?? "Tutor"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </span>
                  <p style={{ marginLeft: "10px", width: "80%" }}>
                    {tutor?.name?.trim()?.split(" ")?.slice(0, 2)?.join(" ") ||
                      "No Show"}
                  </p>
                </TableCell>

                <TableCell align="left" width={headData[1].width}>
                  <div className={classes.studentsBox}>
                    <div className={classes.imagesBox}>
                      {studentsGroups
                        ?.slice(0, 2)
                        .map((student: any, index: number) => (
                          <div className={classes.imageBox} key={index}>
                            <Image
                              src={
                                student?.user?.profileImageUrl ||
                                "/assets/images/demmyPic.png"
                              }
                              alt={student?.user?.name ?? "Student"}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                    </div>
                    <p>
                      {studentsGroups?.[0]?.user?.name
                        .trim()
                        .split(" ")
                        .slice(0, 1)
                        .join(" ") || "No Show"}
                      {studentsGroups?.[1] &&
                        `, ${studentsGroups[1].user.name
                          .trim()
                          .split(" ")
                          .slice(0, 1)
                          .join(" ")}`}
                    </p>
                    {studentsGroups?.length > 2 && (
                      <p>+{studentsGroups.length - 2} more</p>
                    )}
                  </div>
                </TableCell>

                <TableCell
                  align="left"
                  width={headData[2].width}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {subject?.name || "No Show"}
                </TableCell>

                {/* Curriculum - shown for all roles */}
                <TableCell
                  align="left"
                  width={headData[3].width}
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {curriculum?.name || "No Show"}
                </TableCell>

                {/* Date - shown for all roles */}
                <TableCell align="left" width={headData[4].width}>
                  {createdAt
                    ? moment.utc(createdAt).local().format("DD-MMM-YYYY")
                    : "N/A"}
                </TableCell>

                {/* Session Rate - shown for all roles */}
                <TableCell align="left" width={headData[5].width}>
                  AED {getRate(item)}
                </TableCell>

                <TableCell align="left" width={headData[6].width}>
                  {breakLoading && breakId === id ? (
                    <div className={classes.smallLoader}>
                      <CircularProgress className={classes.smallLoaderChild} />
                    </div>
                  ) : (
                    <BasicSwitches
                      value={on_break}
                      handleToggle={
                        canToggleBreak
                          ? (e: any) => {
                              setBreakId(id);
                              return handleSwitch(e, id, {
                                on_break: on_break === false ? true : false,
                              });
                            }
                          : undefined
                      }
                    />
                  )}
                </TableCell>

                {/* Actions column - only for admin and superAdmin */}
                {(roleId === ROLE_IDS.SUPER_ADMIN ||
                  roleId === ROLE_IDS.ADMIN) && (
                  <TableCell align="left" width={headData[7]?.width}>
                    <span className={classes.iconsContainer}>
                      <span
                        className={classes.iconBox}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantClassModal(e, item);
                        }}
                      >
                        <Image
                          src="/assets/svgs/setting.svg"
                          alt="instant class"
                          width={0}
                          height={0}
                          style={{
                            width: "var(--medium-text-size-vh)",
                            height: "var(--medium-text-size-vh)",
                          }}
                        />
                      </span>
                      <span
                        className={classes.iconBox}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModal(e, item);
                        }}
                      >
                        <Image
                          src="/assets/svgs/edit.svg"
                          alt="edit"
                          width={0}
                          height={0}
                          style={{
                            width: "var(--medium-text-size-vh)",
                            height: "var(--medium-text-size-vh)",
                          }}
                        />
                      </span>
                      <span
                        className={classes.iconBox}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModal(e, id);
                        }}
                      >
                        <Image
                          src="/assets/svgs/delete.svg"
                          alt="delete"
                          width={0}
                          height={0}
                          style={{
                            width: "var(--medium-text-size-vh)",
                            height: "var(--medium-text-size-vh)",
                          }}
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

      <PaginationComponent
        totalPages={totalPages}
        page={currentPage || 0}
        rowsPerPage={rowsPerPage || 0}
        totalEntries={totalCount || 0}
        onPageChange={handleChangePage}
        rowsPerPageChange={handleChangeRowsPerPage}
        dropDownValues={[50, 75, 100]}
      />
    </div>
  );
}
