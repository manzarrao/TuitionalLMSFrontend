import styles from "./input-field.module.css";
import { memo } from "react";

interface InputFieldProps {
  value?: string;
  type?: string;
  placeholder?: string;
  link?: [string, string];
  icon1?: React.ReactNode;
  icon2?: React.ReactNode;
  hide?: boolean;
  inputBoxStyles?: any;
  inputStyles?: any;
  customIconStyles?: any;
  changeFunc?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handlePasswordDisability?: React.MouseEventHandler<HTMLSpanElement>;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  type,
  value = "",
  placeholder = "",
  icon1,
  icon2,
  changeFunc,
  handlePasswordDisability,
  hide = false,
  inputBoxStyles,
  inputStyles,
  customIconStyles,
  required = false,
}) => {
  return (
    <div className={styles.inputBox} style={inputBoxStyles}>
      {icon1 && <span className={styles.icon}>{icon1}</span>}
      <input
        value={value}
        className={styles.input}
        style={inputStyles}
        type={hide === false ? "text" : "password"}
        placeholder={placeholder}
        onChange={changeFunc}
        required={required}
      />
      {icon2 && (
        <span
          className={styles.icon}
          style={customIconStyles}
          onClick={handlePasswordDisability}
        >
          {icon2}
        </span>
      )}
    </div>
  );
};

export default memo(InputField);
