"use client";

import { useState } from "react";
import styles from "./subjects-component.module.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import DropDown from "@/components/drop-down/drop-down";
import InputField from "@/components/global/input-field/input-field";
import Checkbox from "@mui/material/Checkbox";
import { Margin, WidthFull } from "@mui/icons-material";

interface Item {
  name: string;
  level: string;
  curriculum: string;
  currency: string;
  rate: string;
}

interface SubjectsComponentProps {
  item: Item;
  currency: any;
  handleChecked: (subject: any) => void;
}

const SubjectsComponent: React.FC<SubjectsComponentProps> = ({
  item,
  currency,
  handleChecked,
}) => {
  const [click, setClick] = useState(false);
  const [checked, setChecked] = useState(false);
  const [input, setInput] = useState(item.rate);

  const handleCheckBox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    handleChecked(item);
  };

  const handleInputField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleClick = () => {
    setClick((prev) => !prev);
  };

  return (
    <div
      className={styles.container}
      style={{
        border: checked ? "1px solid var(--main-color)" : undefined,
      }}
    >
      <div className={styles.box1}>
        <Checkbox checked={checked} onChange={handleCheckBox} />
        <div>
          <p>
            {item.name} <span>| {item.level}</span>
          </p>
          <p>{item.curriculum}</p>
        </div>
      </div>
      <div className={styles.box2}>
        {click ? (
          <div>
            <InputField
              value={input}
              changeFunc={handleInputField}
              type="text"
              icon2="/hr"
              inputBoxStyles={{
                width: "4.5vw",
                borderRadius: "5px",
                backgroundColor: "#E4F5FF",
                boxShadow: "none",
                position: "relative",
                height: "100%",
                cursorPointer: "none",
              }}
              inputStyles={{
                fontFamily: "var(--leagueSpartan-semiBold-600) !important",
                fontSize: "var(--normal-text-size)",
                color: "#2d2d2d",
                textAlign: "center",
                // border: "1px solid red",
              }}
              customIconStyles={{
                fontSize: "0.625vw",
                color: "#9A9A9A",
                position: "absolute",
                top: "0",
                right: "4px",
                // border: "1px solid red",
                width: "fit-content",
                padding: "0",
              }}
            />
          </div>
        ) : (
          <div>
            {currency} {item?.rate}
            <span>/hr</span>
          </div>
        )}
        <span
          onClick={handleClick}
          style={click ? { color: "var(--main-color)" } : undefined}
        >
          <EditOutlinedIcon />
        </span>
      </div>
    </div>
  );
};

export default SubjectsComponent;
