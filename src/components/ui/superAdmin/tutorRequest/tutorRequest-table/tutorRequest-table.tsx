import { useState, useEffect, memo, useMemo, useCallback } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Onboarding_Requests_Parsed,
  JsonData,
  TutorOnboarding_Parsed_Response,
} from "@/services/dashboard/superAdmin/tutor-request/tutor-request.types";
import PaginationComponent from "@/components/global/pagination/pagination";
import styles from "./tutorRequest-table.module.css";
import moment from "moment";
import { useParams } from "next/navigation";

const headData: { id: number; name: string; width: string }[] = [
  { id: 1, name: "Profile", width: "20%" },
  { id: 2, name: "Email Address", width: "22.5%" },
  { id: 3, name: "Country", width: "15%" },
  { id: 4, name: "Subjects", width: "27.5%" },
  { id: 5, name: "Date", width: "15%" },
  { id: 6, name: "Status", width: "15%" },
];

interface CustomizedTablesProps {
  data: any;
}

const TutorRequestTable = ({ data }: CustomizedTablesProps) => {
  const router = useRouter();
  const { role } = useParams();

  // Combine `page` and `paginatedUsers` in a single state
  const [pagination, setPagination] = useState({
    page: 1,
    rowsPerPage: 10,
  });

  const handleUser = useCallback(
    (id: number, event: React.MouseEvent) => {
      const targetPath = `/${role}/tutor-profile/${id}`;
      if (event.ctrlKey || event.metaKey) {
        window.open(targetPath, "_blank");
      } else {
        router.push(targetPath);
      }
    },
    [router, role]
  );

  const handleChangePage = useCallback(
    (event: React.ChangeEvent<unknown>, newPage: number) => {
      setPagination((prev) => ({
        ...prev,
        page: newPage,
      }));
    },
    []
  );

  const handleChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      setPagination({
        page: 1,
        rowsPerPage: parseInt(event.target.value, 10),
      });
    },
    []
  );

  // Memoize paginated data to only recalculate when dependencies change
  const paginatedUsers = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.rowsPerPage;
    const endIndex = startIndex + pagination.rowsPerPage;
    return data?.slice(startIndex, endIndex) || [];
  }, [data, pagination.page, pagination.rowsPerPage]);

  return (
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

      {data === undefined && data?.length === 0 ? (
        <div className={styles.errorBox}>
          <h1>No Data Found!</h1>
        </div>
      ) : (
        <Table
          sx={{
            display: "block !important",
            flex: "0 1 calc(100% - 10px)",
            minHeight: 0,
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
            className={styles.tableBody}
          >
            {paginatedUsers?.map((item: Onboarding_Requests_Parsed) => {
              const userData: JsonData = item?.parsed_jsonData;
              console.log(userData);
              return (
                <TableRow
                  key={item.id}
                  onClick={(event) => handleUser(item.id, event)}
                >
                  <TableCell width={headData[0].width}>
                    <span className={styles.imageBox}>
                      <Image
                        src={
                          userData?.profileImage ||
                          "/assets/images/demmyPic.png"
                        }
                        alt={`${userData?.firstName} ${userData?.lastName}`}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </span>
                    <p
                      style={{ marginLeft: "20px", width: "70%" }}
                    >{`${userData?.firstName
                      .split(" ")
                      .slice(0, 2)
                      .join(" ")}`}</p>
                  </TableCell>
                  <TableCell
                    className={styles.emailCell}
                    width={headData[1].width}
                  >
                    {userData?.email}
                  </TableCell>
                  <TableCell width={headData[2].width}>
                    {userData.country}
                  </TableCell>
                  <TableCell
                    width={headData[3].width}
                    sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}
                  >
                    {userData.subjects.map((subject: any, index: number) => (
                      <span key={index}>{subject?.name}</span>
                    ))}
                  </TableCell>
                  <TableCell width={headData[4].width}>
                    {item?.createdAt
                      ? moment
                          .utc(item?.createdAt)
                          .local()
                          .format("Do-MMM-YYYY")
                      : "N/A"}
                  </TableCell>
                  <TableCell width={headData[5].width}>
                    <p
                      style={{
                        width: "max-content",
                        padding: "5px 10px",
                        borderRadius: "5px",
                        color:
                          item?.status === "Pending"
                            ? "#716E3D"
                            : item?.status === "Approved"
                            ? "#286320"
                            : "#653838",
                        backgroundColor:
                          item?.status === "Pending"
                            ? "#FFFAA0"
                            : item?.status === "Approved"
                            ? "#A0FFC0"
                            : "#FFACAC",
                      }}
                    >
                      {item?.status || "Rejected"}
                    </p>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
      <PaginationComponent
        page={pagination.page}
        rowsPerPage={pagination.rowsPerPage}
        totalEntries={(data?.length as number) || 0}
        onPageChange={handleChangePage}
        rowsPerPageChange={handleChangeRowsPerPage}
        dropDownValues={[10, 15, 20]}
      />
    </div>
  );
};

export default memo(TutorRequestTable);
