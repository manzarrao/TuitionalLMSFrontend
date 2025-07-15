import React, { useEffect, useState } from "react";
import moment from "moment";
import classes from "./session-history.module.css";
import WavyChart from "@/components/global/charts/wave-chart/wave-chart";
import LoadingBox from "@/components/global/loading-box/loading-box";
import ErrorBox from "@/components/global/error-box/error-box";

interface SessionData {
  month?: string;
  value?: number;
}

interface SessionHistoryProps {
  data?: SessionData[];
  loading?: boolean;
  inLineStyles?: React.CSSProperties;
}

const SessionHistory: React.FC<SessionHistoryProps> = ({
  data,
  loading,
  inLineStyles,
}) => {
  const [lastMonthData, setLastMonthData] = useState<SessionData | null>(null);
  useEffect(() => {
    if (data && data.length > 0) {
      // Get last month in the format "Month 'YY" (e.g., "March '25")
      const lastMonth =
        moment().subtract(1, "month").format("MMMM") +
        " '" +
        moment().subtract(1, "month").format("YY");

      // Find the data entry that matches the last month
      const matchedData = data.find((item) => item.month === lastMonth);

      if (matchedData) {
        setLastMonthData(matchedData);
      } else {
        setLastMonthData(null);
      }
    }
  }, [data]);
  return (
    <div className={classes.historyCard} style={inLineStyles}>
      <h3 className={classes.historyTitle}>Session History</h3>

      {loading ? (
        <LoadingBox />
      ) : (
        <>
          {!data || data?.length === 0 ? (
            <ErrorBox
              inlineStyling={{
                fontFamily: "var(--leagueSpartan-bold-700)",
                fontSize: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
                lineHeight: "clamp(1rem, calc(0.5rem + 0.68vw), 1.25rem)",
              }}
            />
          ) : (
            <>
              <div className={classes.sessionStats}>
                <div className={classes.sessionCount}>
                  {lastMonthData?.value ?? 0}
                </div>
                <div className={classes.sessionPeriod}>Sessions Last Month</div>
              </div>
              <div className={classes.chartContainer}>
                <WavyChart data={data as any} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SessionHistory;
