import React, { FC } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

interface RadioButtonProps {
  label1: string;
  label2?: string;
  label3?: string;
  value1: string;
  value2?: string;
  value3?: string;
  radioValue: string;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioButton: FC<RadioButtonProps> = ({
  label1,
  label2,
  label3,
  value1,
  value2,
  value3,
  radioValue,
  handleChange,
}) => {
  return (
    <>
      <style>
        {`.css-ahj2mt-MuiTypography-root{
        font-family: var(--leagueSpartan-regular-400);
        font-size : var(--text-size);
        }`}
      </style>
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-controlled-radio-buttons-group"
          name="controlled-radio-buttons-group"
          value={radioValue}
          onChange={handleChange}
          sx={{ display: "flex" }}
        >
          <FormControlLabel
            value={value1}
            control={
              <Radio
                sx={{ "& .MuiSvgIcon-root": { fontSize: "var(--text-size)" } }}
              />
            }
            label={label1}
          />
          {label2 && (
            <FormControlLabel
              value={value2}
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "var(--text-size)" },
                  }}
                />
              }
              label={label2}
            />
          )}
          {label3 && (
            <FormControlLabel
              value={value3}
              control={
                <Radio
                  sx={{
                    "& .MuiSvgIcon-root": { fontSize: "var(--text-size)" },
                  }}
                />
              }
              label={label3}
            />
          )}
        </RadioGroup>
      </FormControl>
    </>
  );
};

export default React.memo(RadioButton);
