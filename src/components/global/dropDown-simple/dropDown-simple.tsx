"use client";
import * as React from "react";
import { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

interface DropDownProps {
  placeholder: string;
  data: any;
  handleChange: (value: any) => void;
  value?: string;
  isError?: boolean;
  className?: string;
  externalStyles?: any;
  disable?: string | undefined | any;
  margin?: string;
  height?: string;
  width?: string | number;
  background?: string;
}

const DropDownSimple = ({
  placeholder,
  data,
  handleChange,
  value,
  externalStyles,
  disable,
  background,
}: DropDownProps) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <>
      <style>
        {`
          .MuiFormControl-root {
            height: 100% !important;
            background: transparent;
          }

          .MuiOutlinedInput-root {
            padding: 0px !important;
            height: 100% !important;
            background: transparent;
          }

          .MuiAutocomplete-input {
            padding: 0px !important;
            background: transparent;
            height: 100% !important;
          }
          .css-qzbt6i-MuiButtonBase-root-MuiIconButton-root-MuiAutocomplete-popupIndicator{
            margin-right: -10px !important;
          }
          .css-1umw9bq-MuiSvgIcon-root {
            font-size: 2.5vh !important;
          }
          .css-120dh41-MuiSvgIcon-root{
            display:none;
          }   
        `}
      </style>
      <Autocomplete
        disablePortal
        options={data}
        loadingText={"Loading Data..."}
        value={value || null}
        onChange={(event, newValue) => handleChange(newValue)}
        sx={[
          {
            maxHeight: "50px",
            height: "5.5vh !important",
            minHeight: "35px",
            width: "100%",
            padding: "10px",
            zIndex: "0 !important",
            fontFamily: "var(--leagueSpartan-regular-400)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            ...externalStyles,
            "& .MuiAutocomplete-loading": {
              color: "var(--black-color)",
            },
          },
          {
            ...styles.input,
          },
        ]}
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-option": {
                fontFamily: "var(--leagueSpartan-regular-400)",
                backgroundColor: "transparent",
                color: "var(--black-color)",
                fontSize: "1.8vh",
                "&[aria-selected='true']": {
                  backgroundColor: "transparent",
                  color: "var(--black-color)",
                },
                "&:hover": {
                  backgroundColor: "var(--main-color)",
                },
                "& .MuiAutocomplete-loading": {
                  color: "black",
                },
              },
            },
          },
          popper: {
            sx: {
              backgroundColor: "transparent",
              color: "var(--black-color) !important",
              "& .MuiPaper-rounded": {
                backgroundColor: "var(--white-color) !important",
                color: "var(--black-color) !important",
                backdropFilter: "blur(50px)",
                fontFamily: "var(--leagueSpartan-regular-400)",
              },
            },
          },
        }}
        // className={`${classes.dropdownContainer}`}
        renderOption={(props, option) => {
          const show = disable ? option?.includes(disable) : false;
          return (
            <li {...props} key={props.key} aria-disabled={show}>
              {option as unknown as string}
            </li>
          );
        }}
        renderInput={(params: any) => (
          <TextField
            {...params}
            placeholder={placeholder}
            fullWidth
            sx={{
              background: background ? background : "transparent",
              borderRadius: "10px",
              fontFamily: "var(--leagueSpartan-regular-400)",
              fontSize: "1.8vh",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "& .MuiInputBase-input::placeholder": {
                color: "var(--black-color) !important",
                fontFamily: "var(--leagueSpartan-regular-400)",
                fontSize: "1.8vh",
              },
              "& .MuiInputBase-input": {
                color: "var(--black-color) !important",
                fontFamily: "var(--leagueSpartan-regular-400)",
                fontSize: "1.8vh",
              },
              color: "var(--black-color)",
              ":focus-visible": {
                border: "1px solid white",
              },
              ":focus": {
                border: "1px solid white",
              },
            }}
          />
        )}
      />
    </>
  );
};

export default DropDownSimple;

const styles = {
  input: {
    boxShadow: "0px 1px 4px 0px rgba(0, 0, 0, 0.08)",
    backgroundColor: "transparent",
    height: "100%",
    position: "relative",
    zIndex: 2,
    color: "var(--black-color)",
    borderRadius: "10px",
    fontSize: "1.8vh",
    fontFamily: "var(--leagueSpartan-regular-400)",
  },
};
