import * as React from "react";
import Switch from "@mui/material/Switch";

interface BasicSwitchesProps {
  handleToggle?: any;
  value?: boolean;
}

const BasicSwitches: React.FC<BasicSwitchesProps> = ({
  handleToggle,
  value,
}) => {
  return (
    <>
      <style>
        {`
        .css-jsexje-MuiSwitch-thumb{
          background-color: var(--main-color);
        }
        .css-byenzh-MuiButtonBase-root-MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track{
          background-color: var(--white-color);
          box-shadow: inset 0 0 5px var(--main-color);
        }
       `}
      </style>
      <div>
        <Switch checked={value} onClick={handleToggle} />
      </div>
    </>
  );
};

export default BasicSwitches;
