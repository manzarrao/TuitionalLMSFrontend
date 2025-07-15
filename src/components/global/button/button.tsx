"use client";
import React from "react";
import styles from "./button.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { memo } from "react";

interface ButtonProps {
  icon?: React.ReactNode;
  text: string;
  type?: "button" | "submit" | "reset";
  clickFn?: any;
  loading?: boolean;
  disabled?: boolean;
  inlineStyling?: any;
}

const Button: React.FC<ButtonProps> = ({
  icon,
  text,
  clickFn,
  type,
  loading,
  inlineStyling,
  disabled,
}) => {
  // console.log("button");
  return (
    <button
      className={styles.button}
      onClick={clickFn}
      type={type}
      style={inlineStyling}
      disabled={disabled}
    >
      {loading ? (
        <CircularProgress className={styles.loader} />
      ) : (
        <>
          {icon && <span className={styles.icon}>{icon}</span>} {text}
        </>
      )}
    </button>
  );
};

export default memo(Button);
