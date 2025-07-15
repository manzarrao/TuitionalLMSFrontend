import React, { FC, memo } from "react";
import { toast } from "react-toastify";
import classes from "./table.module.css";
import moment from "moment";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Invoice } from "@/services/dashboard/superAdmin/invoices/invoices.types";
import PaginationComponent from "@/components/global/pagination/pagination";
import ErrorBox from "@/components/global/error-box/error-box";

interface Column {
  id: number;
  name: string;
  width: string;
}

interface TtableProps {
  invoice: Invoice[];
  handlePaidModal: (id?: number, amount?: number) => void;
  handleDeleteModal: (id?: number) => void;
  currentPage?: number;
  totalPages?: number;
  totalCount?: number;
  handleChangePage?: any;
  handleChangeRowsPerPage?: any;
  rowsPerPage?: number;
}

const headData: Column[] = [
  { id: 1, width: "15%", name: "Student Name" },
  { id: 2, width: "15%", name: "Issue Date" },
  { id: 3, width: "15%", name: "Due" },
  { id: 4, width: "10%", name: "Invoice ID" },
  { id: 5, width: "10%", name: "Balance" },
  { id: 6, width: "10%", name: "Paid" },
  { id: 7, width: "10%", name: "Status" },
  { id: 8, width: "15%", name: "Actions" },
];

const Ttable: FC<TtableProps> = ({
  invoice = [],
  handlePaidModal,
  handleDeleteModal,
  totalPages,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  currentPage,
}) => {
  const handleDownloadPdf = (pdfUrl: string, fileName: string) => {
    window.open(pdfUrl, "_blank");
  };

  return (
    <div className={classes.table}>
      <div className={classes.tableHead}>
        {headData.map((item, indx) => (
          <div
            className={classes.tableHeadCell}
            key={item.id}
            style={{ width: headData[indx]?.width }}
          >
            {item.name}
          </div>
        ))}
      </div>
      <div className={classes.tableBody}>
        {invoice?.length > 0 ? (
          invoice?.map((item) => (
            <div className={classes.tableRow} key={item.id}>
              <div
                className={classes.tableColumn}
                style={{ width: headData[0]?.width }}
              >
                {item?.userInvoice?.name
                  .trim()
                  .split(" ")
                  .slice(0, 2)
                  .join(" ") || "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[1]?.width }}
              >
                {item?.createdAt
                  ? moment.utc(item.createdAt).local().format("Do-MMM-YYYY")
                  : "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[2]?.width }}
              >
                {item?.due_date
                  ? moment.utc(item.due_date).local().format("Do-MMM-YYYY")
                  : "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[3]?.width }}
              >
                {item?.id || "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[4]?.width }}
              >
                {item?.amount || "0"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[5]?.width }}
              >
                {item?.amount_paid || "0"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[6]?.width }}
              >
                <span
                  style={{
                    background:
                      item?.status === "PENDING"
                        ? "orange"
                        : item?.status === "PAID"
                        ? "rgba(81, 184, 147, 0.18)"
                        : item?.status === "OVERDUE"
                        ? "rgba(248, 106, 106, 0.37)"
                        : "gray",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    color:
                      item?.status === "PENDING"
                        ? "white"
                        : item?.status === "PAID"
                        ? "#098B34"
                        : item?.status === "OVERDUE"
                        ? "#C5371B"
                        : "gray",
                  }}
                >
                  {item?.status
                    ? item?.status?.charAt(0).toUpperCase() +
                      item?.status?.slice(1).toLowerCase()
                    : "No Show"}
                </span>
              </div>
              <div
                className={classes.tableColumn}
                style={{
                  display: "flex",
                  gap: "10px",
                  width: headData[7]?.width,
                }}
              >
                <span
                  className={classes.iconBox}
                  onClick={() => {
                    if (item.pdf_content) {
                      handleDownloadPdf(
                        item.pdf_content,
                        `invoice_${item.id}.pdf`
                      );
                    } else {
                      toast.error("No PDF content available for this invoice.");
                    }
                  }}
                >
                  <FileDownloadOutlinedIcon />
                </span>
                <span
                  className={classes.iconBox}
                  onClick={() => handlePaidModal(item?.id, item?.amount)}
                >
                  <RefreshIcon />
                </span>
                <span
                  className={classes.iconBox}
                  onClick={() => handleDeleteModal(item?.id)}
                >
                  <DeleteOutlineIcon />
                </span>
              </div>
            </div>
          ))
        ) : (
          <ErrorBox />
        )}
      </div>
      <PaginationComponent
        totalPages={totalPages}
        page={currentPage || 0}
        rowsPerPage={rowsPerPage || 0}
        totalEntries={totalCount || 0}
        onPageChange={handleChangePage}
        rowsPerPageChange={handleChangeRowsPerPage}
        dropDownValues={[50, 75, 100]}
        inlineStyles={{
          height: "max-content",
        }}
      />
    </div>
  );
};

export default memo(Ttable);
