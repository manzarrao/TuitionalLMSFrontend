import React, { memo, SyntheticEvent } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { SxProps, Theme } from "@mui/material/styles";
// import classes from "./multi-select-dropDown.module.css";

interface MultiSelectDropDownProps {
  placeholder: string;
  data: any[];
  handleChange: (event: SyntheticEvent<Element, Event>, value: any[]) => void;
  value?: any[];
  labelExternalStyles?: SxProps<Theme>;
  inlineDropDownStyles?: any;
  preFetchValues?: any[];
  margin?: string;
  width?: string | number;
  height?: string;
  background?: string;
}

const MultiSelectDropDown: React.FC<MultiSelectDropDownProps> = ({
  placeholder,
  data = [],
  handleChange,
  value,
  labelExternalStyles,
  inlineDropDownStyles,
  preFetchValues = [],
  width,
  margin,
  height,
  background,
}) => {
  // console.log(data);
  // Check if the option is pre-fetched (if any preFetchValues are provided)
  const isPreFetched = (option: any) => {
    return preFetchValues?.some(
      (preFetchValue: any) => preFetchValue?.id === option?.id
    );
  };

  const imageUrl = (url: string) => {
    if (url && (url.startsWith("http://") || url.startsWith("https://"))) {
      return url;
    } else {
      return "/assets/images/static/demmyPic.png";
    }
  };

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
          .MuiAutocomplete-tag{
          background-color:var(--main-color);
          color:var(--white-color);
          font-family: var(--leagueSpartan-regular-400);
          font-size: 1.8vh !important;
          width:max-content;
          height:max-content;
          margin:0px 3px 0px 0px !important;
          }
          .MuiChip-deleteIcon{
          font-size:1.8vh !important;
          color:var(--white-color) !important;
          }
        `}
      </style>

      <Autocomplete
        style={{ ...inlineDropDownStyles }}
        multiple
        disablePortal
        options={data}
        getOptionLabel={(option) => option?.name}
        isOptionEqualToValue={(option, value) => option?.id === value?.id}
        value={value}
        onChange={handleChange}
        // className={`${classes.dropdownContainer}`}
        sx={[
          {
            maxHeight: "50px",
            height: "5.5vh !important",
            minHeight: "35px",
            width: "100%",
            padding: "10px",
            fontFamily: "var(--leagueSpartan-regular-400)",
            display: "flex",
            alignItems: "center",
            ...inlineDropDownStyles,
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
        renderOption={(props, option, { selected }) => {
          const image = option?.hasOwnProperty("profileImageUrl");
          const isMatchedWithPreFetch = isPreFetched(option);

          return (
            <Box
              component="li"
              {...props}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: selected
                  ? "var(--white-color) !important" // Apply white color if selected
                  : isMatchedWithPreFetch
                  ? "var(--white-color) !important" // Apply white color if matched with preFetch
                  : "var(--black-color)", // Black color otherwise
                backgroundColor: selected
                  ? "var(--main-color) !important" // Apply main color if selected
                  : isMatchedWithPreFetch
                  ? "var(--main-color) !important" // Apply main color if matched with preFetch
                  : "transparent", // Transparent otherwise
                "&:hover": {
                  backgroundColor: "var(--main-color)",
                },
              }}
            >
              {image && (
                <Image
                  src={imageUrl(option?.profileImageUrl)}
                  alt={option.name}
                  width={30}
                  height={30}
                  style={{
                    width: "var(--sub-heading)",
                    height: "var(--sub-heading)",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <Typography variant="body2">{option.name}</Typography>
            </Box>
          );
        }}
        renderInput={(params) => (
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

export default memo(MultiSelectDropDown);

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
