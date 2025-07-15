import React, { FC } from "react";
import Image from "next/image";
import moment from "moment";
import LoadingBox from "@/components/global/loading-box/loading-box";
import classes from "./earnings-overview.module.css";

interface CardProps {
  number?: number;
  inlineStyling?: React.CSSProperties;
  loading?: boolean;
}

const EarningsOverview: FC<CardProps> = ({ number, loading }) => {
  const lastMonth = moment().subtract(1, "month").format("MMMM YYYY");
  return (
    <div className={classes.earningsOverview}>
      <div className={classes.profileLarge}>
        <Image
          src="/assets/svgs/earningsPic.svg"
          alt="Profile"
          fill
          //   className={classes.profileImgLarge}
        />
      </div>
      <div className={classes.earningsInfo}>
        <h2 className={classes.earningsTitle}>
          {`Your Earnings for ${lastMonth}`}
        </h2>
        <p className={classes.earningsDescription}>
          Verify your earnings and report any issues by the 2nd of the month.
          Changes won't be possible after settlement.
        </p>
      </div>
      <div className={classes.earningsAmount}>
        {loading ? (
          <LoadingBox
            loaderStyling={{
              height: "var(--sub-heading-vw) !important",
              width: "var(--sub-heading-vw) !important",
            }}
          />
        ) : (
          <>
            <p>AED</p>
            <p>{Number(number).toFixed(2)}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default EarningsOverview;
