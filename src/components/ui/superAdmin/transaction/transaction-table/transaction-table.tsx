import { useState, useCallback, memo, MouseEvent } from "react";
import moment from "moment";
import classes from "./transaction-table.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import PaginationComponent from "@/components/global/pagination/pagination";
import LoadingBox from "@/components/global/loading-box/loading-box";
import {
  DataItem,
  Transaction_Api_FilterOptions,
} from "@/services/dashboard/superAdmin/transactions/transaction.types";
import { getConclusionTypeStyles } from "@/utils/helpers/sessionType-styles";
import SwapVertRoundedIcon from "@mui/icons-material/SwapVertRounded";
interface TransactionsTablesProps {
  data: DataItem[];
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  rowsPerPage?: number;
  handleDeleteModal?: (e: React.MouseEvent, id: number) => void;
  deleteTransactionId?: number | null;
  handleEditModal?: (e: React.MouseEvent, id: number) => void;
  role?: string;
  deleteLoading?: boolean;
  sortBy?: "session_date" | "createdAt";
  setSortBy?: (sortBy: "session_date" | "createdAt") => void;
}

// Constant definitions outside the component
const HEAD_DATA = [
  {
    id: 0,
    name: "User Profile",
    width: "15%",
    sort: false,
    key: "userProfile",
  },
  { id: 1, name: "Info", width: "17.5%", sort: false, key: "info" },
  { id: 2, name: "Date", width: "10%", sort: true, key: "createdAt" },
  {
    id: 3,
    name: "Session Type",
    width: "11%",
    sort: false,
    key: "sessionType",
  },
  {
    id: 4,
    name: "Session Date",
    width: "15%",
    sort: true,
    key: "session_date",
  },
  {
    id: 5,
    name: "Transaction Type",
    width: "10%",
    sort: false,
    key: "transactionType",
  },
  { id: 6, name: "Amount", width: "7.5%", sort: false, key: "amount" },
  {
    id: 7,
    name: "Remaining ",
    width: "7.5%",
    sort: false,
    key: "remainingBalance",
  },
  { id: 8, name: "Actions", width: "6.5%", sort: false, key: "actions" },
];

const TABLE_STYLES = {
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
};

const TABLE_BODY_STYLES = {
  display: "block !important",
  borderRadius: "10px",
  border: "1px solid #d4d4d4",
  position: "relative",
};

const DEFAULT_PROFILE_IMAGE = "/assets/images/static/demmyPic.png";

const ICON_STYLES = {
  width: "var(--normal-text-size) !important",
  height: "var(--normal-text-size) !important",
};

// Helper components
const UserProfile = memo(({ item }: { item: DataItem }) => {
  const isStudent =
    item?.user_id === item?.enrollment?.studentsGroups?.[0]?.user?.id;

  return (
    <div className={classes.userProfile}>
      <span className={classes.imageBox}>
        <Image
          src={item?.transactions?.profileImageUrl || DEFAULT_PROFILE_IMAGE}
          alt={item?.transactions?.name || "User"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </span>
      <span className={classes.profileContainer}>
        {item?.transactions?.name
          ? item?.transactions?.name.trim()?.split(" ").slice(0, 2).join(" ")
          : "No Show"}

        {item?.session_id && (
          <span
            className={classes.role}
            style={{
              backgroundColor: isStudent ? "#E0F7FA" : "#FFF3E0",
              color: isStudent ? "#00796B" : "#E65100",
            }}
          >
            {isStudent ? "Student" : "Teacher"}
          </span>
        )}
      </span>
    </div>
  );
});

UserProfile.displayName = "UserProfile";

const InfoCell = memo(({ item }: { item: DataItem }) => {
  if (item?.deletedAt !== null) return "Deleted";
  if (!item?.session_id) return "Manually added";

  const isStudent =
    item?.user_id === item?.enrollment?.studentsGroups?.[0]?.user?.id;
  const nameToShow = isStudent
    ? item?.enrollment?.tutor?.name
    : item?.enrollment?.studentsGroups?.[0]?.user?.name;

  const formattedName =
    nameToShow?.trim()?.split(" ")?.slice(0, 1)?.join(" ") || "No Show";

  return (
    <>
      {formattedName}
      &nbsp;&nbsp;
      <span
        style={{
          height: "100%",
          width: "2px",
          background:
            "linear-gradient(180deg, #e6f4f4 0%, #38b6ff 50%, #e2f3f1 100%)",
        }}
      ></span>
      &nbsp;&nbsp;
      {item?.enrollment?.subject?.name || "No Show"}
    </>
  );
});

InfoCell.displayName = "InfoCell";

const TypeBadge = memo(({ type }: { type?: string }) => (
  <span
    style={{
      background: type === "Debit" ? "#F84F31" : "#23C552",
      padding: "5px 10px",
      borderRadius: "5px",
      color: "var(--white-color)",
      width: "50%",
      textAlign: "center",
    }}
  >
    {type || "No Show"}
  </span>
));

TypeBadge.displayName = "TypeBadge";

const SessionType = memo(({ type }: { type?: string }) => (
  <span style={getConclusionTypeStyles(type || "Not Available")}>
    {type || "No Show"}
  </span>
));

TypeBadge.displayName = "SessionType";

function TransactionsTable({
  data,
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage = 50,
  handleDeleteModal,
  role = "admin",
  deleteLoading = false,
  setSortBy,
  sortBy = "session_date",
}: TransactionsTablesProps) {
  const [deleteTransactionIdState, setDeleteTransactionId] = useState<
    number | null
  >(null);
  const router = useRouter();

  // Memoized handlers
  const handleRowClick = useCallback(
    (event: MouseEvent<HTMLElement>, sessionId: number) => {
      if (event.ctrlKey || event.metaKey) {
        window.open(`/${role}/session-details/${sessionId}`, "_blank");
      } else {
        router.push(`/${role}/session-details/${sessionId}`);
      }
    },
    [router, role]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, id?: number) => {
      e.stopPropagation();
      if (id) {
        setDeleteTransactionId(id);
        handleDeleteModal?.(e, id);
      }
    },
    [handleDeleteModal]
  );
  const handleSortClick = useCallback(
    (sort_by: "session_date" | "createdAt") => {
      // Toggle sortBy state between session_date and createdAt
      setSortBy?.(sort_by);
    },
    [setSortBy]
  );

  // Render optimized row
  const renderTableRow = useCallback(
    (item: DataItem) => {
      const formattedDate =
        item?.deletedAt !== null
          ? moment.utc(item.deletedAt).local().format("Do-MMM-YYYY")
          : item?.createdAt
          ? moment.utc(item.createdAt).local().format("Do-MMM-YYYY")
          : "No Show";

      return (
        <TableRow
          key={item?.id}
          onClick={(e) =>
            item?.session_id && handleRowClick(e, item.session_id)
          }
          sx={{ cursor: item?.session_id ? "pointer" : "default" }}
        >
          {/* User Profile */}
          <TableCell align="left" width={HEAD_DATA[0].width}>
            <UserProfile item={item} />
          </TableCell>

          {/* Info */}
          <TableCell align="left" width={HEAD_DATA[1].width}>
            <InfoCell item={item} />
          </TableCell>

          {/* Date */}
          <TableCell align="left" width={HEAD_DATA[2].width}>
            {formattedDate}
          </TableCell>

          {/* Session Type */}
          <TableCell align="left" width={HEAD_DATA[3].width}>
            <SessionType type={item?.sessionTransaction?.conclusion_type} />
          </TableCell>

          {/* Updated at */}
          <TableCell align="left" width={HEAD_DATA[4].width}>
            {item?.session_date !== null
              ? moment
                  .utc(item?.session_date)
                  .local()
                  .format("Do-MMM-YYYY HH:mm a")
              : "No Show"}
          </TableCell>

          {/* Transaction Type */}
          <TableCell align="left" width={HEAD_DATA[5].width}>
            <TypeBadge type={item?.type} />
          </TableCell>

          {/* Amount */}
          <TableCell align="left" width={HEAD_DATA[6].width}>
            {item?.cost ?? "0"}
          </TableCell>

          {/* Remaining Balance */}
          <TableCell align="left" width={HEAD_DATA[7].width}>
            {item?.remaining_balance ?? "0"}
          </TableCell>

          {/* Actions */}
          <TableCell align="left" width={HEAD_DATA[8].width}>
            <span className={classes.iconsContainer}>
              {deleteLoading && deleteTransactionIdState === item?.id ? (
                <LoadingBox
                  loaderStyling={{
                    width: "4vh !important",
                    height: "4vh !important",
                  }}
                />
              ) : (
                <span
                  className={classes.iconBox}
                  onClick={(e) => handleDelete(e, item?.id)}
                >
                  <Image
                    src="/assets/svgs/delete.svg"
                    alt="delete"
                    width={0}
                    height={0}
                    style={ICON_STYLES}
                  />
                </span>
              )}
            </span>
          </TableCell>
        </TableRow>
      );
    },
    [deleteLoading, deleteTransactionIdState, handleDelete, handleRowClick]
  );

  return (
    <div className={classes.tableBox}>
      <div className={classes.tableHead}>
        {HEAD_DATA.map((item) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: item.width, display: "flex", alignItems: "center" }}
          >
            {item.name}
            {item.sort && (
              <SwapVertRoundedIcon
                onClick={() =>
                  item?.key &&
                  handleSortClick(item.key as "session_date" | "createdAt")
                }
                sx={{
                  cursor: "pointer",
                  marginLeft: "5px",
                  color: sortBy === item.key ? "var(--main-color)" : "black",
                  fontSize: "1.2rem",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <Table sx={TABLE_STYLES}>
        <TableBody sx={TABLE_BODY_STYLES} className={classes.tableBody}>
          {data?.map(renderTableRow)}
        </TableBody>
      </Table>

      <PaginationComponent
        totalPages={totalPages}
        page={currentPage}
        rowsPerPage={rowsPerPage}
        totalEntries={totalCount}
        onPageChange={handleChangePage}
        rowsPerPageChange={handleChangeRowsPerPage}
        dropDownValues={[50, 100, 200]}
      />
    </div>
  );
}

export default memo(TransactionsTable);
