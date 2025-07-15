import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter } from "next/navigation";
import PaginationComponent from "@/components/global/pagination/pagination";
import classes from "./billing-table.module.css";
import moment from "moment";
import { imageUrl } from "@/utils/helpers/image-url-parsing";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";

interface BillingTablesProps {
  data: any;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  rowsPerPage?: number;
  handleGetInvoice?: any;
  invoiceLoading?: boolean;
  handleEditModal?: any;
  isLoading?: boolean;
  handleSwitch?: any;
}

const headData = [
  { id: 1, name: "Students Profile", width: "25%" },
  { id: 2, name: "Current Balance", width: "25%" },
  { id: 4, name: "Date", width: "25%" },
  { id: 8, name: "Actions", width: "20%" },
];

export default function BillingTable({
  data,
  currentPage,
  totalPages,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  isLoading,
  handleGetInvoice,
  invoiceLoading,
  handleEditModal,
}: BillingTablesProps) {
  const [invoiceId, setInvoiceId] = useState();
  return (
    <div className={classes.tableBox}>
      <div className={classes.tableHead}>
        {headData?.map((item) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: item.width }}
          >
            {item?.name}
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
              return (
                <TableRow
                  key={indx}
                  //   onClick={() => router.push(`enrollment-details/${id}`)}
                >
                  <TableCell
                    align="left"
                    width="25%"
                    className={classes.userProfile}
                  >
                    <div className={classes.imageBox}>
                      <Image
                        src={imageUrl(item?.user?.profileImageUrl)}
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <span>
                      {item?.user?.name ? item?.user?.name : "No Show"}
                    </span>{" "}
                  </TableCell>
                  <TableCell
                    align="left"
                    width="25%"
                    className={classes.userProfile}
                  >
                    {item?.current_balance ? item?.current_balance : "0"}
                  </TableCell>
                  <TableCell align="left" width="25%">
                    {item?.createdAt
                      ? moment
                          .utc(item?.createdAt)
                          .local()
                          .format("Do-MMM-YYYY")
                      : "No Show"}
                  </TableCell>
                  <TableCell align="left" width="10%">
                    {invoiceLoading && invoiceId === item?.user_id ? (
                      <LoadingBox
                        loaderStyling={{
                          height: "4vh !important",
                          width: "4vh !important",
                        }}
                        inlineStyling={{ justifyContent: "flex-start" }}
                      />
                    ) : (
                      <div className={classes.iconsContainer}>
                        <span
                          className={classes.iconBox}
                          onClick={(e: any) => {
                            setInvoiceId(item?.user_id);
                            handleGetInvoice(e, item?.user_id);
                          }}
                        >
                          <Image
                            src="/assets/svgs/menuBarIcons/invoice.svg"
                            alt="delete"
                            width={0}
                            height={0}
                            style={{
                              width: "var(--regular-text-size-vh)",
                              height: "var(--regular-text-size-vh)",
                            }}
                          />
                        </span>
                      </div>
                    )}
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
  );
}
