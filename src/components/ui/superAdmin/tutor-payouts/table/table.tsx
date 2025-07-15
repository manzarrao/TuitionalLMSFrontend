import React, { FC, memo, useState } from "react";
import classes from "./table.module.css";
import Image from "next/image";
import moment from "moment";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import PaginationComponent from "@/components/global/pagination/pagination";
import ErrorBox from "@/components/global/error-box/error-box";
import LoadingBox from "@/components/global/loading-box/loading-box";
import { Payouts_List } from "@/types/payouts/getPayoutForMonth";

interface Column {
  id: number;
  name: string;
  width: string;
}

interface TtableProps {
  payouts?: Payouts_List[];
  totalPages?: number;
  totalCount?: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => void;
  rowsPerPage?: number;
  currentPage?: number;
  handleChangeStatus?: (payoutId: string) => void;
  loading?: boolean;
}

// Define the SessionSummary interface based on the Payouts_List type
interface SessionSummary {
  enrollment_id: number | null;
  tutor_hourly_rate: number | null;
  name: string;
  session_count: number;
  conclusion_type: string;
  duration: number;
}

interface TooltipProps {
  sessionSummary?: SessionSummary[];
}

const headData: Column[] = [
  { id: 1, width: "20%", name: "Tutor Name" },
  { id: 2, width: "15%", name: "Period" },
  { id: 3, width: "15%", name: "Total Session Count" },
  { id: 4, width: "15%", name: "Balance" },
  { id: 5, width: "20%", name: "Session Count" },
  { id: 6, width: "15%", name: "Status" },
];

const colorPalette = {
  primary: "#D2EEFF",
  secondary: "#B3E4FF",
  background: "#F5F5F5",
  text: "#212121",
};

const Ttable: FC<TtableProps> = ({
  payouts = [],
  totalPages,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  rowsPerPage,
  currentPage,
  handleChangeStatus,
  loading,
}) => {
  const [activeTooltipId, setActiveTooltipId] = useState<
    string | number | null
  >(null);
  const [payoutId, setPayoutId] = useState<number | null>(null);

  const handleLogoBoxClick = (id: string | number) => {
    setActiveTooltipId(id);
  };

  const updateStatus = async (payloadId: number) => {
    handleChangeStatus?.(String(payloadId));
    setPayoutId(payloadId);
  };

  return (
    <div className={classes.table} onClick={() => setActiveTooltipId(null)}>
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
        {payouts?.length > 0 ? (
          payouts?.map((item: Payouts_List) => (
            <div className={classes.tableRow} key={item.id}>
              <div
                className={classes.tableColumn}
                style={{ width: headData[0]?.width }}
              >
                <div className={classes.infoBox}>
                  <span className={classes.imageBox}>
                    <Image
                      src={
                        item?.userPayout?.profileImageUrl ||
                        "/assets/images/demmyPic.png"
                      }
                      alt={"demmyPic"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </span>
                  {item?.userPayout?.name
                    ? item?.userPayout?.name
                        .trim()
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")
                    : "No Show"}
                </div>
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[1]?.width }}
              >
                {item?.start_date
                  ? moment.utc(item.start_date).local().format("MMM-YYYY")
                  : "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[2]?.width }}
              >
                {item?.total_sessions || "0"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[3]?.width }}
              >
                AED {item?.balance || "No Show"}
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[4]?.width }}
              >
                <div className={classes.sessionCountBox}>
                  Session Count Summary{" "}
                  <div
                    className={classes.logoBox}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLogoBoxClick(item?.id);
                    }}
                  >
                    <KeyboardDoubleArrowRightIcon />
                    {item.id === activeTooltipId && (
                      <Tooltip sessionSummary={item?.sessionSummary} />
                    )}
                  </div>
                </div>
              </div>
              <div
                className={classes.tableColumn}
                style={{ width: headData[5]?.width }}
              >
                {payoutId === item?.id && loading ? (
                  <LoadingBox
                    inlineStyling={{
                      height: "max-content",
                      width: "max-content",
                    }}
                    loaderStyling={{
                      width: "3vh !important",
                      height: "3vh !important",
                    }}
                  />
                ) : (
                  <div
                    className={classes.status}
                    style={
                      item.status === "Paid"
                        ? { backgroundColor: "#E0F2EC", color: "#098B34" }
                        : { backgroundColor: "#FCC8C8", color: "#C5371B" }
                    }
                    onClick={() => updateStatus(item?.id)}
                  >
                    {item?.status === "Due"
                      ? "Mark as paid"
                      : item?.status || "No Show"}
                  </div>
                )}
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
          padding: "10px 20px",
        }}
      />
    </div>
  );
};

export default memo(Ttable);

const Tooltip: FC<TooltipProps> = ({ sessionSummary }) => {
  return (
    <div className={classes.tooltip}>
      {sessionSummary?.map((item: any, index: number) => (
        <div className={classes.tooltipRow} key={index}>
          <span></span>
          <p>{item?.name?.split("/")[0] || ""}</p>
          <p>{item?.session_count || 0}</p>
          <p>
            {item?.duration
              ? moment.duration(item?.duration, "minutes").asHours()
              : 0}
          </p>
          <p>{item?.tutor_hourly_rate || 0}</p>
          <p>
            {item?.tutor_hourly_rate && item?.session_count && item?.duration
              ? item?.tutor_hourly_rate *
                item?.session_count *
                Number(
                  moment
                    .duration(item?.duration, "minutes")
                    .asHours()
                    .toLocaleString()
                )
              : 0}
          </p>
        </div>
      ))}
    </div>
  );
};
