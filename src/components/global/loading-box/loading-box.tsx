import React, { FC } from "react";
import classes from "./loading-box.module.css";
import { CircularProgress } from "@mui/material";

interface LoadingBoxProps {
  inlineStyling?: React.CSSProperties;
  loaderStyling?: React.CSSProperties;
}

const LoadingBox: FC<LoadingBoxProps> = ({ inlineStyling, loaderStyling }) => {
  return (
    <div className={classes.loaderBox} style={inlineStyling}>
      <CircularProgress sx={loaderStyling} className={classes.loader} />
    </div>
  );
};

export default LoadingBox;
