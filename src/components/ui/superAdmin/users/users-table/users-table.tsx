import { useState, useEffect } from "react";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { useRouter } from "next/navigation";
import {
  User_Object_Type,
  GetAllUsers_Api_Response_Type,
} from "@/services/dashboard/superAdmin/uers/users.type";
import PaginationComponent from "@/components/global/pagination/pagination";
import moment from "moment";
import styles from "./user-table.module.css";
// import CircularProgress from "@mui/material/CircularProgress";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";

interface UsersTablesProps {
  data?: User_Object_Type[];
  handleDeactivateModal: any;
  handleDeleteModal: any;
  handleEditModal?: any;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  rowsPerPage?: number;
  isLoading?: boolean;
}

const headData: { id: number; name: string; width: string }[] = [
  { id: 1, name: "Profile", width: "24%" },
  { id: 2, name: "User Type", width: "14%" },
  { id: 3, name: "Email Address", width: "22%" },
  { id: 4, name: "Date", width: "12%" },
  { id: 5, name: "Status", width: "6%" },
  { id: 6, name: "Is_synced", width: "15%" },
  { id: 7, name: "Actions", width: "13%" },
];

export default function UsersTable({
  currentPage,
  totalPages,
  totalCount,
  data,
  handleDeactivateModal,
  handleDeleteModal,
  handleEditModal,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  isLoading,
}: UsersTablesProps) {
  // console.log(data);
  const router = useRouter();

  return (
    <>
      <div className={styles.tableBox}>
        <div className={styles.tableHead}>
          {headData.map((item) => (
            <div
              className={styles.tableHeadCell}
              key={item.id}
              style={{ width: `${item.width}` }}
            >
              {item.name}
            </div>
          ))}
        </div>

        {isLoading ? (
          <LoadingBox />
        ) : !data || data.length === 0 ? (
          <ErrorBox />
        ) : (
          <Table
            sx={{
              display: "block !important",
              flex: "0 1 calc(100% - 10px)",
              minHeight: "0px",
              background: "transparent !important",
              position: "relative !important",
              border: "none !important",
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
            <TableBody className={styles.tableBody}>
              {data?.map((item: User_Object_Type) => {
                const {
                  id,
                  profileImageUrl,
                  name,
                  roleId,
                  email,
                  status,
                  createdAt,
                  isSync,
                  pseudo_name,
                } = item;

                return (
                  <TableRow key={id}>
                    <TableCell
                      width={headData[0]?.width}
                      className={styles.profileCell}
                    >
                      <span className={styles.imageBox}>
                        <Image
                          src={profileImageUrl || "/assets/images/demmyPic.png"}
                          alt={name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </span>
                      <span className={styles.nameBox}>
                        <span
                          style={{ marginLeft: "20px", width: "100%" }}
                        >{`${name
                          .trim()
                          .split(" ")
                          .slice(0, 2)
                          .join(" ")}`}</span>
                        <span
                          style={{ marginLeft: "20px", width: "100%" }}
                        >{`${pseudo_name}`}</span>
                      </span>
                    </TableCell>
                    <TableCell width={headData[1]?.width}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "70%",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          color:
                            roleId === 1
                              ? "#653838"
                              : roleId === 2
                              ? "#653838"
                              : roleId === 3
                              ? "#286320"
                              : roleId === 4
                              ? "#2D2D2D"
                              : roleId === 5
                              ? "#2F3282"
                              : "#653838",
                          backgroundColor:
                            roleId === 1
                              ? "#FFACAC"
                              : roleId === 2
                              ? "#FFACAC"
                              : roleId === 3
                              ? "#96EFCF"
                              : roleId === 4
                              ? "#FFFAA0"
                              : roleId === 5
                              ? "#DBDCFF"
                              : "#FFACAC",
                        }}
                      >
                        {roleId === 1
                          ? "Super Admin"
                          : roleId === 2
                          ? "Admin"
                          : roleId === 3
                          ? "Student"
                          : roleId === 4
                          ? "Parent"
                          : roleId === 5
                          ? "Teacher"
                          : roleId === 6
                          ? "Counsellor"
                          : "Unknown"}
                      </div>
                    </TableCell>
                    <TableCell width={headData[2]?.width}>{email}</TableCell>
                    <TableCell width={headData[3]?.width}>
                      {item?.createdAt
                        ? moment.utc(createdAt).local().format("Do-MMM-YYYY")
                        : "N/A"}
                    </TableCell>
                    <TableCell width={headData[4]?.width}>
                      <div
                        style={{
                          padding: "10px",
                          borderRadius: "100%",
                          backgroundColor:
                            status === true ? " #28a745" : "#D32121",
                        }}
                      ></div>
                    </TableCell>
                    <TableCell width={headData[5]?.width}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "70%",
                          padding: "5px 10px",
                          borderRadius: "5px",
                          color: isSync === true ? "#0f5132" : "#842029",
                          textAlign: "center",
                          backgroundColor:
                            isSync === true ? " #d1e7dd" : "#f8d7da",
                        }}
                      >
                        {isSync === true ? "Synced" : "Not Synced"}
                      </div>
                    </TableCell>
                    <TableCell width={headData[6]?.width}>
                      <div className={styles.iconsContainer}>
                        <span
                          className={styles.iconBox}
                          onClick={(e: any) => handleEditModal(e, item)}
                        >
                          <Image
                            src="/assets/svgs/edit.svg"
                            alt="edit"
                            width={0}
                            height={0}
                            style={{
                              width: "var(--normal-text-size)",
                              height: "var(--normal-text-size)",
                            }}
                          />
                        </span>

                        <span
                          className={styles.iconBox}
                          onClick={(e: any) => handleDeactivateModal(e, id)}
                        >
                          <Image
                            src="/assets/svgs/active.svg"
                            alt="edit"
                            width={0}
                            height={0}
                            style={{
                              width: "var(--normal-text-size)",
                              height: "var(--normal-text-size)",
                            }}
                          />
                        </span>
                        <span
                          className={styles.iconBox}
                          onClick={(e: any) => handleDeleteModal(e, id)}
                        >
                          <Image
                            src="/assets/svgs/delete.svg"
                            alt="delete"
                            width={0}
                            height={0}
                            style={{
                              width: "var(--normal-text-size)",
                              height: "var(--normal-text-size)",
                            }}
                          />
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
        <PaginationComponent
          totalPages={totalPages}
          page={currentPage || 0}
          rowsPerPage={rowsPerPage || 0}
          totalEntries={totalCount || 0}
          onPageChange={handleChangePage}
          rowsPerPageChange={handleChangeRowsPerPage}
          dropDownValues={[50, 100, 200]}
        />
      </div>
    </>
  );
}
